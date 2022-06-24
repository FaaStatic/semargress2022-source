import {
  SafeAreaView,
  Animated,
  Image,
  ImageBackground,
  Text,
} from 'react-native';
import React, {useEffect, useRef, useCallback} from 'react';
import {StackActions} from '@react-navigation/native';
import style from '../../util/style';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';

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
        stat = false;
        navigation.dispatch(StackActions.replace('RouterTab'));
      } else {
        navigation.dispatch(StackActions.replace('Login'));
      }
    }, 3000);
  });
  const CheckLogin = async () => {
    let session = SessionManager.GetAsObject(sessionId);
    console.log('SESSION_DATA', session.uid);
    if (session.uid != null && session.fcm_id != null) {
      stat = true;
    } else {
      console.log('Login Dulu');
    }
    return session;
  };

  return (
    <SafeAreaView style={style.conteiner2}>
      <ImageBackground
        source={require('../../assets/bgot.png')}
        style={style.containerSplash}>
        <Animated.View
          style={[
            style.boxImageSplash,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Image
            style={style.boxImageSplash}
            source={require('../../assets/logo.png')}
            resizeMode="cover"
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
      </ImageBackground>
    </SafeAreaView>
  );
}
