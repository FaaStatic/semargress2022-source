import React,{ useState, useCallback, useEffect } from 'react'
import {View, Text, FlatList, SafeAreaView, TouchableOpacity,Image,Dimensions } from 'react-native'
import { Api } from '../../util/Api';


var offset = 0;
var isLast = false;
var onProgress = false;
const {width : SCREEN_WIDTH} = Dimensions.get('window');
const {height : SCREEN_HEIGHT} = Dimensions.get('window');

export default function HomePromo({navigation,route}){

    const [promoMerchant, setPromoMerchant] = useState([]);
    const [extradata,setExtraData] = useState(false);
    const length = 6;
    const {id} = route.params;



    useEffect(()=>{
    setPromoMerchant([]);
    offset = 0;
    isLast = false;
    setExtraData(false);
    const setFirst = getPromo();

return ()=>{
    setFirst;
}
    },[]);

   


    const getPromo = ()=>{
      
        const params = {
            id_merchant : id,
            start: offset,
            limit:length
        }
        Api.post('api/popup_promo/get_promo',params).then(res =>{
            let body = res.data;
            let response = body.response.promo;
            let metadata = body.metadata;
            if(metadata.status === 200){
                setPromoMerchant(offset === 0 ? response : promoMerchant.concat(response));
                console.log('pjgpromo', response.length);
                console.log('pjgcount',length);
                isLast = response.length !== length  ? true : false
                console.log('cek',response);
                console.log(id);
            }else if(metadata.status === 401){
                console.log(metadata.message);
                isLast = true;
            }else{
                console.log(metadata.message);
                isLast = true;
            }
            if(offset == 0){
                
            }
            setExtraData(!extradata);
        }).catch(err => {
            console.log(err);
        })
    }

    const renderItem = useCallback(({item})=>{
    return(
    <View style={{
        width:SCREEN_WIDTH/2,
        height:SCREEN_HEIGHT/5,
        marginTop:18,
        justifyContent:'center',
        marginBottom:18,
    }}>
    <TouchableOpacity style={{  height:180,
        width:180,
        alignSelf:'center',
        borderRadius:16,}} onPress={()=>{promoGet(item)}}>
        <Image source={{uri : item.gambar}} style={{height:180,
        width:180,

        borderRadius:16,}}/>
    </TouchableOpacity>
    </View>

 );
    });
    const promoGet = (item) =>{
        navigation.navigate('DetailPromo', {
          id : item.id_i,
        });
    }

    const onMore = () =>{
        console.log('pjg',offset);
        console.log('last',isLast);
        if(!isLast){
            offset += length;
            getPromo();
            console.log('last',isLast);
        }
    }

    return(<SafeAreaView style={{
       flex:1,
    }}>
 
        <FlatList
        data={promoMerchant}
        renderItem = {renderItem}
        extraData={extradata}
        onEndReached={onMore}
        numColumns={2}
        ListFooterComponent={()=>{
            return(<View style={{
                width:'100%',
                height:42,
            }}/>);
        }}
        contentContainerStyle={{
            // flexGrow:1,
            marginTop:18,
            marginBottom:18,
        }}/>
      
    
    </SafeAreaView>);
}