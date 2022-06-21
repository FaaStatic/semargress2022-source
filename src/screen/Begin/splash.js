import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackActions} from '@react-navigation/native';

export default function Splash({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(StackActions.replace('Login'));
    }, 3000);
  });

  return (
    <View>
      <Text>splash</Text>
    </View>
  );
}
