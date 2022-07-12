import React,{useEffect, useState} from 'react';
import { SafeAreaView, Text, FlatList, Image, Icon, StyleSheet} from 'react-native';
import { Api } from '../../../../util/Api';
import { SessionManager } from '../../../../util/SessionManager';
import { sessionId } from '../../../../util/GlobalVar';
import ExpiredListQuiz from '../../../../util/ListItem/ExpiredListQuiz';



export default function QuizDone({navigation}){

    const [questList, setQuestList] = useState([]);

    useEffect(() => {
       getList();
       loadSession();
        // disable local variable / function
        const unsubscribe = navigation.addListener('focus', () => {
        getList();
          loadSession();
        });
        return () => {
          unsubscribe;
        };
      }, [navigation]);

    const getList = async () => {
      await Api.post('user/quiz/expired', {
        start : 0,
        limit : 10
    }).then(res=>{
        let status = res.data.metadata.status;
        let requestData = res.data.response.quiz;
        let msg = res.data.metadata.message;
        console.log("responseexpiredquiz", res.data);
        if(status === 200){
           setQuestList(requestData);
        }else{
            toastMsg(msg);
        }
      
    }).catch(err => {
        console.log(err);
    })
    }


    const toastMsg = (value) => {
        if (Platform.OS === 'android') {
          ToastAndroid.show(value, ToastAndroid.SHORT);
        } else {
          AlertIOS.alert(value);
        }
      };
    const loadSession = async () => {
        const session = await SessionManager.GetAsObject(sessionId);
        if (session != null) {
          console.log('session ', session);
        }
      };

    return(<SafeAreaView style={style.container}>
        <FlatList
        showsVerticalScrollIndicator={false}
        data={questList}
        keyExtractor={(item,index) => {index.toString()}}
        renderItem={ExpiredListQuiz}/>
    </SafeAreaView>);
}

const style = StyleSheet.create({
    container:{
      backgroundColor:'white',

    }
})