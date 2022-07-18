import React from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';


export default function HomeMerchantList({item, pressCall}){
    return(
        <Pressable style={style.containerList} onPress={() => pressCall(item)}>
            <View style={style.containerImage}>
                <Image source={{ uri: item.foto }} style={style.ImageStyle} resizeMode='contain' />
            </View>
            <Text numberOfLines={2} style={style.textStyle}>{item.nama}</Text>
        </Pressable>
    );
}


const style = StyleSheet.create({
    ImageStyle : {
        height:120,
        width:120,
        borderRadius:8,
        alignSelf:'center',
    },
    containerImage:{
        height:120,
        alignSelf:'center',
        top:10,
        width:120,
        elevation:3,
        borderRadius:8,
        position:'absolute',
        backgroundColor:'#f9f9f9',
        justifyContent:'center',
    },
    containerList:{
        justifyContent:'center',
        flexDirection:'column',
        height:170,
        width:130,
        padding:0,
        marginTop:8,
        marginStart:8,
    },
    textStyle:{
        fontSize:12,
        bottom:0,
        marginTop:4,
        width:120,
        color:'black',
        position:'absolute',
        alignSelf:'center',
        textAlign:'center',
        textAlignVertical:'center',
        marginBottom:6,
    }
})

