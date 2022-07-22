import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Api } from '../../util/Api';
import { SessionManager } from '../../util/SessionManager';
import { ShowSuccess,showError } from '../../util/ShowMessage';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RemoveAccount({ navigation, route }) {
  const [openModal, setOpenModal] = useState(false);


  const hapusBtn = () =>{
    Api.post('').then(res => {
      let body = res.data;
      let response = body.response;
      let metadata = body.metadata;
      if(metadata.status === 200){
        ShowSuccess('');
        SessionManager.ClearAllKeys();
        navigation.navigate("Login");
      }else{
        showError('');
      }
    }).catch(err => {console.log(err);})
  }

  return (
    <SafeAreaView style={style.container}>
     <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
      >
        <TouchableOpacity
          onPress={()=>{ setOpenModal(!openModal) }}
          style={{
            justifyContent: 'center',
            flexDirection:'column',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex:1,
          }}
        >
            <View
          style={{
            marginStart: SCREEN_WIDTH / 10,
            marginEnd: SCREEN_WIDTH / 10,
            height: 300,
            elevation: 5,
            borderRadius: 12,
            flexDirection:'column',
            backgroundColor: '#ffffff',
          }}
        >
          <Image source={require('../../assets/ico_info.png')} resizeMode='contain' style={{
            height:75,
            width:75,
            marginTop:42,
            alignSelf:'center'
          }}/>
          <View style={{
            marginTop:28,
            width:250,
            alignSelf:'center',
          }}>
          <Text style={{
            width:250,
            fontSize:16,
            fontWeight:'600',
            color: '#4F4F4F',
            
          }}>Apa anda yakin ingin menghapus akun ?</Text>
          </View>

          <View style={{
            marginTop:34,
            flexDirection:'row',
            justifyContent:'center',
          }}>

            <TouchableOpacity style={{
              width:140,
              height:48,
              backgroundColor:'white',
              borderColor:'#828282',
              borderWidth:1,
              borderRadius:12,
              marginEnd:4,
              justifyContent:'center',
            }}
            onPress={()=>{setOpenModal(false)}}>
              <Text style={{
                color:'#828282',
                fontSize:16,
                fontWeight:'600',
                width:'100%',
                textAlign:'center',
              }}>Tidak</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={hapusBtn}
             style={{
              width:140,
              height:48,
              marginStart:4,
              backgroundColor:'#A57FF8',
              borderRadius:12,
              justifyContent:'center',
            }}>
              <Text style={{
                color:'white',
                fontSize:16,
                fontWeight:'600',
                width:'100%',
                textAlign:'center',
              }}>Hapus</Text>
            </TouchableOpacity>
          </View>
        
        </View>
        </TouchableOpacity>
      
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/img_hapus.png')}
          resizeMode="contain"
          style={{
            width: 235,
            height: 165,
            marginTop: 50,
            marginStart: SCREEN_WIDTH / 4,
          }}
        />

        <Text
          style={{
            marginTop: 36,
            width: 300,

            alignSelf: 'center',
            textAlign: 'left',
            fontSize: 13,
            color: '#000000',
            fontWeight: '400',
          }}
        >
          1. Akun anda akan terhapus secara permanen dalam jangka waktu 30 hari.
        </Text>
        <Text
          style={{
            marginTop: 10,
            width: 300,

            alignSelf: 'center',
            textAlign: 'left',
            fontSize: 13,
            color: '#000000',
            fontWeight: '400',
          }}
        >
          2. Anda dapat membatalkan penghapusan dengan login kembali dengan akun anda, dalam waktu
          kurang dari 30 hari.
        </Text>
        <Text
          style={{
            marginTop: 10,
            width: 300,

            alignSelf: 'center',
            textAlign: 'left',
            fontSize: 13,
            color: '#000000',
            fontWeight: '400',
          }}
        >
          3. Akun yang telah terhapus permanen tidak dapat dipulihkan lagi.
        </Text>
        <Text
          style={{
            marginTop: 10,
            width: 300,

            alignSelf: 'center',
            textAlign: 'left',
            fontSize: 13,
            color: '#000000',
            fontWeight: '400',
          }}
        >
          4.Pengahapusan akun secara permanen akan mengakibatkan Voucher dan E-Kupon yang telah
          diperoleh hilang.
        </Text>

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 75,
            width: '50%',
          }}
          onPress={() => setOpenModal(true)}
        >
          <Text
            style={{
              fontSize: 16,
              width: '100%',
              textAlign: 'center',
              color: '#A57FF8',
              fontWeight: '600',
            }}
          >
            Hapus Akun Saya
          </Text>
        </TouchableOpacity>
      </ScrollView>
   
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
   flexGrow: 1,
  },
});
