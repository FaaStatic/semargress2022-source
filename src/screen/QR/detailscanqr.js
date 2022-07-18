import React, {useEffect, useState} from 'react';
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
  Alert,
  Switch,
  Modal,
  PermissionsAndroid
} from 'react-native';
import {Api} from '../../util/Api';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { colors } from '../../util/color';
import { ScrollView } from 'react-native-gesture-handler';
import CurrencyInput from 'react-native-currency-input';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';

const ScanQR = ({navigation, route}) => {
  
  const windowWidth = Dimensions.get('window').width;
  const [data, setData] = useState([]);
  const [nominal, setNominal] = useState(0);
  const [modalQR, setModalQR] = useState(false);
  const [isEnabledTunai, setIsEnabledTunai] = useState(true);
  const toggleSwitchTunai = () => {
    setIsEnabledTunai(previousState => !previousState)
    setIsEnabledNonTunai(previousState => !previousState)
  };
  const [isEnabledNonTunai, setIsEnabledNonTunai] = useState(false);
  const toggleSwitchNonTunai = () => {
    setIsEnabledNonTunai(previousState => !previousState)
    setIsEnabledTunai(previousState => !previousState)
  };

  // Load data session
  const loadSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          console.log("session ",session.token);
      }
  };

  useEffect(() => {
    
    loadSession();

    // disable local variable / function
    const unsubscribe = navigation.addListener('focus', () => {
      
      loadSession();
    });
    return () => {
      unsubscribe;
    };
    //getData();
  }, [navigation]);

const checkCamera =  async() => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Izin Kamera Aplikasi Semargres 2022",
            message:
              "Aplikasi Semargres 2022 membutuhkan izin Kamera",
            buttonNeutral: "Nanti Saja",
            buttonNegative: "Batal",
            buttonPositive: "Iya"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setModalQR(true);
        } else {
          ShowError("Izin Kamera Terlebih Dahulu");
        }
      } catch (err) {
        console.warn(err);
      }
    };




  const getData = (data) => {

      if(data != undefined){
        console.log(data.data)
        setModalQR(false);
      }

      var param = {
        hasil_scan: data.data,
        total_bayar: nominal,
        cara_bayar: isEnabledTunai ? 1 : 2
      }

      Api.post('user/scan_qrcode_v2', param)
      .then(async (respon) => {
          let body = respon.data;
          let metadata = body.metadata;
          let response = body.response;
          
          if(metadata.status === 200){
            ShowSuccess("Anda berhasil mendapatkan "+response.jumlah_kupon + " E-Kupon");
            navigation.navigate('RouterTab');
          }else{
            ShowError(metadata.message)
          }
      })
      .catch((error) => {
        ShowError("")
      })
  }

  const showAlert = () =>
        Alert.alert(
            "Konfirmasi",
            "Apakah anda yakin ingin menyimpan data",
            [
                {
                    text: "Tidak",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Iya",
                    onPress: () => {
                        if(loginType == 'SMS'){

                            btnRegisterNomor();
                        }else{
                            btnRegisGoogle();
                        }
                    }
                },
            ],
            {
                cancelable: true,
            }
    );

    const openCamera = () =>{
       checkCamera();
    }


  return (

      <SafeAreaView>
          <View
              style={styles.container}
          >
              {/* <TouchableOpacity
                  style={{ width: 54, height: 54 }}
                  onPress={() => {
                      navigation.goBack();
                  }}
              >
                  <SimpleIcon name="arrow-left" size={18} color={colors.white} style={{
                      marginTop: 10,
                      marginLeft: 24,
                  }} />
              </TouchableOpacity> */}

              <ScrollView
                  style={styles.mainContainer}
              >

                  <View
                      style={{
                          padding: 28,
                      }}
                  >

                      <Text style={styles.mainTitle} >Pembayaran</Text>

                      <Text style={[{ marginTop: 30 }, styles.subTitle]} >Masukkan Nominal Belanja</Text>

                      <CurrencyInput
                          onChangeValue={setNominal}
                          value={nominal}
                          prefix=""
                          delimiter='.'
                          separator=','
                          precision={0}
                          onChangeText={(formattedValue) => {
                              console.log(nominal)
                          }}
                          style={{
                              fontSize: 40,
                              fontWeight: '600',
                              width: '100%',
                              color:'#333333',
                              alignItems: 'center',
                              textAlign: 'center'
                          }}
                      />

                      <View
                          style={{ backgroundColor: colors.black3, width: '100%', height: 1 }}
                      ></View>

                      <Text style={[{ marginTop: 30 }, styles.subTitle]} >Pilih Cara Bayar</Text>

                      <View
                          style={{
                              width: '100%',
                              flexDirection: 'column',
                              marginTop: 30,
                          }}
                      >

                          <View
                              style={{
                                  flexDirection: 'row',
                                  flex: 1,
                              }}
                          >

                              <Text style={styles.subTitle2} >Tunai</Text>

                              <Switch
                                  style={{ flex: 1, marginRight: 30, transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                                  trackColor={{ false: "#767577", true: "#C3FFDC" }}
                                  thumbColor={isEnabledTunai ? "#27AE60" : "#f4f3f4"}
                                  ios_backgroundColor="#C3FFDC"
                                  onValueChange={toggleSwitchTunai}
                                  value={isEnabledTunai}
                              ></Switch>
                          </View>

                          <View
                              style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  marginTop: 30,
                              }}
                          >

                              <Text style={styles.subTitle2} >Non Tunai</Text>

                              <Switch
                                  style={{ flex: 1, marginRight: 30, transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                                  trackColor={{ false: "#767577", true: "#C3FFDC" }}
                                  thumbColor={isEnabledNonTunai ? "#27AE60" : "#f4f3f4"}
                                  ios_backgroundColor="#C3FFDC"
                                  onValueChange={toggleSwitchNonTunai}
                                  value={isEnabledNonTunai}
                              ></Switch>
                          </View>
                      </View>

                      <TouchableOpacity
                          style={{
                              width: '60%',
                              marginTop: 50,
                              marginLeft: 30,
                              marginRight: 30,
                              backgroundColor: '#A57FF8',
                              alignSelf: 'center',
                              alignItems: 'center',
                              borderRadius: 12
                          }}

                          onPress={() => {
                                openCamera();
                             
                          }}
                      >
                          <Text
                              style={{
                                  color: colors.white,
                                  padding: 10,
                                  width:'100%',
                                  textAlign:'center',
                              }}
                          >Lanjutkan Scan QR</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                          style={{
                              width: '60%',
                              marginTop: 30,
                              marginLeft: 30,
                              marginRight: 30,
                              borderColor: '#828282',
                              alignSelf: 'center',
                              alignItems: 'center',
                              borderRadius: 5
                          }}

                          onPress={() => {

                              navigation.goBack();
                          }}
                      >
                          <Text
                              style={{
                                  color: '#828282',
                                  padding: 10,

                              }}
                          >Batal</Text>
                      </TouchableOpacity>
                  </View>
              </ScrollView>

              <Modal
                  visible={modalQR}
                  animationType="fade"
                  onDismiss={() => setModalQR(false)}
                  style={styles.modalStyle}
                  contentContainerStyle={{
                      borderRadius: 16,
                  }}
              >
                  <QRCodeScanner
                      onRead={(data) => { getData(data) }}
                      cameraStyle={{
                          width: '100%',
                          height: '100%',
                      }}
                      containerStyle={{
                          width: '100%',
                          height: '100%',
                      }}
                      bottomContent={
                          <TouchableOpacity
                              style={styles.buttonTouchable}>
                          </TouchableOpacity>
                      }
                  />


                  <TouchableOpacity
                      style={{
                          position: 'absolute',
                          marginTop: 10,
                          marginLeft: 10,
                      }}

                      onPress={() => setModalQR(false)}
                  >

                      <SimpleIcon name="arrow-left" size={18} color={colors.white} style={{
                          marginTop: 24,
                          marginLeft: 24,
                      }} />

                  </TouchableOpacity>

                  <Image
                    source={require('../../assets/qrframe.png')}
                    style={{
                        position:'absolute',
                        alignSelf:'center',
                        marginVertical:'50%',
                        resizeMode:'contain',
                        width:windowWidth*2/3,
                        height:windowWidth*2/3,
                        tintColor:colors.white,
                    }}
                  >

                  </Image>
              </Modal>
          </View>
      </SafeAreaView>
  );
};

export default ScanQR;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
    // justifyContent: 'center',
  },
  imageHeder: {
    marginTop: 0,
    top: 0,
    width: '100%',
    height:'10%',
    resizeMode:'stretch',
    position: 'absolute',
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 28,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor:'#FB44A0'
  },
  mainContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius:12,
    borderTopRightRadius:12,
    width: '100%',
    height: '100%',
    position: 'absolute',
    marginTop: 42
  },
  mainTitle: {
    fontWeight:'600',
    fontSize:20,
    color:colors.black3,
    marginTop:'3%',
    alignSelf:'center'
  },
  subTitle: {
    marginTop : 30,
    color : colors.black3,
    fontSize : 15,
    fontWeight: '400',
  },
  subTitle2: {
    color:colors.black3,
    fontSize:16,
    flex:1
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  modalStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    width:'80%',
    height:'80%',
  },
});
