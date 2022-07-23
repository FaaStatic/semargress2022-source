import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Pressable } from 'react-native';
import EvilIcons from'react-native-vector-icons/EvilIcons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  set,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheetWisata = forwardRef(
    (props,ref) => {
      
  const heightTranslated = useSharedValue(0);
  const contextBS = useSharedValue({ y: 0 });
  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
  const statHeight = useSharedValue(false);
  const [statIcon, setStatIcon] = useState(true);

  const ScrollTo = useCallback((destination) => {
    'worklet';
    heightTranslated.value = withSpring(destination, { damping: 50 });
  }, []);

  useEffect(() => {
    const valueScroll = -SCREEN_HEIGHT / 5.5;
    ScrollTo(valueScroll);
  }, []);

  const gestureFunc = Gesture.Pan()
    .onStart(() => {
      contextBS.value = { y: heightTranslated.value };
    })
    .onUpdate((event) => {
      // console.log(event.translationY);
      heightTranslated.value = event.translationY + contextBS.value.y;
      heightTranslated.value = Math.max(heightTranslated.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (heightTranslated.value > -SCREEN_HEIGHT / 5.5) {
        const valueScroll = -SCREEN_HEIGHT / 5.5;
        ScrollTo(valueScroll);
        statHeight.value = true;
      } else if (heightTranslated.value < -SCREEN_HEIGHT / 4) {
        ScrollTo(MAX_TRANSLATE_Y);
        statHeight.value = false;
      }
    })
    .onChange((event)=>{
        if (event.translationY > -SCREEN_HEIGHT / 5.5) {
            statHeight.value = true;
          } else if (event.translationY < -SCREEN_HEIGHT / 4) {
            statHeight.value = false;
          }
    });

  const styleBottomSheet = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      heightTranslated.value,
      [MAX_TRANSLATE_Y + 75, MAX_TRANSLATE_Y],
      [25, 0],
      Extrapolate.CLAMP
    );
    return {
      borderRadius,
      transform: [{ translateY: heightTranslated.value }],
    };
  });



  const updown = () => {
    if(statIcon){
      ScrollTo(MAX_TRANSLATE_Y);
      setStatIcon(!statIcon);
    }else{
      const valueScroll = -SCREEN_HEIGHT / 5.5;
      ScrollTo(valueScroll);
      setStatIcon(!statIcon);
    }
   
  };

  return (
    // <GestureDetector gesture={gestureFunc}>
      <Animated.View style={[style.container, styleBottomSheet]}>
        <Pressable style={style.containerHeader} onPress={
                updown
            }>
          {statIcon ? (
            <EvilIcons name="chevron-up" color={'#0F2E63'}
            size={40} style={style.iconArrow}/>
          ) : (
            <EvilIcons
              name="chevron-down"
              color={'#0F2E63'}
              size={40}
              style={style.iconArrow}
            
            />
          )}

          <Text style={style.textStyle}>Lihat Merchant Terdekat</Text>
        
        </Pressable>
        <View style={{
            marginTop:16,
          }}>
          {props.children}
        </View>
      </Animated.View>
  );
});


const style = StyleSheet.create({
  iconArrow: {
    alignSelf: 'center',
    marginTop:4,
    margin:0,
  },
  container: {
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    height: SCREEN_HEIGHT,
    borderRadius: 25,
    padding:0,
    backgroundColor: 'white',
    elevation: 6,
    flex:1,
    flexDirection:'column',
  },
  containerHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin:0,
    width: '100%',
  },
  textStyle: {
    color: '#0f2e63',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom:16,
    //fontFamily:'NeutrifPro-Reguler'
  },
});

export default BottomSheetWisata;