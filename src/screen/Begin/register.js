import React, { useState } from 'react';
import {SafeAreaView, Text, View, Pressable } from 'react-native';
import {Portal, Provider, TextInput, Modal} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../util/style'; 
import { regisApi } from '../../util/Api';
import {StackActions} from '@react-navigation/native';

export default function Register({navigation, route}) {
const {uid, email, foto, fcm_id, no_telp, otp} = route.params;

 const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [items, setItems] = useState([
    {label: 'Laki-Laki', value: 1,},
    {label: 'Perempuan', value: 2,}
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


  const btnRegisGoogle = async () => {
    let data = {
     uid : uid,
	email : email,
	profile_name : nama,
	foto : foto,
	fcm_id : fcm_id,
	type : "Google"
    }
    await regisApi(profile_name, uid, token).post('register',{
        data
    }).then(res => {
        let msg = res.data.response.message;
        let data = {
            token : res.data.response.token,
            uid : res.data.response.uid,
            email : res.data.response.email,
            fcm_id : fcm_id
          }
          let session = JSON.stringify(data);
          AsyncStorage.setItem('session_id', session);
          navigation.dispatch(StackActions.replace('RouterTab'),{msg});
    }).catch(err => {

    })
  }

  const btnRegisterNomor = async () => {
    let data = {
        uid: uid,
        fcm_id: fcm_id,
        email: txtEmail,
        nik: ktp,
        profile_name: nama,
        tempat_lahir: tmptlahir,
        tgl_lahir: `${thn}-${bln}-${tgl}`,
        no_telp: no_telp,
        alamat: alamat,
        jenis_kelamin: gender ,
       }
     await regisApi(profile_name, uid, token).post('register_from_otp', {
        data
     }).then(res => {
        let data = {
            token : res.data.response.token,
            uid : res.data.response.uid,
            email : res.data.response.email,
            fcm_id : fcm_id
          }
          console.log("Tes",res);
          let session = JSON.stringify(data);
          AsyncStorage.setItem('session_id', session);
          navigation.dispatch(StackActions.replace('RouterTab'));
     }).catch(err => {
        console.log('tes',err);
     })
  }




  return (
    <Provider>
        <SafeAreaView  style={style.container}>
        <Portal>
        <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={style.modalStyle}
            contentContainerStyle={{
              borderRadius: 16,
            }}>
            <View style={{justifyContent: 'center', height : 300, width : 300, overflow : 'hidden', borderRadius:8, justifyContent:'center'}}>
              <Text style={{
                fontSize: 24,
                color : 'green',
              }}>Berhasil Registrasi! </Text>
            </View>
          </Modal>

        </Portal>
<Text style={{
            fontSize:12,
            alignSelf:'center',
            marginTop: 1,
            color:'black',
            marginStart: 24,
            marginBottom: 16,
        }}>Isi Biodata diri sesuai dengan KTP anda</Text>
        <TextInput 
        selectionColor='grey'
        placeholder='NIK'
        placeholderTextColor={'grey'}
        onChangeText={(text) => setKTP(text) }
        activeUnderlineColor='transparent'
        keyboardType="number-pad" 
        mode='flat' 
        theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'black', 
                underlineColor: 'transparent',
                background: 'transparent',
                
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 24,
            marginEnd: 24,
            height :45,
            borderBottomWidth: 1,
            borderColor: 'grey',
            marginBottom : 8,
        }}
        outlineColor="grey"/>
        <TextInput 
        selectionColor='grey'
        placeholder='Nama'
        onChangeText={(text) => setNama(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="default" 
        mode='flat' theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'grey', 
                underlineColor: 'transparent',
                background: 'transparent',
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 24,
            marginEnd: 24,
            height :45,
            borderBottomWidth: 1,
            borderColor: 'grey',
        }}
        outlineColor="grey"/>

<Text style={{
            fontSize:12,
            color:'black',
            marginStart: 24,
            marginBottom: 8,
            marginTop: 8,
        }}> Jenis Kelamin </Text>
       <DropDownPicker
       placeholder="Pilih Jenis Kelamin"
      open={open}
      value={gender}
      items={items}
      setOpen={setOpen}
      setValue={setGender}
      setItems={setItems}
      stickyHeader={true}
      containerStyle = {{
        marginStart:24,
        marginEnd:16,
        width:250,
      }}
      style={{
        borderColor : 'transparent',
        backgroundColor : 'transparent',
        borderBottomWidth : 1,
        borderBottomColor : 'grey',
        borderRadius : 0,
        marginBottom:8,
      }}
      dropDownContainerStyle = {{
       borderColor:'transparent',
       borderRadius : 0,
      }}
    />

  <TextInput 
        selectionColor='grey'
        placeholder='Tempat Lahir'
        placeholderTextColor={'grey'}
        onChangeText={(text) => setTmptLahir(text) }
        activeUnderlineColor='transparent'
        keyboardType="default" 
        mode='flat' theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'grey', 
                underlineColor: 'transparent',
                background: 'transparent',
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 24,
            marginEnd: 24,
            height :45,
            borderBottomWidth: 1,
            borderColor: 'grey',
        }}
        outlineColor="grey"/>
<Text style={{
            fontSize:12,
            color:'black',
            marginStart: 24,
            marginBottom: 8,
            marginTop: 8,
        }}> Tanggal Lahir (dd mm yy)</Text>
        <View style = {{
            flexDirection: 'row',
            marginTop : 8,
            marginStart:24,
            marginEnd:24,
            justifyContent:'center',
            borderBottomWidth:1,
            borderBottomColor:'grey'
        }}>
 <TextInput 
        selectionColor='grey'
        placeholder='Tanggal'
        onChangeText={(text) => setTgl(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="number-pad" 
        mode='flat' theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'grey', 
                underlineColor: 'transparent',
                background: 'transparent',
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginEnd: 36,
            height :45,
            color : 'black',
            textAlign:'center'
        }}
        outlineColor="grey"/>

<TextInput 
        selectionColor='grey'
        placeholder='Bulan'
        onChangeText={(text) => setBln(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="number-pad" 
        mode='flat' theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'grey', 
                underlineColor: 'transparent',
                background: 'transparent',
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginEnd: 36,
            height :45,
            textAlign:'center'
        }}
        outlineColor="grey"/>

<TextInput 
        selectionColor='grey'
        placeholder='Tahun'
        onChangeText={(text) => setThn(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="number-pad" 
        mode='flat' theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'grey', 
                underlineColor: 'transparent',
                background: 'transparent',
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 6,
            marginEnd: 6,
            height :45,
            textAlign:'center'
        }}
        outlineColor="grey"/>
        </View>
        <TextInput 
        selectionColor='grey'
        placeholder='Alamat'
        onChangeText={(text) => setAlamat(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="default" 
        mode='flat' 
        theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'black', 
                underlineColor: 'transparent',
                background: 'transparent',
                
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 24,
            marginTop:8,
            marginEnd: 24,
            height :45,
            borderBottomWidth: 1,
            borderColor: 'grey',
        }}
        outlineColor="grey"/>
        <TextInput 
        selectionColor='grey'
        placeholder={ email ? email : "Masukan Email" }
        disabled={email ? true : false }
        onChangeText={(text) => setTxtEmail(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="default" 
        mode='flat' 
        theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'black', 
                underlineColor: 'transparent',
                background: 'transparent',
                
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 24,
            marginTop:8,            
            marginEnd: 24,
            height :45,
            borderBottomWidth: 1,
            borderColor: 'grey',
        }}
        outlineColor="grey"/>

<TextInput 
        selectionColor='grey'
        placeholder={ no_telp ? no_telp : 'Nomor Telepon' }
        disabled={no_telp ? true : false}
        onChangeText={(text) => setTelp(text) }
        placeholderTextColor={'grey'}
        activeUnderlineColor='transparent'
        keyboardType="number-pad" 
        mode='flat' 
        theme={{
            colors:{
                placeholder: 'grey',
                text: 'black',
                primary: 'black', 
                underlineColor: 'transparent',
                background: 'transparent',
                
            },
            roundness: 8,
        }}
        style={{
            backgroundColor:'transparent',
            marginStart: 24,
            marginTop:8
,            marginEnd: 24,
            height :45,
            borderBottomWidth: 1,
            borderColor: 'grey',
        }}
        outlineColor="grey"/>
<View style={{
    marginTop:36,
    marginEnd:24,
    flexDirection:'row',
    justifyContent:'flex-end',
}}>
     <Pressable>
    <Text style={{
        color:'grey',
        fontSize : 14,
        marginEnd:36,
        fontWeight:'bold',
    }}>
        Skip
    </Text>

</Pressable>
  <Pressable
   onPress={no_telp ? btnRegisterNomor : btnRegisGoogle}>
    <Text style={{
        fontSize : 14,
        color:'red',
        fontWeight:'bold',
    }}>
        Save
    </Text>

</Pressable>

</View>


    </SafeAreaView>
    </Provider>
);
}
