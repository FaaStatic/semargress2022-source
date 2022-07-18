import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Dimensions , View} from 'react-native';
import { Api } from '../../../util/Api';
import MerchanList from '../../../util/ListItem/MerchantList';
import {
    BallIndicator,
    DotIndicator,
} from 'react-native-indicators';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

var offset = 0;
var Last = false;
var onProgress = false;
var length = 10;

export default function HomeMerchat({ navigation, route }) {

    const [responseList, setResponseList] = useState([]);    
    const [jumlahItem, setJumlahItem] = useState(0);
    const [dataKosong, setDataKosong] = useState(false);
    const [extraData, setExtraData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openLoad, setOpenLoad] = useState(false);


    useEffect(() => {

        const subscribe = navigation.addListener('focus', () => {
            setOpenLoad(true);
            setLoading(false);
            offset = 0;
            onProgress = false;
            setExtraData(false);
            setJumlahItem(0);
            setResponseList([]);
            getApi();

        });
        return () => {
            subscribe;
        }
    }, [])

    const loadmore = async () => {

        if (!Last && !onProgress) {
            setLoading(true);
            offset += length;
            getApi();
        }
    }

    const moveDetail = (data) => {

        const param = {
            id_m: data.id_m,
            kategori: data.id_k,
        }
        // console.log("categoryitem", param);
        navigation.navigate('DetailMerchant', param)
    }

    const itemRender = useCallback(({ item }) => {
        console.log(item);
        return (
            <MerchanList item={item} pressCall={moveDetail} />
        );
    });


    const getApi = async () => {
        
        if (onProgress) {
            return;
        }
        onProgress = true;
        const param = {
            "start": offset,
            "count": length
        }
        await Api.post('merchant/all', param).then(res => {

            let body = res.data;
            let response = body.response;
            let metadata = body.metadata;

            if (metadata.status == 200) {
                setResponseList(offset == 0 ? response : responseList.concat(response));
                Last = response.length !== length ? true : false;
                onProgress = false;
                setDataKosong(false);
                setOpenLoad(false);
                setLoading(false);
            } else if (metadata.status == 401) {
                setDataKosong(true);
                setOpenLoad(false);
                setLoading(false);
                Last = true;
            } else if (metadata.status == 404) {
                setDataKosong(true);
                setOpenLoad(false);
                setLoading(false);
                Last = true;
            } else {
                if (offset == 0) {
                    setDataKosong(true);
                }
                Last = true;
            }

            setExtraData(!extraData);
        }).catch((err) => {
            console.log(err);
        })
    }

    const loadIndice = useCallback(() => {
        if (loading) {
            return (
                <View
                    style={{
                        justifyContent: 'center',
                        marginTop: 8,
                        marginBottom: 8,
                    }}
                >
                    <DotIndicator color="#251468" size={6} />
                </View>
            );
        } else {
            return <></>;
        }
    });


    return (
        <SafeAreaView style={style.container}>

            {openLoad &&
                <View
                    style={{position:'absolute', alignSelf:'center'}}
                >
                    <BallIndicator size={30} color={'#0F2E63'}/> 
                </View>
            }

            <FlatList
                    horizontal={false}
                    data={responseList}
                    extraData={extraData}
                    renderItem={itemRender}
                    onEndReached={loadmore}
                    numColumns={2}
                    ListFooterComponent={loadIndice}
                    keyExtractor={(item, index) => index.toString()}
                    centerContent={true}
                    style={{
                        
                    }}
                    contentContainerStyle={style.flatlistStyle}
                />

        </SafeAreaView>);
}

const style = StyleSheet.create({
    flatlistStyle: {
        justifyContent: 'center',
        marginTop: 16,
        paddingBottom:20,
    },
    container: {
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'white'
    },
    listContainer: {
        height: SCREEN_HEIGHT / 3,
        width: SCREEN_WIDTH / 2.2,
        flexDirection: 'column',
        borderRadius: 8,
        margin: 8,
    },
    imageStyle: {
        height: SCREEN_HEIGHT / 3,
        width: SCREEN_WIDTH / 2.2,
        borderRadius: 8,
        alignSelf: 'center'

    },
    textStyle: {
        fontSize: 20,
        position: 'absolute',
        bottom: 0,
        marginBottom: 16,
        fontWeight: 'bold',
        alignSelf: 'center'

    }
})