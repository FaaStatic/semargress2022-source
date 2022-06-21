import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screen/Home/home';
import Splash from '../screen/Begin/splash';
import Login from '../screen/Begin/login';

const StackScreen = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <StackScreen.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <StackScreen.Screen name="Splash" component={Splash} />
        <StackScreen.Screen name="Login" component={Login} />
        <StackScreen.Screen name="Home" component={Home} />
      </StackScreen.Navigator>
    </NavigationContainer>
  );
}
