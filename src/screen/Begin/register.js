import React, { useState, useEffect } from 'react';
import {SafeAreaView, Text, View, Pressable } from 'react-native';
import {Portal, Provider, TextInput, Modal} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import style from '../../util/style'; 
import { Api } from '../../util/Api';
import {StackActions} from '@react-navigation/native';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';

export default function Register({navigation, route}) {
const {uid, email, foto, token, fcm_id, no_telp, otp} = route.params;

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

useEffect(()=>{
console.log('UID', uid);
console.log('fcm_id', fcm_id);
console.log('token', token);
});

  const btnRegisGoogle = async () => {
    let data = {
     uid : uid,
	email : email,
	profile_name : nama,
	foto : foto,
	fcm_id : fcm_id,
	type : "Google"
    }
    await Api.post('register',{
        data
    },{
        headers: {
          'Username' : email,
          'Uid' : uid,
          'Token' : token, 
        }
    }).then(res => {
        let msg = res.data.response.message;
        let data = {
            token : res.data.response.token,
            uid : res.data.response.uid,
            email : res.data.response.email,
            fcm_id : fcm_id,
          }
          SessionManager.StoreAsObject(sessionId, data);
          navigation.dispatch(StackActions.replace('RouterTab'),{msg});
    }).catch(err => {

    })
  }

  const btnRegisterNomor = async () => {
    console.log(txtEmail);
    const data = {
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
     await Api.post('register_from_otp', {
        data,
     }, {
        Headers: {
          'Username' : no_telp,
          'Uid' : uid,
          'Token' : token,
        }
    }).then(res => {
        let data = {
            token : res.data.response.token,
            uid : res.data.response.uid,
            email : txtEmail,
            fcm_id : fcm_id
          }
          console.log("Tes",res);
          saveData(data);
          navigation.dispatch(StackActions.replace('RouterTab'));
     }).catch(err => {
        console.log('tes',err);
     })
  }

  const toastMsg = (value) =>{
    if (Platform.OS === 'android') {
      ToastAndroid.show(value, ToastAndroid.SHORT)
    } else {
      AlertIOS.alert(value);
    }
  } 

  const saveData = async (data) =>{
    await SessionManager.StoreAsObject(sessionId, data);
    console.log("Done Saved");
  }


  const btnSkip = async () => {
    if(no_telp !== null){
        const data = {
            token : token,
            uid : uid,
            username : no_telp,
            fcm_id : fcm_id,
        }
        saveData(data);
        navigation.dispatch(StackActions.replace('RouterTab'));
    }else{
        toastMsg("Mohon Data diisi dulu");
    }
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
        maxLength={16}
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
        maxLength={2}
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
        maxLength={2}
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
        maxLength={4}
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
     <Pressable
     onPress={btnSkip}>
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
