import React from 'react';
import {View, Pressable, Image, StyleSheet, Text} from 'react-native'

export default function IconList({item, Press}) {
    return (
      
      <View style={{ 

          marginBottom: 16,
          marginTop: 20,
          marginRight: 10,
          marginLeft: 10,
       }}>
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
        height: 70,
        width: 70,
        backgroundColor:'transparent',
      },
      iconCategory: {
        height: 70,
        width: 70,
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
        width:'100%',
        textAlign:'center',
        fontSize: 12,
        fontFamily:"neutrifpro-regular",
        color: 'black',
        alignSelf: 'center',
      },
  })