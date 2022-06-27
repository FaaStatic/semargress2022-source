import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Text, 
    View, 
    Pressable, 
    StyleSheet,
    ScrollView
} from 'react-native';
import {Portal, Provider, TextInput, Modal} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../util/style'; 
import { Api } from '../../util/Api';
import {StackActions} from '@react-navigation/native';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import messaging from '@react-native-firebase/messaging';
import {ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';

var fcm_id = "";
var loginType = "";
export default function Register({navigation, route}) {
    
    const { uid, email, foto, token, no_telp, otp, type } = route.params;

    const [dataUID, setDataUID] = useState('');
    const [open, setOpen] = useState(false);
    const [gender, setGender] = useState(null);
    const [items, setItems] = useState([]);

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
        
        if(session != null){
            
            // if session is set already
            console.log("datasession", session)
            loginType = session.type;
            setDataUID(session.uid);
        }else{
            const data = {
                uid : uid,
                token : token,
                email : email,
                type : type
              }
               
            await SessionManager.StoreAsObject(sessionId, data);
            loginType = type;
            setDataUID(uid);
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
          console.log("fcm ", fcm_id);
        }
      };

    // Get master gender
    const getGender = () => {

        Api.get('gender')
        .then(async (respon) => {
            let body = respon.data;
            let metadata = body.metadata;
            let response = body.response;
            
            if(metadata.status === 200){
            
                var data = [];
                response.forEach(element => {
                    data.push({
                        label : element.jenis_kelamin,
                        value : element.id
                    })
                });
                setItems(data);
            }else{
              
            }

            getDataProfile();
        })
        .catch((error) => {
            
        })
    }

    // get profile data
    const getDataProfile = () => {

        //console.log(param)
        Api.get('profile/view')
        .then(async (respon) => {
            let body = respon.data;
            let metadata = body.metadata;
            let response = body.response;
            console.log("dataprofile", response)
            
            if(metadata.status === 200){
            
                setKTP(response.no_ktp);
                setNama(response.profile_name);
                setTmptLahir(response.tempat_lahir);
                setAlamat(response.alamat);
                setTxtEmail(response.email);
                setGender(response.id_gender);
                setTelp(response.no_telp);
            }else{
              
            }
        })
        .catch((error) => {
            
        })
    }

    const btnRegisGoogle = async () => {
        let data = {
            uid: uid,
            email: email,
            profile_name: nama,
            foto: foto,
            fcm_id: fcm_id,
            type: "Google"
        }

        console.log("datagoogle", data);
        // await Api.post('register', {
        //     data
        // }, {
        //     headers: {
        //         'Username': email,
        //         'Uid': uid,
        //         'Token': token,
        //     }
        // }).then(res => {
        //     let msg = res.data.response.message;
        //     let data = {
        //         token: res.data.response.token,
        //         uid: res.data.response.uid,
        //         email: res.data.response.email,
        //         fcm_id: fcm_id,
        //     }
        //     SessionManager.StoreAsObject(sessionId, data);
        //     navigation.dispatch(StackActions.replace('RouterTab'), { msg });
        // }).catch(err => {

        // })
    }

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
            jenis_kelamin: gender
        }

        await Api.post('register_from_otp', data)
        .then(res => {

            let body = res.data;
            let metadata = body.metadata;
            let response = body.response;
            
            if(metadata.status === 200){
            
                let data = {
                    token: response.token,
                    uid: response.uid,
                    email: response.email,
                    type : "SMS"
                }
                
                saveData(data);
                ShowSuccess(metadata.message);
            }else{
                
                ShowWarning(metadata.message);
            }
            
        }).catch(err => {
            console.log('tes', err);
        })
    }

    const toastMsg = (value) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(value, ToastAndroid.SHORT)
        } else {
            AlertIOS.alert(value);
        }
    }

    const saveData = async (data) => {
        await SessionManager.StoreAsObject(sessionId, data);
        //navigation.dispatch(StackActions.replace('RouterTab'));
    }


    const btnSkip = async () => {
        if (no_telp !== null) {
            const data = {
                token: token,
                uid: uid,
                username: no_telp,
                fcm_id: fcm_id,
            }
            saveData(data);
            navigation.dispatch(StackActions.replace('RouterTab'));
        } else {
            toastMsg("Mohon Data diisi dulu");
        }
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
                            }}>
                            <View style={{ justifyContent: 'center', height: 300, width: 300, overflow: 'hidden', borderRadius: 8, justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: 24,
                                    color: 'green',
                                }}>Berhasil Registrasi! </Text>
                            </View>
                        </Modal>
                    </Portal>

                    <Text style={styles.regionTitle}>Isi Biodata diri sesuai dengan KTP anda</Text>

                    <TextInput
                        placeholder='NIK'
                        maxLength={16}
                        value={ktp}
                        onChangeText={(text) => setKTP(text)}
                        keyboardType="number-pad"
                        style={styles.title} />

                    <TextInput
                        selectionColor='grey'
                        placeholder='Nama'
                        value={nama}
                        onChangeText={(text) => setNama(text)}
                        keyboardType="default"
                        style={styles.title} />

                    <Text style={styles.dropdownTitle}>Jenis Kelamin</Text>

                    <DropDownPicker
                        placeholder="Pilih Jenis Kelamin"
                        open={open}
                        value={gender}
                        items={items}
                        onSelectItem={(item)=>{
                            setGender(item.value)
                        }}
                        setOpen={setOpen}
                        setItems={setItems}
                        stickyHeader={true}
                        containerStyle={{
                            marginStart: 24,
                            marginEnd: 16,
                            width: 250,
                        }}
                        style={{
                            borderColor: 'transparent',
                            backgroundColor: 'transparent',
                            borderBottomWidth: 1,
                            borderBottomColor: 'grey',
                            borderRadius: 0,
                            marginBottom: 8,
                        }}
                        dropDownContainerStyle={{
                            borderColor: 'transparent',
                            borderRadius: 0,
                        }}
                    />

                    <TextInput
                        placeholder='Tempat Lahir'
                        value={tmptlahir}
                        onChangeText={(text) => setTmptLahir(text)}
                        keyboardType="default"
                        style={styles.title} />

                    <Text style={styles.subTitle}> Tanggal Lahir (dd mm yy)</Text>
                    
                    <View style={{
                        flexDirection: 'row',
                        marginStart: 20,
                        marginEnd: 20,
                        marginBottom: 8,
                        justifyContent: 'center',
                    }}>
                        <TextInput
                            maxLength={2}
                            placeholder='Tanggal'
                            value={tgl}
                            onChangeText={(text) => setTgl(text)}
                            keyboardType="number-pad"
                            style={styles.customDate} />

                        <TextInput
                            placeholder='Bulan'
                            maxLength={2}
                            value={bln}
                            onChangeText={(text) => setBln(text)}
                            keyboardType="number-pad"                        
                            style={styles.customDate} />

                        <TextInput
                            placeholder='Tahun'
                            maxLength={4}
                            value={thn}
                            onChangeText={(text) => setThn(text)}
                            keyboardType="number-pad"
                            style={styles.customDate}/>
                    </View>

                    <TextInput
                        placeholder='Alamat'
                        value={alamat}
                        onChangeText={(text) => setAlamat(text)}
                        keyboardType="default"
                        style={styles.title}/>

                    <TextInput
                        placeholder={email ? email : "Masukan Email"}
                        value={txtEmail}
                        disabled={email ? true : false}
                        onChangeText={(text) => setTxtEmail(text)}
                        keyboardType="default"
                        style={styles.title} />

                    <TextInput
                        placeholder={txtTelp ? txtTelp : 'Nomor Telepon'}
                        disabled={txtTelp ? true : false}
                        value={txtTelp}
                        onChangeText={(text) => setTelp(text)}
                        keyboardType="number-pad"
                        style={styles.title}/>

                    <View style={{
                        marginTop: 36,
                        marginEnd: 24,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>

                        <Pressable
                            onPress={btnSkip}>
                            <Text style={{
                                color: 'grey',
                                fontSize: 14,
                                marginEnd: 36,
                                fontWeight: 'bold',
                            }}>
                                Skip
                            </Text>

                        </Pressable>

                        <Pressable
                            onPress={loginType == "SMS" ? btnRegisterNomor : btnRegisGoogle}>
                            <Text style={{
                                fontSize: 14,
                                color: 'red',
                                fontWeight: 'bold',
                            }}>
                                Save
                            </Text>

                        </Pressable>

                    </View>

                </ScrollView>
            </SafeAreaView>
        </Provider>
    );
}

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
    },
    subTitle : {
        fontSize: 12,
        color: 'black',
        marginStart: 24,
        marginBottom: 8,
        marginTop: 8,
    },
    customDate:{
        backgroundColor: 'transparent',
        height: 45,
        flex: 1,
        color: 'black',
        textAlign: 'center' 
    },
    dropdownTitle: {
        fontSize: 12,
        color: 'black',
        marginStart: 24,
        marginBottom: 8,
        marginTop: 8,
    }
  });
