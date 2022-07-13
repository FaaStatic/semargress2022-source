import React from 'react';
import { SafeAreaView, Image, StyleSheet,Pressable  } from 'react-native';


export default function ListPromo({item, click}){
 return(
    <Pressable style={style.container} onPress={()=>{click(item)}}>
        <Image source={{uri : item.gambar}} style={style.imageStyle}/>
    </Pressable>
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