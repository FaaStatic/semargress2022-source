import React from 'react';
import {View, Pressable, Image, StyleSheet, Text} from 'react-native'

export default function IconList({item, Press}) {
    return (
      
      <View style={{ margin: 20 }}>
        <Pressable onPress={() => {Press(item)}}>
        <View style={style.categoryContainer}>
          <Image source={{ uri: item.icon }} style={style.iconCategory} resizeMode="contain" />
        </View>
        <Text style={style.nameKategori}>{item.nama}</Text>
        </Pressable>
      </View>
    );
  }

  const style = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'column',
        height: 62,
        width: 62,
        backgroundColor:'transparent',
      },
      iconCategory: {
        height: 62,
        width: 62,
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        justifyContent: 'center',
      },
      pictureKategori: {
        height: 32,
        width: 32,
      },
      nameKategori: {
        fontSize: 12,
        color: 'black',
        alignSelf: 'center',
      },
  })