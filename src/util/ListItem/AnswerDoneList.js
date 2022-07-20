import React from 'react'
import {SafeAreaView, Text, StyleSheet, View, Image} from 'react-native';


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
          <Image source={require('../../assets/kuis2.png')} style={{
            height:48,
            width:48,

          }}/>
          <View style={{
            flexDirection:'column',
            marginStart:8,
            width:'100%',
          }}>
          <Text style={style.textHeader}>{item.nama_merchant}</Text>
          <Text style={style.textPeriode}>
          Periode {changeDate(item.periode_start)} - {changeDate(item.periode_end)}
        </Text>
          </View>
          
        </View>
           
        <Text style={[style.textStyleContent,{
                    fontSize:16,
                    fontWeight:'400',
                    color:'black',
                    marginStart:75,
                    width:240,marginBottom:4,
                }]}><Text style={{
                    fontSize:16,
                    fontWeight:'600',
                    color:'black',
                }}>Pertanyaan: </Text>{item.soal}</Text>
                <Text style={[style.textStyleContent,{
                    fontSize:16,
                    fontWeight:'400',
                    color:'black',
                    marginStart:75,
                    width:'50%'
                }]}><Text style={{
                    fontSize:16,
                    fontWeight:'600',
                    color:'black',
                    marginTop:4,
                    width:'50%'
                }}>Hadiah: </Text>{item.hadiah}</Text>
                <Text style={{
                    fontSize:16,
                    marginTop:12,
                    color:'#FB44A0',
                    marginStart:75,
                    fontWeight:'600',
                    marginBottom:4,
                }}>Jawaban Kamu</Text>
                <Text style={{
                    fontSize:13,
                    fontWeight:'400',
                    marginStart:75,
                    color:'black',
                    marginBottom:20,
                }}>{item.jawaban}</Text>
        </SafeAreaView>);
}



const style = StyleSheet.create({
    containerList:{
        borderRadius:8,
        backgroundColor:'white',
        margin:8,
        flexDirection:'column',
        borderBottomWidth:1,
        borderBottomColor:'#f9f9f9'
    },
    containerHeader:{
        flexDirection:'row',
        backgroundColor:'transparent',
        margin:8,
        marginBottom:2,
        padding:2,
        
    },
    containerHeaderText:{
        flexDirection:'column',
        width:'100%',
    },
    textHeader:{
        width:'100%',
        marginStart:8,
        fontSize:16,
        marginBottom:4,
        color:'#3B237E',
        fontWeight:'bold',
    },
    textStyleContent:{
        width:'100%',
        marginStart:45,
        fontSize:12,
        color:'red',
    },
    containerHadiah : {
        flexDirection:'row',
         marginStart:45,
         marginBottom:18
    },
    textPeriode: {
        width:'100%',
        marginStart: 8,
        color: '#828282',
        marginBottom: 4,
        fontWeight:'400',
        fontSize: 12,
      },
      textStyleContent:{
        marginStart:24,
        fontSize:15,
        color:'#4F4F4F',
    },

})