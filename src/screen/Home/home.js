import React, {useEffect} from 'react';
import {StackActions} from '@react-navigation/native';
import { sessionId } from '../../util/GlobalVar';
import {SafeAreaView, View, Text, ScrollView, Image} from 'react-native';
import Style from '../../util/style';
import { TextInput } from 'react-native-paper';
import { SessionManager } from '../../util/SessionManager';
import Icon from 'react-native-vector-icons/FontAwesome';


export default function Home({navigation, route}) {
  useEffect(() => {
    checkSession();
  });

  const myIcon = <Icon name="rocket" size={30} color="#900" />;

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
    [Style.container, {
        backgroundColor:'#0F2E63',
    }]
  }>
    <View style={{
      height:100,
    }}>
      <Image source={require('../../assets/header_app.png') }
      style={{
        height:100,
        marginTop:0,
        top:0,
        width : '100%',
        position :'absolute',
        flexDirection:'row',
      }}
      resizeMode={'stretch'}
      />
<View style={{
  flex:1,
}}>
    <TextInput
    underlineColor='transparent'
    activeUnderlineColor='transparent'
     style={{
      width:200,
      height:45,
      borderRadius:8,
      bottom:0,
      position:'absolute',
      marginStart:24,
      backgroundColor:'white'
     }} />
</View>
   
    </View>

    <ScrollView>
 
    </ScrollView>
  </SafeAreaView>;
}
