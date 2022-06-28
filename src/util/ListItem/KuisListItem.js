import React from 'react';
import { StyleSheet, SafeAreaView, Text, Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default function KuisListItem({ item, onModal }) {
  console.log('ItemDataKuis', item);
  return (
    <SafeAreaView style={style.container}>
      <Pressable onPress={() => onModal(item)}>
        <View style={style.merchantView}>
          <Icon name="shop" size={24} color={'#0F2E63'} />
          <Text style={style.textMerchant}>{item.nama_merchant}</Text>
        </View>
        <Text
          style={[
            style.textStyle,
            {
              color: 'black',
            },
          ]}
        >
          Pertanyan : {item.soal}
        </Text>
        <Text style={style.textPeriode}>
          Periode {item.periode_start} - {item.periode_end}
        </Text>
        <Text style={style.textStyle}>Hadiah : {item.hadiah}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  merchantView: {
    flexDirection: 'row',
    padding: 8,
    elevation: 5,
  },
  container: {
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    flexDirection: 'column',
    margin: 8,
    padding: 8,
  },
  iconStyle: {
    marginStart: 16,
  },
  textMerchant: {
    marginStart: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2E63',
  },
  textPeriode: {
    marginStart: 16,
    color: 'grey',
    marginBottom: 16,
    fontSize: 14,
  },
  textStyle: {
    marginStart: 16,
    marginBottom: 16,
    color: 'red',
    fontSize: 14,
  },
});
