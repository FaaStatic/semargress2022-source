import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
  Modal,
} from 'react-native';
import { BallIndicator, DotIndicator } from 'react-native-indicators';
import FeedList from '../../util/ListItem/FeedList';
import { Api } from '../../util/Api';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
var offset = 0;
export default function Feed({ navigation, route }) {
  const [responseFeed, setResponseFeed] = useState([]);
  let onProgress = false;
  // const [offset, setOffset] = useState(0);

   const length = 6;
  const [Last, setLast] = useState(false);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);



  useEffect(() => {
    offset = 0;
    setLoadingOpen(true);
    onProgress = false;
    setExtraData(!extraData)
    setResponseFeed([]);
    getFeed();
    const subscribe = navigation.addListener('focus', () => {
      console.log('TESSSSONRESUME', 'resume');
      offset = 0;
      // setOffset(0);
      setLoadingOpen(true);
      onProgress = false;
      setExtraData(!extraData)
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
      // setOffset(offset + length);
      offset = offset + length;
      getFeed();
    }else{

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
    console.log('jumlah_offset', offset);
    await Api.post('api/feed_instagram', param)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        onProgress = false;
        if (metadata.status === 200) {
          console.log('testestesfeed', response);
          setResponseFeed(offset === 0 ? response : responseFeed.concat(response));
          setLast(offset+length === response.length ? true : false);
          onProgress = false;
          setDataKosong(false);
          setLoadingOpen(false);
        } else if (metadata.status === 401) {
          ShowError(metadata.message);
          setDataKosong(true);
          setLoadingOpen(false);
        } else if (metadata.status === 404) {
          ShowError(metadata.message);
          setDataKosong(true);
          setLoadingOpen(false);
        } else {
          ShowError(metadata.message);
          if (offset === 0) {
            setDataKosong(true);
          }
          setLast(true);
          setLoadingOpen(false);
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
       <Modal
        animationType="fade"
        transparent={true}
        visible={loadingOpen}
      >
        <BallIndicator size={32} color={'#0F2E63'}/>
      </Modal>
      <FlatList
        onEndReached={loadmore}
        data={responseFeed}
        renderItem={itemRender}
        ListHeaderComponent={headerFlatlist}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item,index) => index.toString()}
        ListFooterComponent={loadIndice}
        extraData={extraData}
        contentContainerStyle={{
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
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
    fontFamily:'NeutrifPro-Regular',
    position: 'absolute',
    backgroundColor: 'white',
    marginTop: 100,
    top: 0,
    bottom: 0,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    fontFamily:'NeutrifPro-Regular',
    color: 'white',
    marginTop: 16,
  },
  container: {
    width: '100%',
    height: '100%',
    fontFamily:'NeutrifPro-Regular',
    flexDirection: 'column',
    backgroundColor: '#0F2E63',
  },
});