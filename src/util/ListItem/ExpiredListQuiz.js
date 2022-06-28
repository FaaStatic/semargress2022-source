import React from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import User from 'react-native-vector-icons/AntDesign';



export default function ExpiredListQuiz({item}){
      return(
            <SafeAreaView style={style.containerList}>
                <View style={style.containerHeader}>
                <Icon name='shop' size={28} color={'#0F2E63'}/>
                <View style={style.containerHeaderText}>
                <Text style={style.textHeader}>{item.nama_merchant}</Text>
                <Text style={[style.textStyleContent,{
                    marginStart:8,
                    color:'grey',
                }]}>Periode {item.tanggal_mulai} - {item.tanggal_selesai}</Text>
                </View>
                </View>
               
                <Text style={[style.textStyleContent,{
                    fontSize:18,
                    fontWeight:'bold',
                    color:'black',
                }]}>{item.soal}</Text>
                <View style={style.containerHeader}>
                <User name='user' size={18} color={'red'}/>
                <Text style={[style.textHeader,{
                    color:'red',
                    marginTop:6
                }]}>Pemenang</Text>
                </View>
              <View>
              <Text style={[style.textStyleContent,{
                    marginBottom:8,
                }]}>Nama  {`\t\t\t\t : `} {item.pemenang.nama ? item.pemenang.nama : '-' }</Text>
                <Text style={[style.textStyleContent,{
                    marginBottom:8,
                }]}>Email  {`\t\t\t\t : `} {item.pemenang.email ? item.pemenang.email : '-' }</Text>
                <Text style={[style.textStyleContent,{
                    marginBottom:8,
                }]}>Jawaban {`\t\t : `} {item.pemenang.jawaban ? item.pemenang.jawaban : '-' }</Text>
                <View style={style.containerHadiah}>
                <Text style={[style.textStyleContent,{
                    marginStart:0,
                }]}>Hadiah  {`\t\t\t : `} </Text><Text style={[style.textStyleContent,{
                    marginStart:0,
                    width:200,
                }]}>{item.hadiah}</Text>
                </View>
              </View>
            </SafeAreaView>
      );
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
        backgroundColor:'transparent',
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