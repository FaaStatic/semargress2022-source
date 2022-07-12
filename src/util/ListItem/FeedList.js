import React, { useState,useCallback } from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';


const { height : HEIGHT_CONTAINER } = Dimensions.get('window');
const {width : WIDTH_CONTAINER} = Dimensions.get('window');

export default function FeedList({item}){

    const [fullDeskripsi, setFullDeskripsi] = useState(false);
    const [show, setShowMore] = useState(0);
    const onTextLayout = useCallback(e =>{
        setShowMore(e.nativeEvent.lines.length);
    })

return(<View style={style.container}>
        <View style={style.containerHeader}>
            <Image source={{uri : item.profile_pic}} resizeMode='stretch' style={style.imageProfileStyle}/>
            <Text style={style.textHeader}>{item.profile_name}</Text>
        </View>
        <Image source={{uri : item.media_thumb}} resizeMode='cover' style={style.imagePromo} />

        <Text numberOfLines={ fullDeskripsi ? show : 5} onTextLayout={onTextLayout}  style={{
            flexDirection:'row',
            marginTop:16,
            marginStart:8,
            marginEnd:8,
        }}>
            <Text style={[style.textDeskripsi,{
                fontWeight:'800',
                marginEnd:4,
            }]}>instagram</Text> 
            <Text style={[style.textDeskripsi,]}>{` ${item.media_caption}`}</Text>
        </Text><Pressable onPress={()=>{setFullDeskripsi(!fullDeskripsi)}}><Text style={[style.textDeskripsi,{
            color:'#828282',
            marginStart:8,
            marginTop:2,
        }]}>{fullDeskripsi ? 'Lebih Sedikit' : 'Selengkapnya'}</Text></Pressable>
</View>);

}

const style = StyleSheet.create({
    containerHeader:{
        flexDirection:'row',
        flex:1,
    },
    imageProfileStyle :{
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    overflow: "hidden",
    marginStart:20,
    marginTop:18
    },
    textHeader:{
        fontSize:15,
        color:'black',
        fontWeight:'600',
        marginStart:17,
        marginTop:25,
    },
    imagePromo:{
        marginTop:16,
            width:'100%',
            height:HEIGHT_CONTAINER/2,
            overflow:'hidden',
    },
    container:{
        flex:1,
        flexDirection:'column',
        width:WIDTH_CONTAINER,
        marginBottom:42,
        borderRadius: 16, 
        
    },
    textDeskripsi:{
     fontSize : 15,
     color:'#333333',
    }
})