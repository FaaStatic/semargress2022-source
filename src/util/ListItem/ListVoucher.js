import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';

export default function ListVoucher({ item, PressCall }) {
  console.log('listitemvoucher', item);
  function changeDate(data) {
    let dateFetch = data.split(' ');
    console.log(data);
    console.log(dateFetch);
    let dateArr = dateFetch[0].split('-');
    console.log(dateArr);
    let dateAnswer = null;
    switch (dateArr[1]) {
      case '01':
        dateAnswer = `${dateArr[2]} Januari ${dateArr[0]}`;
        break;
      case '02':
        dateAnswer = `${dateArr[2]} Februari ${dateArr[0]}`;
        break;
      case '03':
        dateAnswer = `${dateArr[2]} Maret ${dateArr[0]}`;
        break;
      case '04':
        dateAnswer = `${dateArr[2]} April ${dateArr[0]}`;
        break;
      case '05':
        dateAnswer = `${dateArr[2]} Mei ${dateArr[0]}`;
        break;
      case '06':
        dateAnswer = `${dateArr[2]} Juni ${dateArr[0]}`;
        break;
      case '07':
        dateAnswer = `${dateArr[2]} Juli ${dateArr[0]}`;
        break;
      case '08':
        dateAnswer = `${dateArr[2]} Agustus ${dateArr[0]}`;
        break;
      case '09':
        dateAnswer = `${dateArr[2]} September ${dateArr[0]}`;
        break;
      case '10':
        dateAnswer = `${dateArr[2]} Oktober ${dateArr[0]}`;
        break;
      case '11':
        dateAnswer = `${dateArr[2]} November ${dateArr[0]}`;
        break;
      case '12':
        dateAnswer = `${dateArr[2]} Desember ${dateArr[0]}`;
        break;
      default:
        dateAnswer = 'error';
        break;
    }
    return dateAnswer;
  }

  return (
      <TouchableOpacity
        style={style.containerTouch}
        onPress={() => {
          PressCall(item.id);
        }}
      >
        <Image
          style={style.imageStyle}
          resizeMode="stretch"
          source={require('../../assets/dummy_voucher.png')}
        />
        <Text
          style={[
            style.textStyle,
            {
              color: 'black',
              fontWeight: 'bold',
            },
          ]}
        >
          {item.nama_voucher}
        </Text>
        <Text
          style={[
            style.textStyle,
            {
              color: 'grey',
              fontSize: 14,
            },
          ]}
        >
          Berlaku hingga {changeDate(item.valid_end)}
        </Text>
      </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  containerTouch: {
    flexDirection: 'column',
    borderRadius: 8,
    borderWidth: 0.1,
    height: 300,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#00000",
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.00,
  },
  imageStyle: {
    height: 200,
    width: '100%',
    borderRadius: 16,
  },
  textStyle: {
    fontSize: 24,
    marginStart: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});
