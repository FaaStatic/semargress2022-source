import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';


export default function IklanItem({item}){
    return(
        <SafeAreaView style={style.container}>
            <Image source={{uri:item.foto}} resizeMode='contain' style={style.imageStyle}/>
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container:{
        flexDirection:'row',
        flex:1,
        justifyContent:'flex-start',
        borderRadius:8,
        elevation:5,
        backgroundColor:'white',
        marginLeft:8,
        marginRight:8,
        padding:0,
        height:250
    },
    imageStyle:{
        borderRadius:8,
        flex:1,
        height:250,
        width:'100%',

    },
})