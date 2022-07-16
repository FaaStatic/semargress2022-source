import React, { useState, useCallback } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { colors } from '../color';

const { height: HEIGHT_CONTAINER } = Dimensions.get('window');
const { width: WIDTH_CONTAINER } = Dimensions.get('window');

export default function FeedList({ item }) {

    const [fullDeskripsi, setFullDeskripsi] = useState(false);
    const [show, setShowMore] = useState(0);
    const [paused, setpaused] = useState(true)
    const onTextLayout = useCallback(e => {
        if(show == 0) setShowMore(e.nativeEvent.lines.length);
    })

    return (
    <View style={style.container}>
        <View style={style.containerHeader}>
            <Image source={{ uri: item.profile_pic }} resizeMode='stretch' style={style.imageProfileStyle} />
            <Text style={style.textHeader}>{item.profile_name}</Text>
        </View>

        {item.media_type == 'GraphVideo' ? (
                <VideoPlayer
                video={{ uri: item.media_url }}
                style={{
                    width:'100%',
                    alignSelf:'center',
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
            ) :
            (
                <Image source={{ uri: item.media_url }} resizeMode='cover' style={style.imagePromo} />
            )
        }

        <Text numberOfLines={fullDeskripsi ? show : 4} onTextLayout={onTextLayout} style={{
            flexDirection: 'row',
            marginTop: 8,
            marginStart: 8,
            marginEnd: 8,
            fontWeight:'300',
        }}>
            <Text style={[style.textDeskripsi, {
                fontWeight: '800',
                marginEnd: 4,
                color:colors.black,
                fontWeight:'300',
                fontFamily: 'NeutrifPro-Reguler'
            }]}>{item.profile_name}</Text>
            <Text style={[style.textDeskripsi,]}>{item.media_caption.length !== 0 ? ` ${item.media_caption}` : ' Tidak Ada Deskripsi'}</Text>

        </Text>
        {show > 4 &&
        <Pressable onPress={() => { 
            setFullDeskripsi(!fullDeskripsi) 
            }}>
            <Text style={[style.textDeskripsi, {
            color: '#9b9b9b',
            marginStart: 8,
            marginTop: 5,
            fontWeight:'300',
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
        color:colors.black3
    }
})