import React, { useEffect } from 'react';
import Router from './src/util/router/router';
import FlashMessage from 'react-native-flash-message';
import { StatusBar, SafeAreaView, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';
import { ShowNotif } from './src/util/ShowMessage';
import Icon from 'react-native-vector-icons/MaterialIcons';

Icon.loadFont();

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

export default function App() {
  let permission = (requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  });

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    createChannel();
    configureNotification();
    const type = 'notification';

    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener(type, onRemoteNotificationIos);
      var handler = foregroundHandler();
    }

    return () => {
      PushNotificationIOS.removeEventListener(type);
      handler;
    };
  }, []);

  const onRemoteNotificationIos = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      //navigate
    } else {
      // Do something else with push notification
    }
  };

  const configureNotification = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        onRemoteNotification(notification);
        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: 'semargres',
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
          smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: notification.message, // (optional) default: "message" prop
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
          subtitle: notification.title, // (optional) smaller title below notification title
          playSound: true,
          soundName: 'default',
          /* iOS and Android properties */
          title: notification.title, // (optional)
          message:  notification.message, // (required)
          userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
        });
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
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
    //  *     requestPermissions: Platform.OS === 'ios'
     */
      requestPermissions: Platform.OS === 'ios',
      requestPermissions: true,
    });
  };

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'semargres',
        channelName: 'channel Semargres',
        channelDescription: 'A channel to categorize your notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  const onRemoteNotification = (notification) => {
    console.log('tesnotif', notification);
    if (notification.data) {
      if (notification.userInteraction == true) {
        console.log("testestes");
      }
    } else {
      if (notification.foreground == false) {
        //navigate
      } else {
        //navigate
      }
    }
  };

  const foregroundHandler = () => {
    messaging().onMessage(async (remoteMessage) => {
      //ShowNotif(remoteMessage.notification.title, remoteMessage.notification.body)

      let title = remoteMessage.notification.title;
      let message = remoteMessage.notification.body;
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'semargres',
        autoCancel: true, // (optional) default: true
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
        smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
        bigText: message, // (optional) default: "message" prop
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
        subtitle: message, // (optional) smaller title below notification title
        playSound: true,
        soundName: 'default',
        /* iOS and Android properties */
        title: title, // (optional)
        message: message, // (required)
        userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
      });
    });
  };

  return (
    <>
      <Router />
      <FlashMessage
        hideStatusBar={false}
        statusBarHeight={StatusBar.currentHeight}
        floating={true}
        style={{ paddingLeft: 10, paddingRight: 10 }}
        animationDuration={240}
        position="bottom"
      />
    </>
  );
}
