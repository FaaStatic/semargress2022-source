import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
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
import FlashMessage from 'react-native-flash-message';
import { ShowError, ShowWarning } from '../../../util/ShowMessage';

var latitude = 0;
var longitude = 0;
var offset = 0;
export default function DetailListCategory({ navigation, route }) {
  const [extraData, setExtraData] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  let length = 11;
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
  let onProgress = false;

  useEffect(() => {

    setOpenLoad(true);
    offset = 0;
    onProgress = false;
    setExtraData(false);
    GrantLocation();
    setResponList([]);
    
    const unsubscribe = navigation.addListener('focus', () => {
      setOpenLoad(true);
      offset = 0;
      onProgress = false;
      setExtraData(false);
      setJumlahItem(0);
      setResponList([]);
      currentLocation();
      loadSession();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation, GrantLocation, currentLocation]);

  const currentLocation = async () => {

    if(Platform.OS == 'ios') {
        
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          
        }
        Geolocation.getCurrentPosition(
          (position) => {
              console.log(position);
          },
          (error) => {
            console.log("map error: ",error);
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    }

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


  const loadIndice = useCallback(() => {
    if (loading) {
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


  const GrantLocation = async () => {

    try {

      const granted = '';
      if(Platform.OS == 'android') {
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
      }else {
        
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth === 'granted') {
          granted = PermissionsAndroid.RESULTS.GRANTES;
        }else{
          granted = 'gagal';
        }
      }
      
      if (granted === PermissionsAndroid.RESULTS.GRANTES) {
        console.log('StatusLokasi', granted);
        getListItem();
      } else {
        ShowWarning("Mohon ijinkan akses lokasi untuk menikmati fitur ini");
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
      console.log('logoffeset', offset);
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
            console.log("pjgresponse",response.length)
            setResponList(offset == 0 ? listNew : [...responList, ...listNew]);
            setLast(response.length !== length  ? true : false);
            setListKosong(false);
            console.log('testestes',isLast);
            setLoading(false);
            setOpenLoad(false);
          
          });

          setJumlahItem(jumlahItem + response.length);
        } else if (metadata.status === 401) {
          setListKosong(true);
          setLoading(false);
          setOpenLoad(false);
        } else if(metadata.status === 404){
          setLast(true);
          setLoading(false);
          setOpenLoad(false);
        }else {
          if (offset == 0) {
            setListKosong(true);
          }
          setLast(true);
          setLoading(false);
          setOpenLoad(false);
        }
        setExtraData(!extraData);
      })
      .catch((error) => {
        onProgress = false;
        console.log(error);
        setLoading(false);
        setOpenLoad(false);
      });
  };

  const loadMore = async () => {
    if (isLast) {
      setLoading(true);
      offset += length;
      console.log('logvar', offset )
      currentLocation();
     }
  };

  const moveDetail = (data) => {
    const param = {
      id_m: data.id_m,
      kategori: id_k,
    };
    //console.log('categoryitem', param);
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

  const loadSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {
      
    }
  };

  return (
    <SafeAreaView style={style.container}>
      
      {openLoad ?   
      <BallIndicator size={40} color={'#0F2E63'}/> :    
      <FlatList
        data={responList}
        renderItem={itemRender}
        extraData={extraData}
        keyExtractor={(item,index) => {index.toString()}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={loadIndice}
        onEndReached={loadMore}
        style={style.listStyle}
      /> }
    
   
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
