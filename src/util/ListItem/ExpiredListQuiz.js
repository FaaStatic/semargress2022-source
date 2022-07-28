import React from 'react';
import { Text, StyleSheet, View, Image, Platform} from 'react-native';



export default function ExpiredListQuiz({item}){
      return(
            <View style={style.containerList}>
                <View style={style.containerHeader}>
                <Image source={require('../../assets/kuis2.png')} style={{
                    height:48,
                    width:48,
                    borderRadius: 8,
                }} resizeMode='cover'/>
                <View style={style.containerHeaderText}>
                <Text style={style.textHeader}>{item.nama_merchant}</Text>
                <Text style={[style.textStyleContent,{
                    marginStart:14,
                    color:'grey',
                    fontSize:12,
                    fontWeight:'400',
                    color:'#828282'
                }]}>Periode {item.tanggal_mulai} - {item.tanggal_selesai}</Text>
                </View>
                </View>
             
                <Text style={[style.textStyleContent,{
                    fontSize:16,
                    fontWeight:'400',
                    color:'black',
                    marginStart:75,
                    width:240
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
                    width:240
                }]}><Text style={{
                    fontSize:16,
                    fontWeight:'600',
                    color:'black',
                    marginTop:4,
                }}>Hadiah: </Text>{item.hadiah}</Text>
                  <View style={{
                borderRadius:15,
                paddingStart:16,
                backgroundColor:'#f9f9f9',
                padding:8,
                margin:20,
               }}>
              <View>
              <Text style={[style.textHeader,{
                    color:'#f2994a',
                    marginTop:6,
                    fontSize:18,
                    marginStart:24,
                    marginBottom:8,
                }]}>Pemenang</Text>
              <Text style={[style.textStyleContent,{
                    marginBottom:8,
                }]}><Text style={[style.textStyleContent,{
                    fontWeight:'600',
                    color:'#4F4F4F'
                }]}>Nama</Text> {Platform.OS === 'ios' ? `\t\t: `:`\t\t\t\t\t:`} {item.pemenang.nama ? item.pemenang.nama : '-' }</Text>
                <Text style={[style.textStyleContent,{
                    marginBottom:8,
                }]}><Text style={[style.textStyleContent,{
                    fontWeight:'600',
                    color:'#4F4F4F'
                }]}>Email</Text>  {Platform.OS === 'ios' ? `\t\t: `:`\t\t\t\t:`} {item.pemenang.email ? item.pemenang.email : '-' }</Text>
                <Text style={[style.textStyleContent,{
                    marginBottom:8,
                }]}><Text style={[style.textStyleContent,{
                    fontWeight:'600',
                    color:'#4F4F4F'
                }]}>Jawaban</Text> {Platform.OS === 'ios' ? `\t: `:`\t\t:`} {item.pemenang.jawaban ? item.pemenang.jawaban : '-' }</Text>
                <View style={style.containerHadiah}>
                <Text style={[style.textStyleContent,{
                    marginStart:0,
                    color:'#4F4F4F'
                }]}><Text style={ Platform.OS === 'ios' ?  {
                    marginStart:24,
                    fontSize:15,
                    color:'#4F4F4F',
                    fontWeight:'600',
                } : [style.textStyleContent,{
                    fontWeight:'600',
                }]}>Hadiah </Text> {Platform.OS === 'ios' ? `\t: `:`\t\t\t:`} </Text><Text style={ Platform.OS === 'ios' ?  {
                    marginStart:24,
                    fontSize:15,
                    color:'#4F4F4F',
                    width:180,
                    marginStart:0,marginEnd:24
                } : [style.textStyleContent,{
                    marginStart:0,
                    width:180,
                }]}>{item.hadiah}</Text>
                </View>
              </View>
              </View>
            </View>
      );
}

const style = StyleSheet.create({
    containerList:{
        borderRadius:8,
        backgroundColor:'white',
        margin:8,
        flexDirection:'column',
        borderBottomWidth:1,
        borderBottomColor:'#f7f7f7'
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
        width:'100%'
    },
    textHeader:{
        width:'100%',
        marginStart:14,
        fontSize:18,
        color:'#3B237E',
        fontWeight:'600',
    },
    textStyleContent:{
        marginStart:24,
        fontSize:15,
        color:'#4F4F4F',
    },
    containerHadiah : {
        flexDirection:'row',
         marginStart:24,
         fontSize:15,
         marginBottom:18
    }

})