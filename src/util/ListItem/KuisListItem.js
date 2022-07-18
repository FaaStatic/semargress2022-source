import React from 'react';
import { StyleSheet,  Text, Pressable, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default function KuisListItem({ item, onModal }) {


  function changeDate(data){
    let dateFetch =  data.split(' ');
    let dateArr = dateFetch[0].split('-');
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


  console.log('ItemDataKuis', item);
  return (
    <View style={style.container}>
      <Pressable onPress={() => onModal(item)}>
        <View style={style.merchantView}>
          <Image source={require('../../assets/kuis2.png')} style={{
            height:48,
            width:48,

          }}/>
          <View style={{
            flexDirection:'column'
          }}>
          <Text style={style.textMerchant}>{item.nama_merchant}</Text>
          <Text style={style.textPeriode}>
          Periode {changeDate(item.periode_start)} - {changeDate(item.periode_end)}
        </Text>
          </View>
          
        </View>
        <View style={{
          marginStart:60,
          marginBottom:16,
        }}>
        <Text
          style={[
            style.textStyle,
            {
              marginBottom:4
            },
          ]}
        >
         
          <Text style={{
            fontWeight:'600'
          }}>Pertanyan</Text> : {item.soal}
        </Text>
        <Text style={style.textStyle}><Text style={[style.textStyle,{
          fontWeight:'600'
        }]}>Hadiah </Text> : {item.hadiah}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  merchantView: {
    flexDirection:'row',
    margin:8,
    marginBottom:2,
    padding:2,
  },
  container: {
    flexDirection: 'column',
    margin: 8,
    padding: 8,
    borderBottomWidth:1,
    borderBottomColor:'#f9f9f9'
  },
  iconStyle: {
    marginStart: 16,
  },
  textMerchant: {
    width:'100%',
    marginStart: 16,
    fontSize: 16,
    marginTop:4,
    marginBottom:4,
    fontWeight: '600',
    color: '#3B237E',
  },
  textPeriode: {
    marginStart: 14,
    color: '#828282',
    marginBottom: 16,
    fontWeight:'400',
    fontSize: 12,
  },
   textStyle: {
    marginStart: 16,
    color: '#333333',
    fontSize: 15,
  },
});
