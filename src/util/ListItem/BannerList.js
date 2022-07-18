import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';


export default function BannerList({ item , pressCall}) {
    console.log('console dari banner', item.gambar);
    return (
      <Pressable style={style.bannerContainer} onPress={()=>pressCall(item)}>
        <Image source={{ uri: item.gambar }} style={style.bannerImage} resizeMode='cover'/>
      </Pressable>
    );
  }



const style = StyleSheet.create({
      bannerContainer: {
        padding: 0,
        height: 130,
        width: 130,
        borderRadius: 8,
        margin:14,
      },
      bannerImage: {
        height: 130,
        width: 130,
        borderRadius: 8,
      },
})