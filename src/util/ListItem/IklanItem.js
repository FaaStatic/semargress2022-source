import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { height: heightScreen } = Dimensions.get('window');
const { width: widhtScreen} = Dimensions.get('window');
const defaultMargin = 10;
const aspect_ratio = widhtScreen/heightScreen;

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
        marginBottom:aspect_ratio < 0.7 ? 2: heightScreen/30,
        width:widhtScreen -32,
        height:widhtScreen -32,
    },
    imageStyle:{
        borderRadius:8,
        width:widhtScreen -32,
        height:widhtScreen -32,
    },
})