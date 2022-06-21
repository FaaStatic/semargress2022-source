/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Image, Pressable, Text, ActivityIndicator} from 'react-native';
import {TextInput, Button, Provider, Portal, Modal} from 'react-native-paper';
import style from '../../util/style';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

export default function Login({navigation}) {
  const [user, setUser] = useState(null);
  const [pass, setPass] = useState(null);
  const [result, setResult] = useState([]);
  const [visible, setVisible] = useState(false);

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
        navigation.navigate('Home', dataToken);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const loginUser = async (data, res) => {
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
          navigation.navigate('Home', tokenLogin);
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

  function btnSubmit() {}

  const btnSubmitGoogle = async () => {
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
    <SafeAreaView style={style.container}>
      {/* <Modal
        visible={visible}
        contentContainerStyle={{
          width: 100,
          height: 100,
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <ActivityIndicator size="large" />
      </Modal> */}
      <Image
        style={style.boxImage}
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/440px-Lion_waiting_in_Namibia.jpg',
        }}
        resizeMode="cover"
      />
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        outlineColor="black"
        style={{
          color: 'black',
          height: 40,
          marginStart: 32,
          marginEnd: 32,
          padding: 5,
          marginBottom: 20,
          textAlign: 'center',
          alignSelf: 'stretch',
        }}
        placeholder="Masukan Nomor Telepon"
        placeholderTextColor="black"
        underlineColorAndroid="transparent"
        theme={{
          colors: {
            primary: 'black',
            underlineColor: 'transparent',
          },
          roundness: 8,
        }}
      />

      <Button
        mode="contained"
        style={{
          width: 200,
          height: 36,
          marginBottom: 16,
          alignSelf: 'center',
        }}
        theme={{
          roundness: 6,
          colors: {
            primary: 'gray',
          },
        }}>
        Login
      </Button>
      <Text style={style.textInputLogin}> Atau Menggunakan </Text>
      <Button
        mode="contained"
        style={{
          marginEnd: 36,
          marginStart: 36,
          alignSelf: 'stretch',
        }}
        theme={{
          roundness: 6,
          colors: {
            primary: 'green',
          },
        }}
        labelStyle={{color: 'red', fontSize: 14}}
        onPress={btnSubmitGoogle}>
        Google
      </Button>
    </SafeAreaView>
  );
}
