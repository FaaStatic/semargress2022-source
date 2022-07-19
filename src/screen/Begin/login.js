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
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import style from '../../util/style';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { Api } from '../../util/Api';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { StackActions } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';
import { colors } from '../../util/color';
import jwt_decode from 'jwt-decode';
import appleAuth, { AppleButton } from '@invertase/react-native-apple-authentication';


let time = 0;

let windowHeight = Dimensions.get('window').height;
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

  const loginUser = async (data, typeLogin = 'GOOGLE') => {

    await Api.post('auth', data)
      .then(async (result) => {

        let body = result.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status == 200) {

          if (response.status == 0) {

            await SessionManager.ClearAllKeys();
            ShowWarning("Silahkan lengkapi informasi akun anda")
            navigation.navigate('Register', {
              uid: data.uid,
              fcm_id: fcm,
              foto: data.foto,
              display_name: data.displayName,
              email: data.email,
              no_telp: telp,
              otp: otp,
              type: typeLogin,
            });

          } else {

            ShowSuccess(response.message);
            setVisible(false);
            const data = {
              token: response.token,
              uid: response.uid,
              email: response.email,
              type: typeLogin,
            };

            saveData(data, typeLogin);
          }
        } else {

          await SessionManager.ClearAllKeys();
          ShowWarning("Silahkan lengkapi informasi akun anda")
          navigation.navigate('Register', {
            uid: data.uid,
            fcm_id: fcm,
            foto: data.foto,
            email: data.email,
            display_name: data.displayName,
            no_telp: telp,
            otp: otp,
            type: typeLogin,
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
      console.log('FCMToken', fcmToken);
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

    setTimer(`${m}:${s}`);
  };

  const showModal = () => {
    if (telp !== '' && telp !== 0) {
      setModalOtpVisible(!modalOTPVisible);
      btnOtp();
    } else {
      //console.log('isi nomor dulu');
    }
  };

  const btnOtp = async () => {
    await Api.post('auth/request_otp_sms', {
      no_telp: telp,
    })
      .then((res) => {

        let response = res.data.response;
        let metadata = res.data.metadata;
        let status = metadata.status;

        if (status == 200) {

          time = response.time;
          setShowRequest(true);
          intervalCount();
        } else {
          ShowWarning(metadata.message);
        }

      })
      .catch((err) => {
        console.log(err);
        ShowError();
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

        //console.log("datalogingoogle ",res);
        const tokenLogin = {
          uid: res.user.uid,
          foto: res.user.photoURL,
          fcm_id: fcm,
          email: res.user.email,
          displayName: res.user.displayName
        };

        loginUser(tokenLogin);
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
      .then(async (result) => {

        const action = result.data.response.action;
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

            await SessionManager.ClearAllKeys();
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
    if (type == 'register') {
      navigation.dispatch(StackActions.replace('RouterTab'));
    } else {
      navigation.dispatch(StackActions.replace('RouterTab'));
    }

  };

  const appleSignIn = async () => {
    
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    // use credentialState response to ensure the user is authenticated
    //console.log("HelloApple ",appleAuthRequestResponse);
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated

      console.log("HelloApple ",appleAuthRequestResponse);

      const { email, email_verified, is_private_email, sub } = jwt_decode(appleAuthRequestResponse.identityToken);

        if(appleAuthRequestResponse.email != null){

          const tokenLogin = {
              uid: appleAuthRequestResponse.user,
              foto: "",
              fcm_id: fcm,
              email: appleAuthRequestResponse.email,
              displayName: appleAuthRequestResponse.fullName.givenName +" "+ appleAuthRequestResponse.fullName.familyName
            };

          loginUser(tokenLogin, "APPLE");     
        }else{
          const tokenLogin = {
            uid: sub,
            foto: "",
            fcm_id: fcm,
            email: email,
            displayName: ""
          };

          loginUser(tokenLogin, "APPLE");
          console.log("tesw");
        }
    }
  };

  return (

    <SafeAreaView style={style.conteiner2}>

      <View style={[style.containerSplash, {
        backgroundColor: colors.primary
      }]}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: '100%',
          }}
        >

          <View
            style={{
              backgroundColor: 'white',
              width: '90%',
              alignSelf:'center',
              height: windowHeight - 100,
              minHeight: windowHeight - 100,
              marginTop: 50,
              borderRadius: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={[
                style.boxImageSplash,
                {
                  width: 245,
                  height: 245,
                  marginBottom: 0,

                },
              ]}
              resizeMode='contain'
            />

            <TextInput
              disabled={modalOTPVisible ? true : false}
              keyboardType="number-pad"
              placeholderTextColor={'black'}
              selectionColor={'grey'}
              placeholder="Masukkan Nomor WhatsApp"
              style={{
                backgroundColor: '#F9F9F9',
                borderRadius: 8,
                marginStart: 36,
                marginEnd: 36,
                height: 55,
                width: 300,
                textAlign: 'center',
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
                color: 'black',
              }}
              value={telp}
              onChangeText={(text) => setTelp(text)}
            />

            <TouchableOpacity
              onPress={showModal}
              style={{
                backgroundColor: '#FB44A0',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 30,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600', marginLeft: 70, marginRight: 70, marginTop: 14, marginBottom: 14 }}>Login</Text>
            </TouchableOpacity>

            <View style={{
              marginStart: 16,
              marginEnd: 16,
              marginTop: 10,
              marginBottom: 16,
            }} />

            <Text style={styling.textStyleGap}>
              Atau kamu dapat login menggunakan
            </Text>

            <View style={styling.btnSubmitStyleGoogle}>
              <TouchableOpacity style={styling.btnTouchableGoogle} onPress={btnSubmitGoogle}>
                <Image source={require('../../assets/google.png')} resizeMode='contain' style={styling.googleIcon} />
                <Text style={[styling.textStyle, {
                  color: colors.black3,
                  flex: 1,
                  textAlign: 'center',
                  marginRight: 20,
                  fontSize: 16,
                  fontWeight: '600',
                }]}>Sign in With Google</Text>
              </TouchableOpacity>
            </View>

            {Platform.OS == 'ios' && 
                  <View style={[styling.btnSubmitStyleGoogle, { backgroundColor: colors.black, marginBottom: 20, alignContent:'center', justifyContent:'center', alignItems:'center'}]}>
                  <TouchableOpacity style={styling.btnTouchableGoogle} onPress={appleSignIn}>
                      <Image source={require('../../assets/ic_apple.png')} resizeMode='contain' style={styling.googleIcon} />
                      <Text style={[styling.textStyle, {
                        color: colors.white,
                        flex:1,
                        textAlign:'center',
                        marginRight:18,
                        fontSize: 16,
                        fontFamily:'NeutrifPro-Regular',
                        fontWeight: '600',
                      }]}>Sign in with Apple</Text>
                    </TouchableOpacity>
                  
                    {/* <Image source={require('../../assets/ic_apple.png')} resizeMode='contain' style={styling.googleIcon} />
                    <Text touc style={[styling.textStyle, {
                      color: colors.white,
                      textAlign:'center',
                      marginRight:20,
                      paddingLeft:10,
                      fontSize: 16,
                      fontFamily:'NeutrifPro-Regular',
                      fontWeight: '600',
                      position:'absolute',
                    }]}>Sign in with Apple</Text>
    
                    <AppleButton
                        buttonStyle={AppleButton.Style.WHITE}
                        buttonType={AppleButton.Type.SIGN_IN}
                        style={{
                          width: 160, // You must specify a width
                          height: 45, // You must specify a height
                        }}
                        onPress={() => appleSignIn()}
                      /> */}
                    {/* {AppleButton({
                    buttonStyle: [styling.textStyle, {
                      color: colors.white,
                      width:'100%',
                      flex: 1,
                      textAlign: 'center',
                      marginRight: 20,
                      fontSize: 16,
                      position:'absolute',
                      fontWeight: '600',
                    }],
                    callBack: appleSignIn,
                    buttonText: "                         ",
                  })} */}
                </View>
            }
          </View>
        </ScrollView>

      </View>

      <Modal
        visible={modalOTPVisible}
        animationType="slide"
        onDismiss={() => setModalOtpVisible(false)}
        style={style.modalStyle}
        transparent={true}
      >
        <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.6)' }}>

          <View
            style={{
              borderRadius: 16,
              alignSelf: 'center',
              height: 350,
              width: 250,
              overflow: 'hidden',
              justifyContent: 'center',
              backgroundColor: '#251468',
              marginBottom: 20,
            }}
          // resizeMode="stretch"
          >
            <Text
              style={{
                textAlign: 'center',
                alignSelf: 'center',
                fontSize: 20,
                marginBottom: 36,
                color: 'white',
              }}
            >
              Masukkan OTP
            </Text>

            <TextInput
              maxLength={6}
              selectionColor={'white'}
              keyboardType="number-pad"
              value={otp}
              onChangeText={(text) => setOtp(text)}
              placeholder="OTP"
              placeholderTextColor={'#FFFFFF66'}
              style={{
                width: 200,
                marginTop: 8,
                color: colors.white,
                alignSelf: 'center',
                borderRadius: 8,
                backgroundColor: '#FFFFFF44',
                marginStart: 36,
                marginEnd: 36,
                marginBottom: 18,
                height: 45,
                textAlign: 'center',
              }}
            />
            {showRequest ? (
              <Text style={{ color: 'white', alignSelf: 'center' }}>{timer}</Text>
            ) : (

              <TouchableOpacity
                onPress={btnRequestOtp}
                style={{
                  width: 100,
                  height: 28,
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                  color: 'white',
                }}
              >
                <Text style={{ color: 'white', fontWeight: '400', fontSize: 14, fontFamily: 'NeutrifPro-Regular', }}>
                  Kirim Ulang ?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={btnSubmitLogin}
              style={{
                alignSelf: 'center',
                marginTop: 16,
                color: 'white',
                backgroundColor: '#FB44A0',
                borderRadius: 6,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', marginLeft: 20, marginRight: 20, marginTop: 8, marginBottom: 8, fontFamily: 'NeutrifPro-Regular', }}>Kirim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.white,
                width: 30,
                height: 30,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                borderRadius: 15,
                top: 0,
                right: 0,
              }}

              onPress={()=>{setModalOtpVisible(false)}}
            >
              <Text style={{ color: colors.primary }}>x</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

      <Image style={{ resizeMode: 'stretch', width: '100%', height: 130, position: 'absolute', bottom: 0, }} source={require('../../assets/bg_bottom.png')}></Image>
    </SafeAreaView>

  );
}

const styling = StyleSheet.create({

  btnSubmitStyleGoogle: {
    width: 240,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
    alignSelf: 'center',
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
  },
  btnTouchableGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    height: 24,
    width: 24,
    alignSelf: 'flex-start',
  },
  textStyleGap: {
    alignSelf: 'center',
    fontSize: 14,
    textAlign:'center',
    width:'100%',
    fontWeight: '400',
    color: colors.black3,
  },
  textStyle: { alignSelf: 'center' },
})