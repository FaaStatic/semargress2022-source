import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';


export default function ListCategory({item}){
    return(
        <SafeAreaView style={style.container}>
            <Image source={{uri:item.foto}} resizeMode='cover' style={style.imageStyle}/>
            <View style={style.containerText}>
                <Text style={[style.textStyle,{
                    width:200,
                    textAlign:'left'
                }]}>{item.nama}</Text>
                <Text style={[style.textStyle,{
                    fontSize:10,
                    width:200,
                    fontWeight:'normal',
                    textAlign:'left',
                    marginTop:8,
                }]}>{ item.alamat }</Text>
            </View>
        </SafeAreaView>
    );
}



const style = StyleSheet.create({
    container:{
        flexDirection:'row',
        flex:1,
        height:125,
        justifyContent:'flex-start',
        borderRadius:16,
        elevation:5,
        backgroundColor:'white',
        margin:8,
        padding:0,
    },
    imageStyle:{
        borderRadius:16,
        height:125,
        width:125,
    },
    containerText:{
        flexDirection:'column',
        justifyContent:'center',
    },
    textStyle:{
        fontSize:16,
        alignSelf:'flex-start',
        marginStart:16,
        fontWeight:'bold',
        color:'black',
    }
})