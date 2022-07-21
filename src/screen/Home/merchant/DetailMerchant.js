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
  Linking
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
var wordLength = 0;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function DetailMerchant({ navigation, route }) {
  const [getDetail, setDetail] = useState([]);
  const [promo, setPromo] = useState([]);
  const [kosong, setKosong] = useState(false);
  const [show, setShowMore] = useState(0);
  const [loc, setLoc] = useState(
    {
      latitude : 0,
      longitude : 0
    }
  );
  const { id_m, kategori } = route.params;

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      DetailGet();
    });

    return () => {
      subscribe;
    };
  },[navigation]);

  const renderingPromo = ({ item }) => {
    return <ListPromo item={item} click={promoGet} />;
  };

  const promoGet = (item) =>{
      navigation.navigate('DetailPromo', {
        id : item.id_i,
      });
  }

  const DetailGet = async () => {
    await Api.get(`merchant/all/${id_m}/`, 1)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        if(metadata.status === 200){
          setDetail(response[0]);
          setLoc({
            latitude : parseFloat(response[0].latitude),
            longitude : parseFloat(response[0].longitude)
          })
          setPromo(response[0].promo);
          setKosong(false);
        }else if(metadata.status === 401){
          setKosong(true);
        }else if(metadata.status === 404){
          setKosong(true);
        }
        console.log('datahasil', response);
       
      })
      .catch((err) => {});
  };

  const promoDummy = [
    {
      id_i: '1252',
      title: 'semargres 2021',
      gambar: 'https://semargres.gmedia.id/assets/images/uploads/info/img_1635325274.jpg',
      link: 'promo disc 15%',
      keterangan: '\n\n',
    },
    {
      id_i: '1253',
      title: 'semargres 2021',
      gambar: 'https://semargres.gmedia.id/assets/images/uploads/info/img_1635325274.jpg',
      link: 'promo disc 15%',
      keterangan: '\n\n',
    },
    {
      id_i: '12524',
      title: 'semargres 2021',
      gambar: 'https://semargres.gmedia.id/assets/images/uploads/info/img_1635325274.jpg',
      link: 'promo disc 15%',
      keterangan: '\n\n',
    },
  ];

  const openLink = async (url) => {
    var text = url.toString();
    var res = text.includes('www.');
    var res2 = text.includes('@');
   
    if(res){
      await Linking.canOpenURL(url);
      Linking.openURL(`https://${url}`);
    }else if(res2){
      var textEdit = url.replace('@','');
      console.log(textEdit);
      await Linking.canOpenURL(textEdit);
      Linking.openURL(`https://www.instagram.com/${textEdit}`);
    }else {
      await Linking.canOpenURL(url);
      Linking.openURL(`https://www.instagram.com/${url}`);
    }
    console.log(url);
  
  };

  const openTel = async (url) => {

   
    await Linking.canOpenURL(url);
    Linking.openURL(`tel://${url}`);
    console.log(url);
  
  };

  const openMaps = (latitude, longitude) => {
    const daddr = `${latitude},${longitude}`;
    const company = Platform.OS === "ios" ? "apple" : "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  }


  const onTextLayout = useCallback(e => {
    wordLength = e.nativeEvent.lines.length;
    console.log('tes', wordLength);
});


  return (
    <SafeAreaView style={styling.containerView}>
    {
      kosong ? <Text style={{
        color:'black',
        fontSize:24,
        width:'100%',
        textAlign:'center',
        alignSelf:'center',
        fontWeight:'600',
      }}>Maaf Data Merchant Belum Ada</Text>  : 
      <ScrollView style={styling.containerScroll} showsVerticalScrollIndicator={false}>
        <View style={styling.constainerHeader}>
          <Image source={{ uri: getDetail.foto }} style={styling.styleImage} />
          <View style={styling.constainerItemHeader}>
            <Pressable
              style={styling.styleIcon}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <IonIcon name="chevron-back" size={28} color={'white'} />
            </Pressable>
  
            <View style={styling.containerTitle}>
              <Text style={styling.textTitle}>{getDetail.nama}</Text>
            </View>
          </View>
          <View styling={styling.cardPromo}>
            <Text
              style={{
                color: 'black',
                marginTop: 100,
                fontSize: 16,
                marginStart: 16,
                marginBottom: 12,
                fontWeight: '800',
                fontFamily:'NeutrifPro-Regular',
              }}
            >
              Promo yang Sedang Berlangsung
            </Text>
            {promo.length > 0 ? (
              
                <FlatList
                  nestedScrollEnabled={true}
                  data={promo}
                  style={{
                    marginBottom: 16,
                  }}
                  keyExtractor={(item,index) => {index.toString()}}
                  renderItem={renderingPromo}
                  key={(item) => item.id_i}
                  horizontal={true}
                />
              
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  alignSelf: 'center',
                  height: 75,
                  marginTop: 28,
                  fontFamily:'NeutrifPro-Regular',
                }}
              >
                Tidak Ada Promo Tersedia!
              </Text>
            )}
          </View>
        </View>
        <View style={styling.containerDetailMerchant}>
          <Text style={ styling.headerTextDetail}>Detail Merchant</Text>
          <View style={[styling.itemDetailContainer,{
            marginTop:8,
          }]}>
          <Image source={require('../../../assets/shop_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text style={[styling.itemTextDetail,{
              fontWeight:'bold',
              fontSize:16
            }]}>{getDetail.nama}</Text>
          </View>
          <Pressable style={styling.itemDetailContainer} >
          <Image source={require('../../../assets/location_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text numberOfLines={6} style={[styling.itemTextDetail,{
              width:'75%',
            }]}>{getDetail.alamat}</Text>
          </Pressable>
          <Pressable style={styling.itemDetailContainer} onPress={getDetail.notelp ? ()=>{openTel(getDetail.notelp)}: ()=>{}}>
          <Image source={require('../../../assets/phone_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text numberOfLines={6} style={[styling.itemTextDetail,{
              width:'75%',
            }]}>{getDetail.notelp ? getDetail.notelp : '-'}</Text>
          </Pressable>
          <Pressable style={styling.itemDetailContainer}  onPress={getDetail.link_ig ? ()=>{openLink(getDetail.link_ig)}: ()=>{}}>
          <Image source={require('../../../assets/ig_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text numberOfLines={6} style={[styling.itemTextDetail,{
              width:'75%',
              color:'#A57FF8'
            }]}>{getDetail.link_ig ? getDetail.link_ig : '-' }</Text>
          </Pressable>
          <Pressable style={styling.itemDetailContainer} onPress={getDetail.link_ig ? ()=>{openLink(getDetail.link_fb)}: ()=>{}}>
            <Image source={require('../../../assets/fb_ico.png')} resizeMode='contain' style={{
              height:28,
              width:28,
            }}/>
            <Text numberOfLines={6} style={[styling.itemTextDetail,{
              width:'75%',
               color:'#A57FF8'
            }]}>{getDetail.link_fb ? getDetail.link_fb : '-' }</Text>
          </Pressable>
  <View style={styling.constainerMaps} >
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
              title="You"/>
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
  <Image source={require('../../../assets/map_btn.png')}  style={{height:30, width:30, alignSelf:'center'}}/>
  </Pressable>
  </View>
        </View>
        <View style={styling.card}>
          <View
            style={{
              justifyContent: 'flex-start',
              position: 'absolute',
              top: 0,
            }}
          >
            <Text style={{ color: 'grey', fontSize: 12, marginStart: 16, marginTop: 16,  fontFamily:'NeutrifPro-Regular', }}>
              Diskon Yang Diberikan
            </Text>
            <Text
            onTextLayout={onTextLayout}
            numberOfLines={wordLength}
            style={ wordLength == 2 ? {
              color: 'black',
              fontFamily:'NeutrifPro-Regular',
              fontSize: 16,
              fontWeight: 'bold',
              marginStart: 16,
              marginEnd: 16,
            } : {
              color: 'black',
              fontFamily:'NeutrifPro-Regular',
              fontSize: 11,
              fontWeight: 'bold',
              marginStart: 16,
              marginTop:8,
              marginEnd: 16, 
            }}
            >
              {getDetail.diskon_default}
            </Text>
          </View>
  
          <View
            style={{
              borderColor: 'gray',
              borderWidth: 0.5,
              marginEnd: 16,
              marginStart: 16,
              marginTop:8,
              marginBottom:8,
              marginEnd: 16,
              backgroundColor: 'grey',
            }}
          />
  
  
          <View
            style={{
              justifyContent: 'flex-start',
              position: 'absolute',
              bottom: 0,
              marginBottom: 36,
            }}
          >
            <Text numberOfLines={1} style={{ color: 'grey', fontSize: 12, marginStart: 16, marginBottom: 8 }}>
              Diskon Pengguna Aplikasi
            </Text>
          
            <Text
            numberOfLines={wordLength}
            onTextLayout={onTextLayout}
              style={ wordLength == 2 ? {
                color: 'black',
                fontFamily:'NeutrifPro-Regular',
                fontSize: 16,
                fontWeight: 'bold',
                marginStart: 16,
                marginEnd: 16,
              } : {
                color: 'black',
                fontFamily:'NeutrifPro-Regular',
                fontSize: 11,
                fontWeight: 'bold',
                marginStart: 16,
                marginEnd: 16, 
              }}
            >
              {getDetail.diskon_user_app}
            </Text>
           
            
          </View>
        </View>
      </ScrollView>
  
    }
    
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
    fontFamily:'NeutrifPro-Regular',
    marginStart:16,
    marginTop:4,
  },
  headerTextDetail:{
    fontSize:18,
    fontWeight:'bold',
    color:'#0f2e63',
    marginTop:16,
    fontFamily:'NeutrifPro-Regular',
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
    height: 200,
    width:'85%',
    marginTop: windowHeight / 4,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation:5,
    padding: 0,
    position: 'absolute',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
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
    fontFamily:'NeutrifPro-Regular',
    width: '100%',
    marginEnd: 16,
  },
  styleIcon: {
    marginStart: 16,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    alignSelf: 'center',
    textAlign:'center',
    fontFamily:'NeutrifPro-Regular',
    marginEnd: windowWidth / 4,
  },
  styleImage: {
    height: windowHeight/2.5,
    backgroundColor:'#FF5CB550',
    resizeMode:'cover',
    width: '100%',
  },
  containerScroll: {
    flexDirection: 'column',
    margin: 0,
    flex: 1,
  },
  containerView: {
    flex: 1,
    justifyContent:'center'
  },
});
