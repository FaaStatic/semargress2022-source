import React,{useState, useCallback, useEffect} from 'react';
import { SafeAreaView, FlatList, StyleSheet, Image, Text, Pressable,Dimensions } from 'react-native';
import { Api } from '../../../../util/Api';

const {height : SCREEN_HEIGHT} = Dimensions.get('window');
const {width : SCREEN_WIDTH} = Dimensions.get('window');

export default function HomeWisataSemarang({navigation, route}){

    let offset = 0;
    let onProgress = false;
    const [length, setLength] = useState(10);
    const [response, setResponse] = useState([]);
    const [Last, setLast] = useState(false);
    const [jumlahItem, setJumlahItem] = useState(0);
    const [dataKosong, setDataKosong] = useState(false);
    const [extraData, setExtraData] = useState(false);


    useEffect(()=>{
        offset = 0;
        onProgress = false;
        setJumlahItem(0);
        setResponse([]);
        getApi();

        const subscribe = navigation.addListener('focus',()=>{
        offset = 0;
        onProgress = false;
        setJumlahItem(0);
        setResponse([]);
        getApi();

        });
        return()=>{
            subscribe;
        }
    },[navigation,getApi])

    const loadmore = async () =>{
        if(Last === false){
            getApi();
        }
    }

    const moveDetail = (item)=>{
        console.log(item);
        navigation.navigate('DetailWisata',{
            'id_wisata' : item.id
        });
    }

    const itemRender = useCallback(({item})=>{
        console.log(item);
        return(
            <SafeAreaView style={style.listContainer}>
            <Pressable onPress={()=>{moveDetail(item)}}>
            <Image source={{uri:item.gambar}} resizeMode={'stretch'} style={style.imageStyle}/>

            </Pressable>
            <Text style={style.textStyle}>{item.nama}</Text>
            </SafeAreaView>
        );
    });


    const getApi = async ()=>{
        if(onProgress){
            return;
        }
        onProgress = true;
        await Api.post('api/tempat_wisata',{
            "start" : offset,
            "count" : length
        }).then(res =>{
            let body = res.data;
            let response = body.response;
            let metadata = body.metadata;
            if(metadata.status === 200){
                console.log("testeslistwisata", response);
                setResponse(response);
                setResponse(offset === 0 ? response: [...response, ...response]);
                offset = response.length === 0 ? offset + response.length : offset;
                setLast(response.length !== length ? true : false);
                setDataKosong(false);
                setJumlahItem(jumlahItem + response.length);
            }else if(metadata.status === 401){
                setDataKosong(true);
            }else if(metadata.status === 404){
                setDataKosong(true);
            }else{
                if(offset === 0){
                    setDataKosong(true);
                }
                setLast(true);
            }
            setExtraData(!extraData);
        }).catch((err)=>{
            console.log(err);
        })
    }



    return(
    <SafeAreaView style={style.container}>
        <FlatList
            horizontal={false}
            data={response}
            extraData={extraData}
            renderItem={itemRender}
            onEndReached = {loadmore}
            numColumns = {2}
            centerContent={true}
            contentContainerStyle={style.flatlistStyle}
            style={{flex:1}}
        />
    </SafeAreaView>);
}

const style = StyleSheet.create({
    flatlistStyle:{
        justifyContent:'center',
    },
    container:{
        flex:1,
       
        backgroundColor:'white'
    },
    listContainer:{
        height:SCREEN_HEIGHT/3,
        width:SCREEN_WIDTH/2.2,
        flexDirection:'column',
        borderRadius:8,
        margin:8,
        },
    imageStyle : {
        height:SCREEN_HEIGHT/3,
        width:SCREEN_WIDTH/2.2,
        borderRadius:8,
        alignSelf:'center'

    },
    textStyle : {
        fontSize:20,
        position:'absolute',
        bottom:0,
        marginBottom:16,
        fontWeight:'bold',
        alignSelf:'center'
       
    }
})