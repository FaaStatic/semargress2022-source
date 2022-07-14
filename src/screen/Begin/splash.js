import { SafeAreaView, Animated, Image, ImageBackground, Text, View } from 'react-native';
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { StackActions } from '@react-navigation/native';
import style from '../../util/style';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
var stat = false;
export default function Splash({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0.0)).current;
  const ballAnim = useRef(new Animated.Value(0.0)).current;
  const [stateBall, setStateBall] = useState(false);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const fadeInBall = () => {
    Animated.timing(ballAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
         setStateBall(true);
        fadeIn();
      }
    });
  };

  useEffect(() => {
    CheckLogin();
   
    let unsubscribe = navigation.addListener('focus',()=>{
      CheckLogin();
      fadeInBall();
      setTimeout(() => {
        if (stat) {
           // eslint-disable-next-line react-hooks/exhaustive-deps
           navigation.dispatch(StackActions.replace('RouterTab'));
         } else {
          navigation.dispatch(StackActions.replace('Login'));
         }
       }, 3000);
    })
   
    return()=>{
    unsubscribe;
    }
  }, [CheckLogin]);

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
    <SafeAreaView
      style={{
        flex: 1,
        margin: 0,
        padding: 0,
        justifyContent: 'center',
        fontFamily: 'NeutrifPro-Regular',
      }}
    >
      {stateBall ? (
        <Animated.View
          style={[
            style.boxImageSplash,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Image
            style={{
              height: 300,
              width: 300,
              alignSelf: 'center',
            }}
            source={require('../../assets/logo.png')}
            resizeMode={'contain'}
            resizeMethod={'resize'}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            backgroundColor: ballAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ['rgba(53,202,237,1)', 'rgba(251,68,160, 0.5)', 'rgba(165,127,248, 0)'],
            }),
            height: 150,
            width: 150,
            borderRadius: 150 / 2,
            alignSelf: 'center',
          }}
        ></Animated.View>
      )}

      <Text
        style={{
          fontSize: 12,
          color: 'black',
          fontWeight: 'bold',
          bottom: 0,
          fontFamily: 'NeutrifPro-Regular',
          alignSelf: 'center',
          position: 'absolute',
          marginBottom: 36,
        }}
      >
        Copyright{'\u00A9'}2022
      </Text>
    </SafeAreaView>
  );
}
