import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  Image,
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Api } from '../../util/Api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EventDetail({ navigation, route }) {
  const { id } = route.params;
  const [responseDetail, setResponseDetail] = useState([]);

  useEffect(() => {
    getDetail();
    const subs = navigation.addListener('focus', () => {});
    return () => {
      subs;
    };
  }, [navigation, getDetail]);

  const getDetail = async () => {
    await Api.get(`merchant/view_promo_user/${id}`)
      .then((res) => {
        let body = res.data;
        let response = body.response[0];
        let metadata = body.metadata;
        if (metadata.status === 200) {
          setResponseDetail(response);
          console.log(response);
          console.log('tes1q',responseDetail);
        } else if (metadata.status === 401) {
          console.log(metadata.message);
        } else {
          console.log(metadata.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <SafeAreaView style={style.container}>
       <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: responseDetail.gambar }}
            resizeMode="cover"
            style={style.imageStyle}
          />
          <Text style={style.textStyleTitle}>{responseDetail.title}</Text>
          <Text style={{
            color:'black',
            fontSize:14,
            marginTop:8,
            width:SCREEN_WIDTH/1.1,
            alignSelf:'center',
          }}>{responseDetail.keterangan !== ' ' ? responseDetail.keterangan : 'Tidak Ada Keterangan Promo' }</Text>
      
      <Pressable style={style.btnStyle}>
        <Text style={{
            alignSelf:'center',
            fontSize:16,
            fontWeight:'500',
            color:'white'
        }}
        >Saya Tertarik</Text>
      </Pressable>
      </ScrollView> 
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
   btnStyle:{
    borderRadius:8,
    width:250,
    height:45,
    justifyContent:'center',
    alignSelf:'center',
    marginTop:16,
    marginBottom:16,
    backgroundColor:'#f29836'
   },
  container: {
    width: '100%',
    height: '100%',
    fontFamily:'NeutrifPro-Regular',
    flexDirection: 'column',
  },
  imageStyle: {
    width: SCREEN_WIDTH / 1.1,
    height: SCREEN_HEIGHT / 1.8,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 16,
    alignSelf: 'center',
    borderRadius: 16,
  },
  textStyleTitle: {
    alignSelf: 'center',
    fontSize:24,
    fontWeight:'bold',
    fontFamily:'NeutrifPro-Regular',
    color:'black',
    marginTop:8
  },
});
