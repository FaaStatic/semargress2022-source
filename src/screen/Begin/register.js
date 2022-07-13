import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Portal, Provider, TextInput, Modal } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../util/style';
import { Api } from '../../util/Api';
import { StackActions } from '@react-navigation/native';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import messaging from '@react-native-firebase/messaging';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';
import { colors } from '../../util/color';
import LinearGradient from 'react-native-linear-gradient';

var fcm_id = '';
var loginType = '';
var gender = 1;
export default function Register({ navigation, route }) {
  const { uid, email, foto, token, no_telp, otp, type, display_name, edit } = route.params;
  const windowWidth = Dimensions.get('window').width;
  const [radioBtn,setRadioBtn] = useState(true);
  const [dataUID, setDataUID] = useState('');
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [items, setItems] = useState([]);
  const [dateItems, setDateItems] = useState([
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    { label: '13', value: '13' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '17', value: '17' },
    { label: '18', value: '18' },
    { label: '19', value: '19' },
    { label: '20', value: '20' },
    { label: '21', value: '21' },
    { label: '22', value: '22' },
    { label: '23', value: '23' },
    { label: '24', value: '24' },
    { label: '25', value: '25' },
    { label: '26', value: '26' },
    { label: '27', value: '27' },
    { label: '28', value: '28' },
    { label: '29', value: '29' },
    { label: '30', value: '30' },
    { label: '31', value: '31' },
  ]);
  const [monthItems, setMonthItems] = useState([
    { label: 'Januari', value: '01' },
    { label: 'Februari', value: '02' },
    { label: 'Maret', value: '03' },
    { label: 'April', value: '04' },
    { label: 'Mei', value: '05' },
    { label: 'Juni', value: '06' },
    { label: 'Juli', value: '07' },
    { label: 'Agustus', value: '08' },
    { label: 'September', value: '09' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
  ]);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ktp, setKTP] = useState('');
  const [nama, setNama] = useState('');
  const [tmptlahir, setTmptLahir] = useState('');
  const [tgl, setTgl] = useState('');
  const [bln, setBln] = useState('');
  const [thn, setThn] = useState('');
  const [alamat, setAlamat] = useState('');
  const [txtEmail, setTxtEmail] = useState('');
  const [txtTelp, setTelp] = useState('');

  // Load data session
  const loadSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);

    if (session != null) {
      // if session is set already
      console.log('sessionlama ', session);
      loginType = session.type;
      setTxtEmail(session.email);
      setDataUID(session.uid);
    } else {
      const data = {
        uid: uid,
        token: token,
        email: email,
        type: type,
      };

      console.log('buatsession ', data);

      await SessionManager.StoreAsObject(sessionId, data);
      loginType = type;
      setDataUID(uid);
      setTxtEmail(email);
    }

    if (display_name != undefined) {
      setNama(display_name);
    }

    getGender();
  };

  useEffect(() => {
    if (edit) {
      navigation.setOptions({
        title: 'Profile',
      });
    }
    loadSession();
    checkToken();
    gender = 1;
    setRadioBtn(true);
    // disable local variable / function
    const unsubscribe = navigation.addListener('focus', () => {
      loadSession();
      checkToken();
      gender = 1;
    setRadioBtn(true);
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      fcm_id = fcmToken;
    }
  };

  // Get master gender
  const getGender = () => {
    Api.get('gender')
      .then(async (respon) => {
        let body = respon.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status === 200) {
          var data = [];
          response.forEach((element) => {
            data.push({
              label: element.jenis_kelamin,
              value: element.id,
            });
          });
          setItems(data);
        } else {
        }

        getDataProfile();
      })
      .catch((error) => {});
  };

  // get profile data
  const getDataProfile = () => {
    setLoading(true);

    Api.get('profile/view')
      .then(async (respon) => {
        setLoading(false);
        let body = respon.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status === 200) {
          setKTP(response.no_ktp);
          setNama(response.profile_name);
          setTmptLahir(response.tempat_lahir);
          setAlamat(response.alamat);
          setTxtEmail(response.email);
          gender = response.id_gender;
          if(gender == 1){
            setRadioBtn(true);
          }else{
            setRadioBtn(false);
          }
          let tglLahir = response.tgl_lahir.split('-');
          setThn(tglLahir[0]);
          setBln(tglLahir[1]);
          setTgl(tglLahir[2]);
          setTelp(response.no_telp);
        } else {
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const showAlert = () =>
    Alert.alert(
      'Konfirmasi',
      'Apakah anda yakin ingin menyimpan data',
      [
        {
          text: 'Tidak',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Iya',
          onPress: () => {
            if (loginType == 'SMS') {
              btnRegisterNomor();
            } else {
              if (edit) {
                editProfile();
              } else {
                btnRegisGoogle();
              }
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );

  const btnRegisGoogle = async () => {
    let data = {
      uid: dataUID,
      email: txtEmail,
      profile_name: nama,
      foto: foto,
      fcm_id: fcm_id,
      type: 'GOOGLE',
    };

    console.log(data);
    await Api.post('register', data)
      .then(async (res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status === 200) {
          let data = {
            token: response.token,
            uid: response.uid,
            email: response.email,
            type: loginType,
          };

          await SessionManager.StoreAsObject(sessionId, data);
          editProfile();
        } else {
          ShowError(metadata.message);
        }
      })
      .catch((err) => {
        console.log('err ', err);
        ShowError();
        //editProfile();
      });
  };

  const editProfile = async () => {
    let data = {
      no_ktp: ktp,
      email: txtEmail,
      profile_name: nama,
      tgl_lahir: `${thn}-${bln}-${tgl}`,
      no_telp: txtTelp,
      alamat: alamat,
      jenis_kelamin: gender,
      tempat_lahir: tmptlahir,
    };

    await Api.post('profile/edit', data)
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status === 200) {
          ShowSuccess(metadata.message);
          if (!edit || edit == undefined) {
            navigation.dispatch(StackActions.replace('RouterTab'));
          } else {
            //navigation.goBack();
          }
          //saveData(data);
        } else {
          ShowWarning(metadata.message);
        }
      })
      .catch((err) => {
        ShowError();
      });
  };

  const btnRegisterNomor = async () => {
    const data = {
      uid: dataUID,
      fcm_id: fcm_id,
      email: txtEmail,
      nik: ktp,
      profile_name: nama,
      tempat_lahir: tmptlahir,
      tgl_lahir: `${thn}-${bln}-${tgl}`,
      no_telp: txtTelp,
      alamat: alamat,
      jenis_kelamin: gender,
    };

    await Api.post('register_from_otp', data)
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status === 200) {
          let data = {
            token: response.token,
            uid: response.uid,
            email: response.email,
            type: 'SMS',
          };

          saveData(data);
          ShowSuccess(metadata.message);
        } else {
          ShowWarning(metadata.message);
        }
      })
      .catch((err) => {
        console.log('tes', err);
      });
  };

  const toastMsg = (value) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(value, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(value);
    }
  };

  const saveData = async (data) => {
    await SessionManager.StoreAsObject(sessionId, data);
    navigation.dispatch(StackActions.replace('RouterTab'));
  };

  const btnSkip = async () => {
    if (no_telp !== null) {
      const data = {
        token: token,
        uid: uid,
        username: no_telp,
        type: 'SMS',
      };
      saveData(data);
      navigation.dispatch(StackActions.replace('RouterTab'));
    } else {
      toastMsg('Mohon Data diisi dulu');
    }
  };

  const radioMen = () =>{
      gender = 1;
      setRadioBtn(!radioBtn);
      console.log(gender);

  }
 const radioWoman = () =>{
  gender = 0;
  setRadioBtn(!radioBtn);
  console.log(gender);
 }

  return (
    <Provider>
      <SafeAreaView style={style.container}>
        <ScrollView>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              style={style.modalStyle}
              contentContainerStyle={{
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  height: 300,
                  width: 300,
                  overflow: 'hidden',
                  borderRadius: 8,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    color: 'green',
                  }}
                >
                  Berhasil Registrasi!{' '}
                </Text>
              </View>
            </Modal>
          </Portal>
          <LinearGradient
            colors={['#FFC46C45', '#FFC46C45', '#ffffff']}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.5, y: 1.5 }}
            style={{
              borderRadius: 8,
              borderWidth: 1,
              height: 70,
              marginTop: '5%',
              marginBottom: '5%',
              marginStart: '5%',
              marginEnd: '5%',
              borderColor: '#F2994A',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <Image
                source={require('../../assets/notif.png')}
                style={{
                  height: 30,
                  width: 25,
                  marginStart: '8%',
                  marginEnd: '4%',
                  marginTop: '0.5%',
                }}
                resizeMode="contain"
              />
              <Text style={styles.regionTitle}>Isi Biodata diri sesuai dengan KTP anda</Text>
            </View>
          </LinearGradient>
<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  marginLeft:20,
    fontSize:16,
  marginBottom:8,

}}> Masukan NIK (Nomor Induk Kependudukan) </Text>
          <TextInput
            placeholder="NIK"
            maxLength={16}
            placeholderTextColor={'grey'}
            value={ktp}
            theme={themeText}
            onChangeText={(text) => setKTP(text)}
            keyboardType="number-pad"
           style={styles.title}
          />
<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  marginLeft:20,
  fontSize:16,
  marginBottom:8,

}}> Nama </Text>


          <TextInput
            selectionColor="grey"
            placeholderTextColor={'grey'}
            placeholder="Nama"
            value={nama}
            theme={themeText}
            onChangeText={(text) => setNama(text)}
            keyboardType="default"
            style={styles.title}
          />

<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  marginLeft:20,
  fontSize:16,
  marginBottom:20,

}}> Jenis Kelamin</Text>

<View style={{
  flexDirection:'column',
  marginStart:42,
}}>
    <View style={{
    flexDirection:'row',
    marginBottom:29,
   }}>
    <Pressable style={{
      height:20,
      width:20,
      backgroundColor:radioBtn ? '#6FCF97' :  "#f9f9f9"
    }}  onPress={radioMen}>
      <Entypo name='check' color={'white'} size={20}/>
    </Pressable>
    <Text style={{
      fontSize:16,
      fontWeight:'600',
      color:'black',
      marginStart:23,
    }}>
       Laki-Laki
    </Text>
   </View>
  <View style={{
    flexDirection:'row',
    marginBottom:29,
   }}>
    <Pressable style={{
      height:20,
      width:20,
      backgroundColor:radioBtn ?  "#f9f9f9" : '#6FCF97'
    }} onPress={radioWoman}>
      <Entypo name='check' color={'white'} size={20}/>
    </Pressable>
    <Text style={{
      fontSize:16,
      fontWeight:'600',
      color:'black',
      marginStart:23,
    }}>
       Perempuan
    </Text>
   </View>

</View>


          {/* <DropDownPicker
            placeholder="Pilih Jenis Kelamin"
            open={open}
            value={gender}
            items={items}
            onSelectItem={(item) => {
              setGender(item.value);
            }}
            setOpen={setOpen}
            setItems={setItems}
            stickyHeader={true}
            containerStyle={{
              marginStart: 24,
              marginEnd: 16,
              width: 250,
            }}
            style={styles.dropdown}
            dropDownContainerStyle={{
              borderColor: 'transparent',
              borderRadius: 0,
            }}
          /> */}
<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  fontSize:16,
  marginLeft:20,
  marginBottom:8,

}}> Tempat Lahir </Text>
          <TextInput
            placeholder="Tempat Lahir"
            value={tmptlahir}
            theme={themeText}
            placeholderTextColor={'grey'}
            onChangeText={(text) => setTmptLahir(text)}
            keyboardType="default"
            style={styles.title}
          />


          <Text style={styles.subTitle}> Tanggal Lahir (DD Month YYYY)</Text>

          <View
            style={{
              flexDirection: 'row',
              marginStart: 20,
              marginEnd: 20,
              marginBottom: 29,
              justifyContent: 'center',
            }}
          >
            <DropDownPicker
              placeholder="Tanggal"
              open={openDate}
              value={tgl}
              items={dateItems}
              onSelectItem={(item) => {
                setTgl(item.value);
              }}
              setOpen={setOpenDate}
              setItems={setDateItems}
              stickyHeader={true}
              containerStyle={{
                flex: 1,
              }}
              style={styles.dropdown}
              dropDownContainerStyle={{
                borderColor: 'transparent',
                borderRadius: 0,
              }}
            />

            <DropDownPicker
              placeholder="Bulan"
              open={openMonth}
              value={bln}
              items={monthItems}
              onSelectItem={(item) => {
                setBln(item.value);
              }}
              setOpen={setOpenMonth}
              setItems={setMonthItems}
              stickyHeader={true}
              containerStyle={{
                flex: 1,
              }}
              style={styles.dropdown}
              dropDownContainerStyle={{
                borderColor: 'transparent',
                borderRadius: 0,
              }}
            />

            <TextInput
              placeholder="Tahun"
              maxLength={4}
              value={thn}
              theme={themeText}
              onChangeText={(text) => setThn(text)}
              keyboardType="number-pad"
              style={styles.customYear}
            />
          </View>

<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  marginLeft:20,
  fontSize:16,
  marginBottom:20,

}}> Alamat</Text>
          <TextInput
            placeholder="Alamat"
            placeholderTextColor={'grey'}
            value={alamat}
            multiline={true}
            theme={themeText}
            onChangeText={(text) => setAlamat(text)}
            keyboardType="default"
            style={[styles.title,{
              height:100,
              textAlignVertical:'top'
            }]}
          />
<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  marginLeft:20,
  fontSize:16,
  marginBottom:20,

}}> Email</Text>
          <TextInput
            placeholder={txtEmail ? txtEmail : 'Email'}
            value={txtEmail}
            placeholderTextColor={'grey'}
            theme={themeText}
            disabled={loginType == 'GOOGLE' ? true : false}
            onChangeText={(text) => setTxtEmail(text)}
            keyboardType="default"
            style={styles.title}
          />
<Text style={{
  color:'black',
  fontFamily:'NeutrifPro-Reguler',
  fontWeight:'400',
  marginLeft:20,
  fontSize:16,
  marginBottom:20,

}}> Telepon</Text>
          <TextInput
            placeholder={txtTelp ? txtTelp : 'Nomor Telepon'}
            disabled={loginType == 'SMS' ? true : false}
            value={txtTelp}
            placeholderTextColor={'grey'}
            theme={themeText}
            onChangeText={(text) => setTelp(text)}
            keyboardType="number-pad"
            style={styles.title}
          />

          <View
            style={{
              marginTop: 16,
              marginEnd: 24,
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
         

            <Pressable style={{
              width:150,
              height:40,
              borderRadius:8,
              alignSelf:'center',
              marginBottom:16,
              justifyContent:'center',
              backgroundColor:'#A57FF8'
            }} onPress={showAlert}>
              <Text
                style={{
                  alignSelf:'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                Save
              </Text>
            </Pressable>

            {edit == undefined ||
              (!edit && (
                <Pressable onPress={btnSkip}>
                  <Text
                    style={{
                      color: '#828282',
                      fontSize: 16,
                      fontWeight:'400',
                      marginTop:8,
                      alignSelf:'center',
                      fontWeight: '800',
                      marginBottom:16,
                    }}
                  >
                    Cancel
                  </Text>
                </Pressable>
              ))}
          </View>
        </ScrollView>

        {loading && (
          <ActivityIndicator
            size="large"
            style={{
              backgroundColor: 'rgba(52, 52, 52, 0.6)',
              width: '100%',
              height: '100%',
              alignSelf: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
            }}
            animating={true}
          />
        )}
      </SafeAreaView>
    </Provider>
  );
}

const themeText = {
  colors: {
    placeholder: 'black',
    text: 'black',
    primary: '#F9F9F9',
    underlineColor: 'transparent',
    background: '#F9F9F9',
  },
  roundness:8,
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  regionTitle: {
    fontSize: 13,
    alignSelf: 'center',
    color: '400',
    color: '#F2994A',
    marginEnd: '2%',
    marginStart: '2%',
    fontFamily: 'NeutrifPro-Regular',
  },
  title: {
    backgroundColor: '#F9F9F9',
    marginStart: 20,
    marginEnd: 20,
    height: 46,
    borderRadius: 8,
    fontFamily: 'NeutrifPro-Regular',
    marginBottom: 40,
    color: 'black',
  },
  subTitle: {
    fontSize: 16,
    color: 'black',
    marginStart: 40,
    fontFamily: 'NeutrifPro-Regular',
    marginBottom: 8,
    marginTop: 8,
  },
  customDate: {
    backgroundColor: 'transparent',
    height: 45,
    flex: 1,
    color: 'black',
    fontFamily: 'NeutrifPro-Regular',
    textAlign: 'center',
  },
  customYear: {
    backgroundColor: 'transparent',
    height: 45,
    maxHeight: 50,
    fontFamily: 'NeutrifPro-Regular',
    flex: 1,
    color: 'black',
    textAlign: 'center',
  },
  dropdownTitle: {
    fontSize: 12,
    color: 'black',
    marginStart: 24,
    fontFamily: 'NeutrifPro-Regular',
    marginBottom: 8,
    marginTop: 8,
  },
  dropdown: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    borderRadius: 0,
    marginBottom: 8,
  },
});
