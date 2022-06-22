/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, Alert} from 'react';
import {View, Image, SafeAreaView, ImageBackground, Text} from 'react-native';
import {TextInput, Button, Provider, Portal, Modal} from 'react-native-paper';
import style from '../../util/style';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
import {color} from 'native-base/lib/typescript/theme/styled-system';

export default function Login({navigation}) {
  const [telp, setTelp] = useState('');
  const [result, setResult] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalOTPVisible, setModalOtpVisible] = useState(false);

  const [timer, setTimer] = useState(0);

  let tokenRegister = null;
  let tokenLogin = null;
  let newUser = false;

  let fcm = '';

  useEffect(() => {
    cekGoogle();
    checkToken();
    console.log('newUserer', newUser);
    console.log('register', tokenRegister);
  });

  const cekGoogle = () => {
    GoogleSignin.configure({
      webClientId:
        '356805825965-sj1fj3bhitspg19hj87tbs65l0rbsul0.apps.googleusercontent.com',
    });
  };

  const instanceAPI = axios.create({
    baseURL: 'https://semargres.gmedia.id/api/',
    headers: {
      'Client-Service': 'frontend-client',
      'Auth-Key': 'gmedia_semargress',
      'Content-Type': 'application/json',
    },
  });

  const registerUser = async dataToken => {
    await instanceAPI
      .post('/register', tokenRegister)
      .then(result => {
        console.log(result);
        setVisible(false);
        navigation.dispatch(StackActions.replace('RouterTab'));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const loginUser = async (data, res) => {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('session_id', jsonData);
    await instanceAPI
      .post('auth', data)
      .then(result => {
        console.log(result);
        if (res === 0) {
          tokenRegister = {
            uid: res.user.uid,
            email: res.user.email,
            profile_name: res.user.displayName,
            foto: res.user.photoURL,
            fcm_id: fcm,
            type: 'google',
          };
          registerUser(tokenRegister);
        } else {
          setVisible(false);
          navigation.dispatch(StackActions.replace('RouterTab'));
        }
      })
      .catch(err => {
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

  let second = 0;

  const cound = async d => {
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    m = `0${m.toString()}`;
    if (s < 10) {
      s = `0${s}`;
    }
    let result = `${m}:${s}`;
    return result;
  };

  const modalShow = () => {
    setModalOtpVisible(!modalOTPVisible);
  };
  const btnOtp = async () => {
    second = 120;
    await instanceAPI
      .post('auth/request_otp_sms', {
        no_telp: telp,
      })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const btnSubmitGoogle = async () => {
    setVisible(true);
    const {idToken} = await GoogleSignin.signIn();
    console.log('TEstTOKEN', idToken);
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const response = auth().signInWithCredential(googleCredential);
    setResult(response);
    response
      .then(res => {
        console.log(result);
        console.log(res);
        tokenLogin = {
          uid: res.user.uid,
          foto: res.user.photoURL,
          fcm_id: fcm,
        };
        loginUser(tokenLogin, res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <Provider>
      <SafeAreaView style={style.conteiner2}>
        <Portal>
          <Modal
            visible={modalOTPVisible}
            onDismiss={() => setModalOtpVisible(!modalOTPVisible)}
            style={style.modalStyle}
            contentContainerStyle={{
              borderRadius: 16,
            }}>
            <View style={{justifyContent: 'center'}}>
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
                resizeMode="stretch">
                <Text
                  style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontSize: 20,
                    marginBottom: 36,
                    color: 'black',
                  }}>
                  Masukan OTP
                </Text>
                <TextInput
                  underlineColor="grey"
                  mode="flat"
                  keyboardType="number-pad"
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
                <Text style={{color: 'black', alignSelf: 'center'}}>
                  countdown
                </Text>
                <Button
                  mode="contained"
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
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Kirim
                  </Text>
                </Button>
              </ImageBackground>
            </View>
          </Modal>
        </Portal>
        <ImageBackground
          source={require('../../assets/bgot.png')}
          style={style.containerSplash}>
          <Image
            source={require('../../assets/logo.png')}
            style={[
              style.boxImageSplash,
              {
                width: 175,
                height: 175,
              },
            ]}
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
          />
          <Button
            mode="contained"
            onPress={modalShow}
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
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>Login</Text>
          </Button>

          <Text style={{color: 'black', alignSelf: 'center', marginTop: 16}}>
            Atau Menggunakan
          </Text>

          <Button
            onPress={btnSubmitGoogle}
            mode="contained"
            theme={{
              colors: {
                text: 'white',
                primary: '#D61C4E',
              },
              roundness: 8,
            }}
            style={{
              alignSelf: 'stretch',
              marginTop: 16,
              marginEnd: 36,
              marginStart: 36,
              color: 'white',
            }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>Google</Text>
          </Button>
        </ImageBackground>
      </SafeAreaView>
    </Provider>
  );
}
