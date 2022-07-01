import React from 'react';
import { SafeAreaView, Text, View, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';


const { height : HEIGHT_CONTAINER } = Dimensions.get('window');
const {width : WIDTH_CONTAINER} = Dimensions.get('window');

export default function FeedList({item}){
return(<SafeAreaView>
    <ScrollView>
        <SafeAreaView>
            <SafeAreaView></SafeAreaView>
            <Image/>
            <Text></Text>
        </SafeAreaView>
    </ScrollView>
</SafeAreaView>);

}

const style = StyleSheet.create({
    imageProfileStyle :{

    },
    imagePromo:{

    },
    container:{
        flex:1,
        minHeight:HEIGHT_CONTAINER/2,
        width:WIDTH_CONTAINER,
    }
})