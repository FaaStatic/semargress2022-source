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
  Alert,
  TouchableOpacity,
  Linking,
  useWindowDimensions
} from 'react-native';
import { Api } from '../../util/Api';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import WebView from 'react-native-webview';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');
var uid = '';

export default function EventDetail({ navigation, route }) {

  const { id } = route.params;
  const [responseDetail, setResponseDetail] = useState([]);
  const [flagTertarik, setFlagTertarik] = useState(false);
  const [keterangan, setKeterangan] = useState('');
  useEffect(() => {
    getDetail();
    const subs = navigation.addListener('focus', () => {

      loadSession();
    });
    return () => {
      subs;
    };
  }, [navigation, getDetail]);

  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {

      uid = session.uid;
      getTertarikEvent();
    }
  };

  const getDetail = async () => {
    await Api.get(`merchant/view_promo_user/${id}`)
      .then((res) => {

        let body = res.data;
        let response = body.response[0];
        let metadata = body.metadata;

        if (metadata.status == 200) {
          console.log('testes',response.keterangan)
          var temp = response.keterangan;
          var tempProc = temp.split('data:image/gif;').join('');
          setKeterangan(tempProc);
          setResponseDetail(response);
        } else if (metadata.status == 401) {
          console.log(metadata.message);
        } else {
          console.log(metadata.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTertarikEvent = async () => {

    let param = {
      uid_user: uid,
      id_promo: id
    }

    await Api.post('api/popup_promo/get_promo_tertarik/', param)
      .then((res) => {

        let body = res.data;
        let response = body.response[0];
        let metadata = body.metadata;
        if (metadata.status == 200) {
          
          setFlagTertarik(true);
        } else if (metadata.status == 401) {
          setFlagTertarik(false);
          console.log(metadata.message);
        } else {
          setFlagTertarik(false);
          console.log(metadata.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tertarikEvent = async () => {

    let param = {
      uid_user: uid,
      id_promo: id
    }
    await Api.post('api/popup_promo/save_promo_tertarik/', param)
      .then((res) => {

        let body = res.data;
        let response = body.response[0];
        let metadata = body.metadata;
        if (metadata.status == 200) {
          setFlagTertarik(true)
        } else if (metadata.status == 401) {
          console.log(metadata.message);
        } else {
          console.log(metadata.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onPressTertarik = () => {

    if(responseDetail.link == ''){
      Linking.openURL(responseDetail.gambar);
    }else{
      Linking.openURL(responseDetail.link);
    }

    tertarikEvent();
  };

  const { width } = useWindowDimensions();
  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true
    }
  };


  const htmlRender = {html : `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  <body style="color: black; font-size: 16px; font-weight: 400;margin-left: 16px; margin-right: 16px;margin-top:16px; margin-bottom:16px;">
    ${keterangan}
  </body>
  
  </html>`};
  const htmlFail = {html : `!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  
  <body>
  <div style="color: black; font-size: 13px; font-weight: 400;margin-left: 16px; margin-right: 16px;margin-top:16px; margin-bottom:16px;"><center>Tidak Ada Keterangan</center><div>
  </body>
  
  </html>`}

  

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: responseDetail.gambar }}
          resizeMode="cover"
          style={style.imageStyle}
        />
        <Text style={style.textStyleTitle}>{responseDetail.title}</Text>

<WebView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{minHeight:SCREEN_HEIGHT/2.5, backgroundColor:'transparent', flex:1,flexGrow:1, width:'100%'}} source={responseDetail.keterangan!== undefined && responseDetail.keterangan!== '' ? htmlRender : htmlFail} ></WebView>



        <TouchableOpacity style={style.btnStyle} onPress={onPressTertarik}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: '500',
            color: 'white',
            textAlign:'center',
            width:'100%',
            fontFamily:"neutrifpro-regular",
          }}
          >Saya Tertarik</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  btnStyle: {
    borderRadius: 8,
    width: 250,
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#A57FF8'
  },
  container: {
    width: '100%',
    height: '100%',
    fontFamily:"neutrifpro-regular",
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
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily:"neutrifpro-regular",
    color: 'black',
    marginTop: 11
  },
});
