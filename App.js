import React,{useEffect} from 'react';
import Router from './src/util/router/router';
import FlashMessage from "react-native-flash-message";
import { StatusBar, SafeAreaView, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import firebase from '@react-native-firebase/app';

var firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://firebaseapp.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: '453568856155',
  appId: 'app-id',
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
