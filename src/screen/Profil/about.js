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
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../util/color';

const About = ({navigation, route}) => {

  const windowWidth = Dimensions.get('window').width;
  const [data, setData] = useState([]);
  const [isi, setIsi] = useState('');

  // Load data session
  const loadSession = async () => {

    const session = await SessionManager.GetAsObject(sessionId);
      if(session != null){
          
        getData();
      }
  };

  useEffect(() => {

    navigation.setOptions({
      title : "Tentang Semargres"
    });
    
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

      Api.get('latest_version/user')
      .then(async (respon) => {
          let body = respon.data;
          let metadata = body.metadata;
          let response = body.response;
          
          if(metadata.status === 200){
            setIsi(response.about);
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
          style={{
            height: '20%',
            width: '80%',
            resizeMode: 'contain'
          }}
          source={require('../../assets/logo.png')}
        >
        </Image>

        <ScrollView
          style={{borderWidth:0, marginTop:30,}}
          showsVerticalScrollIndicator={false}
        >

          <Text style={{fontSize:15, fontWeight:'600',color:colors.black3,lineHeight:25,}}>{isi}</Text>
        </ScrollView>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      >
        <Image
          source={require('../../assets/bg_bottom.png')}
          style={styles.imageFooter}
        />
      </View>
    </SafeAreaView>
  );
};

export default About;

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
    height: '100%',
    paddingBottom:'20%',
    alignItems:'center',
    margin:30,
  },
  imageFooter: {
    height: Dimensions.get('window').height/4.5,
    width: '100%',
    resizeMode:'cover',
    flexDirection: 'row',
    },
});
