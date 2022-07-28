import { check } from 'prettier';
import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { colors } from '../color';

const { height: HEIGHT_CONTAINER } = Dimensions.get('window');
const { width: WIDTH_CONTAINER } = Dimensions.get('window');
const aspect_ratio = WIDTH_CONTAINER/HEIGHT_CONTAINER;
var statIos = true;
export default function FeedList({ item, pressCall }) {
  const [fullDeskripsi, setFullDeskripsi] = useState(true);
  const [show, setShowMore] = useState(0);
  const [paused, setpaused] = useState(true);
  const onTextLayout = useCallback((e) => {
    if (show == 0) setShowMore(e.nativeEvent.lines.length);
  });

  useEffect(() => {
    let check = Platform.OS === 'android' ? setFullDeskripsi(false) : setFullDeskripsi(true);
    if (Platform.OS === 'ios') {
      showIos();
    }

    return () => {
      check;
      showIos();
    };
  }, []);

  const showIos = () => {
    let timeout = setTimeout(() => {
      if (statIos) {
        setFullDeskripsi(false);
        statIos = false;
      } else {
        clearTimeout(timeout);
      }
    }, 250);
  };

  return (
    <View style={style.container}>
      <TouchableOpacity style={style.containerHeader} onPress={() => pressCall(item)}>
        <Image
          source={{ uri: item.profile_pic }}
          resizeMode="stretch"
          style={style.imageProfileStyle}
        />
        <Text 
        numberOfLines={2} style={[style.textHeader,{
          width:'75%'
        }]}>{item.profile_name}</Text>
      </TouchableOpacity>

      {item.media_type == 'GraphVideo' ? (
        <VideoPlayer
          video={{ uri: item.media_url }}
          style={{
            width: '100%',
            alignSelf: 'center',
            marginTop: 8,
          }}
          videoWidth={item.media_width != 0 ? parseInt(item.media_width) : 1920}
          videoHeight={item.media_height != 0 ? parseInt(item.media_height) : 1080}
          resizeMode="contain"
          autoplay={false}
          controls={false}
          hideControlsOnStart={true}
          // loop={true}
          // paused={paused}
          thumbnail={{ uri: item.media_thumb }}
        />
      ) : (
        <Image source={{ uri: item.media_url }} resizeMode="cover" style={style.imagePromo} />
      )}
<View style={{
  flex:1,
}}>
<Text
        numberOfLines={fullDeskripsi ? show : 4}
        onTextLayout={onTextLayout}
        style={ aspect_ratio > 0.7 ? {
          flexDirection: 'row',
          marginTop: 8,
          marginStart: 8,
          marginEnd: 8,
          fontWeight: '300',
          height: fullDeskripsi ? HEIGHT_CONTAINER/4  : 40,
        } : {
          flexDirection: 'row',
          marginTop: 8,
          marginStart: 8,
          marginEnd: 8,
          fontWeight: '300',
          height: fullDeskripsi ? HEIGHT_CONTAINER/2 : 40,
        }}
      >
        <Text
          style={[
            style.textDeskripsi,
            {
              fontWeight: '800',
              marginEnd: 4,
              color: colors.black,
              fontWeight: '300',
              //fontFamily: 'NeutrifPro-Reguler'
            },
          ]}
        >
          {item.profile_name}
        </Text>
        <Text style={[style.textDeskripsi,{  flexGrow:1}]}>
          {item.media_caption.length !== 0 ? ` ${item.media_caption}` : ''}
        </Text>
      </Text>
</View>
{show > 4 && (
        <TouchableOpacity
          onPress={() => {
            setFullDeskripsi(!fullDeskripsi);
          }}
        >
          <Text
            style={[
              style.textDeskripsi,
              {
                color: '#9b9b9b',
                marginStart: 8,
                marginTop: 5,
                fontWeight: '300',
              },
            ]}
          >
            {fullDeskripsi ? 'Lebih Sedikit' : 'Selengkapnya'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    flex: 1,
    alignContent: 'flex-start',
    alignItems: 'center',
  },
  imageProfileStyle: {
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    overflow: 'hidden',
    marginStart: 16,
  },
  textHeader: {
    fontSize: 15,
    width: '100%',
    color: 'black',
    fontWeight: '600',
    marginStart: 17,
  },
  imagePromo: {
    marginTop: 8,
    width: '100%',
    height: HEIGHT_CONTAINER / 2.1,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    width: WIDTH_CONTAINER,
    marginBottom: 42,
    borderRadius: 16,
    textAlignVertical: 'center',
  },
  textDeskripsi: {
    fontSize: 15,
    color: colors.black3,
    lineHeight: 20,
    flexGrow:1,
  },
});
