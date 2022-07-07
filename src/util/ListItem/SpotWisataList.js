import React from 'react';
import { SafeAreaView, Image, Text,StyleSheet, Pressable, Dimensions } from 'react-native';
import { colors } from '../color';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;

export default function SpotWisataList({item, pressCall}){
    return (
        <Pressable style={style.container} onPress={() => { pressCall(item) }}>

            <Image source={{ uri: item.gambar }} style={style.imageStyle} />

            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(15, 46, 99, 0.7)', 'rgba(20, 99, 99, 0.8)']}
                start={{ x: 0.0, y: 0 }}
                end={{ x: 0.0, y: 1.5 }}
                style={style.imageGradient}
            >
                
            </LinearGradient>

            
            <Text style={style.textNama}>{item.nama}</Text>

        </Pressable>);
}

const style = StyleSheet.create({
    container :{
    height:windowWidth/2,
    width:windowWidth/3,
    borderRadius:8,
    backgroundColor:colors.black,
    flexDirection:'column',
    marginStart:8,
    
    },
    imageStyle:{
        height:'100%',
        width:'100%',
        backgroundColor:colors.black,
        resizeMode:'cover',
        borderRadius:8,
    },
    textNama:{
        position:'absolute',
        fontSize:14,
        color:colors.white,
        bottom:0,
        textAlign:'center',
        alignSelf:'center',
        marginBottom:8,
        backgroundColor:'transparent',

    },
    imageGradient:{
        width: '100%',
        height: '100%',
        position:'absolute',
        borderRadius:8,
    }
})