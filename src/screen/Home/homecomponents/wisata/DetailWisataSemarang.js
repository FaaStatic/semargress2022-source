import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  FlatList,
} from 'react-native';
import BottomSheetWisata from './BottomSheetWisata';
import { Api } from '../../../../util/Api';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MerchanList from '../../../../util/ListItem/MerchantList';
// import { enableLatestRenderer } from 'react-native-maps';

// enableLatestRenderer();

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

var latitudeBottomSheet = 0;
var longitudeBottomSheet = 0;

export default function DetailWisataSemarang({ navigation, route }) {
  const [detailResponse, setDetailResponse] = useState([]);
  const [responseMerchant, setResponseMerchant] = useState([]);
  const [loc, setLoc] = useState({
    latitude: 0,
    longitude: 0,
  });
  const { id_wisata } = route.params;

  useEffect(() => {
    DetailGet();
    const subscribe = navigation.addListener('focus', () => {
      DetailGet();
    });

    return () => {
      subscribe;
    };
  }, []);

  const itemRenderBottomSheet = useCallback(({ item }) => {
    return <MerchanList item={item} pressCall={moveDetailMerchant} />;
  });

  const getMerchant = async () => {
    await Api.post('merchant/nearby_filter_order/', {
      latitude: latitudeBottomSheet,
      longitude: longitudeBottomSheet,
      start: 0,
      limit: 10,
      kategori: [],
      search: '',
      order_col: {
        nama: 'asc',
        favorit: 'desc',
      },
      order_dir: '',
    })
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        console.log('testes', body);
        if (metadata.status === 200) {
          setResponseMerchant(response);
        } else if (metadata.status === 401) {
        } else {
        }
      })
      .catch((err) => {});
  };

  const DetailGet = async () => {
    await Api.get(`api/tempat_wisata/view/${id_wisata}`, 1)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        if (metadata.status === 200) {
          console.log('datahasil', response);
          setDetailResponse(response);
          setLoc({
            latitude: parseFloat(response.latitude),
            longitude: parseFloat(response.longitude),
          });
          latitudeBottomSheet = parseFloat(response.latitude);
          longitudeBottomSheet = parseFloat(response.longitude);
          console.log('datahasilgambar', response.gambar);
          getMerchant();
        } else if (metadata.status === 401) {
        } else if (metadata.status === 404) {
        } else if (metadata.status === 500) {
        } else {
        }
      })
      .catch((err) => {
        console.log('error response', err);
      });
  };

  const moveDetailMerchant = (data) => {
    console.log(data);
    console.log('testesdetailmerchant', data.id);
    navigation.navigate('DetailMerchant', {
      id_m: data.id,
    });
  };
  return (
    // <GestureHandlerRootView
    //   style={{
    //     flex: 1,
    //   }}
    // >
      <SafeAreaView style={styling.containerView}>
        <ScrollView style={styling.containerScroll} showsVerticalScrollIndicator={false}>
          <SafeAreaView style={styling.containerTentang}>
            <Image source={{ uri: detailResponse.gambar }} style={styling.styleImage} />
            <Text style={styling.headerTextDetail}>Tentang</Text>
            <Text
              style={[
                styling.itemTextDetail,
                {
                  marginStart: 16,
                  marginEnd: 16,
                  marginBottom: 16,
                  textAlign: 'justify',
                },
              ]}
            >
              {detailResponse.deskripsi}
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styling.containerDetailMerchant}>
            <View
              style={[
                styling.itemDetailContainer,
                {
                  marginTop: 8,
                },
              ]}
            >
              <Material name="storefront" size={28} color={'#0f2e63'} />
              <Text
                style={[
                  styling.itemTextDetail,
                  {
                    fontWeight: 'bold',
                    fontSize: 16,
                  },
                ]}
              >
                {detailResponse.nama}
              </Text>
            </View>
            <View style={styling.itemDetailContainer}>
              <SimpleIcon name="location-pin" size={28} color={'#0f2e63'} />
              <Text
                style={[
                  styling.itemTextDetail,
                  {
                    width: 200,
                  },
                ]}
              >
                {detailResponse.alamat}
              </Text>
            </View>
            <View style={styling.itemDetailContainer}>
              <FeatherIcon name="phone" size={28} color={'#0f2e63'} />
              <Text style={styling.itemTextDetail}>
                {detailResponse.notelp ? detailResponse.notelp : '-'}
              </Text>
            </View>
            <View style={styling.itemDetailContainer}>
              <FeatherIcon name="instagram" size={28} color={'#0f2e63'} />
              <Text style={styling.itemTextDetail}>
                {detailResponse.link_ig ? detailResponse.link_ig : '-'}
              </Text>
            </View>
            <View style={styling.itemDetailContainer}>
              <FeatherIcon name="facebook" size={28} color={'#0f2e63'} />
              <Text style={styling.itemTextDetail}>
                {detailResponse.link_fb ? detailResponse.link_fb : '-'}
              </Text>
            </View>

            <SafeAreaView style={styling.constainerMaps}>
              <MapView
                style={styling.MapsStyle}
                initialRegion={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                region={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                  }}
                  pinColor="red"
                  title="You"
                />
              </MapView>
            </SafeAreaView>
          </SafeAreaView>
        </ScrollView>
        <BottomSheetWisata>
         
          <FlatList
            data={responseMerchant}
            renderItem={itemRenderBottomSheet}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            numColumns={2}
            contentContainerStyle={styling.flatContainer}
            style={styling.flatlistStyle}
          />
          
       
        </BottomSheetWisata>
      </SafeAreaView>
    // </GestureHandlerRootView>
  );
}

const styling = StyleSheet.create({
  flatContainer:{
    justifyContent:'center',
    width:SCREEN_WIDTH,
  },
  flatlistStyle:{
     marginBottom:SCREEN_HEIGHT/6,
  },
  iconArrow: {
    alignSelf: 'center',
  },
  containerBottomSheet: {
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    height: SCREEN_HEIGHT,
    borderRadius: 25,
    backgroundColor: 'white',
    elevation: 5,
    flexDirection: 'column',
  },
  containerHeaderBottomSheet: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  textStyleBottomSheet: {
    color: '#0f2e63',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  containerTentang: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  constainerMaps: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
    marginBottom:SCREEN_HEIGHT/10,
    elevation: 5,
   
  },
  MapsStyle: {
    height: 250,
  },

  itemTextDetail: {
    fontSize: 14,
    color: '#0f2e63',
    marginStart: 16,
    marginTop: 4,
  },
  headerTextDetail: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f2e63',
    marginTop: 16,
    marginStart: 16,
    marginBottom: 16,
  },
  itemDetailContainer: {
    marginTop: 16,
    marginStart: 16,
    flexDirection: 'row',
  },
  containerIconName: {
    flexDirection: 'row',
  },
  containerDetailMerchant: {
    marginTop: 8,
    backgroundColor: 'white',
    flexDirection: 'column',
    marginBottom:SCREEN_HEIGHT/13,
  },
  cardPromo: {
    height: 400,
    width: '100%',
    marginTop: 0,
    backgroundColor: 'white',
  },

  card: {
    height: 175,
    marginTop: SCREEN_HEIGHT / 2.5,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 5,
    width: 250,
    padding: 0,
    width: 350,
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 64,
  },
  constainerHeader: {
    marginBottom: 0,
    backgroundColor: 'white',
  },
  constainerItemHeader: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    marginTop: 16,
    width: '100%',
  },
  containerTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginEnd: 16,
  },
  styleIcon: {
    marginStart: 16,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginEnd: SCREEN_WIDTH / 4,
  },
  styleImage: {
    height: 250,
    margin: 16,
    borderRadius: 8,
  },
  containerScroll: {
    flexDirection: 'column',
    margin: 0,
    flex: 1,
  },
  containerView: {
    flex: 1,
  },
});
