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
  Linking,
} from 'react-native';
import BottomSheetWisata from './BottomSheetWisata';
import { Api } from '../../../../util/Api';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import MerchanList from '../../../../util/ListItem/MerchantList';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
// import { enableLatestRenderer } from 'react-native-maps';

// enableLatestRenderer();

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

var latitudeBottomSheet = 0;
var longitudeBottomSheet = 0;
var offset = 0;
var onProgress = false;


export default function DetailWisataSemarang({ navigation, route }) {

  const [length, setLength] = useState(10);
  const [extraData, setExtraData] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [detailResponse, setDetailResponse] = useState([]);
  const [responseMerchant, setResponseMerchant] = useState([]);
  const [loc, setLoc] = useState({
    latitude: 0,
    longitude: 0,
  });
  const { id_wisata } = route.params;

  useEffect(() => {

    offset = 0;
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

  const DetailGet = async () => {
    await Api.get(`api/tempat_wisata/view/${id_wisata}`, 1)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        var metadata = body.metadata;
        console.log('datahasil', body);
        if (metadata.status === 200) {
          console.log('datahasil', response);
          setDetailResponse(response);
          setLoc({
            latitude: parseFloat(response.latitude),
            longitude: parseFloat(response.longitude),
          });
          latitudeBottomSheet = parseFloat(response.latitude);
          longitudeBottomSheet = parseFloat(response.longitude);

          setResponseMerchant([]);
          offset = 0;
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

  const getMerchant = async () => {

    if(onProgress){
      return;
    }

    onProgress = true;

    await Api.post('merchant/nearby_filter_order/', {
      latitude: latitudeBottomSheet,
      longitude: longitudeBottomSheet,
      start: offset,
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

        onProgress = false;
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        if (metadata.status === 200) {

          setResponseMerchant(offset === 0 ? response : [...responseMerchant, ...response]);
          offset = offset + response.length;
          setIsLast(response.length !== length ? true : false);

        } else if (metadata.status === 401) {
        } else {
        }
      })
      .catch((err) => {
        onProgress = false;
      });
  };

  const loadMore = async () => {

    if (isLast === false) {
      offset += length;
      getMerchant();
    }
  };  

  const openLink = async (url) => {
    var text = url.toString();
    var res = text.includes('www.');
   
    if(res){
      await Linking.canOpenURL(url);
      Linking.openURL(`https://${url}`);
    }else {
      await Linking.canOpenURL(url);
      Linking.openURL(`instagram://user?username= ${url}`);
    }
    console.log(url);
  
  };

  const openMaps = (latitude, longitude) => {
    const daddr = `${latitude},${longitude}`;
    const company = Platform.OS === "ios" ? "apple" : "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  }

  const openTel = async (url) => {

   
    await Linking.canOpenURL(url);
    Linking.openURL(`tel://${url}`);
    console.log(url);
  
  };

  const moveDetailMerchant = (data) => {
    // console.log(data);
    // console.log('testesdetailmerchant', data.id);
    navigation.navigate('DetailMerchant', {
      id_m: data.id,
    });
  };
  return (
    <SafeAreaView style={styling.containerView}>
      <ScrollView style={styling.containerScroll} showsVerticalScrollIndicator={false}>
        <View style={styling.containerTentang}>
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
        </View>
        <View style={styling.containerDetailMerchant}>
          <View
            style={[
              styling.itemDetailContainer,
              {
                marginTop: 8,
              },
            ]}
          >
            <Image source={require('../../../../assets/shop_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text
              style={[
                styling.itemTextDetail,
                {
                  width:'100%',
                  fontWeight: 'bold',
                  fontSize: 16,
                },
              ]}
            >
              {detailResponse.nama}
            </Text>
          </View>
          <View style={styling.itemDetailContainer}>
          <Image source={require('../../../../assets/location_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text
              numberOfLines={6}  style={[styling.itemTextDetail,{
                width:'75%',
                fontFamily:"neutrifpro-regular",
             }]}
            >
              {detailResponse.alamat ? detailResponse.alamat : '-' }
            </Text>
          </View>
          <View style={styling.itemDetailContainer} onPress={detailResponse.notelp ? ()=>{openTel(detailResponse.notelp)}: ()=>{}}>
          <Image source={require('../../../../assets/phone_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text  numberOfLines={6}  style={[styling.itemTextDetail,{
               width:'75%',
            }]}>
              {detailResponse.notelp ? detailResponse.notelp : '-'}
            </Text>
          </View>
          <View style={styling.itemDetailContainer}  onPress={detailResponse.link_ig ? ()=>{openLink(detailResponse.link_ig)}: ()=>{}}>
          <Image source={require('../../../../assets/ig_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text numberOfLines={6}  style={[styling.itemTextDetail,{
               width:'75%',
               color:'#A57FF8'
            }]}>
              {detailResponse.link_ig ? detailResponse.link_ig : '-'}
            </Text>
          </View>
          <View style={styling.itemDetailContainer}  onPress={detailResponse.link_fb ? ()=>{openLink(detailResponse.link_fb)}: ()=>{}}>
          <Image source={require('../../../../assets/fb_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text numberOfLines={6}  style={[styling.itemTextDetail,{
               width:'75%',
               color:'#A57FF8'
            }]}>
              {detailResponse.link_fb ? detailResponse.link_fb : '-'}
            </Text>
          </View>

          <View style={styling.constainerMaps}>
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
            <Pressable style={{
  height:30,
  width:30,
  padding:'5%',
  backgroundColor:'#0F2E63',
  position:'absolute',
  borderRadius:8,
  bottom:0,
  right:0,
  marginEnd:'5%',
  marginBottom:'5%',
  justifyContent:'center'
}} onPress={()=>{openMaps(loc.latitude,loc.longitude)}}>
  <Image source={require('../../../../assets/map_btn.png')}  style={{height:30, width:30, alignSelf:'center'}}/>
</Pressable>
          </View>
        </View>
      </ScrollView>
      <BottomSheetWisata>

        <FlatList
          data={responseMerchant}
          extraData={extraData}
          renderItem={itemRenderBottomSheet}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          numColumns={2}
          onEndReached={loadMore}
          keyExtractor={(item,index) => {index.toString()}}
          contentContainerStyle={styling.flatContainer}
          style={[styling.flatlistStyle,{marginLeft:5, marginRight:5}]}
        />


      </BottomSheetWisata>
     
    </SafeAreaView>
    // </GestureHandlerRootView>
  );
}

const styling = StyleSheet.create({
  flatContainer:{
    marginTop:"5%",
    justifyContent:'center',
    width:SCREEN_WIDTH,
  },
  flatlistStyle:{
     marginBottom:SCREEN_HEIGHT/5,
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
    flex:1,
    marginBottom:SCREEN_HEIGHT/10,
    elevation: 5,
   
  },
  MapsStyle: {
    height: 250,
    flex:1,
  },

  itemTextDetail: {
    fontSize: 14,
    width:'90%',
    color: '#0f2e63',
    marginStart: 16,
    marginTop: 4,
    fontFamily:"neutrifpro-regular",
  },
  headerTextDetail: {
    fontSize: 18,
    width:'100%',
    fontWeight: 'bold',
    fontFamily:"neutrifpro-regular",
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
    resizeMode:'cover',
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
