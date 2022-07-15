import React, { useState, useCallback } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native'
import { colors } from '../color';

const { height: HEIGHT_CONTAINER } = Dimensions.get('window');
const { width: WIDTH_CONTAINER } = Dimensions.get('window');

export default function FeedList({ item }) {

    let lHeight = HEIGHT_CONTAINER/3.5;
    const [fullDeskripsi, setFullDeskripsi] = useState(false);
    const [show, setShowMore] = useState(0);
    const [paused, setpaused] = useState(true)
    const onTextLayout = useCallback(e => {
        if(show == 0) setShowMore(e.nativeEvent.lines.length);
    })

    const handleImageVisibility = (visible) => {
        
        console.log("visible ", visible)
        setpaused(true);
      }

    return (
    <View style={style.container}>
        <View style={style.containerHeader}>
            <Image source={{ uri: item.profile_pic }} resizeMode='stretch' style={style.imageProfileStyle} />
            <Text style={style.textHeader}>{item.profile_name}</Text>
        </View>

        {item.media_type == 'GraphVideo' ? (
            <VisibilitySensor
            style={{
                width:'100%',
                flex:1,
                marginTop:8,
                justifyContent:'center',
            }}
            onChange={handleImageVisibility}
            >
                <VideoPlayer
                video={{ uri: item.media_url }}
                style={{
                    width:'100%',
                    alignSelf:'center',
                }}
                resizeMode="contain"
                autoplay={false}
                hideControlsOnStart={true}
                // loop={true}
                // paused={paused}
                thumbnail={{ uri: item.media_thumb }}
            />
            </VisibilitySensor>
            
        ) :
            (
                <Image source={{ uri: item.media_url }} resizeMode='contain' style={style.imagePromo} />
            )
        }

        <Text numberOfLines={fullDeskripsi ? show : 3} onTextLayout={onTextLayout} style={{
            flexDirection: 'row',
            marginTop: 8,
            marginStart: 8,
            marginEnd: 8,
        }}>
            <Text style={[style.textDeskripsi, {
                fontWeight: '800',
                marginEnd: 4,
                color:colors.black,
                fontFamily: 'NeutrifPro-Reguler'
            }]}>{item.profile_name}</Text>
            <Text style={[style.textDeskripsi,]}>{item.media_caption.length !== 0 ? ` ${item.media_caption}` : ' Tidak Ada Deskripsi'}</Text>

        </Text>
        {show > 3 &&
        <Pressable onPress={() => { 
            setFullDeskripsi(!fullDeskripsi) 
            }}>
            <Text style={[style.textDeskripsi, {
            color: '#615f5f',
            marginStart: 8,
            marginTop: 5,
        }]}>{fullDeskripsi ? 'Lebih Sedikit' : 'Selengkapnya'}</Text>
        </Pressable>}
    </View>);

}

const style = StyleSheet.create({
    containerHeader: {
        flexDirection: 'row',
        flex: 1,
        alignContent:'flex-start',
        alignItems:'center'
    },
    imageProfileStyle: {
        width: 42,
        height: 42,
        borderRadius: 42 / 2,
        overflow: "hidden",
        marginStart: 16,
        
    },
    textHeader: {
        fontSize: 15,
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
        textAlignVertical:'center'

    },
    textDeskripsi: {
        fontSize: 15,
        
    }
})