import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, PermissionsAndroid, Platform, Text } from 'react-native';
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
var isLast = false;
var onProgress = false;

export default function DetailListCategory({ navigation, route }) {

  const [extraData, setExtraData] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  let length = 10;
  const [refreshing, setRefresh] = useState(false);
  const [responList, setResponList] = useState([]);
  const [col, setCol] = useState(0);
  const [ListKosong, setListKosong] = useState(false);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const { id_k } = route.params;
  //console.log('routeparams', route.params);

  useEffect(() => {
    
    setOpenLoad(true);
    setExtraData(false);
    setResponList([]);
    setJumlahItem(0);
    offset = 0;
    onProgress = false;
    GrantLocation();

    const unsubscribe = navigation.addListener('focus', () => {
      
      loadSession();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const currentLocation = async () => {

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
            width:'100%',
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <DotIndicator color="#251468" size={6} style={{
            alignSelf:'center',
          }} />
        </View>
      );
    } else {
      return <></>;
    }
  });


  const GrantLocation = async () => {

    try {
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
        if (granted) {
          console.log('StatusLokasi', granted);
          currentLocation();
        } else {
          ShowWarning("Mohon ijinkan akses lokasi untuk menikmati fitur ini");
        }
      }else if(Platform.OS == 'ios'){
        
        const auth = await Geolocation.requestAuthorization('whenInUse');
        if (auth == 'granted') {
          currentLocation();
        }else{
          ShowWarning("Mohon ijinkan akses lokasi untuk menikmati fitur ini");
        }
      }
      
     
    } catch (error) {
      console.log(error.message);
    }
  };

  const getListItem = (data) => {
    
    if (onProgress) {
      return;
    }

    onProgress = true;
    const param = {
      latitude: latitude,
      longitude: longitude,
      start: offset,
      count: length,
      jarak: 30,
      kategori: id_k,
      keyword: '',
    };
      
    Api.post('merchant/nearby_with_ads', param)
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        
        if (metadata.status == 200) {
          //setResponList(data);
          var merchant = [];
          var listNew = [];
          var tes = response.filter(function(item){
            return item.flag_tipe === 'merchant'
          })

        var countMerc = 0;
          response.forEach((element) => {
            if (element.flag_tipe == 'merchant') {
              countMerc += 1;
              merchant.push(element);
              console.log(countMerc);
              console.log(merchant);
              if (merchant.length == 2 && countMerc == 2) {
                listNew.push({
                  type: 'merchant',
                  data: merchant,
                });
                merchant = [];
                countMerc = 0;
              }    
          }else if (element.flag_tipe == 'iklan') {
            listNew.push({
              type: 'iklan',
              data: element,
            });
          } });
          listNew.push({
            type: 'merchant',
            data: merchant,
          });
          merchant = [];
          setResponList(offset == 0 ? listNew : responList.concat(listNew));
          isLast = response.length !== length  ? true : false  ;
          setListKosong(false);
          setLoading(false);
          setOpenLoad(false);
          console.log('merchant', listNew);
        } else if (metadata.status == 401) {
          setListKosong(true);
          setLoading(false);
          setOpenLoad(false);
          isLast = true;
        } else if(metadata.status == 404){
          isLast = true;
          if(responList.length !== 0){
            setListKosong(false);
          }else{
            setListKosong(true);
          }
         
          setLoading(false);
          setOpenLoad(false);
        }else {
          
          if (offset == 0) {
            if(responList.length !== 0){
              setListKosong(false);
            }else{
              setListKosong(true);
            }
          }

          isLast = true;
          setLoading(false);
          setOpenLoad(false);
        }

        setExtraData(!extraData);
        onProgress = false;
      })
      .catch((error) => {
        
        console.log(error);
        setLoading(false);
        setOpenLoad(false);
        onProgress = false;
      });
  };

  const loadMore = () => {

    if (!isLast && !onProgress) {
      setLoading(true);
      offset += length;
      getListItem();
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
    if (item.type == 'merchant') {
      if(item.data.length == 1){
        return (
          <View style={{ margin: 10, flexDirection:'column', alignSelf:'flex-start'}}>
          <MerchanList item={item.data[0]} pressCall={moveDetail}/>
          </View>
        );
      }else if(item.data.length === 2){
        return (
          <View style={{ margin: 10, flexDirection:'row',alignSelf:'center' }}>
          <MerchanList item={item.data[0]} pressCall={moveDetail}/>
          <MerchanList item={item.data[1]} pressCall={moveDetail}/>
          </View>
        );
      }
     
    } else if (item.type == 'iklan') {
      return (
        <View style={{ margin: 10 , alignSelf:'center'}}>
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
      
      <View
        style={{
          position:'absolute',
          alignSelf:'center'
        }}
      >
        {openLoad ? 
        <BallIndicator size={40} color={'#0F2E63'}/> :
          (ListKosong ? 
            <Text style={{
              fontSize:23,
              color:'black',
              fontWeight:'400',
              width:'70%',
              textAlign:'center',
              alignSelf:'center'
            }}>Merchant Terdekat Tidak Ditemukan</Text> : <></>  
            )   
        }
      </View>

      <FlatList
      data={responList}
      renderItem={itemRender}
      extraData={extraData}
      keyExtractor={(item,index) => index.toString()}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={loadIndice}
      onEndReached={loadMore}
      style={style.listStyle}
      contentContainerStyle={{ width:'100%'}}
    />
   
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent:'center',
    flexDirection: 'column',
  },
  listStyle: {
    width: '100%',
    height:'100%',
  },
  constainerLoading: {
    height: 100,
    justifyContent: 'center',
  },
  styleLoading: {
    alignSelf: 'center',
  },
});
