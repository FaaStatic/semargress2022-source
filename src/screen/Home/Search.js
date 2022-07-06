import React,{useCallback, useEffect, useState} from 'react';
import { SafeAreaView, StyleSheet, FlatList, Image, Dimensions, PermissionsAndroid,Text, View } from 'react-native';
import { Api } from '../../util/Api';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { ShowSuccess, ShowError, ShowWarning } from '../../util/ShowMessage';
import MerchanList from '../../util/ListItem/MerchantList';
let latitude = 0;
let longitude = 0;
const {width : SCREEN_WIDTH} = Dimensions.get('window');
const {height : SCREEN_HEIGHT} = Dimensions.get('window');
export default function Search({navigation, route}){

    const [iconVisible, setIconVisible] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [response,setResponse] = useState([]);
    const [dataKosong, setDataKosong] = useState(false);
    const [msg,setMsg] = useState('');
  
    useEffect(()=>{
      GrantLocation();
      setTextInput('');
      const subscribe = navigation.addListener('focus', ()=> {
        GrantLocation();
        setTextInput('');
      });

      return()=>{
          subscribe;
      }

    },[navigation, GrantLocation])

    const currentLocation = () => {
      try {
        Geolocation.getCurrentPosition(
          async (pos) => {
            const datalatitude = pos.coords.latitude;
            const datalongitude = pos.coords.longitude;
          latitude = datalatitude;
          longitude = datalongitude;
          onSearch();
          },
          (err) => {
            console.log(err.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (error) {
        console.log(error.message);
      }
    };
    const GrantLocation = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Semargress Meminta Izin Lokasi',
            message:
              'Semargress Membutuhkan akses lokasi untuk menyesuaikna merchant terdekat pengguna',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'Iya',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTES) {
          console.log('StatusLokasi', granted);
        } else {
          console.log('StatusLokasi', granted);
        }
      } catch (error) {
        console.log(error.message);
      }
    };



    const onSearch = async () =>{
      await Api.post('/merchant/nearby_filter_order/',{
        "latitude" : latitude,
        "longitude" : longitude,
        "jarak" : 50,
        "start" : 0,
        "limit" : 10,
        "kategori" : [],
        "search" : textInput,
        "order_col" : 
        {
            "nama" : "asc",
            "favorit" : "desc"
        },
        "order_dir" : ""
      }).then(res =>{
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        if(metadata.status === 200){
          console.log('statusresponse', response)
          setResponse(response);
          setDataKosong(true);
          ShowSuccess(metadata.message);

        }else if(metadata.status === 401){
          setResponse([]);
          ShowWarning(metadata.message);
          setDataKosong(false);
          setMsg(metadata.message);
          console.log(metadata.message);

        }else{
          setResponse([]);
          setDataKosong(false);
          setMsg(metadata.message);
          ShowWarning(metadata.message);
          console.log(metadata.message);
        }

      }).catch(err => {
        ShowError(metadata.message);
        console.log(err);
      })
    }

    const moveDetail = (value) =>{
      navigation.navigate('DetailMerchant', {
        id_m : value.id_m
      });
    }

    const itemRender = useCallback(({item})=>{
      return(
        <MerchanList item={item} pressCall={moveDetail}/>
      )
    })

    return(<SafeAreaView style={style.container}>
        <View style={style.containerHeader}>
        <Image
          source={require('../../assets/header_app.png')}
          style={{
            height: 100,
            marginTop: 0,
            top: 0,
            width: '100%',
            position: 'absolute',
            flexDirection: 'row',
          }}
          resizeMode={'stretch'}
        />
        <View style={style.searchView}>  
        <TextInput
            mode="flat"
            selectionColor='grey'
            autoFocus={true}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            placeholder="Cari Merchant"
            theme={themeSearch}
            onFocus={() => setIconVisible(true)}
            onBlur={() => setIconVisible(false)}
            value={textInput}
            onChangeText={(Value)=>{setTextInput(Value)}}
            style={style.SearchStyle}
            onSubmitEditing={currentLocation}
          />
          {!iconVisible && <Icon name="search" size={26} color="grey" style={style.iconSearch} />} 
        </View>
     
           {/* <Pressable style={style.iconNotif}>
            <Icon name="notifications" size={36} color="white" />
          </Pressable> */}
        </View>
  
        <View style ={{
          marginTop:8,
          flex:1,
        }}>
        { dataKosong ?  <FlatList
          data={response}
          renderItem={itemRender}
          showsVerticalScrollIndicator={false}
          horizontal={false}
            numColumns={2}
          contentContainerStyle={styling.flatContainer}
            style={styling.flatlistStyle}
        /> : <Text style={{
          fontSize:24,
          fontWeight:'bold',
          color:'black',
          alignSelf:'center'
        }}>{msg != '' ? msg : '' }</Text>}
      

        </View>
    </SafeAreaView>);
}

const themeSearch = {
  version: 3,
  colors: {
    primary: '#3498db',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
  },
};

const style = StyleSheet.create({
  flatContainer:{
    justifyContent:'center',
    width:SCREEN_WIDTH,
  },
  flatlistStyle:{
     marginBottom:SCREEN_HEIGHT/6,
  },
  container:{
    flex:1,
    flexDirection:'column',
    backgroundColor:'white'
  },
    containerHeader:{
        height:100,
        backgroundColor: '#0F2E63'
    },
    searchView: {
        borderRadius: 16,
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 8,
        bottom: 0,
        width:350,
        marginStart: 16,
        marginEnd:16,
        marginBottom:15,
        backgroundColor:'white',
        flexDirection: 'row',
      },
      SearchStyle: {
        width: 300,
        alignSelf: 'flex-start',
        height: 36,
        marginStart: 6,
        marginEnd:6,
        backgroundColor: 'transparent',
      },
      iconSearch: {
        marginTop: 4,
        marginStart: 6,
      },
    

});