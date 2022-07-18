import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, Dimensions } from 'react-native';


let widhtScreen = Dimensions.get('window').width;
export default function IklanItem({item}){
    return(
        <View style={style.container}>
            <Image source={{uri:item.foto}} resizeMode='contain' style={style.imageStyle}/>
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        
        borderRadius:8,
        elevation:5,
        backgroundColor:'white',
        marginLeft:8,
        marginRight:8,
        padding:0,
        width:widhtScreen -32,
        height:widhtScreen -32,
    },
    imageStyle:{
        borderRadius:8,
        width:widhtScreen -32,
        height:widhtScreen -32,
    },
})