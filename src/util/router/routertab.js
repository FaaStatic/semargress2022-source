import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../../screen/Home/home';
import Feed from '../../screen/Feed/Feed';
import QR from '../../screen/QR/qr';
import Event from '../../screen/Event/event';
import Profil from '../../screen/Profil/profil';
import {  Text, View, StyleSheet, Platform  } from 'react-native';
import { Image } from "@rneui/themed";



const TabScreen = createBottomTabNavigator();

export default function RouterTab({ navigation }) {
  return (
    <TabScreen.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          shadowColor: '#D8E3E7',
          height:Platform.OS == 'android' ? 85 : 95,
          padding:5,
          paddingBottom: Platform.OS === 'ios' ? 16 : 0,
          paddingLeft:20,
          paddingRight:20,
          fontFamily:"neutrifpro-regular",
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
              <View style={[style.iconContainer(focused),{
                alignItems:'center'
              }]}>
                <Image source={active} style={{width:20,height:20, aspectRatio:1}}/>
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
            <View style={[style.iconContainer(focused),{
              alignItems:'center'
            }]}>
              <Image source={active} style={{width:20,height:20, aspectRatio:1}}/>
            </View>
          )
        }
      }} />
      <TabScreen.Screen name="QR" component={QR} 
      options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/qr_active.png') : require('../../assets/qr_inactive.png') 
          return(
            <View style={[style.iconContainer,{height:55,width:55,backgroundColor:'#A57FF8',justifyContent:'center',borderRadius:12,alignItems:'center'}]}>
              <Image source={active} style={{width:30,height:30, aspectRatio:1}} resizeMode='contain'/>

            </View>
          )
        }
      }}  />
      <TabScreen.Screen name="Event" component={Event} 
      options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/even_active.png') : require('../../assets/event_inactive.png') 
          return(
            <View style={[style.iconContainer(focused),{
              alignItems:'center'
            }]}>
              <Image source={active}style={{width:20,height:20, aspectRatio:1}}/>
            </View>
          )
        }
      }}/>
      <TabScreen.Screen name="Profil" component={Profil} options={{
        tabBarIcon:({focused, size, color}) =>{
          let active = focused ? require('../../assets/profile_active.png') : require('../../assets/profile_inactive.png') 
          return(
            <View style={[style.iconContainer(focused),{
              alignItems:'center'
            }]}>
              <Image source={active} style={{width:20,height:20, aspectRatio:1}}/> 
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
    marginBottom: Platform.OS === 'ios' ? 8 : 16,
  }),
  iconStyle:{
    height:20,
    width:20,
    alignSelf:'center',
    resizeMode:'center',
  }
});
