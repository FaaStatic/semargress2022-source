import React from 'react';
import { StyleSheet, SafeAreaView, Image, Text, Pressable } from 'react-native';


export default function HomeMerchantList({item, pressCall}){
    console.log('listMerchant',item);
    return(
        <Pressable style={style.containerList} onPress={()=>pressCall(item)}>
        <SafeAreaView style={style.containerImage}>
            <Image source={{uri : item.foto}}style={style.ImageStyle} resizeMode='contain'/>
        </SafeAreaView>
        <Text numberOfLines={2} style={style.textStyle}>{item.nama}</Text>
        </Pressable>
    );
}


const style = StyleSheet.create({
    ImageStyle : {
        height:95,
        width:95,
        borderRadius:8,
        alignSelf:'center',
    },
    containerImage:{
        height:95,
        alignSelf:'center',
        top:10,
        width:95,
        elevation:3,
        borderRadius:8,
        position:'absolute',
        backgroundColor:'#f9f9f9',
        justifyContent:'center',
    },
    containerList:{
        justifyContent:'center',
        flexDirection:'column',
        height:150,
        width:130,
        padding:0,
        marginTop:16,
        marginStart:16,
    },
    textStyle:{
        fontSize:12,
        bottom:0,
        marginTop:4,
        width:100,
        color:'black',
        position:'absolute',
        alignSelf:'center',
        textAlign:'center',
        textAlignVertical:'center',
        marginBottom:6,
    }
})

