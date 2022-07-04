import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View, TouchableOpacity } from 'react-native';
import RouteTab from './routertab';
import Splash from '../../screen/Begin/splash';
import Login from '../../screen/Begin/login';
import Register from '../../screen/Begin/register';
import RouterQuiz from './routerQuiz';
import DetailMerchant from '../../screen/Home/merchant/DetailMerchant';
import DetailQR from '../../screen/QR/detailqr';
import ScanQR from '../../screen/QR/detailscanqr';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DetailListCategory from '../../screen/Home/merchant/DetailListCategory';
import VoucherHome from '../../screen/Home/homecomponents/VoucherHome';
import EKupon from '../../screen/Home/homecomponents/Ekupon';

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
          options={( {navigation , screenProps} )=>({
            headerShown: true,
            headerTitle: 'Kuis Semargress',
            headerTitleAlign:'center',
            headerShadowVisible: false,
            headerLeft: () => { return(
              <View>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                <IonIcon name="chevron-back" size={24} color={'black'}/>
                </TouchableOpacity>
              </View>
            )
            } ,
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              backgroundColor: 'white',
              marginBottom: 0,
              borderBottomWidth: 0,
            },
          })}
        />
        <StackScreen.Screen
          name="DetailQR"
          component={DetailQR}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
          name="ScanQR"
          component={ScanQR}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
        name='DetailListCategory'
        component={DetailListCategory}
        options={( {navigation , screenProps, route} )=>({
          headerShown: true,
          title: route.params.nama,
          headerTitleAlign:'center',
          headerShadowVisible: false,
          headerLeft: () => { return(
            <View>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <IonIcon name="chevron-back" size={24} color={'black'}/>
              </TouchableOpacity>
            </View>
          )
          } ,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: 'white',
            marginBottom: 0,
            borderBottomWidth: 0,
          },
        })}/>
         <StackScreen.Screen
        name='VoucherHome'
        component={VoucherHome}
        options={( {navigation , screenProps, route} )=>({
          headerShown: true,
          title: 'Voucher Saya',
          headerTitleAlign:'center',
          headerShadowVisible: true,
          headerLeft: () => { return(
            <View>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <IonIcon name="chevron-back" size={24} color={'black'}/>
              </TouchableOpacity>
            </View>
          )
          } ,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: 'white',
            marginBottom: 0,
            borderBottomWidth: 0,
          },
        })}/>
           <StackScreen.Screen
        name='EKupon'
        component={EKupon}
        options={( {navigation , screenProps, route} )=>({
          headerShown: true,
          title: 'E-Koupon Semargress',
          headerTitleAlign:'center',
          headerShadowVisible: true,
          headerLeft: () => { return(
            <View>
              <TouchableOpacity onPress={()=>navigation.goBack()}>
              <IonIcon name="chevron-back" size={24} color={'black'}/>
              </TouchableOpacity>
            </View>
          )
          } ,
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: 'white',
            marginBottom: 0,
            borderBottomWidth: 0,
          },
        })}/>
      </StackScreen.Navigator>
    </NavigationContainer>
  );
}
