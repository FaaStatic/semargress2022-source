import {
  SafeAreaView,
  Animated,
  Image,
  ImageBackground,
  Text,
  View
} from 'react-native';
import React, {useEffect, useRef, useCallback} from 'react';
import {StackActions} from '@react-navigation/native';
import style from '../../util/style';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function Splash({navigation}) {
  let stat = false;

  const fadeAnim = useRef(new Animated.Value(0.0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    CheckLogin();
    fadeIn();
    setTimeout(() => {
      if (stat) {
         // eslint-disable-next-line react-hooks/exhaustive-deps
         navigation.dispatch(StackActions.replace('RouterTab'));
       } else {
        navigation.dispatch(StackActions.replace('Login'));
       }
     }, 3000);
  },[CheckLogin, fadeIn, setTimeout ]);
  
  const CheckLogin = async () => {
    const sesi = await SessionManager.GetAsObject(sessionId);
    console.log('SESSION_DATA', sesi);
    if (sesi != null) {
      stat = true;
    } else {
      console.log('Login Dulu');
    }
  };

  return (
<SafeAreaView style={{
      flex:1,
      margin:0,
      padding:0,
      justifyContent:'center',
    }}>
        <Image
        source={require('../../assets/header_app.png')}
        style={{
          height:80,
          marginTop:0,
          top:0,
          height:'15%',
          width : '100%',
          position :'absolute'
        }}
        resizeMode={'stretch'}
        />
        <Animated.View
          style={[
            style.boxImageSplash,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Image
            style={{
              height:300,
              width:300,
              alignSelf:'center',
            }}
            source={require('../../assets/logo.png')}
            resizeMode={'contain'}
            resizeMethod={'resize'}
          />
        </Animated.View>
        <Text
          style={{
            fontSize: 12,
            color: 'black',
            fontWeight: 'bold',
            bottom: 0,
            alignSelf: 'center',
            position: 'absolute',
            marginBottom: 36,
          }}>
          Copyrigth{'\u00A9'}2022
        </Text>
    </SafeAreaView>
   
  );
}
