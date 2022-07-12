import React, { useState,useEffect } from 'react';
import { SafeAreaView, Text, FlatList, Image, Icon, StyleSheet} from 'react-native';
import { Api } from '../../../../util/Api';
import { SessionManager } from '../../../../util/SessionManager';
import { sessionId } from '../../../../util/GlobalVar';
import AnswerDoneList from '../../../../util/ListItem/AnswerDoneList';
export default function QuizAnswer({navigation}){
    const [responJawab, setResponJawab] = useState([]);
 


    useEffect(() => {
        getJawabList();
        loadSession();
         // disable local variable / function
         const unsubscribe = navigation.addListener('focus', () => {
            getJawabList();
           loadSession();
         });
         return () => {
           unsubscribe;
         };
       }, [navigation]);
    

    const getJawabList = async () =>{
        await Api.post('user/quiz/answered',{
             start : 0,
            limit : 10
        }).then(res =>{
            let status = res.data.metadata.status;
            let data = res.data.response.quiz;
            console.log('tesresponstatusjawab', status);
            console.log('tesresponjawab', res.data.response);
            if(status === 200){
                setResponJawab(data);
            }else{

            }
        }).catch(err =>{
            console.log(err);
        })
    } 

    const loadSession = async () => {
        const session = await SessionManager.GetAsObject(sessionId);
        if (session != null) {
          console.log('session ', session);
        }
      };
    return(<SafeAreaView style={style.container}>
<FlatList
data={responJawab}
renderItem={AnswerDoneList}
keyExtractor={(item,index) => {index.toString()}}
showsVerticalScrollIndicator={false}/>
    </SafeAreaView>);
}


const style = StyleSheet.create({
    container :{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white'
    }
})