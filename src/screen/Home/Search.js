import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  PermissionsAndroid,
  Text,
  View,
  Pressable,
  Platform
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Api } from '../../util/Api';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';
import MerchanList from '../../util/ListItem/MerchantList';
import { BallIndicator } from 'react-native-indicators';
import { colors } from '../../util/color';
let latitude = 0;
let longitude = 0;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
export default function Search({ navigation, route }) {
  const [iconVisible, setIconVisible] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState([]);
  const [dataKosong, setDataKosong] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    GrantLocation();
    setTextInput('');
    const subscribe = navigation.addListener('focus', () => {
      GrantLocation();
      setTextInput('');
    });

    return () => {
      subscribe;
    };
  }, [navigation, GrantLocation]);

  const currentLocation = () => {
    setLoading(true)
    try {
      Geolocation.getCurrentPosition(
        async (pos) => {
          const datalatitude = pos.coords.latitude;
          const datalongitude = pos.coords.longitude;
          latitude = datalatitude;
          longitude = datalongitude;
          onSearch();
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
          title: 'Semargres Meminta Izin Lokasi',
          message:
            'Semargres Membutuhkan akses lokasi untuk menyesuaikna merchant terdekat pengguna',
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

  const onSearch = async () => {
    await Api.post('merchant/nearby_with_ads/', {
      latitude: latitude,
      longitude: longitude,
      start: 0,
      count: 10,
      jarak: 50,
      kategori: '',
      keyword: textInput,
    })
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        if (metadata.status === 200) {
          console.log('statusresponse', response);
          setResponse(response);
          setDataKosong(true);
          ShowSuccess(metadata.message);
          setLoading(false);
        } else if (metadata.status === 401) {
          setResponse([]);
          ShowWarning(metadata.message);
          setDataKosong(false);
          setMsg(metadata.message);
          console.log(metadata.message);
          setLoading(false);
        } else {
          setResponse([]);
          setDataKosong(false);
          setMsg(metadata.message);
          ShowWarning(metadata.message);
          console.log(metadata.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        ShowError(metadata.message);
        console.log(err);
        setLoading(false);
      });
  };

  const moveDetail = (value) => {
    navigation.navigate('DetailMerchant', {
      id_m: value.id_m,
    });
  };

  const itemRender = useCallback(({ item }) => {
    if (item.flag_tipe === 'merchant') {
      return <MerchanList item={item} pressCall={moveDetail} />;
    }
  });

  return (
    <SafeAreaView style={style.container}>

      <View style={style.containerHeader}>

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
            selectionColor="grey"
            autoFocus={true}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholder="Cari Merchant"
            theme={themeSearch}
            onFocus={() => setIconVisible(true)}
            onBlur={() => setIconVisible(false)}
            value={textInput}
            onChangeText={(Value) => {
              setTextInput(Value);
            }}
            style={style.SearchStyle}
            onSubmitEditing={currentLocation}
          />
          {!iconVisible ? <Icon name="search" size={26} color="grey" style={style.iconSearch} /> : <Icon name="search" size={26} color="white" style={style.iconSearch} />}
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.white,
          marginTop:-16,
          borderTopRightRadius:16,
          borderTopLeftRadius:16,
          width:'100%',
          flex:1,
        }}
      >

        {loading ? (
          <BallIndicator
            size={60}
            color={'#0F2E63'}
            style={{
              marginTop: '10%',
              alignSelf: 'center',
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
            }}
          >
            {dataKosong ? (
              <FlatList
                data={response}
                renderItem={itemRender}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                keyExtractor={(item, index) => {
                  index.toString();
                }}
                numColumns={2}
                contentContainerStyle={style.flatContainer}
                style={style.flatlistStyle}
              />
            ) : (
              <View
                style={{
                  height: '100%',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: '800',
                    color: 'black',
                    fontFamily: 'NeutrifPro-Regular',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                >
                  Tidak Ditemukan Merchant Terdekat :"(
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <Pressable
        style={ Platform.OS === 'ios' ? {
          height: 30,
          width: 30,
          position: 'absolute',
          left: 0,
          top: 0,
          marginTop: SCREEN_HEIGHT/9.5, 
          marginLeft: 16,
        } : {
          height: 30,
          width: 30,
          position: 'absolute',
          left: 0,
          top: 0,
          marginTop: 40,
          marginLeft: 16,
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <IonIcon name="chevron-back" size={28} color={'white'} />
      </Pressable>
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
  flatContainer: {
    marginTop: '5%',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    fontFamily: 'NeutrifPro-Regular',
  },
  flatlistStyle: {
    fontFamily: 'NeutrifPro-Regular',
  },
  container: {
    flex: 1,
    height: '100%',
    fontFamily: 'NeutrifPro-Regular',
    flexDirection: 'column',
    backgroundColor: colors.secondary,
    justifyContent: 'center',
  },
  containerHeader: {
    height: 120,
    backgroundColor: '#0F2E63',
  },
  styleIcon: {
    height: 30,
    width: 30,
    position: 'absolute',
    left: 0,
    top: 0,
    marginTop: 40,
    marginLeft: 20,
  },
  searchView: {
    borderRadius: 16,
    backgroundColor: 'white',
    position: 'absolute',
    borderRadius: 8,
    marginTop:40,
    marginStart: "15%",
    marginEnd: 16,
    marginBottom: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  SearchStyle: {
    width: '85%',
    // backgroundColor:'green',
    alignSelf: 'flex-start',
    height: 36,
    marginStart: 6,
    marginEnd: 6,
    backgroundColor: 'transparent',
  },
  iconSearch: {
    marginTop: 4,
    marginStart: 6,
  },
});
