import React, { useEffect, useState, useCallback } from 'react';
import { StackActions } from '@react-navigation/native';
import { sessionId } from '../../util/GlobalVar';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  FlatList,
  ImageBackground,
  BackHandler,
  Alert,
  Dimensions,
} from 'react-native';
import Style from '../../util/style';
import { Button, TextInput } from 'react-native-paper';
import { SessionManager } from '../../util/SessionManager';
import Icon from 'react-native-vector-icons/Ionicons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Api } from '../../util/Api';
import IconList from '../../util/ListItem/IconList';
import BannerList from '../../util/ListItem/BannerList';
import HomeMerchantList from '../../util/ListItem/HomeMerchantList';
import SpotWisataList from '../../util/ListItem/SpotWisataList';
import {Environment} from '../../util/environment';
import messaging from '@react-native-firebase/messaging';
const windowWidth = Dimensions.get('window').width;

export default function Home({ navigation, route }) {
  
  const [iconVisible, setIconVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const [banner, setBanner] = useState([]);
  const [merchantPop, setMerchantPop] = useState([]);
  const [countKoupon, setCountKoupon] = useState(0);
  const [search, setSearch] = useState();
  const [spotWisata, setSpotWisata] = useState([]);
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(false);
  useEffect(() => {

    const backAction = () => {

      if (navigation.isFocused()) {
          Alert.alert("Konfirmasi", "Apakah anda yakin ingin keluar dari aplikasi?", [
              {
                  text: "Batal",
                  onPress: () => null,
                  style: "cancel"
              },
              { text: "Iya", onPress: () => BackHandler.exitApp() }
          ]);
          return true;
      }

  };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    console.log(left)
    console.log(right)
    const unsubscribe = navigation.addListener('focus', () => {
      checkSession();
      kategoriHome();
      jumlahCoupon();
      getBannerSlider();
      merchantPopuler();
      getSpotPariwisata();
      checkFCMToken();
    });

    return () => {

      backHandler.remove();
      unsubscribe;
      
      
    };
  }, [navigation, getBannerSlider, merchantPopuler, getSpotPariwisata, jumlahCoupon]);

  const checkFCMToken = async () => {
    
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      
      let param = {
        fcm_id : fcmToken
      }
      await Api.post('auth/update_fcm_id', param)
      .then((res) => {
      })
      .catch((err) => {});

    }
  };

  const merchantPopuler = async () => {
    await Api.get('merchant/all')
      .then((res) => {
        console.log('ResponseMerchant', res.data.response);
        setMerchantPop(res.data.response);
      })
      .catch((err) => {});
  };

  const jumlahCoupon = async () => {
    await Api.get('kupon/total')
      .then((res) => {
        setCountKoupon(res.data.response.total);
      })
      .catch((err) => {});
  };

  const splitArray = (arr) => {
    var i,
      j,
      resArray = [],
      chunk = 2;
    for (i = 0, j = arr.length; i < j; i += chunk) {
      resArray.push(arr.slice(i, i + chunk));
    }
    return resArray;
  };

  const kategoriHome = async () => {
    await Api.get('kategori')
      .then((res) => {
        //console.log('Kategori', res.data.response);
        let arr = splitArray(res.data.response);
        setCategory(arr);
        //console.log('tes kategori', category);
      })
      .catch((err) => {});
  };

  const getBannerSlider = async () => {
    await Api.get('promo')
      .then((res) => {
        console.log('Tes Banner', res.data.response);
        setBanner(res.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const itemRender = useCallback(({ item }) => {
    console.log('item tes', item[0]);
    return (
      <View>
        <IconList item= {item[0]} Press={moveCategory} />
        <IconList item = {item[1]} Press={moveCategory} />
      </View>
    );
  }, []);

  const itemRenderWisata = useCallback(({item}) => {
    return(
      <View>
        <SpotWisataList item={item} pressCall={moveDetailWisata}/>
      </View>
    )
  })

  const moveDetailWisata = (item)=>{
    //console.log('testeswisata', item.nama);
    navigation.navigate('DetailWisata', {
      id_wisata : item.id,
      name : item.nama,
    })
  }

  const getSpotPariwisata = async () => {
    await Api.post('api/tempat_wisata',{
      start:0,
      count:6,
    }).then(res => {
      let body = res.data;
      let response = body.response;
      let metadata = body.metadata;
      console.log("spotWisata", body);
      if(metadata.status === 200){
        setSpotWisata(response);
      }else if( metadata.status === 401){

      }else{
        
      }
    }).catch(err =>{
      console.log(err);
    })
  }

  const detailMerchant = useCallback(({item}) =>{
    return(
      <HomeMerchantList item={item} pressCall={moveDetail}/>
    );
  });

  const moveDetail = (value) =>{
    navigation.navigate('DetailMerchant', {
      id_m : value.id_m
    });
  }


  const moveCategory = (data) =>{
    navigation.navigate('DetailListCategory', {
      ...data
    });
    //console.log('tesidk', data);
  }

  const moveHomeWisata = ()=>{
    navigation.navigate('HomeWisata');
  }

const showAllDestination = () =>{
      return(
        <Pressable onPress={moveHomeWisata} style={style.containerFooter}>
        <Image source={require('../../assets/logotugumuda.png')}  style={style.imageStyleFooter}/>
        <Text style={style.textAllFooter}>Lihat Semua Pariwisata Semarang</Text>
    </Pressable>);
      }

  const keyExtractor = useCallback(({ item }) => {
    return item.id_k;
  }, []);

  const checkSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {
      const sesiUid = session.uid;
      console.log('TEST AT HOME', sesiUid);
      console.log('TEST AT HOME FULL', session);
    } else {
      console.log('login dulu!');
      navigation.dispatch(StackActions.replace('Login'));
    }
  };


  return (
    <SafeAreaView style={style.containerHome}>
      <View
        style={{
          height: 100,
        }}
      >
        <Image
          source={require('../../assets/header_app.png')}
          style={{
            height: 106,
            marginTop: 0,
            top: 0,
            width: '100%',
            position: 'absolute',
            flexDirection: 'row',
          }}
          resizeMode={'stretch'}
        />
        <View style={style.searchView}>
        <Pressable style={style.SearchStyle} onPress={()=>{navigation.navigate('Search')}}>
        <SafeAreaView style={{
          flexDirection:'row',
          width:'100%',
        }}>
        <Text style={{
          color:'grey',
          fontSize:13,
          width:205,
          marginTop:2,
          marginStart:6,
        }}>Cari Merchant</Text>
        <Icon name="search" size={22} color="#4F4F4F" style={style.iconSearch} />
        </SafeAreaView>
        </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={style.viewCoupon}>
          <Text style={style.TextCoupon}>Jumlah E-Kupon Anda : {countKoupon}</Text>
          <Pressable style={style.btnStyle} onPress={()=>{navigation.navigate('EKupon')}}>
            <Text style={style.TextListCoupon}>Lihat E-kupon</Text>
          </Pressable>
        </View>

        <View style={style.listService}>
          <FlatList
            nestedScrollEnabled={true}
            data={category}
            horizontal={true}
            onMomentumScrollEnd={e => {
              if (e.nativeEvent.contentOffset.x === 0) {
                setLeft(true)
                setRight(false)
              }else{
                setLeft(false)
                setRight(true)
              }
            }}
            showsHorizontalScrollIndicator={true}
            indicatorStyle={'#05245A'}
            renderItem={itemRender}
          />

          <View style={{
            flexDirection:'row',alignSelf:'center'
          }}>
            <View style={{
              width:6,
              height:6,
              margin:2,
              borderRadius:6/2,
              backgroundColor: left? '#0F2E63' : '#f9f9f9'
            }}>
            </View>
            <View style={{
              width:6,
              height:6,
              margin:2,
              borderRadius:6/2,
              backgroundColor: right ? '#0F2E63' : '#f9f9f9'
            }}>
            </View>
          </View>

          <View>
            <LinearGradient
              colors={['#F29836', '#FBEDB7', '#ffffff']}
              start={{ x: 0.2, y: 0.0 }}
              end={{ x: 1, y: 0.5 }}
              style={style.voucherView}
            >
              <Image
                source={require('../../assets/voucher.png')}
                style={style.voucherImage}
                resizeMode="contain"
              />
              <Text style={style.voucherNotice}>Jangan sia-siakan voucher kamu</Text>
              <Pressable style={style.btnStyleVoucher} onPress={()=>{
                navigation.navigate('VoucherHome');
              }}>
                <Text style={style.textVoucherBtn}>Lihat Voucher</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>

        <Text style={style.textBannerSmargress}>Event Semargress</Text>
            <View style={{
              width:350,
              height:135,
              borderRadius:7,
              alignSelf:'center',
              backgroundColor:'white',
              marginBottom:20
            }}>

            </View>
        <View>
          <ScrollView>
            <FlatList
              nestedScrollEnabled={true}
              horizontal={true}
              data={banner}
              showsHorizontalScrollIndicator={false}
              renderItem={BannerList}
            />
          </ScrollView>
        </View>
        <SafeAreaView style={style.containerMerchant}>
          <Pressable style={style.btnAllMerchant}>
            <Text style={style.textAllMerchant}>Merchant Populer</Text>
            <SimpleIcon name="arrow-right" size={12} color={'#0F2E63'} style={style.styleIconArrow} onPress={()=>{navigation.navigate('MerchantHome')}} />
          </Pressable>
          <ScrollView>
            <FlatList nestedScrollEnabled={true}
            data={merchantPop.slice(0,10)}
            renderItem={detailMerchant}
            horizontal={true}/>
          </ScrollView>

          <LinearGradient
            colors={['#0F2E6333', '#0F2E6300', '#ffffff']}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 3.0, y: 0.0 }}
            style={style.kuisContainer}
          >
            <Image
              source={require('../../assets/woman_happy.png')}
              style={style.imageWomanHappy}
              resizeMode="contain"
            />
            <SafeAreaView style={style.styleNoticeKuis}>
              <Text style={style.textNoticeKuis} numberOfLines={5}>Jawab Kuis yang diajukan oleh merchant dan menangkan hadiahnya!</Text>
              <Pressable style={style.btnKuis} onPress={
               ()=> { navigation.navigate('RouterQuiz')}
              }>
                <Text style={style.texbtnKuis}>Lihat Kuis</Text>
              </Pressable>
            </SafeAreaView>
          </LinearGradient>
        </SafeAreaView>

        <View style={style.spotPariwisataContainer}>
        <ImageBackground source={require('../../assets/bgpopulerwisata.png')} style={style.imagestyleBg} resizeMode='cover'>
          <Text style={style.textSpotTitle}>Pariwisata Semarang</Text>
          <ScrollView>
            <FlatList
              nestedScrollEnabled={true}
              horizontal={true}
              data={spotWisata}
              showsHorizontalScrollIndicator={false}
              renderItem={itemRenderWisata}
              ListFooterComponent={showAllDestination}
              style={style.containerListSpotPariwisata}
            />
          </ScrollView>
          </ImageBackground>
         
        </View>
      </ScrollView>

      {Environment.ENV != 'PRODUCTION' && 
        <View
              style={{width:'100%', backgroundColor:'red', position:'absolute', marginTop:0, padding:8}}
        >
          <Text style={{color:'white', alignSelf:'center'}}>{Environment.ENV}</Text>
        </View>}
    </SafeAreaView>
  );
}

const themeSearch = {
  version: 3,
  colors: {
    primary: '#3498db',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
  },
};

const style = StyleSheet.create({
  containerListSpotPariwisata:{
    marginBottom:16,

  },
  containerFooter :{
  height:windowWidth/2,
  width:windowWidth/3,
  justifyContent:'center',
  borderRadius:5,
  marginStart:8,
  marginEnd:32,
  flexDirection:'column',
  backgroundColor:'#f29836',

},
imageStyleFooter :{
    width:24,
    height:50,
    alignSelf:'center',
    marginBottom:12,
    resizeMode:'contain',
},
textAllFooter:{
    fontSize:16,
    fontWeight:'bold',
    alignSelf:'center',
    textAlign:'center',
    color:'white',
    width:100,
},
imagestyleBg:{
  height:300,
  width:'100%'
},
  spotPariwisataContainer :{
    height:270,
    backgroundColor:'#B60D00',
    flexDirection:'column',
  },
  textSpotTitle:{
    color:'white',
    fontSize:18,
    margin:16,
    fontWeight:'600'
  },

  containerHome: [
    Style.container,
    {
      backgroundColor: '#001F58',
    },
  ],

  scrollStyle: {
    padding: 0,
    margin: 0,
  },
  searchView: {
    flex: 1,
    width: 250,
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 8,
    bottom: 0,
    marginStart: 16,
    marginBottom:15,
    backgroundColor:'white',
    flexDirection: 'row',
  },
  SearchStyle: {
    width: 250,
    justifyContent:'center',
    padding:0,
    alignSelf: 'flex-start',
    height: 36,
    marginStart: 6,
    backgroundColor: 'transparent',
  },
  iconSearch: {
    bottom:0,
    right:0,
    alignSelf:'flex-end',
    marginEnd:16,
  },
  iconNotif: {
    marginStart: 54,
    marginRight: 16,
  },
  viewCoupon: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#05245A',
    elevation: 16,
    height: 65,
    marginTop: 8,
    paddingTop: 16,
  },
  TextCoupon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginStart: 16,
    fontWeight: '600',
  },
  btnStyle: {
    width: 95,
    height: 30,
    marginStart: 45,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  TextListCoupon: {
    color: '#0F2E63',
    fontSize: 12,
    fontWeight: '600',
    marginStart: 8, 
  },
  listService: {
    margin: 0,
    padding: 0,
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  voucherView: {
    height: 64,
    borderRadius: 16,
    elevation: 8,
    marginStart: 16,
    marginTop: 36,
    marginBottom: 36,
    marginEnd: 16,
    flexDirection: 'row',
  },
  voucherImage: {
    height: 28,
    width: 39,
    marginStart: 8,
    marginTop: 16,
  },
  voucherNotice: {
    fontWeight: '500',
    fontSize: 14,
    color: 'black',
    marginStart: 8,
    marginTop: 20,
  },
  btnStyleVoucher: {
    width: 70,
    height: 25,
    marginStart: 14,
    marginTop: 20,
    backgroundColor: '#F29836',
    color: 'white',
    paddingTop: 6,
    textAlign: 'center',
    borderRadius: 8,
  },
  textVoucherBtn: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
    alignSelf: 'center',
    
  },
  categoryContainer: {
    flexDirection: 'column',
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent',
  },
  iconCategory: {
    height: 56,
    width: 56,
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    justifyContent: 'center',
  },
  pictureKategori: {
    height: 32,
    width: 32,
  },
  nameKategori: {
    fontSize: 12,
    color: 'black',
    alignSelf: 'center',
  },
  containerMerchant: {
    backgroundColor: 'white',
    flexDirection: 'column',
    marginTop: 24,
  },
  btnAllMerchant: {
    marginTop: 16,
    flexDirection: 'row',
    flex: 1,
  },
  textAllMerchant: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginStart: 16,
  },
  styleIconArrow: {
    marginTop: 5,
    position: 'absolute',
    right: 0,
    marginRight: 16,
  },
  textBannerSmargress: {
    fontSize: 26,
    alignSelf: 'center',
    margin: 56,
    color: 'white',
    fontWeight: '700',
  },
  kuisContainer: {
    height: 170,
    width:340,
    borderRadius: 16,
    marginTop: 16,
    alignSelf:'center',
    marginBottom:16,
    flexDirection: 'row',
  },
  imageWomanHappy: {
    width: 105,
    height: 175,
    marginTop:8,
    marginStart:16,
    marginEnd:8,
  },
  styleNoticeKuis: {
    flexDirection: 'column',
    marginStart:0,
    marginTop:16,
    justifyContent:'center',
  },
  textNoticeKuis:{
    color:'black',
    width:200,
    alignSelf:'flex-start',
    marginEnd:8,
    fontSize:16,
    fontWeight:'600',
  },
  texbtnKuis:{
    fontSize:10,
    fontWeight:'600',
    marginTop:4,
    alignSelf:'center',
    color:'white',
  },
  btnKuis:{
    alignSelf:'flex-end',
    borderRadius:8,
    height:24,
    marginTop:16,
    marginEnd:16,
    width:70,
    backgroundColor:'#F29836'
  }
});
