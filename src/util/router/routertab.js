import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../../screen/Home/home';
import Feed from '../../screen/Feed/Feed';
import QR from '../../screen/QR/qr';
import Event from '../../screen/Event/event';
import Profil from '../../screen/Profil/profil';
import { Image, Text, View, StyleSheet } from 'react-native';

const TabScreen = createBottomTabNavigator();

export default function RouterTab({ navigation }) {
  return (
    <TabScreen.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          shadowColor: '#D8E3E7',
          height:85,
          padding:5,
          paddingLeft:20,
          paddingRight:20,
          shadowOffset: {
            width: 0,
            height: 28,
          },
          shadowOpacity: 0.25,
          elevation: 5,
        },
        tabBarActiveTintColor: '#F29836',
        tabBarInactiveTintColor: 'black',
      })}
    >
      <TabScreen.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon:({focused, size, color}) =>{
            let active = focused ? require('../../assets/home_active.png') : require('../../assets/home_inactive.png') 
            return(
              <View style={style.iconContainer(focused)}>
                <Image source={active} style={style.iconStyle}/>
              </View>
            )
          }
        }}
      />
      <TabScreen.Screen name="Feed" component={Feed} 
       options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/coupon_active.png') : require('../../assets/coupon_inactive.png') 
          return(
            <View style={style.iconContainer(focused)}>
              <Image source={active} style={[style.iconStyle, {resizeMode:'center'}]}/>
            </View>
          )
        }
      }} />
      <TabScreen.Screen name="QR" component={QR} 
      options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/qr_active.png') : require('../../assets/qr_inactive.png') 
          return(
            <View style={[style.iconContainer,{height:55,width:55,backgroundColor:'#A57FF8',justifyContent:'center',borderRadius:12,}]}>
              <Image source={active} style={[style.iconStyle, {width:30, height:30}]}/>

            </View>
          )
        }
      }}  />
      <TabScreen.Screen name="Event" component={Event} 
      options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/even_active.png') : require('../../assets/event_inactive.png') 
          return(
            <View style={style.iconContainer(focused)}>
              <Image source={active} style={style.iconStyle}/>
            </View>
          )
        }
      }}/>
      <TabScreen.Screen name="Profil" component={Profil} options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/profile_active.png') : require('../../assets/profile_inactive.png') 
          return(
            <View style={style.iconContainer(focused)}>
              <Image source={active} style={style.iconStyle}/> 
            </View>
          )
        }
      }}/>
    </TabScreen.Navigator>
  );
}

const style = StyleSheet.create({
  btnCOntainer: {
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  iconContainer:focused => ({
    height:40,
    width:40,
    borderRadius:12,
    backgroundColor:'#f9f9f9',
    elevation: focused ? 2 : 0,
    justifyContent:'center',
    bottom : 0,
    padding:8,
    position:'absolute',
    marginBottom:16,
  }),
  iconStyle:{
    height:20,
    width:20,
    alignSelf:'center',
    resizeMode:'center',
  }
});
