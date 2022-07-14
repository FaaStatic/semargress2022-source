import React, { useEffect } from 'react';
import Router from './src/util/router/router';
import FlashMessage from "react-native-flash-message";
import { StatusBar, SafeAreaView, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import firebase from '@react-native-firebase/app';
import {Platform} from 'react-native';
import {ShowNotif} from './src/util/ShowMessage';

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

  useEffect(() => {
    
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

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
    
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
    
        // process the notification
    
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
    
        // process the action
      },
    
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
    
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);

    const handler = foregroundHandler()

    return () => {
      PushNotificationIOS.removeEventListener(type);
      handler;
    };

  }, [])

  const onRemoteNotification = (notification) => {

    console.log(notification)
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  };

  const foregroundHandler = () => {
    messaging().onMessage(async remoteMessage => {
      console.log();
      ShowNotif(remoteMessage.notification.title, remoteMessage.notification.body)
    });
  };
  

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
