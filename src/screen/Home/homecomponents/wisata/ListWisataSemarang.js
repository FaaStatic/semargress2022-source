import React, {useEffect,useCallback,useState} from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import ListWisataSemarang from '../../../../util/ListItem/ListWisataSemarang';
import { Api } from '../../../../util/Api';

export default function ListWisataSemarang({navigation, route}){

    
    useEffect(()=>{

        const subscribe = navigation.addListener('focus',() => {
           
          });

          return()=>{
            subscribe;
          }
    },[navigation])


    const getWisata = async () =>{
        
    }

    const moveDetailWisata = (item) =>{
        console.log(item.id)
    }

    useCallback(({item})=>{
        return(
            <ListWisataSemarang item={item} pressCall={moveDetailWisata}/>
        );
    })


    return(<SafeAreaView>
        <FlatList
        numColumns={2}
        renderItem/>
    </SafeAreaView>);
}

const style = StyleSheet.create({

})