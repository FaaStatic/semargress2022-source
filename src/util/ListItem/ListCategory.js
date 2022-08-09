import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { colors } from '../color';
const windowWidth = Dimensions.get('window').width;

export default function ListCategory({item, pressCall}){
    console.log(item);
    return(
        <Pressable style={style.container} onPress={() => {pressCall(item)}}>
            
            <Image source={{uri:item.foto}} resizeMode='cover' style={style.imageStyle}/>

            <View style={style.containerText}>

                <Text style={[style.textStyle,{
                    width:windowWidth-windowWidth/2.5-50,
                    textAlign:'left'
                }]}>{item.nama}</Text>

                <Text style={[style.textStyle,{
                    fontSize:10,
                    width:windowWidth-windowWidth/2.5-50,
                    fontWeight:'normal',
                    textAlign:'left',
                    marginTop:8,
                }]}>{ item.alamat }</Text>

            </View>
        </Pressable>
    );
}

const style = StyleSheet.create({
    container:{
        flexDirection:'row',
        flex:1,
        height:windowWidth/2.5,
        justifyContent:'flex-start',
        borderRadius:5,
        backgroundColor:'white',
        marginLeft:8,
        marginRight:8,
        padding:0,
    },
    imageStyle:{
        borderRadius:5,
        height:windowWidth/2.5,
        width:windowWidth/2.5,
    },
    containerText:{
        flexDirection:'column',
        alignItems:'center',
        marginTop:4,
        marginBottom:4,
    },
    textStyle:{
        fontSize:16,
        color:colors.black3,
        fontWeight:'600',
        marginStart:16,
        fontFamily:"neutrifpro-regular",
    }
})