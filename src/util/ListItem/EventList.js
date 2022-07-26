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
             <Text numberOfLines={3} style={[style.textGeneric,{
                fontSize:18,
             }]}>{item.title}</Text>
            <Text numberOfLines={2} style={[style.textGeneric,{
                marginTop:8,
                fontSize:14,
                fontWeight:'400',
                width:'90%',
                lineHeight:18,

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
                    textAlign:'right'
                }]}>Lihat Detail</Text>
                <Icon name='chevron-thin-right' size={18} color={'#0F2E63'}/>
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
        width:120,
        height:120,
        borderRadius:8,
        marginTop:SCREEN_HEIGHT/40,
        marginStart:16,
        alignSelf:'flex-start',
    }, 

    textGeneric :{
        fontSize:12,
        fontWeight:'bold',
        color:'black',
        width:'90%',
        marginEnd:8,
    }
})