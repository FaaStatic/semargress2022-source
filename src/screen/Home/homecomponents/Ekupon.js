import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, FlatList, Dimensions, StyleSheet } from 'react-native';
import { Api } from '../../../util/Api';
import { SessionManager } from '../../../util/SessionManager';
import { sessionId } from '../../../util/GlobalVar';
import ListKoupon from '../../../util/ListItem/ListKoupon';

const windowWidth = Dimensions.get('window');
export default function EKupon({ navigation, route }) {
  let offset = 0;
  let onProgress = false;
  let isEmpty = true;
  const [kuponList, setKuponList] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [jumlahItem, setJumlahItem] = useState(0);
  const [length, setLength] = useState(10);
  const [dataKosong, setDataKosong] = useState(false);
  const [extraData, setExtraData] = useState(false);
  const [msg, setMsg] = useState('');
  const [filtered, setFiltered] = useState([]);


  useEffect(()=>{
    offset = 0;
    onProgress = false;
    setJumlahItem(0);
    setKuponList([]);
    getKupon();
    const unsubscribe = navigation.addListener('focus', () => {
    offset = 0;
    onProgress = false;
    setJumlahItem(0);
    setKuponList([]);
    getKupon();
    });
    return() => {
        unsubscribe;
    }


  },[navigation])



  const itemRender = useCallback(({item}) => {
    return(<ListKoupon data={item}/>);
  }, []);

  const loadMore = () => {
    if (isLast === false) {
       getKupon;
      }
  };

  const getKupon = async () => {
    if (onProgress) {
        return;
      }
    onProgress = true;
    await Api.get('kupon/history', 1)
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        if (metadata.status === 200) {
          let data = response;
          setKuponList(response);
          var merchant = response[0].merchant;
          var dateKupon = response[0].insert_at
          var tempList = [];
          tempList.push( {
            type: 'title',
            id : merchant+dateKupon,
            merchant : merchant,
            insert_at : dateKupon,
        } );
        tempList.push( {
            type: 'title',
            id : merchant+dateKupon+'x',
            merchant : '',
            insert_at : '',
        } );
          response.forEach(element => {
            
            if(element.merchant !== merchant && element.insert_at !== dateKupon){
                merchant = element.merchant;
                dateKupon = element.insert_at;
                var itemTemp = {
                    type: 'title',
                    id : merchant+dateKupon,
                    merchant : merchant,
                    insert_at : dateKupon,
                } 
                tempList.push(itemTemp);

                dateKupon = element.insert_at;
                var itemTemp2 = {
                    type: 'title',
                    id : merchant+dateKupon+'x',
                    merchant : '',
                    insert_at : ''
                } 
                tempList.push(itemTemp2);
            }
            var itemKupon = {
                type: 'coupon',
                id: element.id,
                nomor: element.nomor,
                merchant: element.merchant ,
                kategori:element.kategori,
                insert_at: element.insert_at
            } 
            tempList.push(itemKupon);
          });
          setKuponList(offset === 0 ? tempList : [...kuponList, ...tempList]);
          offset = response.length === 0 ? offset + data.length : offset;
          setIsLast( response.length !== length ? true : false);
          setDataKosong(false);
          setJumlahItem(jumlahItem + response.length);
          console.log('filtered2', filtered)
        } else if (metadata.status === 404) {
          isEmpty = true;
          console.log('Status', metadata.message);
          setDataKosong(true);
        } else if (metadata.status === 401) {
          isEmpty = true;
          console.log('Status', metadata.message);
          setMsg(metadata.message);
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

  return <SafeAreaView>
    <FlatList
    data={kuponList}
    renderItem={itemRender}
    numColumns={2}
    keyExtractor={(item)=>{item.id}}
    onEndReached={loadMore}
    extraData={extraData}
    style={style.listcontainer}/>
  </SafeAreaView>;
}

const style=StyleSheet.create({
    listcontainer : {
        height:windowWidth.height,
        backgroundColor:'white',
    }
})