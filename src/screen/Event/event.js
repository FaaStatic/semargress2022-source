import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, Image, StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import { Api } from '../../util/Api';
import { colors } from '../../util/color';
import EventList from '../../util/ListItem/EventList';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

var offset = 0;
var last = false;
var onProgress = false;

export default function Event({ navigation, route }) {

  const length = 10;
  const [responseEvent, setResponseEvent] = useState([]);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [iklanPhoto, setIklanPhoto] = useState([]);


  useEffect(() => {
   
    const subscribe = navigation.addListener('focus', () => {
      offset = 0;
    onProgress = false;
    getIklan();
    setResponseEvent([]);
    setExtraData(false);
      setResponseEvent([]);
      setJumlahItem(0);
      getApi();
    });
    return () => {
      subscribe;
    };
  }, [navigation]);

  const loadMore = () => {
    if (last == false) {
      offset += length;
      getApi();
    }
  }

  const getIklan = () => {
    Api.post('api/foto_hadiah/get_foto_hadiah').then(res=> {
        let response = res.data.response[0];
        setIklanPhoto(response);
    }).catch(err => {
      console.log(err);
    })
  }

  const getApi = async () => {
    if (onProgress) {
      return;
    }

    onProgress = true;

    const params = {
      start: offset,
      count: length,
    };
    await Api.post('event', params)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        if (metadata.status === 200) {
          onProgress = false;
          setJumlahItem(jumlahItem + response.length);
          //setResponseEvent(response)
          setResponseEvent(
            offset === 0 ? response : setResponseEvent(responseEvent.concat(response))
          );
          offset = response.length === 0 ? offset + response.length : offset;
          last = response.length !== length ? true : false;
          setDataKosong(false);
        } else if (metadata.status === 401) {
          setDataKosong(true);
        } else {
          if (offset === 0) {
            setDataKosong(true);
          }
          last = true;
        }

        setExtraData(!extraData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const moveDetail = (item) => {
    console.log(item)
    const params = {
      id: item.id_i,
      nama: item.title
    }
    navigation.navigate('EventDetail', params);
  };

  const itemRender = useCallback(({ item }) => {
    return <EventList item={item} pressCall={moveDetail} />;
  });

  return (
    <SafeAreaView style={style.container}>
      <View style={{
        backgroundColor: 'white',
        width: '100%',
      }}>
        <View style={style.containerHeader}>
          <Image
            source={require('../../assets/header_app.png')}
            style={{
              height: '50%',
              marginTop: 0,
              top: 0,
              width: '100%',
              position: 'absolute',
              flexDirection: 'row',
            }}
            resizeMode={'stretch'}
          />
          <Text style={style.textHeader}>Event</Text>
        </View>
      </View>

      <View 
        style={{
          backgroundColor: 'white',
          height:'100%',
          paddingTop: SCREEN_WIDTH / 5 + 40,
        }}
      >
        <FlatList
          data={responseEvent}
          renderItem={itemRender}
          style={{
            height:'100%'
          }}
          onEndReached={loadMore}
          keyExtractor={(item, index) => item.id_i}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={style.containerHeaderAds}>
        <Image source={{uri: iklanPhoto.foto}}  resizeMode='cover' style={{
          width: SCREEN_WIDTH / 1.2,
          height: SCREEN_HEIGHT / 4,
          borderRadius: 7,
        }} />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  containerHeaderAds: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 16,
    position:'absolute',
    alignSelf: 'center',
    marginTop: 120,
    elevation: 5,
    marginLeft:30,
    marginRight:30,
  },
  flatContainer: {
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  flatlistStyle: {
    marginBottom: SCREEN_HEIGHT / 6,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.secondary
  },
  containerHeader: {
    height: 200,
    backgroundColor: '#0F2E63',
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
});
