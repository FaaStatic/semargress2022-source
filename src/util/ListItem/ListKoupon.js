import React from 'react'
import { SafeAreaView, Image, StyleSheet, Dimensions,Text, FlatList } from 'react-native'
const windowWidth = Dimensions.get('window').width;
export default function ListKoupon({item}){

    const itemRender = ({item}) =>{

        return(
            <SafeAreaView>
                <Image source={require('../../assets/e-koupon.png')} resizeMode='contain' style={style.imageStyle} />
                 <Text style={style.styleText}>item.nomor</Text>
            </SafeAreaView>
        );

        
    }
    
    return(<SafeAreaView>
        <FlatList data={item}
          numColumns={2}
          renderItem={itemRender}
          keyExtractor={(item)=> item.nomor}
          />
    </SafeAreaView>);
}

const style = StyleSheet.create({
    imageStyle:{
        height:300,
        width  : (windowWidth/2) - 100,
        position:'absolute',
    },
    styleText :{
        top:0,
        bottom:0,
        start:0,
        end:0,
        position:'absolute',
        alignSelf:'center',
        fontSize:28,
        color:'white',
    }
});