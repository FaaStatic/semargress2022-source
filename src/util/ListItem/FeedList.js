import React from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';


const { height : HEIGHT_CONTAINER } = Dimensions.get('window');
const {width : WIDTH_CONTAINER} = Dimensions.get('window');

export default function FeedList({item}){
return(<SafeAreaView style={style.container}>
        <SafeAreaView style={style.containerHeader}>
            <Image resizeMode='stretch' style={style.imageProfileStyle}/>
            <Text style={style.textHeader}></Text>
        </SafeAreaView>
        <Image resizeMode='stretch' style={style.imagePromo} />
        <Text></Text>
</SafeAreaView>);

}

const style = StyleSheet.create({
    containerHeader:{
        flexDirection:'row',
        flex:1,
    },
    imageProfileStyle :{
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    overflow: "hidden",
    },
    textHeader:{
        fontSize:16,
        color:'black',
        fontWeight:'bold'
    },
    imagePromo:{
            width:'100%',
            height:HEIGHT_CONTAINER/3,
    },
    container:{
        flex:1,
        minHeight:HEIGHT_CONTAINER/2,
        width:WIDTH_CONTAINER,
    },
    textDeskripsi:{

    }
})