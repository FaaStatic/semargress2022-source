import React from 'react'
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';


export default function AnswerDoneList({item}){

   function changeDate(data){
       let dateFetch =  data.split(' ');
       console.log(data)
       console.log(dateFetch)
       let dateArr = dateFetch[0].split('-');
       console.log(dateArr)
       let dateAnswer = null;
        switch(dateArr[1]){
            case '01':
                dateAnswer = `${dateArr[2]} Januari ${dateArr[0]}`;
                break;
            case '02':
                dateAnswer = `${dateArr[2]} Februari ${dateArr[0]}`;
                break;
            case '03':
                dateAnswer = `${dateArr[2]} Maret ${dateArr[0]}`;
                break;
            case '04':
                dateAnswer = `${dateArr[2]} April ${dateArr[0]}`;
                break;
            case '05':
                dateAnswer = `${dateArr[2]} Mei ${dateArr[0]}`;
                break;
            case '06':
                dateAnswer = `${dateArr[2]} Juni ${dateArr[0]}`;
                break;
            case '07':
                dateAnswer = `${dateArr[2]} Juli ${dateArr[0]}`;
                break;
            case '08':
                dateAnswer = `${dateArr[2]} Agustus ${dateArr[0]}`;
                break;
            case '09':
                dateAnswer = `${dateArr[2]} September ${dateArr[0]}`;
                break;
            case '10':
                dateAnswer = `${dateArr[2]} Oktober ${dateArr[0]}`;
                break;
            case '11':
                dateAnswer = `${dateArr[2]} November ${dateArr[0]}`;
                break;
            case '12':
                dateAnswer = `${dateArr[2]} Desember ${dateArr[0]}`;
                break;
            default: 
                dateAnswer = 'error';
                break;
        }
        return dateAnswer;

    }


    return(
        <SafeAreaView style={style.containerList}>
            <View style={style.containerHeader}>
            <Icon name='shop' size={28} color={'#0F2E63'}/>
            <Text style={[style.textHeader,{
                width:175,
            }]}>{item.nama_merchant}</Text>
            <Text style={[style.textStyleContent,{
                color:'grey',
                alignSelf:'flex-end',
                marginTop:0,
                marginEnd:16,
                position:'absolute',
                right:0,
                top:0,
            }]}>{ changeDate(item.answered_at) }</Text>
            </View>
           
            <Text style={[style.textStyleContent,{
                fontSize:18,
                fontWeight:'bold',
                color:'black',
            }]}>{item.soal}</Text>
          <Text style={[style.textStyleContent,{
                marginBottom:16,
                marginTop:16,
                fontSize:12,
                fontWeight:'bold'
            }]}>Jawaban {`\t\t : `} {item.jawaban }</Text>
        </SafeAreaView>);
}



const style = StyleSheet.create({
    containerList:{
        borderRadius:8,
        backgroundColor:'#f9f9f9',
        margin:8,
        elevation:5,
        flexDirection:'column',
    },
    containerHeader:{
        flexDirection:'row',
        margin:8,
        padding:2,
        
    },
    containerHeaderText:{
        flexDirection:'column',
    },
    textHeader:{
        marginStart:8,
        fontSize:14,
        color:'black',
        fontWeight:'bold',
    },
    textStyleContent:{
        marginStart:45,
        fontSize:12,
        color:'red',
    },
    containerHadiah : {
        flexDirection:'row',
         marginStart:45,
         marginBottom:18
    }

})