import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, View, Image, StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import { Api } from '../../util/Api';
import EventList from '../../util/ListItem/EventList';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function Event({ navigation, route }) {
  let offset = 0;
  let onProgress = false;
  const length = 10;
  const [responseEvent, setResponseEvent] = useState([]);
  const [Last, setLast] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);

  useEffect(() => {
    offset = 0;
    onProgress = false;
    setResponseEvent([]);
    setJumlahItem(0);
    getApi();
    const subscribe = navigation.addListener('focus', () => {
      offset = 0;
      onProgress = false;
      setResponseEvent([]);
      setJumlahItem(0);
      getApi();
    });
    return () => {
      subscribe;
    };
  }, [navigation]);

  const loadMore =() =>{
    if (Last === false) {
      offset += length;
     getApi();
  }
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
          console.log('cektesevent', response);
          setJumlahItem(jumlahItem + response.length);
          setResponseEvent(response)
          setResponseEvent(
            offset === 0 ? response : setResponseEvent(responseEvent.concat(response))
          );
          offset = response.length === 0 ? offset + response.length : offset;
          setLast(response.length !== length ? true : false);
          setDataKosong(false);
        } else if (metadata.status === 401) {
          setDataKosong(true);
        } else {
          if (offset === 0) {
            setDataKosong(true);
          }
          setLast(true);
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
      id : item.id_i,
      nama : item.title
    }
    navigation.navigate('EventDetail', params);
  };

  const itemRender = useCallback(({ item }) => {
    return <EventList item={item} pressCall={moveDetail} />;
  });

  return (
    <SafeAreaView style={style.container}>
      <View style={{
backgroundColor:'white',
width:'100%',
height: 300,
      }}>
   <View style={style.containerHeader}>
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
        <Text style={style.textHeader}>Event</Text>
        <View style={style.containerHeaderAds}></View>
      </View>
      </View>
   
   
      <View >
          <FlatList 
          data={responseEvent}
          renderItem={itemRender}
          onEndReached={loadMore}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
           />
        </View>
       
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  containerHeaderAds: {
    position: 'absolute',
    width: SCREEN_WIDTH / 1.2,
    height: SCREEN_HEIGHT / 5,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 120,
    elevation: 5,
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
  },
  containerHeader: {
    height: 200,
    backgroundColor: '#0F2E63',
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
});
