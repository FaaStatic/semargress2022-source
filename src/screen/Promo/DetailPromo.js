import React, { useEffect, useState  } from 'react';
import {SafeAreaView, View, Text, Image, TouchableOpacity, Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Api } from '../../util/Api';

export default function DetailPromo({navigation, route}){

    const {id} = route.params;  
    const [response,setResponse] = useState([]);
    useEffect(()=>{
        console.log(id)
        getPromoDetail();
    },[getPromoDetail]);

    const onPressTertarik = () => {

        if(response.link == ''){
          Linking.openURL(response.gambar);
        }else{
          Linking.openURL(response.link);
        }
      };
    
    
    const getPromoDetail = async () =>{
await Api.get(`merchant/view_promo_user/${id}`).then(res => {
    let body = res.data;
    let response = body.response[0];
    let metadata = body.metadata;
    if(metadata.status === 200){
        console.log(response);
        setResponse(response);
    }else if(metadata.status === 401){

    }else{

    }
}).catch(err=>{
    console.log(err)
})
    }


return(<View style={{
    flex:1,
}}>
    <ScrollView 
    showsVerticalScrollIndicator={false}
    style={{
        flexGrow:1,
    }}>
    <Image source={{uri : response.gambar}} style={{
        height:350,
        marginStart:'5%',
        marginEnd:'5%',
        marginTop:'5%',
        borderRadius:8,
    }} resizeMode="cover"/>

    <Text style={{
        fontSize:20,
        color:'#4F4F4F',
        //fontFamily:'NeutrifPro-Reguler',
        fontWeight:'600',
        marginTop:22,
        marginStart:'5%',
    }}>{response.title}</Text>

    <Text style={{
         fontSize:13,
         color:'#4F4F4F',
         //fontFamily:'NeutrifPro-Reguler',
         fontWeight:'400',
         marginTop:8,
         marginStart:'5%',
         marginEnd:'5%'
    }}>
   {response.keterangan}
    </Text>
    <TouchableOpacity style={{
         borderRadius: 8,
         width: 250,
         height: 45,
         justifyContent: 'center',
         alignSelf: 'center',
         marginTop: 48,
         marginBottom: 16,
         backgroundColor: '#A57FF8'
    }} onPress={onPressTertarik}>
          <Text style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: '500',
            color: 'white',
            textAlign:'center',
            width:'100%',
          }}
          >Saya Tertarik</Text>
        </TouchableOpacity>

    </ScrollView>
  
</View>);
}