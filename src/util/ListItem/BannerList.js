import React from 'react';
import { View, Image, StyleSheet } from 'react-native';


export default function BannerList({ item }) {
    console.log('console dari banner', item.gambar);
    return (
      <View style={style.bannerContainer}>
        <Image source={{ uri: item.gambar }} style={style.bannerImage} />
      </View>
    );
  }



const style = StyleSheet.create({
      bannerContainer: {
        flex: 1,
        margin: 8,
        padding: 0,
        borderRadius: 16,
      },
      bannerImage: {
        height: 300,
        width: 300,
        borderRadius: 16,
      },
})