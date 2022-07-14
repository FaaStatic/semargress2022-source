import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';


const {width : SCREEN_WIDTH} = Dimensions.get('window');
const {height : SCREEN_HEIGHT} = Dimensions.get('window');
export default function ListPromoHome({item, pressCall}){
    return(<Pressable style={style.container} onPress={()=>{pressCall(item)}}>
        <Image source={{uri : item.gambar}} resizeMode='cover' style={style.imageStyle}/>
        <View style={{
            flexDirection:'column',
            marginStart:16,
            width:'60%'
        }}>
             <Text style={[style.textGeneric,{
                fontSize:16,
                fontWeight:'600'
             }]}>{item.title}</Text>
            <Text numberOfLines={4} style={[style.textGeneric,{
                marginTop:16,
                fontSize:14,
                fontWeight:'400',
                width:'50%'
            }]}>
              { item.keterangan.length !== 0 ?  item.keterangan : '-'}
            </Text>
        </View>
    </Pressable>);
}

const style = StyleSheet.create({
    container : {
        backgroundColor:'white',
        width:'100%',
        flexDirection:'row',
        marginBottom:8,
    },
    imageStyle :{
        width:130,
        height:130,
        borderRadius:8,
        alignSelf:'flex-start',
    }, 

    textGeneric :{
        fontSize:12,
        fontWeight:'bold',
        color:'black',
    }
})