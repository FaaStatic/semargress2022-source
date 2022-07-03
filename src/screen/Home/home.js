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
} from 'react-native';
import Style from '../../util/style';
import { TextInput } from 'react-native-paper';
import { SessionManager } from '../../util/SessionManager';
import Icon from 'react-native-vector-icons/Ionicons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Api } from '../../util/Api';
import IconList from '../../util/ListItem/IconList';
import BannerList from '../../util/ListItem/BannerList';
import HomeMerchantList from '../../util/ListItem/HomeMerchantList';
import SpotWisataList from '../../util/ListItem/SpotWisataList';

export default function Home({ navigation, route }) {
  const [iconVisible, setIconVisible] = useState(false);
  const [category, setCategory] = useState([]);
  const [banner, setBanner] = useState([]);
  const [merchantPop, setMerchantPop] = useState([]);
  const [countKoupon, setCountKoupon] = useState(0);
  const [search, setSearch] = useState();
  const [spotWisata, setSpotWisata] = useState([]);
  useEffect(() => {
    checkSession();
    kategoriHome();
    jumlahCoupon();
    getBannerSlider();
    merchantPopuler();
    const unsubscribe = navigation.addListener('focus', () => {
      checkSession();
      kategoriHome();
      jumlahCoupon();
      getBannerSlider();
      merchantPopuler();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

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
        console.log('Kategori', res.data.response);
        let arr = splitArray(res.data.response);
        setCategory(arr);
        console.log('tes kategori', category);
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


  const moveCategory = (data) =>{
    navigation.navigate('DetailListCategory', {
      ...data
    });
    console.log('tesidk', data);
  }

const showAllDestination = () =>{

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
            height: 100,
            marginTop: 0,
            top: 0,
            width: '100%',
            position: 'absolute',
            flexDirection: 'row',
          }}
          resizeMode={'stretch'}
        />
        <View style={style.searchView}>
          <TextInput
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholder="Cari Merchant"
            theme={themeSearch}
            onFocus={() => setIconVisible(true)}
            onBlur={() => setIconVisible(false)}
            style={style.SearchStyle}
          />
          {!iconVisible && <Icon name="search" size={26} color="grey" style={style.iconSearch} />}
          {/* <Pressable style={style.iconNotif}>
            <Icon name="notifications" size={36} color="white" />
          </Pressable> */}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={style.viewCoupon}>
          <Text style={style.TextCoupon}>Jumlah E-Kupon Anda : {countKoupon}</Text>
          <Pressable style={style.btnStyle} onPress={()=>{navigation.navigate('EKupon')}}>
            <Text style={style.TextListCoupon}>Lihat E-kupon</Text>
          </Pressable>
        </View>

        <SafeAreaView style={style.listService}>
          <FlatList
            nestedScrollEnabled={true}
            data={category}
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            indicatorStyle={'#05245A'}
            renderItem={itemRender}
          />

          <View>
            <LinearGradient
              colors={['#F29836', '#FBEDB7', '#ffffff']}
              start={{ x: 0.0, y: 0.0 }}
              end={{ x: 1.5, y: 0.0 }}
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
        </SafeAreaView>

        <Text style={style.textBannerSmargress}>Event Semargress</Text>
        <SafeAreaView>
          <ScrollView>
            <FlatList
              nestedScrollEnabled={true}
              horizontal={true}
              data={banner}
              showsHorizontalScrollIndicator={false}
              renderItem={BannerList}
            />
          </ScrollView>
        </SafeAreaView>
        <SafeAreaView style={style.containerMerchant}>
          <Pressable style={style.btnAllMerchant}>
            <Text style={style.textAllMerchant}>Merchant Populer</Text>
            <SimpleIcon name="arrow-right" size={18} color={'black'} style={style.styleIconArrow} />
          </Pressable>
          <ScrollView>
            <FlatList nestedScrollEnabled={true}
            data={merchantPop.slice(0,10)}
            renderItem={HomeMerchantList}
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

        <SafeAreaView>
          <Text>Pariwisata Semarang</Text>
          <ScrollView>
            <FlatList
              nestedScrollEnabled={true}
              horizontal={true}
              data={spotWisata}
              showsHorizontalScrollIndicator={false}
              renderItem={SpotWisataList}
              // ListFooterComponent={showAllDestination}
            />
          </ScrollView>
        </SafeAreaView>
      </ScrollView>
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
  containerHome: [
    Style.container,
    {
      backgroundColor: '#0F2E63',
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
    width: 200,
    alignSelf: 'flex-start',
    height: 36,
    marginStart: 6,
    backgroundColor: 'transparent',
  },
  iconSearch: {
    marginTop: 4,
    marginStart: 6,
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
    color: 'white',
    fontSize: 18,
    marginStart: 16,
    fontWeight: 'bold',
  },
  btnStyle: {
    width: 100,
    height: 30,
    marginStart: 32,
    backgroundColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  TextListCoupon: {
    color: '#0F2E63',
    fontSize: 12,
    fontWeight: 'bold',
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
    height: 75,
    borderRadius: 16,
    elevation: 8,
    marginStart: 16,
    marginTop: 36,
    marginBottom: 36,
    marginEnd: 16,
    flexDirection: 'row',
  },
  voucherImage: {
    height: 55,
    width: 55,
    marginStart: 8,
    marginTop: 8,
  },
  voucherNotice: {
    fontWeight: 'bold',
    fontSize: 11,
    color: 'black',
    marginStart: 8,
    marginTop: 26,
  },
  btnStyleVoucher: {
    width: 80,
    height: 30,
    marginStart: 16,
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
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 3,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginStart: 16,
  },
  styleIconArrow: {
    marginTop: 5,
    position: 'absolute',
    right: 0,
    marginRight: 16,
  },
  textBannerSmargress: {
    fontSize: 28,
    alignSelf: 'center',
    margin: 56,
    color: 'white',
    fontWeight: 'bold',
  },
  kuisContainer: {
    height: 200,
    borderRadius: 16,
    marginStart: 16,
    marginEnd: 16,
    marginTop: 16,
    marginBottom:16,
    flexDirection: 'row',
  },
  imageWomanHappy: {
    width: 150,
    height: 175,
    marginTop: 24,
  },
  styleNoticeKuis: {
    flexDirection: 'column',
    marginStart:0,
    marginTop:16,
    justifyContent:'center',
  },
  textNoticeKuis:{
    alignItems:'center',
    color:'black',
    width:200,
    alignSelf:'flex-start',
    marginEnd:8,
    fontSize:18,
    fontWeight:'bold',
    textAlignVertical:'center'
  },
  texbtnKuis:{
    fontSize:12,
    fontWeight:'bold',
    marginTop:3,
    alignSelf:'center',
    color:'white',
  },
  btnKuis:{
    alignSelf:'flex-end',
    borderRadius:8,
    height:24,
    marginTop:16,
    marginEnd:16,
    width:100,
    backgroundColor:'#F29836'
  }
});
