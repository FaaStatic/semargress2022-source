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
  ScrollView 
} from 'react-native';
import {Api} from '../../util/Api';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import  {SessionManager}  from '../../util/SessionManager';
import { sessionId } from '../../util/GlobalVar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {StackActions} from '@react-navigation/native';
import { colors } from '../../util/color';
import { ShowSuccess, ShowError, ShowWarning} from '../../util/ShowMessage';

var typeLogin = "";
const Profile = ({navigation, route}) => {

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const [data, setData] = useState([]);

  // Load data session
  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          
          typeLogin = session.type;
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

      Api.get('profile/view')
      .then(async (respon) => {
          let body = respon.data;
          let metadata = body.metadata;
          let response = body.response;
          
          if(metadata.status === 200){
            setData(response);
          }else{
            
          }
      })
      .catch((error) => {
          
      })
  }

  const showAlert = async () =>
        Alert.alert(
            "Konfirmasi",
            "Apakah anda yakin ingin keluar dari akun anda?",
            [
                {
                    text: "Tidak",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Iya",
                    onPress: async () => {
                        SessionManager.ClearAllKeys();
                        if(typeLogin == 'SMS'){

                            
                        }else if(typeLogin == 'GOOGLE'){

                            const isSignedIn = await GoogleSignin.isSignedIn();
                            if (isSignedIn) {
                        
                              await GoogleSignin.revokeAccess();
                              await GoogleSignin.signOut();
                            }
                        }

                        navigation.dispatch(StackActions.replace('Login'));
                    }
                },
            ],
            {
                cancelable: true,
            }
    );

  return (

    <SafeAreaView style={styles.safeAreaContainer}>
      <View
        style={styles.container}
      >
<ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:colors.white}}>
        <View style={{
            backgroundColor: colors.primary,
            width: '100%',
          }}>
            <View style={styles.containerHeader}>
              <Image
                source={require('../../assets/header_app.png')}
                style={{
                  height: '100%',
                  marginTop: 0,
                  top: 0,
                  width: '100%',
                  flexDirection: 'row',
                }}
                resizeMode={'stretch'}
              />
              <Text style={styles.textHeader}>Profile</Text>
            </View>
          </View>      

          <View
            style={{
              marginTop:-16,
              backgroundColor:colors.white,
              height:16,
              width:'100%',
              borderTopLeftRadius:16,
              borderTopRightRadius:16,
            }}
          >

          </View>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginTop:20,
              borderTopLeftRadius:16,
              borderTopRightRadius:16,
            }}
          >

            <View
              style={{
                width: 350,
                height: 350,
                padding: 30,
                borderRadius: 18,
              }}
            >

            <Image source={require('../../assets/bg_profile.png')} style={{
              position:'absolute',
              width: 350,
                height: 350,
              borderRadius: 18,
            }} resizeMode='cover'/>
              <Image
                source={data.foto != undefined? { uri: data.foto } : require('../../assets/logo.png')}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  backgroundColor:colors.white,
                  resizeMode: 'contain',
                }}
              >

              </Image>


              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  marginTop: 25,
                  right: 0,
                  marginRight: 25,
                }}

                onPress={() => {
                  navigation.navigate('Register', { edit: true, title : 'Edit Profile' })
                }}
              >
                <Image
                  source={require('../../assets/edit_profile.png')}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 10,
                    resizeMode: 'stretch',
                  }}
                >

                </Image>
              </TouchableOpacity>

              <Text style={styles.label} >Nama</Text>

              <Text style={styles.value} numberOfLines={1} >{data.profile_name}</Text>

              <Text style={styles.label} >Alamat</Text>

              <Text style={styles.value} numberOfLines={1} >{data.alamat}</Text>

              <Text style={styles.label} >No. Telepon</Text>

              <Text style={styles.value} numberOfLines={1} >{data.no_telp}</Text>

            </View>



          </View>

          <TouchableOpacity style={styles.menuContainer}
            onPress={()=>{
              navigation.navigate('EKupon');
            }}
          >

            <Image
              source={require('../../assets/ic_ekupon.png')}
              style={styles.icon}
            ></Image>

            <Text style={styles.menuTitle} >E-Kupon Saya</Text>

            <View style={styles.leftIcon}>

              <SimpleIcon name="arrow-right" size={18} color={'black'} />
            </View>

          </TouchableOpacity>

          <TouchableOpacity style={styles.menuContainer}
            onPress={()=>{
              navigation.navigate('VoucherHome');
            }}
          >

            <Image
              source={require('../../assets/ic_voucher.png')}
              style={styles.icon}
            ></Image>

            <Text style={styles.menuTitle} >Voucher Saya</Text>

            <View style={styles.leftIcon}>
              <SimpleIcon name="arrow-right" size={18} color={'black'} />
            </View>

          </TouchableOpacity>

          <TouchableOpacity style={styles.menuContainer}
            onPress={()=>{
              navigation.navigate('RouterQuiz');
            }}
          >

            <Image
              source={require('../../assets/ic_kuis.png')}
              style={styles.icon}
            ></Image>

            <Text style={styles.menuTitle} >Kuis</Text>

            <View style={styles.leftIcon}>
              <SimpleIcon name="arrow-right" size={18} color={'black'} />
            </View>

          </TouchableOpacity>

          <TouchableOpacity style={styles.menuContainer}
            onPress={()=>{
              navigation.navigate('About');
            }}
          >

            <Image
              source={require('../../assets/ic_tentang.png')}
              style={styles.icon}
            ></Image>

            <Text style={styles.menuTitle} >Tentang Semargres</Text>

            <View style={styles.leftIcon}>
              <SimpleIcon name="arrow-right" size={18} color={'black'} />
            </View>

          </TouchableOpacity>

          <TouchableOpacity style={styles.menuContainer}
            onPress={()=>{
              navigation.navigate('RemoveAccount');
            }}
          >

            <Image
              source={require('../../assets/ic_trash.png')}
              style={styles.icon}
            ></Image>

            <Text style={styles.menuTitle} >Kebijakan Hapus Akun</Text>

            <View style={styles.leftIcon}>
              <SimpleIcon name="arrow-right" size={18} color={'black'} />
            </View>

          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuContainer,{marginBottom:30,}]}
            onPress={() => { showAlert(); }}
          >

            <Image
              source={require('../../assets/ic_logout.png')}
              style={styles.icon}
            ></Image>

            <Text style={styles.menuTitle} >Log Out</Text>

            <View style={styles.leftIcon}>
              <SimpleIcon name="arrow-right" size={18} color={'black'} />
            </View>

          </TouchableOpacity>

        </ScrollView>


      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  imageHeder: {
    marginTop: 0,
    top: 0,
    width: '100%',
    height:100,
    resizeMode:'stretch',
    position: 'absolute',
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    color: '#333333',
    marginTop:31,

  },
  container: {
    width: '100%',
    height: '100%'
  },
  label: {
    color:colors.white,
    fontFamily:"neutrifpro-regular",
    marginTop:10,
    width:'100%',
    fontWeight:'400',
  },
  value: {
    color:colors.white,
    marginTop:10,
    width:'100%',
    fontFamily:"neutrifpro-regular",
    fontSize:18,
    fontWeight:'600',
  },
  icon:{
    width:30,
    height:30,
    resizeMode:'contain',
  },
  leftIcon:{
    position:'absolute', 
    right:0, 
    marginRight:10,
  },
  menuTitle:{
    fontSize:16,
    fontWeight:'600',
    width:'100%',
    color:colors.black,
    fontFamily:"neutrifpro-regular",
    marginLeft:19,
  },
  menuContainer :{
    flexDirection:'row',
    marginLeft:30,
    marginRight:30,
    marginTop:30,
    alignItems:'center'
  },
  containerHeader: {
    height: 100,
    marginBottom:10,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    fontFamily:"neutrifpro-regular",
    color: 'white',
    marginTop: 16,
  },
  safeAreaContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.secondary
  },
});
