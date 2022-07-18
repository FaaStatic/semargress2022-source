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
  Linking
} from 'react-native';
import { Api } from '../../util/Api';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');
var uid = '';

export default function EventDetail({ navigation, route }) {

  const { id } = route.params;
  const [responseDetail, setResponseDetail] = useState([]);
  const [flagTertarik, setFlagTertarik] = useState(false);

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

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View></View>
        <Image
          source={{ uri: responseDetail.gambar }}
          resizeMode="cover"
          style={style.imageStyle}
        />
        <Text style={style.textStyleTitle}>{responseDetail.title}</Text>
        <Text style={{
          color: 'black',
          fontSize: 14,
          marginTop: 8,
          width: SCREEN_WIDTH / 1.1,
          alignSelf: 'center',
        }}>{responseDetail.keterangan !== " " ? responseDetail.keterangan : ''}</Text>

        <TouchableOpacity style={style.btnStyle} onPress={onPressTertarik}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: '500',
            color: 'white'
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
    backgroundColor: '#f29836'
  },
  container: {
    width: '100%',
    height: '100%',
    fontFamily: 'NeutrifPro-Regular',
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
    fontFamily: 'NeutrifPro-Regular',
    color: 'black',
    marginTop: 8
  },
});
