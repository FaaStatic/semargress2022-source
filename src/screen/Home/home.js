import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
export default function Home({navigation, route}) {
  useEffect(() => {
    checkSession();
  });

  const checkSession = async () => {
    let session = await AsyncStorage.getItem('session_id');
    session = session != null ? JSON.parse(session) : null;
    console.log('TEST AT HOME', session.uid);
    console.log('TEST AT HOME FULL', session);
    if (session.uid == null && session.fcm_id == null) {
      console.log('login dulu!');
      navigation.dispatch(StackActions.replace('Login'));
    }
  };
  return <></>;
}
