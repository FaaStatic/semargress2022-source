import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { BallIndicator, DotIndicator } from 'react-native-indicators';
import { useFocusEffect } from '@react-navigation/native';
import FeedList from '../../util/ListItem/FeedList';
import { Api } from '../../util/Api';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function Feed({ navigation, route }) {
  const [responseFeed, setResponseFeed] = useState([]);
  let offset = 0;
  let onProgress = false;
  const [length, setLength] = useState(10);
  const [Last, setLast] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);


  // useFocusEffect(
  //   React.useCallback(() => {
  //       console.log('TESSSSONRESUME', 'resume');
  //       offset = 0;
  //       onProgress = false;
  //       setJumlahItem(0);
  //       setResponseFeed([]);
  //       getFeed();
  //   }, [getFeed])
  // );

  useEffect(() => {
    offset = 0;
    onProgress = false;
    setJumlahItem(0);
    setExtraData(!extraData)
    setResponseFeed([]);
    getFeed();
    const subscribe = navigation.addListener('focus', () => {
      console.log('TESSSSONRESUME', 'resume');
      offset = 0;
      onProgress = false;
      setExtraData(!extraData)
      setJumlahItem(0);
      setResponseFeed([]);
      getFeed();
    });
    return () => {
      subscribe;
    };
  }, [navigation]);

  const loadIndice = useCallback(() => {
    if (loadIndicator) {
      return (
        <View
          style={{
            justifyContent: 'center',
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <DotIndicator color="#251468" size={10} />
        </View>
      );
    } else {
      return <></>;
    }
  });

  const loadmore = async () => {
    setLoadIndicator(true);
    if (Last === false) {
      offset += length;
      getFeed();
    }
  };

  const itemRender = useCallback(({ item }) => {
    return <FeedList item={item} />;
  });

  const getFeed = async () => {
    if (onProgress) {
      return;
    }

    onProgress = true;
    const param = {
      start: offset,
      count: length,
    };
    await Api.post('api/feed_instagram', param)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        onProgress = false;
        if (metadata.status === 200) {
          console.log('testestesfeed', response);
          setResponseFeed(response);
          setResponseFeed(offset === 0 ? response : [...responseFeed, ...response]);
          offset = response.length === 0 ? offset + response.length : offset;
          setLast(response.length !== length ? true : false);
          setDataKosong(false);
          setJumlahItem(jumlahItem + responseFeed.length + response.length);
          console.log('testestesfeed2', responseFeed);
        } else if (metadata.status === 401) {
          setDataKosong(true);
        } else if (metadata.status === 404) {
          setDataKosong(true);
        } else {
          if (offset === 0) {
            setDataKosong(true);
          }
          setLast(true);
        }
        setExtraData(!extraData);
        setLoadIndicator(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const headerFlatlist = useCallback(() => {
    return (
      <View>
        <View
          style={{
            height: 116,
            backgroundColor: '#0F2E63',
          }}
        >
          <Image
            source={require('../../assets/header_app.png')}
            style={{
              height: 100,
              marginTop: 0,
              top: 0,
              width: '100%',
              position: 'absolute',
              flexDirection: 'row',
            }}
            resizeMode={'stretch'}
          />

          <Text style={style.textHeader}>Feed Promo</Text>
        </View>
        <View
          style={{
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
            backgroundColor: 'white',
             bottom:0,
             marginTop:-16,
            height: 20,
          }}
        ></View>
      </View>
    );
  });

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        onEndReached={loadmore}
        data={responseFeed}
        renderItem={itemRender}
        ListHeaderComponent={headerFlatlist}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListFooterComponent={loadIndice}
        extraData={extraData}
        contentContainerStyle={{
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  continerFeed: {
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'white',
    marginTop: 100,
    top: 0,
    bottom: 0,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    color: 'white',
    marginTop: 16,
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#0F2E63',
  },
});
