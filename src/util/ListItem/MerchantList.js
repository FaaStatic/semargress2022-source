import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '../color';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const defaultMargin = 10;
const aspect_ratio = SCREEN_WIDTH/SCREEN_HEIGHT;
// var isIpadOS = false;
// const isIpad = (aspect_ratio) => {

// }
export default function MerchanList({ item, pressCall }) {
 console.log(aspect_ratio );
  return (
    <View style={{
      flexDirection: 'column',
      width: SCREEN_WIDTH/2 - 25,
      height: SCREEN_HEIGHT/5,
      marginLeft:defaultMargin,
      marginRight:defaultMargin,
      marginBottom: aspect_ratio < 0.7 ? 2: SCREEN_HEIGHT/6
    }}>
      <Pressable onPress={() => pressCall(item)} style={style.containerGbr}>
        <Image source={{ uri: item.foto }} style={style.imageStyle} resizeMode="cover" />
      </Pressable>
      <Text style={style.textStyle} numberOfLines={2}>{item.nama}</Text>
    </View>
  );
}

const style = StyleSheet.create({

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
