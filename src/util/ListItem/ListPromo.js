import React from 'react';
import { SafeAreaView, Image, StyleSheet } from 'react-native';

export default function ListPromo({item, click}){
 return(
    <SafeAreaView style={style.container}>
        <Image source={{uri : item.gambar}} style={style.imageStyle}/>
    </SafeAreaView>
 );
}

const style = StyleSheet.create({
    container : {
        height:150,
        width:150,
        borderRadius:16,
        margin:8,
    },
    imageStyle:{
        height:150,
        width:150,
        borderRadius:16,
    }
})