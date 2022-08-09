import React from 'react';
import { SafeAreaView, Image, Text,StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function ListWisataSemarang({item, pressCall}){
    return (
    <SafeAreaView style={style.container}>
        <Image source={{uri : item.gambar}} resizeMode='stretch' style={style.imageStyle}/>
        <Text style={style.textNama}>{item.nama}</Text>
    </SafeAreaView>);
}

const style = StyleSheet.create({
    container :{
    height:250,
    width: windowWidth/4,
    borderRadius:16,
    flexDirection:'column',
    marginStart:8,
    
    },
    imageStyle:{
        height:175,
        width:125,
        borderRadius:8,
    },
    textNama:{
        position:'absolute',
        fontSize:14,
        fontFamily:"neutrifpro-regular",
        fontWeight:'bold',
        bottom:0,
        textAlign:'center',
        alignSelf:'center',
        marginBottom:8,
        backgroundColor:'transparent',

    }

})