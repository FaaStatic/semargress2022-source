import React from 'react';
import { View, Image, StyleSheet } from 'react-native';


export default function BannerList({ item }) {
    console.log('console dari banner', item.gambar);
    return (
      <View style={style.bannerContainer}>
        <Image source={{ uri: item.gambar }} style={style.bannerImage} resizeMode='cover'/>
      </View>
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