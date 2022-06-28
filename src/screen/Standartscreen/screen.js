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

const Screen = ({navigation, route}) => {
  const [data, setData] = useState([]);

  // Load data session
  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          console.log("session ",session.token);
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

    <SafeAreaView>
      <View
        style={styles.container}
      >
        
        <Button
          title='profile'
          onPress={()=>{
            navigation.navigate('Register');
          }}
        ></Button>
      </View>
    </SafeAreaView>
  );
};

export default Screen;

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
