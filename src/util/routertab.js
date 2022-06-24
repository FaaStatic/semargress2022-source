import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screen/Home/home';
import Location from '../screen/Location/location';
import QR from '../screen/QR/qr';
import Event from '../screen/Event/event';
import Profil from '../screen/Profil/profil';
import {Image, Text} from 'react-native';

const TabScreen = createBottomTabNavigator();

export default function RouterTab({navigation}) {
  return (
    <TabScreen.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 45,
          shadowColor: '#D8E3E7',
          shadowOffset: {
            width: 0,
            height: 28,
          },
          shadowOpacity: 0.25,
          elevation: 5,
        },
        tabBarActiveTintColor: '#F29836',
      tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? require('../assets/homeyellow.png')
              : require('../assets/homegrey.png');
          } else if (route.name === 'Location') {
            iconName = focused
              ? require('../assets/terdekatyellow.png')
              : require('../assets/terdekatgrey.png');
          } else if (route.name === 'QR') {
            iconName = focused
              ? require('../assets/myqryelow.png')
              : require('../assets/myqrgray.png');
          } else if (route.name === 'Event') {
            iconName = focused
              ? require('../assets/newsyellow.png')
              : require('../assets/newsgrey.png');
          } else if (route.name === 'Profil') {
            iconName = focused
              ? require('../assets/akunyellow.png')
              : require('../assets/akungrey.png');
          }

          return (
            <Image
              source={iconName}
              style={{width: 18, height: 18, margin: 0}}
              resizeMethod="scale"
              resizeMode="contain"
            />
          );
        },
      })}>
      <TabScreen.Screen name="Home" component={Home} />
      <TabScreen.Screen name="Location" component={Location} />
      <TabScreen.Screen name="QR" component={QR} />
      <TabScreen.Screen name="Event" component={Event} />
      <TabScreen.Screen name="Profil" component={Profil} />
    </TabScreen.Navigator>
  );
}
