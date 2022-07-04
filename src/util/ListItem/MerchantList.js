import React from 'react';
import { SafeAreaView, Text, Pressable, StyleSheet, Image, Dimensions } from 'react-native';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');


export default function MerchanList({ item, pressCall }) {

  return (
    <SafeAreaView style={style.container}>
      <Pressable onPress={() => pressCall(item)} style={style.containerGbr}>
        <Image source={{ uri: item.foto }} style={style.imageStyle} resizeMode="stretch" />
      </Pressable>
      <Text style={style.textStyle}>{item.nama}</Text>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: SCREEN_WIDTH/3,
    height: SCREEN_HEIGHT/3.5,
    marginStart:SCREEN_WIDTH/10,
    alignSelf:'center',
    marginBottom:16,
  },
  containerGbr: {
    width: SCREEN_WIDTH/3,
    height: SCREEN_HEIGHT/5.5,
    backgroundColor: 'white',
    position:'absolute',
    top:0,
    elevation: 5,
    borderRadius: 16,
  },
  imageStyle: {
    borderRadius: 16,
    height: '100%',
    width: '100%',
  },
  textStyle: {
    fontSize: 16,
    color: 'black',
    width:SCREEN_WIDTH/3,
    position:'absolute',
    bottom:0,
    textAlign:'center',
  },
});
