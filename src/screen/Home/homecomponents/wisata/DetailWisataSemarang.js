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
  Pressable,
} from 'react-native';
import { Api } from '../../../util/Api';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ListPromo from '../../../util/ListItem/ListPromo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
// import { enableLatestRenderer } from 'react-native-maps';

// enableLatestRenderer();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function DetailWisataSemarang({ navigation, route }) {
  const [getDetail, setDetail] = useState([]);
  const [loc, setLoc] = useState(
    {
      latitude : 0,
      longitude : 0
    }
  );
  const { id } = route.params;

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      DetailGet();
    });

    return () => {
      subscribe;
    };
  });

  const renderingPromo = ({ item }) => {
    return <ListPromo item={item} />;
  };

  const DetailGet = async () => {
    await Api.get(`api/tempat_wisata/view/${id}`, 1)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        console.log('datahasil', response);
        setDetail(response[0]);
        setLoc({
          latitude : parseFloat(response[0].latitude),
          longitude : parseFloat(response[0].longitude)
        }
         

        )
        setPromo(response[0].promo);
      })
      .catch((err) => {});
  };


  return (
    <SafeAreaView style={styling.containerView}>
      <ScrollView style={styling.containerScroll} showsVerticalScrollIndicator={false}>
        <SafeAreaView>
            
        </SafeAreaView>
        <SafeAreaView style={styling.containerDetailMerchant}>
          <Text style={ styling.headerTextDetail}>Detail Merchant</Text>
          <View style={[styling.itemDetailContainer,{
            marginTop:8,
          }]}>
            <Material name="storefront" size={28} color={'#0f2e63'} />
            <Text style={[styling.itemTextDetail,{
              fontWeight:'bold',
              fontSize:16
            }]}>{getDetail.nama}</Text>
          </View>
          <View style={styling.itemDetailContainer} >
            <SimpleIcon name="location-pin" size={28} color={'#0f2e63'} />
            <Text style={[styling.itemTextDetail,{
              width:200,
            }]}>{getDetail.alamat}</Text>
          </View>
          <View style={styling.itemDetailContainer}>
            <FeatherIcon name="phone" size={28} color={'#0f2e63'} />
            <Text style={styling.itemTextDetail}>{getDetail.notelp ? getDetail.notelp : '-'}</Text>
          </View>
          <View style={styling.itemDetailContainer}>
            <FeatherIcon name="instagram" size={28} color={'#0f2e63'} />
            <Text style={styling.itemTextDetail}>{getDetail.link_ig ? getDetail.link_ig : '-' }</Text>
          </View>
          <View style={styling.itemDetailContainer}>
            <FeatherIcon name="facebook" size={28} color={'#0f2e63'} />
            <Text style={styling.itemTextDetail}>{getDetail.link_fb ? getDetail.link_fb : '-' }</Text>
          </View>
<SafeAreaView style={styling.constainerMaps} >
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
    }}><Marker  coordinate={{
      latitude: loc.latitude,
      longitude: loc.longitude,
      }}
              pinColor="red"
              title="You"/></MapView>
</SafeAreaView>



        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styling = StyleSheet.create({
  constainerMaps:{
    borderRadius: 16,
    overflow: "hidden",
    margin:16,
    elevation:5,
  },
  MapsStyle:{
     height:250, 
  },

  itemTextDetail:{
    fontSize:14,
    color:'#0f2e63',
    marginStart:16,
    marginTop:4,
  },
  headerTextDetail:{
    fontSize:18,
    fontWeight:'bold',
    color:'#0f2e63',
    marginTop:16,
    marginStart:16,
    marginBottom:16,

  },
  itemDetailContainer:{
    marginTop:16,
    marginStart:16,
    flexDirection:'row',
  },
  containerIconName: {
    flexDirection: 'row',
  },
  containerDetailMerchant: {
    marginTop: 8,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  cardPromo: {
    height: 400,
    width: '100%',
    marginTop: 0,
    backgroundColor: 'white',
  },

  card: {
    height: 175,
    marginTop: windowHeight / 2.5,
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
    marginEnd: windowWidth / 4,
  },
  styleImage: {
    height: 400,
    width: '100%',
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
