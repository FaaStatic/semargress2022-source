import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Image, ScrollView, Text, StyleSheet } from 'react-native';
import { Api } from '../../../util/Api';
import { SessionManager } from '../../../util/SessionManager';

const H_MAX_HEIGHT = 250;
const H_MIN_HEIGHT = 52;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

export default function DetailHomeMerchant({ navigation, route }) {
  const [detailData, setDetailData] = useState([]);
  const [id_m, id_k] = route.params;

  useEffect(() => {
    getDetailMerchant();
    const unsubscribe = navigation.addListener('focus', () => {
      getDetailMerchant();
    });
    return () => {
      unsubscribe;
    };
  });

  const getDetailMerchant = async () => {
    await Api.get(`merchant/all/${id_m}/${id_k}`)
      .then((res) => {
        let body = res.data;
        let response = body.response;
        let metadata = body.metadata;
        if (metadata.status === 200) {
          setDetailData(response);
        } else {
        }
      })
      .catch((err) => {});
  };

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
//   const headerScrollHeight = scrollOffsetY.interpolate({
//     inputRange: [0, H_SCROLL_DISTANCE],
//     outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
//     extrapolate: 'clamp',
//   });
  return (
    <SafeAreaView>
      <ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }])}
        scrollEventThrottle={16}
      >
        <Image/>
        <View>


        </View>
   
      </ScrollView>
      {/* <Animated.View 
        style={[style.containerHeader,{
            height: headerScrollHeight,
        }]}>
        <Image source={{uri:detailData.foto}} resizeMode='stretch'/>
        </Animated.View> */}
    </SafeAreaView>
  );




}

const style = StyleSheet.create({
    containerHeader:{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        width: "100%",
        overflow: "hidden",
        zIndex: 999,
        borderBottomColor: "#EFEFF4",
        borderBottomWidth: 2,
        padding: 10,
        backgroundColor: "blue"

    }
});
