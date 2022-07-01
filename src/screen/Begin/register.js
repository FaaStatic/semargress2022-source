import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { Portal, Provider, TextInput, Modal } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../util/style';
import { Api } from '../../util/Api';
import { StackActions } from '@react-navigation/native';
import { SessionManager } from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import messaging from '@react-native-firebase/messaging';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';

var fcm_id = '';
var loginType = '';
export default function Register({ navigation, route }) {
  const { uid, email, foto, token, no_telp, otp, type, display_name, edit } = route.params;

  const [dataUID, setDataUID] = useState('');
  const [open, setOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [gender, setGender] = useState(null);
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
    loadSession();
    checkToken();

    // disable local variable / function
    const unsubscribe = navigation.addListener('focus', () => {
      loadSession();
      checkToken();
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
    Api.get('profile/view')
      .then(async (respon) => {
        let body = respon.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status === 200) {
          setKTP(response.no_ktp);
          setNama(response.profile_name);
          setTmptLahir(response.tempat_lahir);
          setAlamat(response.alamat);
          setTxtEmail(response.email);
          setGender(response.id_gender);
          let tglLahir = response.tgl_lahir.split('-');
          setThn(tglLahir[0]);
          setBln(tglLahir[1]);
          setTgl(tglLahir[2]);
          setTelp(response.no_telp);
        } else {
        }
      })
      .catch((error) => {});
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
        }
      })
      .catch((err) => {
        console.log('err ', err);
        editProfile();
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

          <Text style={styles.regionTitle}>Isi Biodata diri sesuai dengan KTP anda</Text>

          <TextInput
            placeholder="NIK"
            maxLength={16}
            value={ktp}
            theme={themeText}
            onChangeText={(text) => setKTP(text)}
            keyboardType="number-pad"
            style={styles.title}
          />

          <TextInput
            selectionColor="grey"
            placeholder="Nama"
            value={nama}
            theme={themeText}
            onChangeText={(text) => setNama(text)}
            keyboardType="default"
            style={styles.title}
          />

          <Text style={styles.dropdownTitle}>Jenis Kelamin</Text>

          <DropDownPicker
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
          />

          <TextInput
            placeholder="Tempat Lahir"
            value={tmptlahir}
            theme={themeText}
            onChangeText={(text) => setTmptLahir(text)}
            keyboardType="default"
            style={styles.title}
          />

          <Text style={styles.subTitle}> Tanggal Lahir (dd mm yy)</Text>

          <View
            style={{
              flexDirection: 'row',
              marginStart: 20,
              marginEnd: 20,
              marginBottom: 8,
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

          <TextInput
            placeholder="Alamat"
            value={alamat}
            theme={themeText}
            onChangeText={(text) => setAlamat(text)}
            keyboardType="default"
            style={styles.title}
          />

          <TextInput
            placeholder={txtEmail ? txtEmail : 'Masukan Email'}
            value={txtEmail}
            theme={themeText}
            disabled={loginType == 'GOOGLE' ? true : false}
            onChangeText={(text) => setTxtEmail(text)}
            keyboardType="default"
            style={styles.title}
          />

          <TextInput
            placeholder={txtTelp ? txtTelp : 'Nomor Telepon'}
            disabled={loginType == 'SMS' ? true : false}
            value={txtTelp}
            theme={themeText}
            onChangeText={(text) => setTelp(text)}
            keyboardType="number-pad"
            style={styles.title}
          />

          <View
            style={{
              marginTop: 36,
              marginEnd: 24,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            {edit == undefined ||
              (!edit && (
                <Pressable onPress={btnSkip}>
                  <Text
                    style={{
                      color: 'grey',
                      fontSize: 14,
                      marginEnd: 36,
                      fontWeight: 'bold',
                    }}
                  >
                    Skip
                  </Text>
                </Pressable>
              ))}

            <Pressable onPress={showAlert}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                  fontWeight: 'bold',
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const themeText = {
  colors: {
    placeholder: 'black',
    text: 'black',
    primary: 'grey',
    underlineColor: 'transparent',
    background: 'transparent',
  },
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
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 24,
    color: 'black',
    marginStart: 24,
    marginBottom: 16,
  },
  title: {
    backgroundColor: 'transparent',
    marginStart: 24,
    marginEnd: 24,
    height: 45,
    marginBottom: 8,
    color: 'black',
  },
  subTitle: {
    fontSize: 12,
    color: 'black',
    marginStart: 24,
    marginBottom: 8,
    marginTop: 8,
  },
  customDate: {
    backgroundColor: 'transparent',
    height: 45,
    flex: 1,
    color: 'black',
    textAlign: 'center',
  },
  customYear: {
    backgroundColor: 'transparent',
    height: 45,
    maxHeight: 50,
    flex: 1,
    color: 'black',
    textAlign: 'center',
  },
  dropdownTitle: {
    fontSize: 12,
    color: 'black',
    marginStart: 24,
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
