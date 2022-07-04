import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function Location({ navigation, route }) {
  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          height: 100,
          backgroundColor: '#0F2E63',
        }}
      >
        <Image
          source={require('../../assets/header_app.png')}
          style={{
            height: 100,
            marginTop: 0,
            top: 0,
            width: '100%',
            position: 'absolute',
            flexDirection: 'row',
          }}
          resizeMode={'stretch'}
        />

        <Text style={style.textHeader}>Feed Promo</Text>
      </View>
      <SafeAreaView style={style.continerFeed}></SafeAreaView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  continerFeed: {
    flex: 1,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    width: '100%',
    minHeight: SCREEN_HEIGHT,
    position: 'absolute',
    backgroundColor:'white',
    marginTop:100,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    color: 'white',
    marginTop: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0F2E63',
  },
});
