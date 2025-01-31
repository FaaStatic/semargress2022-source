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
  Alert
} from 'react-native';
import {Api} from '../../util/Api';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import {colors} from '../../util/color'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';

const DetailQR = ({navigation, route}) => {

  const [dataQR, setDataQR] = useState('');
  const windowWidth = Dimensions.get('window').width;
  const [onLengkapiProfile, setLengkapiProfile] = useState(false);

  // Load data session
  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          getData();
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
       Api.get('qrcode')
      .then(async (respon) => {
          let body = respon.data;
          let metadata = body.metadata;
          let response = body.response;
          
          if(metadata.status === 200){
            
            setLengkapiProfile(false);
            setDataQR(response.url)
            
          }else{
            setLengkapiProfile(true);
          }
      })
      .catch((error) => {
          console.log(error)
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

  return (

    <SafeAreaView style={{backgroundColor:colors.primary}}>
      <View
        style={styles.container}
      >

        <TouchableOpacity
            style={{width:54,height:54}}
            onPress={()=>{
                navigation.goBack();
            }}
        >
            <SimpleIcon name="arrow-left" size={15} color={colors.white} style={{
                marginTop: 24,
                marginLeft: 24,
            }} />
        </TouchableOpacity>

        <View
            style={{
                alignItems:'center',
                marginLeft:24,
                marginRight:24,
            }}
        >
            <Text
                style={{color:colors.white, textAlign:'center',fontFamily:"neutrifpro-regular", marginTop:'5%'}}
            >Tunjukan QR code anda kepada petugas merchant untuk dilakukan proses scan</Text>

            <View
                style={{
                    backgroundColor: colors.white,
                    height: '75%',
                    width:'94%',
                    marginTop: 18,
                    borderRadius: 16,
                    alignItems:'center',
                    flexDirection:'column'
                }}
            >

                <Image
                    source={require('../../assets/logo.png')}
                    style={{
                        width: 150,
                        height: 150,
                    }}
                    resizeMode='contain'
                />

                <Text
                    style={{
                        color:colors.black,
                        fontSize:20,
                        width:'100%',
                        fontFamily:"neutrifpro-regular",
                        textAlign:'center',
                    }}
                >SCAN QR CODE</Text>

                {dataQR != undefined && dataQR != '' && 
                
                    <Image
                        source={{uri:dataQR}}
                        defaultSource={require('../../assets/qr.png')}
                        style={{
                            width: '70%',
                            height: '60%',
                        }}
                        resizeMode='contain'
                    />
                }

                {onLengkapiProfile && 
                    <TouchableOpacity
                        style={{
                            marginTop:50,
                            marginLeft:20,
                            marginRight:20,
                            backgroundColor:colors.yellow2,
                            borderRadius:5
                        }}

                        onPress={()=>{
                            
                            navigation.navigate('Register',{
                                edit: true 
                            });
                        }}
                    >
                        <Text
                            style={{
                                color:colors.white,
                                padding:10,
                                fontFamily:"neutrifpro-regular",
                                textAlign:'center',
                            }}
                        >Harap Lengkapi Profile Terlebih Dahulu</Text>
                    </TouchableOpacity>
                }

            </View>
        </View>

        <View
            style={{
                position:'absolute',
                bottom:0,
                width:'100%',
            }}
        >
            <Image
                source={require('../../assets/bg_bottom.png')}
                style={styles.imageFooter}
            />
        </View>
        
      </View>
    </SafeAreaView>
  );
};

export default DetailQR;

const styles = StyleSheet.create({
    imageFooter: {
        height: Dimensions.get('window').height/7,
        width: '100%',
        resizeMode:'cover',
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
        backgroundColor: colors.primary

    }
});
