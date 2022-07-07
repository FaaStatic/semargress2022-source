import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, PermissionsAndroid } from 'react-native';
import { SessionManager } from '../../../util/SessionManager';
import { sessionId } from '../../../util/GlobalVar';
import { Api } from '../../../util/Api';
import ListCategory from '../../../util/ListItem/ListCategory';
import IklanItem from '../../../util/ListItem/IklanItem';
import Geolocation from 'react-native-geolocation-service';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import MerchanList from '../../../util/ListItem/MerchantList';

var latitude = 0;
var longitude = 0;

export default function DetailListCategory({ navigation, route }) {
  const [extraData, setExtraData] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState(10);
  const [refreshing, setRefresh] = useState(false);
  const [isLast, setLast] = useState(false);
  const [responList, setResponList] = useState([]);
  const [col, setCol] = useState(0);
  const [ListKosong, setListKosong] = useState(false);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const { id_k } = route.params;
  console.log('routeparams', route.params);
  let offset = 0;
  let onProgress = false;

  useEffect(() => {
    console.log('routeparams', route.params);
    console.log('idk', id_k);
    offset = 0;
    onProgress = false;
    GrantLocation();
    currentLocation();
    setJumlahItem(0);
    setResponList([]);
    loadSession();
    const unsubscribe = navigation.addListener('focus', () => {
      offset = 0;
      onProgress = false;
      setJumlahItem(0);
      setResponList([]);
      currentLocation();
      loadSession();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const currentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        async (pos) => {
          const datalatitude = pos.coords.latitude;
          const datalongitude = pos.coords.longitude;

          setLocation({
            latitude: datalatitude,
            longitude: datalongitude,
          });
          latitude = datalatitude;
          longitude = datalongitude;
          getListItem();
          console.log('current', pos);
          console.log('currentstate', location);
        },
        (err) => {
          console.log(err.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  const GrantLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Semargress Meminta Izin Lokasi',
          message:
            'Semargress Membutuhkan akses lokasi untuk menyesuaikna merchant terdekat pengguna',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Batal',
          buttonPositive: 'Iya',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTES) {
        console.log('StatusLokasi', granted);
      } else {
        console.log('StatusLokasi', granted);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getListItem = async (data) => {
    if (onProgress) {
      return;
    }

    onProgress = true;
    const param = {
      latitude: latitude,
      longitude: longitude,
      start: offset,
      count: length,
      jarak: 20,
      kategori: id_k,
      keyword: '',
    };

    await Api.post('merchant/nearby_with_ads', param)
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        onProgress = false;
        console.log('tessaja', response);
        if (metadata.status === 200) {
          setResponList(data);
         
          var merchant = [];
          var listNew = [];
          response.forEach((element) => {
            if (element.flag_tipe=== 'merchant') {
              merchant.push(element);
              if (merchant.length == 2) {
                listNew.push({
                  type: 'merchant',
                  data: merchant,
                });
                merchant = [];
              }
            } else if (element.flag_tipe === 'iklan') {
              listNew.push({
                type: 'iklan',
                data: element,
              });
            }
            setResponList(offset == 0 ? listNew : [...responList, ...listNew]);
            offset = response.length !== 0 ? offset + response.length : offset;
            setLast(response.length !== length ? true : false);
            setListKosong(false);
            setJumlahItem(jumlahItem + response.length);
            console.log('testestes',listNew);
          
          });

          setJumlahItem(jumlahItem + response.length);
        } else if (metadata.status === 401) {
          setListKosong(true);
        } else {
          if (offset == 0) {
            setListKosong(true);
          }
          setLast(true);
        }
        setExtraData(!extraData);
      })
      .catch((error) => {
        onProgress = false;
        console.log(error);
      });
  };

  const loadMore = async () => {
    if (isLast === false) {
      offset += length;
      getListItem();
    }
  };

  const moveDetail = (data) => {
    const param = {
      id_m: data.id_m,
      kategori: id_k,
    };
    console.log('categoryitem', param);
    navigation.navigate('DetailMerchant', param);
  };

  const itemRender = useCallback(({ item }) => {
    if (item.type === 'merchant') {
      return (
        <View style={{ margin: 10, flexDirection:'row' }}>
        <MerchanList item={item.data[0]} pressCall={moveDetail}/>
        <MerchanList item={item.data[1]} pressCall={moveDetail}/>
        </View>
      );
    } else {
      return (
        <View style={{ margin: 10 }}>
          <IklanItem item={item.data} />
        </View>
      );
    }
  }, []);

  const onRefresh = async () => {
    offset = 0;
    setResponList([]);
    getListItem();
    setLast(false);
    await loadMore();
  };

  const loadSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {
      console.log('session ', session);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        data={responList}
        renderItem={itemRender}
        extraData={extraData}
        keyExtractor={(item) => {
          item.id_m;
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        style={style.listStyle}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    flexDirection: 'column',
  },
  listStyle: {
    flex: 1,
    width: '100%',
  },
  constainerLoading: {
    height: 100,
    justifyContent: 'center',
  },
  styleLoading: {
    alignSelf: 'center',
  },
});
