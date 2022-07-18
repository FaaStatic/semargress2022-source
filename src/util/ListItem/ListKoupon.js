import React from 'react'
import { SafeAreaView, Image, StyleSheet, Dimensions,Text, FlatList, View } from 'react-native'
const windowWidth = Dimensions.get('window');


export default function ListKoupon({data}){

    console.log('testest',data)

    function changeDate(data){
        let dateArr = data.split('/');
        console.log(dateArr)
        let dateAnswer = null;
         switch(dateArr[1]){
             case '01':
                 dateAnswer = `${dateArr[0]} Januari ${dateArr[2]}`;
                 break;
             case '02':
                 dateAnswer = `${dateArr[0]} Februari ${dateArr[2]}`;
                 break;
             case '03':
                 dateAnswer = `${dateArr[0]} Maret ${dateArr[2]}`;
                 break;
             case '04':
                 dateAnswer = `${dateArr[0]} April ${dateArr[2]}`;
                 break;
             case '05':
                 dateAnswer = `${dateArr[0]} Mei ${dateArr[2]}`;
                 break;
             case '06':
                 dateAnswer = `${dateArr[0]} Juni ${dateArr[2]}`;
                 break;
             case '07':
                 dateAnswer = `${dateArr[0]} Juli ${dateArr[2]}`;
                 break;
             case '08':
                 dateAnswer = `${dateArr[0]} Agustus ${dateArr[2]}`;
                 break;
             case '09':
                 dateAnswer = `${dateArr[0]} September ${dateArr[2]}`;
                 break;
             case '10':
                 dateAnswer = `${dateArr[0]} Oktober ${dateArr[2]}`;
                 break;
             case '11':
                 dateAnswer = `${dateArr[0]} November ${dateArr[2]}`;
                 break;
             case '12':
                 dateAnswer = `${dateArr[0]} Desember ${dateArr[2]}`;
                 break;
             default: 
                 
                 break;
         }
         return dateAnswer;
  
     }

    return(

        <>

        {data.type =='title' &&
        <View style={{
            flexDirection:'row',
            width:windowWidth.width,
        }}>
        <Text style={{
                color:'black',
                fontSize:15,
                fontWeight:'600',
                marginStart:20,
                marginBottom:16,
                
            }}>{data.merchant}</Text>
              <Text style={{
                color:'black',
                position:'absolute',
                right:0,
                fontSize:13,
                marginEnd:16,
                fontWeight:'400',
                marginBottom:16,
            }}>{changeDate(data.insert_at)}</Text>
        </View>
        
        }

        {data.type =='coupon' &&
            <View style={style.container}>
           <Image source={require('../../assets/e-kupon.png')} resizeMode='contain' style={{
            height:windowWidth.height/4,
            width:windowWidth.width/2,
            marginBottom:10,
            marginStart:windowWidth.width/500,
           }}/>
           <Text style={{
            position:'absolute',
            fontSize:14,
            fontWeight:'bold',
            color:'white',
            alignSelf:'center',


           }}>{data.nomor}</Text>
        </View>
        }
        </>
        
    )
          
}

const style = StyleSheet.create({
    imageStyle:{
        height:300,
        position:'absolute',
        backgroundColor:'red'
    },
    styleText :{
        top:0,
        bottom:0,
        start:0,
        end:0,
        width: windowWidth.width/2,
        position:'absolute',
        alignSelf:'center',
        fontSize:28,
        color:'white',
    },
    textHeader :{
        flexDirection:'row',
    },
    container:{
        marginTop:8,
        width:  windowWidth.width/2,
        justifyContent:'center',
    }
});