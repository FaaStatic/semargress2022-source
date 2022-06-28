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
} from 'react-native';
import {Api} from '../../util/Api';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import {ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';
import {colors} from '../../util/color'
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
        
        <Image
          source={require('../../assets/header_app.png')}
          style={styles.imageHeder}
        />

        <Text style={styles.title} >QR Code</Text>

        <View
          style={[styles.divMain,{backgroundColor:colors.primary}]}
        >
          <View
            style={{
              flexDirection:'row',
              marginTop:20,
              height: windowHeight/6,
            }}
          >
            <View
              style={{
                padding:30,
                backgroundColor:colors.white,
                flex:1,
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
                  fontSize:18
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
                alignSelf:'flex-end'
              }}
              onPress={()=>{
                navigation.navigate('DetailQR');
              }}
            >
                  <Text
                    style={{
                      color:'white',
                      fontSize:16
                    }}
                  >Lihat QR</Text>
            </TouchableOpacity>
        </View>

        <View
          style={[styles.divMain,{
            backgroundColor: colors.white,
            borderColor: colors.primary,
            borderWidth:2
          }]}
        >
          <View
            style={{
              flexDirection:'row',
              marginTop:20,
              height: windowHeight/6,
            }}
          >
            <View
              style={{
                padding:30,
                backgroundColor: colors.primary,
                flex:1,
                alignItems:'center',
                borderRadius:10,
              }}
            >
              <Image
                source={require('../../assets/scanqr.png')}
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
                  color: colors.primary,
                  fontSize:18
                }}
              >Scan QR Code</Text>

              <Text
                style={{
                  color: colors.primary,
                  fontSize:14,
                  marginTop:8,
                  fontWeight:'100',
                }}
              >1. Masukan nominal belanja dan cara bayar
              {"\n"}2. Scan QR code yang terdapat pada merchant</Text>
            </View>
          </View>
            
            <TouchableOpacity
              style={{
                alignSelf:'flex-end',
              }}
            >
                  <Text
                    style={{
                      color:colors.primary,
                      fontSize:16
                    }}
                  >Scan QR <SimpleIcon name="arrow-right" size={14  } color={colors.primary} style={{}} /></Text>
                  
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
    position: 'absolute',
    flexDirection: 'row',
  },
  title: {
    alignSelf:'center',
    marginTop:'20%',
    fontSize:25,
    color:'black'
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  divMain : {
    marginTop:30,
    padding:24,
    marginLeft: 24,
    marginRight: 24,
    borderRadius: 14,
  }
});
