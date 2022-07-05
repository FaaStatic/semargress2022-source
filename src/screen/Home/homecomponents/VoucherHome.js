import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, SafeAreaView, Text, Dimensions,StyleSheet } from 'react-native';
import { Api } from '../../../util/Api';
import { SessionManager } from '../../../util/SessionManager';
import { sessionId } from '../../../util/GlobalVar';
import ListVoucher from '../../../util/ListItem/ListVoucher';

let windows = Dimensions.get('window');


export default function VoucherHome({ navigation, route }) {


  let offset = 0;
  let onProgress = false;
  const [dataList, setDataList] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [length, setLength] = useState(10);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [msg,setMsg] = useState('');

  useEffect(() => {
    offset = 0;
    onProgress = false;
    setJumlahItem(0);
    setDataList([]);
    getVoucherList();
    const unsubscribe = navigation.addListener('focus', () => {
      offset = 0;
      onProgress = false;
      setJumlahItem(0);
      setDataList([]);
      getVoucherList();
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);


  const renderList = useCallback(({ item }) => {
    console.log('item voucher', item);
    return (
      <View>
         <ListVoucher item={item} PressCall={callPress} />  
      </View>
    );
  }, []);

  const callPress = (data) => {
    console.log('id_voucher', data);
  };

  const loadMore = async () => {
    if (isLast === false) {
      getVoucherList();
    }
  };

  const getVoucherList = async () => {
    if (onProgress) {
      return;
    }

    onProgress = true;

    await Api.post('user/voucher', {
      start: offset,
      limit: length,
      search: '',
    })
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        

        if (metadata.status === 200) {
          console.log('voucherlist', response.vouchers);
          setDataList(response.vouchers);
          setDataList(offset === 0 ? response.vouchers : [...dataList, ...response.vouchers]);
          offset = response.length === 0 ? offset + response.vouchers.length : offset;
          setIsLast(response.vouchers.length !== length ? true : false);
          setDataKosong(false);
          console.log('list voucher',dataList)
          setJumlahItem(jumlahItem + response.vouchers.length);
          isEmpty = false;
        } else if (metadata.status === 401) {
            isEmpty = true;
          console.log('Status', metadata.message);
          setDataKosong(true);
        } else if(metadata.status === 404){
            isEmpty = true;
            console.log('Status', metadata.message);
            setMsg(metadata.message)
            setDataKosong(true);
        } else {
          if (offset === 0) {
            setDataKosong(true);
          }
          setIsLast(true);
        }
        setExtraData(!extraData);
      })
      .catch((err) => {
        console.log(err);
        onProgress(false);
      });
  };

  return (
    <SafeAreaView style={style.container}>
        { dataList.length === 0 ? <Text style={style.textStyle}>{msg}</Text>  : 
         <FlatList
         onEndReached={loadMore}
         extraData={extraData}
         data={dataList}
         showsVerticalScrollIndicator={false}
         renderItem={renderList}
         style={style.listcontainer}
       />
        }
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
    container:{
        flex:1,
        width: windows.width,
        height: windows.height,
        flexDirection:'column',
        
    },
    textStyle:{
        alignSelf:'center',
        fontSize:18,
        fontWeight:'bold',
        color:'black',
        position :'absolute',
        marginTop:windows.height/2,
    },
    listcontainer : {
      backgroundColor:'white',
       flex:1,
    }
});
