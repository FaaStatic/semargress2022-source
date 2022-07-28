import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { colors } from '../color';

const images = {
  logos: {
    0: require('../../assets/vector_1.png'),
    1: require('../../assets/vector_2.png'),
    2: require('../../assets/vector_3.png'),
    3: require('../../assets/vector_4.png'),
  }
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ListVoucher({ item, PressCall }) {
  
  var bgImage = item.id % 4;

  function changeDate(data) {
    let dateFetch = data.split(' ');
    let dateArr = dateFetch[0].split('-');
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
        onPress={() => {
          PressCall(item.id);
        }}
      >
        
        <View style={style.containerTouch}>
          <View
            style={{
              width: '100%',
              height: windowWidth / 2.5,
              borderRadius: 12,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 15,
              }}
            ></Image>

            <Image
              source={images.logos[bgImage]}
              style={{
                width: '60%',
                height: '100%',
                right: 0,
                position: 'absolute',
                resizeMode: 'stretch',
                borderRadius: 15,
              }}
            ></Image>

<View style={{
  position: 'absolute',
  right: 0,
  marginTop: 10,
  marginRight: 10,
  width: 30,
  
  backgroundColor: 'white',
  borderRadius: 15,
  alignItems:'center',
  justifyContent:'center',
  height: 30,
}}>
  <Image
            source={require('../../assets/logo_voucher.png')}
            resizeMode='stretch'
            style={{
              width: 28,
              height: 24,
              padding:10,
              borderRadius: 15,
            }}
          ></Image>
</View>

            <View
              style={{
                width: '58%',
                height: '100%',
                alignItems: 'flex-start',
                right: 0,
                padding: 20,
                color: colors.white,
                position: 'absolute',
                resizeMode: 'contain',
              }}
            >
              <Text
                style={{
                  width: '100%',
                  marginTop: '16%',
                  fontSize: 20,
                  fontWeight:'700',
                  color: colors.white,
                }}
                numberOfLines={1}
              >{item.nama_merchant}</Text>

              <Text
                style={{
                  fontSize: 14,
                  width: '100%',
                  color: colors.white,
                  marginTop: 4,
                }}
                numberOfLines={1}
              >{item.tipe == 'P' ? 'Diskon' : 'Potongan'}</Text>

              <Text
                style={{
                  fontSize: 20,
                  width: '100%',
                  fontWeight:'600',
                  color: colors.white,
                  marginTop: 4,
                }}
                numberOfLines={1}
              >{item.tipe == 'P' && item.tipe != undefined ? item.nominal+ "% OFF" :  currencyFormat(item.nominal) }</Text>
            </View>

          </View>        
  
          <View style={style.textContainer} >
            <Text
              style={[
                style.textStyle,
                {
                  color: 'black',
                },
              ]}
              numberOfLines={1}
            >
              {item.nama_voucher}
            </Text>
            <Text
              style={[
                style.textStyle,
                {
                  fontWeight: '400',
                  fontSize:13,
                },
              ]}
            >
              Berlaku hingga {changeDate(item.valid_end)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
  );
}

const style = StyleSheet.create({

  containerTouch: {
    flexDirection: 'column',
    flexBasis:1,
    borderRadius: 5,
    borderWidth: 0.1,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 8,
    marginBottom: 10,
    alignItems:'center',
    shadowColor: "#00000",
    
  },
  textStyle: {
    fontSize: 18,
    color:colors.black3,
    width: '100%',
    fontWeight:'600',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  textContainer :{
    width:'100%',
    flexDirection:'column',
    marginTop:8,
    paddingLeft:16,
    paddingRight:16,
    marginBottom:16,
  }
});
