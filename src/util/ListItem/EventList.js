import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';


const {width : SCREEN_WIDTH} = Dimensions.get('window');
const {height : SCREEN_HEIGHT} = Dimensions.get('window');
export default function EventList({item, pressCall}){
    return(<View style={style.container}>
        <Image source={{uri : item.gambar}} resizeMode='cover' style={style.imageStyle}/>
        <View style={{
            flexDirection:'column',
            marginTop:16,
            marginStart:16,
            width:'60%'
        }}>
             <Text style={[style.textGeneric,{
                fontSize:18
             }]}>{item.title}</Text>
            <Text numberOfLines={4} style={[style.textGeneric,{
                marginTop:16,
                fontSize:14,
                width:'50%'
            }]}>
              { item.keterangan.length !== 0 ?  item.keterangan : '-'}
            </Text>
            <Pressable onPress={()=>{pressCall(item)}} style={{
                flexDirection : 'row',
                position:'absolute',
                bottom:0,
                right:0,
                marginEnd:32,
                marginBottom:16,
               
            }}>
                
                <Text style={[style.textGeneric,{
                    fontSize:16,
                    marginEnd:8,
                }]}>Lihat Detail</Text>
                <Icon name='chevron-thin-right' size={20} color={'#0F2E63'}/>
            </Pressable>
        </View>
    </View>);
}

const style = StyleSheet.create({
    container : {
        backgroundColor:'white',
        width:'100%',
        height:SCREEN_HEIGHT/4,
        flexDirection:'row',
        marginBottom:8,
    },
    imageStyle :{
        width:SCREEN_WIDTH/2.8,
        height:SCREEN_HEIGHT/5,
        borderRadius:8,
        marginTop:SCREEN_HEIGHT/40,
        marginStart:16,
        alignSelf:'flex-start',
    }, 

    textGeneric :{
        fontSize:12,
        fontWeight:'bold',
        color:'black',
    }
})