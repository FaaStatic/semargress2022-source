import React, {useEffect} from 'react';
import {StackActions} from '@react-navigation/native';
import { sessionId } from '../../util/GlobalVar';
import {SafeAreaView, View, Text, ScrollView, ImageBackground} from 'react-native';
import Style from '../../util/style';
import { SessionManager } from '../../util/SessionManager';
import { Searchbar } from 'react-native-paper';


export default function Home({navigation, route}) {
  useEffect(() => {
    checkSession();
  });

  const checkSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
    if(session != null){
      const sesiUid = session.uid;
      console.log('TEST AT HOME', sesiUid);
      console.log('TEST AT HOME FULL', session);
    }else{
      console.log('login dulu!');
      navigation.dispatch(StackActions.replace('Login'));
    }
  };
  return <SafeAreaView style={
    Style.container
  }>
      <ImageBackground source={require('../../assets/header_app.png') }
      style={{
        height:100,
        marginTop:0,
        top:0,
        width : '100%',
        position :'absolute',
        flexDirection:'row',
      }}
      resizeMode={'stretch'}
      >

     <Searchbar />

      </ImageBackground>
    <ScrollView>
 
    </ScrollView>
  </SafeAreaView>;
}
