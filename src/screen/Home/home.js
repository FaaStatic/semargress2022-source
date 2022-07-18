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
  LogBox,
  Modal,
  TouchableOpacity,
  Linking
} from 'react-native';
import Style from '../../util/style';
import { SessionManager } from '../../util/SessionManager';
import Icon from 'react-native-vector-icons/Ionicons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Api } from '../../util/Api';
import IconList from '../../util/ListItem/IconList';
import BannerList from '../../util/ListItem/BannerList';
import HomeMerchantList from '../../util/ListItem/HomeMerchantList';
import SpotWisataList from '../../util/ListItem/SpotWisataList';
import { Environment } from '../../util/environment';
import messaging from '@react-native-firebase/messaging';
import ListPromoHome from '../../util/ListItem/ListPromoHome';
import DeviceInfo from 'react-native-device-info';
import { colors } from '../../util/color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Home({ navigation, route }) {

  const [iconVisible, setIconVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const [banner, setBanner] = useState([]);
  const [merchantPop, setMerchantPop] = useState([]);
  const [countKoupon, setCountKoupon] = useState(0);
  const [promoUser, setPromoUser] = useState([]);
  const [search, setSearch] = useState();
  const [spotWisata, setSpotWisata] = useState([]);
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(false);
  const [btnUpdateAndroid, setBtnUpdateAndroid] = useState(false);
  const [pesanUpdateAndroid, setPesanUpdateAndroid] = useState('');
  const [linkUpdateAndroid, setUpdateAndroid] = useState('');
  const [wajibAndroid, setWajibAndroid] = useState('0');

  useEffect(() => {

    checkSession();
    kategoriHome();

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

    const unsubscribe = navigation.addListener('focus', () => {
      getLatestVersion();
      setMerchantPop([]);
      setSpotWisata([]);
      setBanner([]);
      jumlahCoupon();
      getPromo();
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      getBannerSlider();
      merchantPopuler();
      getSpotPariwisata();
      checkFCMToken();
    });

    return () => {

      backHandler.remove();
      unsubscribe;

    };
  }, [navigation]);

  const checkFCMToken = async () => {

    const fcmToken = await messaging().getToken();
    if (fcmToken) {

      let param = {
        fcm_id: fcmToken
      }
      await Api.post('auth/update_fcm_id', param)
        .then((res) => {
        })
        .catch((err) => { });

    }
  };

  const merchantPopuler = async () => {

    const param = {
        "start" : 0,
        "count" : 10
    }
    await Api.post('merchant/all', param)
      .then((res) => {

        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;

        if(metadata.status == 200){
          setMerchantPop(res.data.response);
        }
        
      })
      .catch((err) => { });
  };

  const jumlahCoupon = async () => {
    await Api.get('kupon/total')
      .then((res) => {
        setCountKoupon(res.data.response.total);
      })
      .catch((err) => { });
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
        let arr = splitArray(res.data.response);
        setCategory(arr);
      })
      .catch((err) => { });
  };

  const getBannerSlider = async () => {

    await Api.get('promo')
      .then((res) => {
        setBanner(res.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const itemRender = useCallback(({ item }) => {
    return (
      <View>
        <IconList item={item[0]} Press={moveCategory} />
        <IconList item={item[1]} Press={moveCategory} />
      </View>
    );
  }, []);

  const itemRenderWisata = useCallback(({ item }) => {
    return (
      <View>
        <SpotWisataList item={item} pressCall={moveDetailWisata} />
      </View>
    )
  })

  const moveDetailWisata = (item) => {
    //console.log('testeswisata', item.nama);
    navigation.navigate('DetailWisata', {
      id_wisata: item.id,
      name: item.nama,
    })
  }

  const getSpotPariwisata = async () => {
    await Api.post('api/tempat_wisata', {
      start: 0,
      count: 6,
    }).then(res => {
      let body = res.data;
      let response = body.response;
      let metadata = body.metadata;

      if (metadata.status === 200) {
        setSpotWisata(response);
      } else if (metadata.status === 401) {

      } else {

      }
    }).catch(err => {
      console.log(err);
    })
  }

  const getLatestVersion = async () => {
    await Api.get('/latest_version/user')
      .then(res => {

        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;

        if (metadata.status === 200) {
          setUpdateAndroid(response.link_update);
          var buildVersion = response.build_version;
          setWajibAndroid(response.wajib);

          console.log("sdjkfhslkhfskjhf");
          // Android
          if (Platform.OS === 'android' && buildVersion != DeviceInfo.getVersion()) {

            let onlineVersion = parseFloat(buildVersion);
            let currentVersion = parseFloat(DeviceInfo.getVersion());
            if (onlineVersion > currentVersion) {
              setPesanUpdateAndroid(buildVersion);
              setBtnUpdateAndroid(true);
            }
          }
        } else if (metadata.status === 401) {

        } else {

        }
      }).catch(err => {
        console.log(err);
      })
  }

  const detailMerchant = useCallback(({ item }) => {
    return (
      <HomeMerchantList item={item} pressCall={moveDetail} />
    );
  });

  const moveDetail = (value) => {
    navigation.navigate('DetailMerchant', {
      id_m: value.id_m
    });
  }


  const moveCategory = (data) => {
    navigation.navigate('DetailListCategory', data);
  }

  const moveHomeWisata = () => {
    navigation.navigate('HomeWisata');
  }


  const getPromo = async () => {
    await Api.post('api/popup_promo/get_promo', {
      "start": 0,
      "limit": 5
    }).then(res => {
      var body = res.data;
      var response = body.response.promo;
      var metadata = body.metadata;
      if (metadata.status === 200) {
        setPromoUser(response);
      } else if (metadata.status === 401) {

      } else {

      }
    }).catch(err => {
      console.log(err.message);
    })
  }

  const renderItemPromo = useCallback(({ item }) => {
    return (
      <ListPromoHome item={item} pressCall={moveDetailPromo} />
    );
  })

  const moveDetailPromo = (value) => {
    navigation.navigate('DetailPromo', {
      id: value.id_i
    })
  }

  const showAllDestination = () => {
    return (
      <Pressable style={style.containerFooter} onPress={moveHomeWisata}>
        <Image source={require('../../assets/logotugumuda.png')} style={style.imageStyleFooter} />
        <Text style={style.textAllFooter}>Lihat Semua Pariwisata Semarang</Text>
      </Pressable>);
  }

  const checkSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {
      const sesiUid = session.uid;
    } else {
      navigation.dispatch(StackActions.replace('Login'));
    }
  };

  const bannerRender = useCallback(({ item }) => {
    return (
      <BannerList item={item} pressCall={moveDetailPromo} />
    );

  })

  return (
    <SafeAreaView style={style.containerHome}>

      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: colors.primary,
        }}
      >
        <View style={{
          flexDirection: 'column',
          top: 0,
          backgroundColor: colors.primary,
          height: 150
        }}>
          <Image
            source={require('../../assets/header_app.png')}
            style={{
              height: 100,
              top: 0,
              width: '100%',
              position: 'absolute',
              flexDirection: 'row',
            }}
            resizeMode={'stretch'}
          />

          <View
            style={{
              height: 100,
            }}
          >

            <View style={style.searchView}>
              <Pressable style={style.SearchStyle} onPress={() => { navigation.navigate('Search') }}>
                <View style={{
                  flexDirection: 'row',
                  width: '100%',
                }}>
                  <Text style={{
                    color: 'grey',
                    fontSize: 13,
                    width: '85%',
                    marginTop: 2,
                    marginStart: 6,
                  }}>Cari Merchant</Text>
                  <Icon name="search" size={22} color="#4F4F4F" style={style.iconSearch} />
                </View>
              </Pressable>
            </View>

          </View>

          <View style={style.viewCoupon}>
            <Text style={style.TextCoupon}>Jumlah E-Kupon Anda : {countKoupon}</Text>
            <Pressable style={style.btnStyle} onPress={() => { navigation.navigate('EKupon') }}>
              <Text style={style.TextListCoupon}>Lihat E-kupon</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} style={{
          backgroundColor:'#472F9A'
        }}>
          <View style={style.listService}>
            <FlatList
              nestedScrollEnabled={true}
              data={category}
              horizontal={true}
              viewabilityConfig={{
                viewAreaCoveragePercentThreshold: 95
              }}
              onMomentumScrollEnd={e => {
                if (e.nativeEvent.contentOffset.x === 0) {
                  setLeft(true)
                  setRight(false)
                } else {
                  setLeft(false)
                  setRight(true)
                }
              }}

              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={itemRender}
            />

            <View style={{
              flexDirection: 'row', alignSelf: 'center'
            }}>
              <View style={{
                width: 6,
                height: 6,
                margin: 2,
                borderRadius: 6 / 2,
                backgroundColor: left ? '#A57FF8' : '#f9f9f9'
              }}>
              </View>
              <View style={{
                width: 6,
                height: 6,
                margin: 2,
                borderRadius: 6 / 2,
                backgroundColor: right ? '#A57FF8' : '#f9f9f9'
              }}>
              </View>
            </View>

            <View>
              <LinearGradient
                colors={['#A57FF833', '#A57FF81B', '#ffffff']}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1, y: 1 }}
                style={style.voucherView}
              >
                <Image
                  source={require('../../assets/voucher.png')}
                  style={style.voucherImage}
                  resizeMode="contain"
                />
                <Text style={style.voucherNotice}>Jangan sia-siakan voucher kamu</Text>
                <View
                  style={{
                    height:'100%',
                    flex:1,
                    justifyContent:'center',
                  }}
                >
                  <TouchableOpacity style={style.btnStyleVoucher} onPress={() => {
                    navigation.navigate('VoucherHome');
                  }}>
                    <Text style={style.textVoucherBtn}>Lihat Voucher</Text>
                  </TouchableOpacity>
                </View>

              </LinearGradient>
            </View>
          </View>

          <View style={{
            width: 350,
            height: 175,
            marginTop:30,
            borderRadius: 7,
            alignSelf: 'center',
            backgroundColor: 'white',
            marginBottom: 20
          }}>
            <Image source={require('../../assets/iklan.png')} style={{
              width: 350,
              height: 175,
              borderRadius: 7,
              resizeMode:'cover',
            }} />

          </View>
          <View>
            <ScrollView>
              <FlatList
                nestedScrollEnabled={true}
                horizontal={true}
                data={banner}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={bannerRender}
              />
            </ScrollView>
          </View>
          
          <View style={style.containerMerchant}>

            <Pressable style={style.btnAllMerchant}  onPress={() => { navigation.navigate('MerchantHome') }}>
              <Text style={style.textAllMerchant}>Merchant Populer</Text>
              <SimpleIcon name="arrow-right" size={14} color={'#0F2E63'} style={style.styleIconArrow} />
            </Pressable>

            <FlatList nestedScrollEnabled={true}
              data={merchantPop}
              showsHorizontalScrollIndicator={false}
              renderItem={detailMerchant}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true} />

            <LinearGradient
              colors={['#35CAED33', '#35CAED33', '#ffffff']}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.0, y: 1.0 }}
              style={style.kuisContainer}
            >
              <Image
                source={require('../../assets/woman_happy.png')}
                style={style.imageWomanHappy}
                resizeMode="contain"
              />
              <View style={style.styleNoticeKuis}>
                <Text style={style.textNoticeKuis} numberOfLines={5}>Jawab Kuis yang diajukan oleh merchant dan menangkan hadiahnya!</Text>
                <Pressable style={style.btnKuis} onPress={
                  () => { navigation.navigate('RouterQuiz') }
                }>
                  <Text style={style.texbtnKuis}>Lihat Kuis</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          <View style={style.spotPariwisataContainer}>
            <ImageBackground source={require('../../assets/bgpopulerwisata.png')} style={style.imagestyleBg} resizeMode='cover'>
              <Text style={style.textSpotTitle}>Pariwisata Semarang</Text>

              <FlatList
                nestedScrollEnabled={true}
                horizontal={true}
                data={spotWisata}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={itemRenderWisata}
                ListFooterComponent={showAllDestination}
                style={style.containerListSpotPariwisata}
              />

            </ImageBackground>

          </View>
          <View
            style={{
              backgroundColor: 'white',
            }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: '#333333',
              fontFamily: 'NeutrifPro-Reguler',
              marginStart: 18,
              marginTop: 40,

            }}>Promo Hari Ini</Text>

            <ScrollView>

              <FlatList
                nestedScrollEnabled={true}
                data={promoUser}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderItemPromo}
                style={{
                  marginStart: 18,
                  marginTop: 28,
                }}
              />
            </ScrollView>

          </View>

        </ScrollView>

      </View>


      {Environment.ENV == 'PRODUCTION' &&
        <View
          style={{ width: '100%', backgroundColor: 'red', position: 'absolute', top: 0, padding: 8 }}
        >
          <Text style={{ color: 'white', alignSelf: 'center' }}>{Environment.ENV}</Text>
        </View>}

      {btnUpdateAndroid && (
        <Modal
          onShow={false}
          animationType="slide" transparent={true}
        >
          <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 12, backgroundColor: 'white', elevation: 3, paddingTop: 24, paddingLeft: 16, paddingRight: 16, paddingBottom: 24, alignItems: 'center' }}>
              <Image source={require('../../assets/logo.png')} style={{ height: 120, width: 120, resizeMode: 'contain' }} />
              <Text style={{ width: 220, textAlign: 'center', marginTop: 10, fontSize: 14, fontWeight: '300', }}>Versi {pesanUpdateAndroid} Telah Tersedia di Playstore</Text>
              <TouchableOpacity style={{ height: 38, width: 150, backgroundColor: '#FF0000', alignItems: 'center', justifyContent: 'center', marginTop: 22, borderRadius: 100 }} onPress={() => Linking.openURL(linkUpdateAndroid)}>
                <Text style={{ fontSize: 14, color: 'white' }}>Perbarui</Text>
              </TouchableOpacity>

              {wajibAndroid == "0" &&
                <TouchableOpacity style={{ height: 38, width: 150, backgroundColor: '#f5b342', alignItems: 'center', justifyContent: 'center', marginTop: 22, borderRadius: 100 }} onPress={() => { setBtnUpdateAndroid(false) }}>
                  <Text style={{ fontSize: 14, color: 'white' }}>Lewati</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </Modal>
      )}
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
  containerListSpotPariwisata: {
    marginBottom: 16,

  },
  containerFooter: {
    height: SCREEN_WIDTH / 2,
    width: SCREEN_WIDTH / 3,
    justifyContent: 'center',
    borderRadius: 5,
    marginStart: 8,
    marginEnd: 32,
    flexDirection: 'column',
    backgroundColor: '#19b0bf',

  },
  imageStyleFooter: {
    width: 24,
    height: 50,
    alignSelf: 'center',
    marginBottom: 12,
    resizeMode: 'contain',
  },
  textAllFooter: {
    fontSize: 16,
    fontFamily: 'NeutrifPro-Regular',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    width: 100,
  },
  imagestyleBg: {
    height: SCREEN_WIDTH / 2 + 70,
    width: '100%'
  },
  spotPariwisataContainer: {
    height: SCREEN_WIDTH / 2 + 70,
    backgroundColor: '#B60D00',
    flexDirection: 'column',
  },
  textSpotTitle: {
    color: 'white',
    fontSize: 18,
    margin: 16,
    fontFamily: 'NeutrifPro-Regular',
    fontWeight: '600'
  },

  containerHome: [
    Style.container,
    {
      width: SCREEN_WIDTH,
      backgroundColor: colors.secondary,
      fontFamily: 'NeutrifPro-Regular'
    },
  ],

  scrollStyle: {
    padding: 0,
    margin: 0,
  },
  searchView: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 8,
    bottom: 0,
    marginStart: 16,
    marginEnd: 16,
    marginBottom: 24,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  SearchStyle: {
    width: '100%',
    justifyContent: 'center',
    padding: 0,
    alignSelf: 'flex-start',
    height: 36,
    marginStart: 6,
    backgroundColor: 'transparent',
    fontFamily: 'NeutrifPro-Regular'
  },
  iconSearch: {
    bottom: 0,
    right: 0,
    marginEnd: 16,
  },
  iconNotif: {
    marginStart: 54,
    marginRight: 16,
  },
  viewCoupon: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    backgroundColor: '#8B68D9',
    width: '100%',
    height: 60,
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,

  },
  TextCoupon: {
    color: '#FFFFFF',
    width: '100%',
    fontSize: 18,
    alignSelf: 'center',
    marginStart: 16,
    fontWeight: '400',
  },
  btnStyle: {
    width: 95,
    height: 30,
    marginEnd: 16,
    marginTop: SCREEN_WIDTH / 30,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    position: 'absolute',
    right: 0,
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
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  voucherView: {
    height: 64,
    width: SCREEN_WIDTH - 40,
    borderRadius: 16,
    marginLeft: 16,
    marginTop: 36,
    marginBottom: 36,
    marginRight: 16,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  voucherImage: {
    height: 28,
    width: 39,
    marginStart: 14,
  },
  voucherNotice: {
    fontWeight: '500',
    fontSize: 12,
    color: 'black',
  },
  btnStyleVoucher: {
    alignSelf:'flex-end',
    width:100,
  },
  textVoucherBtn: {
    color: 'white',
    height:25,
    backgroundColor: '#A57FF8',
    fontSize: 10,
    paddingRight: 4,
    borderRadius: 4,
    margin:8,
    alignItems:'center',
    textAlign:'center',
    textAlignVertical:'center',
    fontWeight: '400',
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
    margin: 50,
    color: 'white',
    fontWeight: '700',
  },
  kuisContainer: {
    height: 170,
    width: 340,
    borderRadius: 16,
    marginTop: 16,
    alignSelf: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  imageWomanHappy: {
    width: 105,
    height: 175,
    marginTop: 8,
    marginStart: 16,
    marginEnd: 8,
  },
  styleNoticeKuis: {
    flexDirection: 'column',
    marginStart: 0,
    marginTop: 16,
    justifyContent: 'center',
  },
  textNoticeKuis: {
    color: 'black',
    width: 200,
    alignSelf: 'flex-start',
    marginEnd: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  texbtnKuis: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    alignSelf: 'center',
    color: 'white',
  },
  btnKuis: {
    alignSelf: 'flex-end',
    borderRadius: 8,
    height: 24,
    marginTop: 16,
    marginEnd: 16,
    width: 70,
    backgroundColor: '#A57FF8'
  }
});
