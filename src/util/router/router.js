import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, Dimensions, Pressable, SafeAreaView } from 'react-native';
import RouteTab from './routertab';
import Splash from '../../screen/Begin/splash';
import Login from '../../screen/Begin/login';
import Register from '../../screen/Begin/register';
import RouterQuiz from './routerQuiz';
import DetailMerchant from '../../screen/Home/merchant/DetailMerchant';
import DetailQR from '../../screen/QR/detailqr';
import ScanQR from '../../screen/QR/detailscanqr';
import About from '../../screen/Profil/about';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DetailListCategory from '../../screen/Home/merchant/DetailListCategory';
import VoucherHome from '../../screen/Home/homecomponents/VoucherHome';
import EKupon from '../../screen/Home/homecomponents/Ekupon';
import Voucher from '../../screen/Voucher/voucher';
import DetailWisataSemarang from '../../screen/Home/homecomponents/wisata/DetailWisataSemarang';
import HomeWisataSemarang from '../../screen/Home/homecomponents/wisata/HomeWisataSemarang';
import Search from '../../screen/Home/Search';
import HomeMerchat from '../../screen/Home/merchant/HomeMerchant';
import EventDetail from '../../screen/Event/EventDetail';
import DetailPromo from '../../screen/Promo/DetailPromo';
import HomePromo from '../../screen/Promo/HomePromo';
import RemoveAccount from '../../screen/Profil/RemoveAccount';

const StackScreen = createNativeStackNavigator();

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Router() {
  return (
    <NavigationContainer>
      <StackScreen.Navigator 
       screenOptions={{headerShadowVisible:true}}>
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
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: route.params.title !== undefined ? route.params.title : 'Daftar',
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
          })}
        />
        <StackScreen.Screen
          name="DetailPromo"
          component={DetailPromo}
          initialParams={{
            uid: null,
            email: null,
            foto: null,
            fcm_id: null,
            token: null,
            no_telp: null,
            otp: null,
          }}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: 'Detail Promo',
            headerShadowVisible:true,
            header: (screenProps) => {
              return (
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                      shadowColor: '#171717',
                      shadowOffset: {width: -2, height: 4},
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                    
                  }}>
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      top: SCREEN_HEIGHT / 20,
                      left: 0,
                      marginStart: 16,
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: 'black',
                      alignSelf: 'center',
                      fontSize: 18,
                      width: '50%',
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Detail Promo
                  </Text>
                </View>
              );
            },
          })}
        />
        <StackScreen.Screen
          name="RouterTab"
          component={RouteTab}
          options={{
            headerShown: false,
          }}
        />
        <StackScreen.Screen
          name="Search"
          component={Search}
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
          options={({ navigation, screenProps }) => ({
            headerShown: true,
            headerTitle: 'Kuis Semargres',
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="About"
          component={About}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
        <StackScreen.Screen
          name="Voucher"
          component={Voucher}
          options={({ navigation, screenProps }) => ({
            title: 'Detail Voucher',
            headerShown: true,
            headerTitleAlign: 'center',
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
          })}
        />
        <StackScreen.Screen
          name="DetailListCategory"
          component={DetailListCategory}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: route.params.nama,
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="EventDetail"
          component={EventDetail}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: route.params.nama,
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            header: (screenProps) => {
              return (
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      top: SCREEN_HEIGHT / 20,
                      left: 0,
                      marginStart: 16,
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: 'black',
                      alignSelf: 'center',
                      fontSize: 18,
                      width: '75%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {route.params.nama}
                  </Text>
                </View>
              );
            },
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
          name="VoucherHome"
          component={VoucherHome}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: 'Voucher Saya',
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="EKupon"
          component={EKupon}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: 'E-Kupon Semargres',
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="DetailWisata"
          component={DetailWisataSemarang}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: 'Info Wisata',
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="MerchantHome"
          component={HomeMerchat}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: 'Merchant Populer',
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="HomeWisata"
          component={HomeWisataSemarang}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: 'Wisata Semarang',
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            headerLeft: () => {
              return (
                <View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>
                </View>
              );
            },
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
          name="RemoveAccount"
          component={RemoveAccount}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            headerShadowVisible : true,
            title: 'Kebijakan Hapus Akun',
            headerTitleAlign: 'center',
            header: (screenProps) => {
              return (
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 30,
                    shadowRadius: 1.41,
                    elevation: 30,
                    borderBottomColor:'rgba(0, 0, 0, 0.08)',
                    borderBottomWidth:1,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      top: SCREEN_HEIGHT / 20,
                      left: 0,
                      marginStart: 16,
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: 'black',
                      alignSelf: 'center',
                      fontSize: 18,
                      width: '75%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    Kebijakan Hapus Akun
                  </Text>
                </View>
              );
            },
          })}
        />
        <StackScreen.Screen
          name="HomePromo"
          component={HomePromo}
          options={({ navigation, screenProps, route }) => ({
            headerShown: true,
            title: route.params.name,
            headerTitleAlign: 'center',
            headerShadowVisible: true,
            header: (screenProps) => {
              return (
                <View
                  style={{
                    height: 100,
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      top: SCREEN_HEIGHT / 20,
                      left: 0,
                      marginStart: 16,
                    }}
                    onPress={() => navigation.goBack()}
                  >
                    <IonIcon name="chevron-back" size={24} color={'black'} />
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: 'black',
                      alignSelf: 'center',
                      fontSize: 18,
                      width: '75%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {route.params.name}
                  </Text>
                </View>
              );
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              backgroundColor: 'white',
              marginBottom: 0,
              borderBottomWidth: 0,
            },
          })}
        />
      </StackScreen.Navigator>
    </NavigationContainer>
  );
}
