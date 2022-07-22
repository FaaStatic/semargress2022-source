import React,{ useState, useCallback, useEffect } from 'react'
import {View, Text, FlatList, SafeAreaView } from 'react-native'
import { Api } from '../../util/Api';


var offset = 0;
var isLast = false;
var onProgress = false;
export default function HomePromo({navigation,route}){

    const [promoMerchant, setPromoMerchant] = useState([]);
    const [extradata,setExtraData] = useState(false);
    const length = 6;
    const {id_m} = route.params;

    useEffect(()=>{



    },[]);

    const getPromo = ()=>{
        const params = {
            id_merchant : id_m,
            start: offset,
            limit:length
        }
        Api.post('api/popup_promo/get_promo').then(res =>{

        }).catch(() => {

        })
    }

    const renderItem = useCallback((item)=>{
        <></>
    });


    return(<SafeAreaView style={{
        flex:1,
    }}>
        <FlatList
        numColumns={2}
        style={{
            flexGrow:1,
        }}/>
    </SafeAreaView>);
}