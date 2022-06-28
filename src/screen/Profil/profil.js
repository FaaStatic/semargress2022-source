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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {StackActions} from '@react-navigation/native';

var typeLogin = "";
const Profile = ({navigation, route}) => {
  const [data, setData] = useState([]);

  // Load data session
  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          console.log("session ",session.token);
          typeLogin = session.type;
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

    <SafeAreaView>
      <View
        style={styles.container}
      >
        
        <Button
          title='Profile'
          onPress={()=>{
            navigation.navigate('Register',{
              edit: true 
            });
          }}
        ></Button>

        <Button
          title='Logout'
          onPress={()=>{
            showAlert();
          }}
        ></Button>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 28,
  },
  container: {
    width: '100%',
    height: '100%'
  }
});
