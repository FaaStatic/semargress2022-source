import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, SafeAreaView, Text, Dimensions,StyleSheet } from 'react-native';
import { Api } from '../../../util/Api';
import { SessionManager } from '../../../util/SessionManager';
import { sessionId } from '../../../util/GlobalVar';
import ListVoucher from '../../../util/ListItem/ListVoucher';
import { BallIndicator, DotIndicator } from 'react-native-indicators';


let windows = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

var offset = 0;
var isLast = false;
var onProgress = false;

export default function VoucherHome({ navigation, route }) {
  const [loadIndicator, setLoadIndicator] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [length, setLength] = useState(10);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [msg,setMsg] = useState('');

  useEffect(() => {
    offset = 0;
    isLast = false;
    onProgress = false;
    setJumlahItem(0);
    setDataList([]);
    getVoucherList();
    setExtraData(false);
    const unsubscribe = navigation.addListener('focus', () => {
      offset = 0;
      onProgress = false;
      setJumlahItem(0);
      isLast = false;
      setDataList([]);
      getVoucherList();
      setExtraData(false);
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);


  const renderList = useCallback(({ item }) => {
    return (
         <ListVoucher item={item} PressCall={callPress} />
    );
  }, []);

  const callPress = (data) => {
    navigation.navigate('Voucher', {id:data});
  };



  const loadIndice = useCallback(() => {
    if (loadIndicator) {
      return (
        <View
          style={{
            justifyContent: 'center',
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <DotIndicator color="#251468" size={6}/>
        </View>
      );
    } else {
      return <></>;
    }
  });


  const loadMore = async () => {

    if (!isLast) {
      setLoadIndicator(true);
      offset += length;
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

        onProgress = false;
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;

        if (metadata.status == 200) {
          setDataList(offset == 0 ? response.vouchers : dataList.concat(response.vouchers));
          console.log(response.vouchers.length);
          isLast = response.vouchers.length !== length ? true : false;
          setDataKosong(false);
          isEmpty = false;
          setLoadIndicator(false);
        } else if (metadata.status == 401) {
            isEmpty = true;
            isLast = true;
            setLoadIndicator(false);

          //console.log('Status', metadata.message);
          setDataKosong(true);
        } else if(metadata.status == 404){
            isEmpty = true;
            isLast = true;
            setLoadIndicator(false);

            //console.log('Status', metadata.message);
            setMsg(metadata.message)
            setDataKosong(true);
        } else {
          if (offset == 0) {
            setDataKosong(true);
          }
          isLast = true;
          setLoadIndicator(false);

        }
        setExtraData(!extraData);
      })
      .catch((err) => {
        console.log(err);
        onProgress = false;
      });
  };

  return (
    <SafeAreaView style={style.container}>
        { dataList.length == 0 ? <Text style={style.textStyle}>{msg}</Text>  : 

         <FlatList
         onEndReached={loadMore}
         extraData={extraData}
         data={dataList}
         ListFooterComponent={loadIndice}
         showsVerticalScrollIndicator={false}
         renderItem={renderList}
         keyExtractor={(item,index) => {index.toString()}}
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
        width:'100%',
        textAlign:'center',
        alignSelf:'center',
        color:'black',
        fontWeight:'300',
        position :'absolute',
        marginTop:windows.height/2,
    },
    listcontainer : {
      backgroundColor:'white',
       flex:1,
    }
});
