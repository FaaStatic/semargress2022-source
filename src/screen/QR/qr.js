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
  ImageBackground,
} from 'react-native';
import {Api} from '../../util/Api';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import {ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';
import {colors} from '../../util/color'
import AntIcon from 'react-native-vector-icons/AntDesign'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

const Qr = ({navigation, route}) => {

  const [data, setData] = useState([]);
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  // Load data session
  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          console.log("session ",session);
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

  const getData = () => {

      //console.log(param)
      Api.post('', param)
      .then(async (respon) => {
          let body = respon.data;
          let metadata = body.metadata;
          let response = body.response;
          
          if(metadata.status === 200){
          
          }else{
            
          }
      })
      .catch((error) => {
          
      })
  }

  return (

    <SafeAreaView>
      <View
        style={styles.container}
      >

        <Text style={styles.title} >QR Code</Text>

        <ImageBackground
        source={require('../../assets/bg_profile.png')}
          style={[styles.divMain,{
          }]}
        >
      
          <View
            style={{
              flexDirection:'row',
              marginTop:20,
              height: windowWidth/3,
            }}
          >
            <View
              style={{
                padding:30,
                backgroundColor:colors.white,
                width:windowWidth/3,
                height:windowWidth/3,
                alignItems:'center',
                borderRadius:10,
              }}
            >
              <Image
                source={require('../../assets/qr.png')}
                style={{
                  resizeMode:'contain',
                  width:'100%',
                  height:'100%',
                }}
              />
            </View>

            <View
              style={{
                flex:2,
                marginLeft:24,
                flexDirection:'column'
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize:18,
                  fontWeight:'700'
                }}
              >User QR Code</Text>

              <Text
                style={{
                  color:'white',
                  fontSize:14,
                  marginTop:8,
                  fontWeight:'100',
                }}
              >Tunjukan QR code anda kepada petugas merchant untuk dilakukan proses scan</Text>
            </View>
          </View>
            
            <TouchableOpacity
              style={{
                alignSelf:'flex-end',
                flexDirection:'row',
              }}
              onPress={()=>{
                navigation.navigate('DetailQR');
              }}
            >
                  <Text
                    style={{
                      width:100,
                      color:'white',
                      fontSize:16,
                      marginEnd:12,
                      textAlign:'right',
                    }}
                  >Lihat QR</Text>

                  <AntIcon name='right' size={20} color={'#FFFFFF'}/>
            </TouchableOpacity>
        </ImageBackground>

        <View
          style={[styles.divMain,{
            backgroundColor: colors.white,
            borderColor: '#A57FF8',
            borderWidth:2
          }]}
        >
          <View
            style={{
              flexDirection:'row',
              marginTop:20,
              height: windowWidth/3,
            }}
          >
            <ImageBackground
              style={{
                padding:30,
                width:windowWidth/3,
                height:windowWidth/3,
                alignItems:'center',
                borderRadius:10,
                borderRadius:12,
                overflow:'hidden',
              }}
              source={require('../../assets/bg_profile.png')}
            >
              <Image
                source={require('../../assets/scanqr.png')}
                style={{
                  resizeMode:'contain',
                  width:'100%',
                  height:'100%',
                }}
              />
            </ImageBackground>

            <View
              style={{
                flex:2,
                marginLeft:24,
                flexDirection:'column'
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize:18,
                  fontWeight:'700'
                }}
              >Scan QR Code</Text>

              <Text
                style={{
                  color: colors.primary,
                  fontSize:14,
                  marginTop:8,
                  fontWeight:'400',
                }}
              >1. Masukan nominal belanja dan cara bayar
              {"\n"}2. Scan QR code yang terdapat pada merchant</Text>
            </View>
          </View>
            
            <TouchableOpacity
              style={{
                alignSelf:'flex-end',
                marginTop:43,
                flexDirection:'row',
                alignItems:'center',
              }}
              onPress={()=>{
                navigation.navigate('ScanQR');
              }}
            >
                  <Text
                    style={{
                      color:colors.primary,
                      fontSize:16,
                      fontWeight:'600',
                      width:100,
                      textAlign:'right',
                      paddingRight:10,
                    }}
                  >Scan QR </Text>
                  <SimpleIcon name="arrow-right" size={14  } color={colors.primary} style={{}} />
                  
            </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default Qr;

const styles = StyleSheet.create({
  imageHeder: {
    marginTop: 0,
    top: 0,
    width: '100%',
    height:'15%',
    resizeMode:'stretch',
    position: 'absolute',
    flexDirection: 'row',
  },
  title: {
    alignSelf:'center',
    width:'100%',
    textAlign:'center',
    marginTop:31,
    fontSize:25,
    fontWeight:'600',
    color:'#333333'
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  divMain : {
    marginTop:43,
    padding:24,
    marginLeft: 24,
    marginRight: 24,
    overflow:'hidden',
    borderRadius: 12,
  }
});
