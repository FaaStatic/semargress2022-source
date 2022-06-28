/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  Text,
  ToastAndroid,
  AlertIOS,
  Platform,
  StatusBar,
  StyleSheet
} from 'react-native';
import { TextInput, Button, Provider, Portal, Modal } from 'react-native-paper';
import style from '../../util/style';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { Api } from '../../util/Api';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { StackActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';

let time = 0;
export default function Login({ navigation }) {
  const [telp, setTelp] = useState('');
  const [otp, setOtp] = useState();
  const [result, setResult] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalOTPVisible, setModalOtpVisible] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const [timer, setTimer] = useState();
  let fcm = '';

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
      return () => {
        (time = 0), setModalOtpVisible(false);
        clearInterval(intervalCount());
      };
    }, [])
  );

  useEffect(() => {
    
    cekGoogle();
    checkToken();
    
    
    if (modalOTPVisible) {
    } else {
      setShowRequest(false);
      setOtp('');
    }
    
    if (time === 1 || time === 0) {
      setShowRequest(false);
      setTimer();
      time = 0;
      clearInterval(intervalCount());
    }
  });

  const intervalCount = () => {
    if (time >= 1) {
      setInterval(() => {
        if (time >= 1) {
          cound(time);
          time = time - 1;
        }
      }, 1000);
    } else {
      setShowRequest(false);
      clearInterval(intervalCount);
    }
  };

  const cekGoogle = () => {
    GoogleSignin.configure({
      webClientId: '356805825965-sj1fj3bhitspg19hj87tbs65l0rbsul0.apps.googleusercontent.com',
    });
  };

  const loginUser = async (data, res) => {
    
    await Api.post('auth', data)
      .then((result) => {

        let body = result.data;
        let metadata = body.metadata;
        let response = body.response;
        
        if(metadata.status == 200){
        
          if (response.status == 0) {

              ShowWarning("Silahkan lengkapi informasi akun anda")
              navigation.navigate('Register', {
                uid: data.uid,
                fcm_id: fcm,
                foto: data.foto,
                display_name : data.displayName,
                email: data.email,
                no_telp: telp,
                otp: otp,
                type: 'GOOGLE',
              });

            } else {
    
              ShowSuccess(response.message);
              setVisible(false);
              const data = {
                token: response.token,
                uid: response.uid,
                email: response.email,
                type: 'GOOGLE',
              };
              
              saveData(data, 'GOOGLE');
            }
        }else{

            ShowWarning("Silahkan lengkapi informasi akun anda")
              navigation.navigate('Register', {
                uid: data.uid,
                fcm_id: fcm,
                foto: data.foto,
                email: data.email,
                display_name : data.displayName,
                no_telp: telp,
                otp: otp,
                type: 'GOOGLE',
              });
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      fcm = fcmToken;
      console.log('Test Token', fcmToken);
    }
  };

  const cound = (d) => {
    d = d - 1;
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    m = `0${m.toString()}`;
    if (s < 10) {
      s = `0${s}`;
    }
    console.log('Minute', m);
    console.log('Second', s);
    setTimer(`${m}:${s}`);
  };

  const showModal = () => {
    if (telp !== '' && telp !== 0) {
      setModalOtpVisible(!modalOTPVisible);
      btnOtp();
    } else {
      console.log('isi nomor dulu');
    }
  };

  const btnOtp = async () => {
    await Api.post('auth/request_otp_sms', {
      no_telp: telp,
    })
      .then((res) => {
        console.log(res);
        time = res.data.response.time;
        setShowRequest(true);
        intervalCount();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const btnSubmitGoogle = async () => {
    setVisible(true);
    const { idToken } = await GoogleSignin.signIn();

    // check kalau sudah login
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {

      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
    
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const response = auth().signInWithCredential(googleCredential);
    setResult(response);
    response
      .then((res) => {
        
        const tokenLogin = {
          uid: res.user.uid,
          foto: res.user.photoURL,
          fcm_id: fcm,
          email: res.user.email,
          displayName : res.user.displayName
        };
        
        loginUser(tokenLogin, res);
      })
      .catch((err) => {
        console.log(err);
        ShowError("Terjadi Kesalahan Saat Terhubung ke Akun Anda")
      });
  };

  const btnRequestOtp = () => {
    btnOtp();
  };

  const toastMsg = (value) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(value, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(value);
    }
  };

  const btnSubmitLogin = async () => {
    setVisible(true);
    await Api.post('auth/login_check_otp', {
      no_telp: telp,
      kode_otp: otp,
    })
      .then((result) => {
        
        const action = result.data.response.action;
        console.log('loginstatus', action);
        const status = result.data.metadata.status;
        const msg = result.data.metadata.message;
        if (status === 400) {

          ShowError(msg);
        } else {
          
          ShowSuccess("Selamat Datang " + result.data.response.nama);
          if (action === 'login') {
            const data = {
              token: result.data.response.token,
              uid: result.data.response.uid,
              email: result.data.response.email,
              fcm_id: fcm,
              type: 'SMS',
            };
            setVisible(false);
            clearInterval(intervalCount);
            saveData(data, 'SMS');
          } else {

            ShowWarning("Silahkan lengkapi informasi akun anda");
            setVisible(false);
            clearInterval(intervalCount);
            navigation.navigate('Register', {
              uid: result.data.response.uid,
              fcm_id: fcm,
              token: result.data.response.token,
              no_telp: telp,
              otp: otp,
              type: 'SMS',
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveData = async (data, type) => {
    
    await SessionManager.StoreAsObject(sessionId, data);
    if(type == 'register'){
      navigation.dispatch(StackActions.replace('RouterTab'));
    }else{
      navigation.dispatch(StackActions.replace('RouterTab'));
    }
    
  };

  return (
    <Provider>
      <SafeAreaView style={style.conteiner2}>
        <Portal>
          <Modal
            visible={modalOTPVisible}
            onDismiss={() => setModalOtpVisible(false)}
            style={style.modalStyle}
            contentContainerStyle={{
              borderRadius: 16,
            }}
          >
            <View style={{ justifyContent: 'center' }}>
              <ImageBackground
                source={require('../../assets/bgot.png')}
                style={{
                  borderRadius: 16,
                  alignSelf: 'center',
                  height: 350,
                  width: 250,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
                resizeMode="stretch"
              >
                <Text
                  style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontSize: 20,
                    marginBottom: 36,
                    color: 'black',
                  }}
                >
                  Masukan OTP
                </Text>
                <TextInput
                  underlineColor="grey"
                  mode="flat"
                  maxLength={6}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={(text) => setOtp(text)}
                  style={{
                    marginTop: 8,
                    backgroundColor: 'transparent',
                    marginStart: 36,
                    marginEnd: 36,
                    marginBottom: 18,
                    height: 45,
                    textAlign: 'center',
                  }}
                  theme={{
                    colors: {
                      placeholder: 'grey',
                      text: 'black',
                      primary: 'grey',
                      textAlign: 'center',
                      fontSize: 12,
                      underlineColor: 'transparent',
                      background: 'transparent',
                    },
                    roundness: 8,
                  }}
                />
                {showRequest ? (
                  <Text style={{ color: 'black', alignSelf: 'center' }}>{timer}</Text>
                ) : (
                  <Button
                    onPress={btnRequestOtp}
                    mode="contained"
                    style={{
                      width: 100,
                      height: 28,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginTop: 16,
                      color: 'white',
                    }}
                    theme={{
                      colors: {
                        text: 'white',
                        primary: '#c29f55',
                      },
                      roundness: 8,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 8 }}>
                      Request?
                    </Text>
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={btnSubmitLogin}
                  style={{
                    width: 175,
                    alignSelf: 'center',
                    marginTop: 16,
                    color: 'white',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      primary: '#F77E21',
                    },
                    roundness: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Kirim</Text>
                </Button>
              </ImageBackground>
            </View>
          </Modal>
        </Portal>
        
        <SafeAreaView style={style.containerSplash}>
          <View
            style={{
              backgroundColor:'white',
              height: '100%',
              marginTop: '100%',
              borderRadius: 10,
              marginLeft : 20,
              marginRight : 20,
            }}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={[
                style.boxImageSplash,
                {
                  width: 220,
                  height: 220,
                },
              ]}
              resizeMode='contain'
            />
            <TextInput
              mode="outlined"
              keyboardType="number-pad"
              underlineColor="transparent"
              outlineColor="grey"
              placeholder="Masukan Nomor WhatsApp"
              style={{
                backgroundColor: 'transparent',
                marginStart: 36,
                marginEnd: 36,
                height: 55,
                textAlign: 'center',
              }}
              theme={{
                colors: {
                  placeholder: 'grey',
                  text: 'black',
                  primary: 'grey',
                  underlineColor: 'transparent',
                  background: 'transparent',
                },
                roundness: 8,
              }}
              value={telp}
              onChangeText={(text) => setTelp(text)}
            />
            <Button
              mode="contained"
              onPress={showModal}
              style={{
                width: 175,
                alignSelf: 'center',
                marginTop: 36,
                color: 'white',
              }}
              theme={{
                colors: {
                  text: 'white',
                  primary: '#F77E21',
                },
                roundness: 8,
              }}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Login</Text>
            </Button>

            <Text style={styling.textStyle}>
              Atau Menggunakan
            </Text>

            <Button
              onPress={btnSubmitGoogle}
              mode="contained"
              theme={btnSubmitGoogleStyle}
              style={styling.btnSubmitStyleGoogle}
            >
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Google</Text>
            </Button>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </Provider>
  );
}


const btnSubmitGoogleStyle = {
  colors: {
    text: 'white',
    primary: '#D61C4E',
  },
  roundness: 8,
}

const styling = StyleSheet.create({
  btnSubmitStyleGoogle:{
    alignSelf: 'stretch',
    marginTop: 16,
    marginEnd: 36,
    marginStart: 36,
    color: 'white',
  },
  textStyle:{ color: 'black', alignSelf: 'center', marginTop: 16 },
})