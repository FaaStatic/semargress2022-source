import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, FlatList, Dimensions, StyleSheet, View, Text, ScrollViewBase } from 'react-native';
import { Api } from '../../../util/Api';
import { SessionManager } from '../../../util/SessionManager';
import { sessionId } from '../../../util/GlobalVar';
import ListKoupon from '../../../util/ListItem/ListKoupon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
var offset = 0;
export default function EKupon({ navigation, route }) {
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
  const [jumlah, setJumlah] = useState(0);


  useEffect(() => {
    getKupon();
    const unsubscribe = navigation.addListener('focus', () => {
      offset = 0;
      onProgress = false;
      setJumlahItem(0);
      setExtraData(false);
      setKuponList([]);
      getKupon();
      jumlahCoupon();
    });
    return () => {
      unsubscribe;
    }


  }, [navigation])


  const jumlahCoupon = async () => {
    await Api.get('kupon/total')
      .then((res) => {
        let body = res.data;
        let metadata = body.metadata;
        let response = body.response;
        if (metadata.status === 200) {
          console.log("testes", response);
          setJumlah(response.total);

        } else if (metadata.status === 401) {

        } else {

        }

      })
      .catch((err) => { });
  };

  const itemRender = useCallback(({ item }) => {
    return (<ListKoupon data={item} />);
  }, []);

  const loadMore = () => {
    if (isLast === false) {
      offset += length;
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
        console.log('data', response);
        if (metadata.status === 200) {
          let data = response;
          setKuponList(response);
          var merchant = response[0].merchant;
          var dateKupon = response[0].insert_at
          var tempList = [];
          tempList.push({
            type: 'title',
            id: merchant + dateKupon,
            merchant: merchant,
            insert_at: dateKupon,
          });
          tempList.push({
            type: 'title',
            id: merchant + dateKupon + 'x',
            merchant: '',
            insert_at: '',
          });
          response.forEach(element => {

            if (element.merchant !== merchant && element.insert_at !== dateKupon) {
              merchant = element.merchant;
              dateKupon = element.insert_at;
              var itemTemp = {
                type: 'title',
                id: merchant + dateKupon,
                merchant: merchant,
                insert_at: dateKupon,
              }
              tempList.push(itemTemp);

              dateKupon = element.insert_at;
              var itemTemp2 = {
                type: 'title',
                id: merchant + dateKupon + 'x',
                merchant: '',
                insert_at: ''
              }
              tempList.push(itemTemp2);
            }
            var itemKupon = {
              type: 'coupon',
              id: element.id,
              nomor: element.nomor,
              merchant: element.merchant,
              kategori: element.kategori,
              insert_at: element.insert_at
            }
            tempList.push(itemKupon);
          });
          setKuponList(offset === 0 ? tempList : [...kuponList, tempList]);
          offset = response.length === 0 ? offset + data.length : offset;
          setIsLast(response.length !== length ? true : false);
          setDataKosong(false);
          setJumlahItem(jumlahItem + response.length);
          console.log('filtered2', tempList)
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

  return <SafeAreaView style={{
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap'
  }}>
    <View style={{
      borderBottomColor: '#E0E0E0',
      borderBottomWidth: 1,
      width: '100%',
      paddingBottom: 16,
      paddingTop: 16,
    }}>
      <Text style={{
        color: '#333333',
        fontWeight: '600',
        width: '100%',
        fontSize: 16,
        marginStart: 18,

      }} >Jumlah E-Kupon Kamu : {jumlah}</Text>
    </View>
    <FlatList
      data={kuponList}
      renderItem={itemRender}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={loadMore}
      extraData={extraData}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        height: SCREEN_HEIGHT + (SCREEN_HEIGHT / 4)
      }}
      style={style.listcontainer} />
  </SafeAreaView>;
}

const style = StyleSheet.create({
  listcontainer: {
    backgroundColor: 'white',
    paddingTop: 16,
  }
})