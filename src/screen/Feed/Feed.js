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
import { colors } from '../../util/color';
import { off } from 'npm';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
var offset = 0;
var isLast = false;
export default function Feed({ navigation, route }) {
  const [responseFeed, setResponseFeed] = useState([]);
  let onProgress = false;
  // const [offset, setOffset] = useState(0);

   const length = 10;
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(true);
  const [pullRefresh, setPullRefresh] = useState(false);



  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      console.log('TESSSSONRESUME', 'resume');
      setResponseFeed([]);
      offset = 0;
      isLast = false;
      setLoadingOpen(true);
      onProgress = false;
      setExtraData(!extraData)   
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
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <DotIndicator color="#251468" size={6}/>
        </View>
      );
    } else {
      return <></>;
    }
  });

  const loadmore = async () => {

    console.log("last");
    if (!isLast) {
      setLoadIndicator(true);
      offset += length;
      console.log('jumlah', offset);
      getFeed();
    }
  };

  const itemRender = useCallback(({ item }) => {
    return <FeedList item={item} pressCall={moveDetail} />;
  });

  const moveDetail = (data) =>{
    navigation.navigate('DetailMerchant',{
      id_m : data.id_merchant
    });
  }

  const getFeed = async () => {

    if (onProgress) {
      return;
    }

    onProgress = true;
    const param = {
      start: offset,
      count: length,
    };
    if(offset == 0)setResponseFeed([]);
    
    await Api.post('api/feed_instagram', param)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        onProgress = false;
        if (metadata.status === 200) {
          //console.log('testestesfeed', response);
          setResponseFeed(offset === 0 ? response : responseFeed.concat(response));
          isLast = response.length !== length  ? true : false;
          console.log(response.length);
          onProgress = false;
          setDataKosong(false);
          setLoadingOpen(false);
          setPullRefresh(false);
        } else if (metadata.status === 401) {
          //ShowError(metadata.message);
          setDataKosong(true);
          setLoadingOpen(false);
          isLast = true;
          setPullRefresh(false);
        } else if (metadata.status === 404) {
          //ShowError(metadata.message);
          setDataKosong(true);
          setLoadingOpen(false);
          isLast = true;
          setPullRefresh(false);
        } else {
          ShowError(metadata.message);
          if (offset === 0) {
            setDataKosong(true);
          }
          isLast = true;
          setLoadingOpen(false);
          setPullRefresh(false);
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
            backgroundColor: '#241468',
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

  const refreshList = () =>{
    setPullRefresh(true);
    setLoadingOpen(true);
    offset = 0;
    setResponseFeed([]);
    getFeed();
  }

  return (
    <SafeAreaView style={style.container}>
       <Modal
        animationType="fade"
        transparent={true}
        visible={loadingOpen}
      >
        <BallIndicator size={24} color={'#0F2E63'}/>
      </Modal>
      <FlatList
        onEndReached={loadmore}
        data={responseFeed}
        renderItem={itemRender}
        onRefresh={refreshList}
        ListHeaderComponent={headerFlatlist}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item,index) => index.toString()}
        ListFooterComponent={loadIndice}
        refreshing={pullRefresh}
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
    fontFamily:"neutrifpro-regular",
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
    fontFamily:"neutrifpro-regular",
    color: 'white',
    marginTop: 16,
  },
  container: {
    width: '100%',
    height: '100%',
    fontFamily:"neutrifpro-regular",
    flexDirection: 'column',
    backgroundColor: colors.secondary,
  },
});
