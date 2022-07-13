import React,{useEffect} from 'react';
import Router from './src/util/router/router';
import FlashMessage from "react-native-flash-message";
import { StatusBar, SafeAreaView, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import firebase from '@react-native-firebase/app';

var firebaseConfig = {
  apiKey: 'AIzaSyBcnaLt3yXVh4nLergCrtMDADP1Vq0VuJE',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://semargres2019.firebaseio.com',
  projectId: 'semargres2019',
  storageBucket: 'semargres2019.appspot.com',
  messagingSenderId: '356805825965',
  appId: '1:356805825965:ios:a8c00486499f8e41',
  measurementId: 'G-measurement-id',
};




function App() {

  useEffect(()=>{
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
PushNotification.createChannel(
    {
        channelId: 'semargres',
        channelName: 'channel Semargres',
        channelDescription: 'A channel to categorise your notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
    },
      created => console.log(`createChannel returned '${created}'`),
);

  })


  return (
    <>
      <Router />
      <FlashMessage 
          hideStatusBar={false}
          statusBarHeight={StatusBar.currentHeight}
          floating={true}
          animationDuration={240}
          position="bottom" /> 
    </>
  );
}

export default App;
