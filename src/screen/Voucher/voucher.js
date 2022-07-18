import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Button,
  Alert
} from 'react-native';
import { Api } from '../../util/Api';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { colors } from '../../util/color';
import { ScrollView } from 'react-native-gesture-handler';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';

const windowWidth = Dimensions.get('window').width;
const defaultMargin = 20;

const Voucher = ({ navigation, route }) => {

  const { id } = route.params;
  const [data, setData] = useState([]);
  const [bgImage, setBgImage] = useState(0);
  const images = {
    logos: {
      0: require('../../assets/vector_1.png'),
      1: require('../../assets/vector_2.png'),
      2: require('../../assets/vector_3.png'),
      3: require('../../assets/vector_4.png'),
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSNK, setIsOpenSNK] = useState(false);

  // Load data session
  const loadSession = async () => {

    setBgImage(id % 4);

    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {
      //console.log("session ",session.token);
      getData();
    }
  };

  useEffect(() => {

    // disable local variable / function
    const unsubscribe = navigation.addListener('focus', () => {

      loadSession();
    });
    return () => {
      unsubscribe;
    };
    //getData();
  }, [navigation]);

  const getData = () => {

    console.log("id ne", id);
    let param = {
      id_voucher: id
    }
    Api.post('user/detail_voucher', param)
      .then(async (respon) => {
        let body = respon.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status == 200) {
          setData(response.voucher);

        } else {

        }
      })
      .catch((error) => {

      })
  }

  const useVoucher = () => {

    let param = {
      id: id
    }
    Api.post('user/voucher/use', param)
      .then(async (respon) => {

        let body = respon.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status == 200) {
          ShowSuccess(metadata.message);
          navigation.goBack();
        } else {
          ShowWarning(metadata.message);
        }
      })
      .catch((error) => {
        ShowError();
      })
  }

  const showAlert = () =>
    Alert.alert(
      "Konfirmasi",
      "Apakah anda yakin ingin memakai voucher ini?",
      [
        {
          text: "Tidak",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Iya",
          onPress: () => {
              useVoucher();
          }
        },
      ],
      {
        cancelable: true,
      }
    );

  function currencyFormat(num) {

    if(num == undefined){
      
      return 0;
    }
    return 'Rp '+Number(num).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  return (

    <SafeAreaView>
      <View
        style={styles.container}
      >

        <View
          style={{
            width: windowWidth - 40,
            height: windowWidth / 2.5,
            margin: defaultMargin,
            backgroundColor: 'red',
            borderRadius: 12,
          }}
        >
          <Image
            source={{ uri: data.image }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              borderRadius: 12,
            }}
          ></Image>

          <Image
            source={images.logos[bgImage]}
            style={{
              width: '70%',
              height: '100%',
              right: 0,
              position: 'absolute',
              resizeMode: 'contain',
              borderRadius: 12,
            }}
          ></Image>

          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 30,
              height: 30,
              right: 0,
              marginTop: 10,
              marginRight: 10,
              backgroundColor: colors.white,
              position: 'absolute',
              resizeMode: 'contain',
              borderRadius: 15,
            }}
          ></Image>

          <View
            style={{
              width: '58%',
              height: '100%',
              alignItems: 'flex-start',
              right: 0,
              padding: defaultMargin,
              color: colors.white,
              position: 'absolute',
              resizeMode: 'contain',
            }}
          >
            <Text
              style={{
                width: '100%',
                marginTop: '16%',
                fontSize: 20,
                fontWeight:'700',
                color: colors.white,
              }}
              numberOfLines={1}
            >{data.nama_merchant}</Text>

            <Text
              style={{
                width: '100%',
                fontSize: 14,
                color: colors.white,
                marginTop: 4,
              }}
              numberOfLines={1}
            >{data.tipe == 'P' ? 'Diskon' : 'Potongan'}</Text>

            <Text
              style={{
                width: '100%',
                fontSize: 20,
                fontWeight:'600',
                color: colors.white,
                marginTop: 4,
              }}
              numberOfLines={1}
            >{data.tipe == 'P' && data.tipe != undefined ? data.nominal+ "% OFF" :  currencyFormat(data.nominal) }</Text>
          </View>

        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginBottom:100,
          }}
        >

          <Text
            style={{
              width: '100%',
              color:colors.black3,
              marginLeft:defaultMargin,
              marginRight:defaultMargin,
              fontSize:20,
              fontWeight:'600',
            }}
          >
            {data.nama_voucher}
          </Text>

          <Text
            style={{
              width: '100%',
              color:colors.black3,
              marginLeft:defaultMargin,
              marginRight:defaultMargin,
              fontSize:14,
              marginTop:2,
              fontWeight:'400',
            }}
          >
            {data.nama_merchant}
          </Text>

          <View style={styles.line}></View>

          <View
            style={{
              margin:defaultMargin,
            }}
          >
            <View
              style={{
                flexDirection:'row',
                width:'100%',
              }}
            >

              <Text
                style={{
                  width: '100%',
                  color:colors.black3,
                  fontSize:18,
                  fontWeight:'600',
                }}
              >Detail dan Cara Penggunaan</Text>

              <TouchableOpacity
                style={{
                  position:'absolute',
                  right:0,
                }}
                onPress={()=>{
                  setIsOpen(!isOpen);
                }}
              >
                <SimpleIcon name={isOpen ? "arrow-up" : "arrow-down"} size={18} color={colors.black} style={{}} />
              </TouchableOpacity>

            </View>

            {isOpen && 

              <Text
                style={{
                  width: '100%',
                  marginTop:10,
                  fontSize:15,
                  fontWeight:'400',
                  color:colors.black3,
                }}
              >{data.syarat}</Text>
            }
          </View>

          <View style={[styles.line,{marginTop:0}]}></View>

          <View
            style={{
              margin:defaultMargin,
            }}
          >
            <View
              style={{
                flexDirection:'row',
                width:'100%',
              }}
            >

              <Text
                style={{
                  width: '100%',
                  color:colors.black3,
                  fontSize:18,
                  fontWeight:'600',
                }}
              >Syarat dan Ketentuan</Text>

              <TouchableOpacity
                style={{
                  position:'absolute',
                  right:0,
                }}
                onPress={()=>{
                  setIsOpenSNK(!isOpenSNK);
                }}
              >
                <SimpleIcon name={isOpenSNK ? "arrow-up" : "arrow-down"} size={18} color={colors.black} style={{}} />
              </TouchableOpacity>

            </View>

            {isOpenSNK && 

              <Text
                style={{
                  width: '100%',
                  marginTop:10,
                  fontSize:15,
                  fontWeight:'400',
                  color:colors.black3,
                }}
              >{data.snk}</Text>
            }
          </View>
          
        </ScrollView>
        
        <View
          style={{
            
            bottom:0,
            width:'100%',
            height:100,
            elevation:2,
            shadowColor:colors.black,
            borderTopRightRadius:20,
            borderTopLeftRadius:20,
            borderColor:colors.black3,
            flexDirection:'row',
            alignItems:'center',
            padding:defaultMargin,
          }}
        >

          <View style={{flex:1,}} >
              <Text>Berlaku Hingga</Text>
              <Text style={{color:'#B60D00', fontSize:18, fontWeight:'600'}}>{moment(data.valid_end,"YYYY-MM-DD hh:mm:ss").format("DD MMMM YYYY")}</Text>
          </View>

          <View style={{right:0}} >
            <TouchableOpacity
              style={{
                backgroundColor:colors.yellow2,
                padding:10,
                paddingLeft:15,
                paddingRight:15,
                borderRadius:8
              }}

              onPress={()=>{
                showAlert()
              }}
            >
                <Text
                  style={{
                    color:colors.white,
                    fontWeight:'500',
                  }}

                >Pakai Voucher</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Voucher;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: defaultMargin,
    backgroundColor: 'white',
    flexDirection: 'column',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 28,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  line :
  { 
    backgroundColor: '#F2F2F2', 
    width: '100%', 
    height: 3,
    marginTop:15,
  }
});
