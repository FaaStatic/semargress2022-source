import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RouteTab from './routertab';
import Splash from '../../screen/Begin/splash';
import Login from '../../screen/Begin/login';
import Register from '../../screen/Begin/register';
import RouterQuiz from './routerQuiz';
import DetailMerchant from '../../screen/Home/homecomponents/DetailMerchant';
import DetailQR from '../../screen/QR/detailqr'

const StackScreen = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <StackScreen.Navigator>
        <StackScreen.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
          name="Register"
          component={Register}
          initialParams={{
            uid: null,
            email: null,
            foto: null,
            fcm_id: null,
            token: null,
            no_telp: null,
            otp: null,
          }}
          options={{
            headerShown: true,
          }}
        />
        <StackScreen.Screen
          name="RouterTab"
          component={RouteTab}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
          name="DetailMerchant"
          component={DetailMerchant}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
          name="RouterQuiz"
          component={RouterQuiz}
          options={{
            headerShown: true,
            headerTitle: 'Kuis',
            headerShadowVisible: false,
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              backgroundColor:'white',
              marginBottom:0,
              borderBottomWidth: 0,
            }
          }}
        />
        <StackScreen.Screen
          name="DetailQR"
          component={DetailQR}
          options={{
            headerShown: false,
          }}
        />
      </StackScreen.Navigator>
    </NavigationContainer>
  );
}
