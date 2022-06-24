import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RouteTab from '../util/routertab';
import Splash from '../screen/Begin/splash';
import Login from '../screen/Begin/login';
import Register from '../screen/Begin/register';

const StackScreen = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <StackScreen.Navigator>
        <StackScreen.Screen name="Splash" component={Splash} options={{
          headerShown: false,
        }} />
        <StackScreen.Screen name="Login" component={Login} options={{
          headerShown: false,
        }} />
        <StackScreen.Screen name="Register" component={Register} initialParams={{
          uid : null, 
          email : null,
          foto : null, 
          fcm_id : null,
          token : null,
          no_telp : null,
          otp : null,
        }} options ={{
          headerShown: true,
        }}/>
        <StackScreen.Screen name="RouterTab" component={RouteTab} options={{
          headerShown: false,
        }}/>
      </StackScreen.Navigator>
    </NavigationContainer>
  );
}
