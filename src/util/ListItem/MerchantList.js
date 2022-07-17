import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '../color';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const defaultMargin = 10;

export default function MerchanList({ item, pressCall }) {

  return (
    <View style={style.container}>
      <Pressable onPress={() => pressCall(item)} style={style.containerGbr}>
        <Image source={{ uri: item.foto }} style={style.imageStyle} resizeMode="cover" />
      </Pressable>
      <Text style={style.textStyle} numberOfLines={2}>{item.nama}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: SCREEN_WIDTH/2 - 25,
    height: SCREEN_HEIGHT/3.8,
    marginLeft:defaultMargin,
    marginRight:defaultMargin,
    
    marginBottom:6,
  },
  containerGbr: {
    width: SCREEN_WIDTH/2 - 25,
    height: SCREEN_WIDTH/2 - 25,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 6,
  },
  imageStyle: {
    borderRadius: 6,
    height: '100%',
    width: '100%',
  },
  textStyle: {
    fontSize: 13,
    fontWeight:'400',
    color: colors.black,
    width:SCREEN_WIDTH/2 - 25,
    marginTop:8,
    textAlign:'center',
  },
});
