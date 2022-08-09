import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  Icon,
  StyleSheet,
  Pressable,
  View,
} from 'react-native';
import { Modal, Provider, Portal, TextInput } from 'react-native-paper';
import { Api } from '../../../../util/Api';
import { SessionManager } from '../../../../util/SessionManager';
import { sessionId } from '../../../../util/GlobalVar';
import KuisListItem from '../../../../util/ListItem/KuisListItem';
export default function QuisReady({ navigation, route }) {
  const [listQuiz, setListQuiz] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [answer, setAnswer] = useState('');
  const [id_quiz, setId_Quiz] = useState(0);

  useEffect(() => {
    loadSession();
    getKuis();

    // disable local variable / function
    const unsubscribe = navigation.addListener('focus', () => {
      getKuis();
      loadSession();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const loadSession = async () => {
    const session = await SessionManager.GetAsObject(sessionId);
    if (session != null) {
      console.log('session ', session.token);
    }
  };

  const getKuis = async () => {
    await Api.post('user/quiz/on_progress', {
      start: 0,
      limit: 10,
    })
      .then((res) => {
        let status = res.data.metadata.status;
        console.log('status request', status);
        if (status === 200) {
          console.log('kuiz', res.data.response.quiz);
          setListQuiz(res.data.response.quiz);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toastMsg = (value) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(value, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(value);
    }
  };

  const answerChalenge = (data) => {
    setVisibleModal(true);
    setId_Quiz(data.id);
    console.log('testdatamodal', data);
  };
  const submitAnswer = async () => {
    await Api.post('user/quiz/send_answer', {
      id_quiz: id_quiz,
      jawaban: answer,
    }).then(res => {
        let status = res.data.metadata.status;
        let msg = res.data.metadata.msg;
        console.log("status", status );
        if(status === 200){
        setVisibleModal(false);
        toastMsg(msg)
        }else if(status === 400){
            setVisibleModal(false);
            toastMsg(msg)
        }
    }).catch(err => {
        
    })
  };

  const keyIdExtra = (item) => {
    return item.id;
  };

  const itemRender = useCallback(({ item }) => {
    return (
        <KuisListItem item={item} onModal={answerChalenge} />
    );
  }, []);

  return (
    <Provider>
      <Portal>
        <Modal visible={visibleModal} contentContainerStyle={style.ModalStyle}>
          <View style={style.containerModalStyle}>
            <Text style={style.textHeader}>JAWABANMU ADALAH</Text>
            <Text
              style={[
                style.TextStyleGeneral,
                {
                  fontWeight: 'bold',
                  fontSize: 12,
                  marginBottom: 8,
                },
              ]}
            >
              Jawaban
            </Text>
            <Text style={style.TextStyleGeneral}>
              Berikan jawaban yang sesuai dengan pertanyaan
            </Text>
            <TextInput
              mode="flat"
              underlineColor="grey"
              selectionColor={'#F29836'}
              theme={theme}
              style={style.textInputStyle}
              value={answer}
              onChangeText={(value) => setAnswer(value)}
            />
            <View style={style.containerBtn}>
              <Pressable
                onPress={() => {
                  setVisibleModal(false);
                }}
              >
                <Text style={style.textBtnCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={submitAnswer}
                style={style.btnAnswer}
              >
                <Text style={style.textBtnAnswer}>Kirim</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </Portal>
      <View style={style.container}>
        <FlatList
          data={listQuiz}
          renderItem={itemRender}
          keyExtractor={(item,index) => {index.toString()}}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Provider>
  );
}

const theme = {
  colors: {
    primary: '#F29836',
    placeholder: 'grey',
    text: 'black',
    textAlign: 'center',
    underlineColor: 'grey',
    background: 'transparent',
  },
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    flexDirection: 'row',
  },
  ModalStyle: {
    height: 375,
    width: 275,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 16,
  },
  containerModalStyle: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'white',
    justifyContent: 'center',
  },
  containerBtn: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnAnswer: {
    height: 36,
    width: 80,
    backgroundColor: '#F29836',
    justifyContent: 'center',
    borderRadius: 8,
    marginStart: 64,
  },
  textBtnAnswer: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    alignSelf: 'center',
    fontFamily:"neutrifpro-regular",
  },
  textBtnCancel: {
    fontSize: 14,
    width:50,
    fontWeight: '600',
    color: 'black',
    marginTop: 8,
    fontFamily:"neutrifpro-regular",
    alignSelf: 'center',
  },
  textHeader: {
    color: '#0F2E63',
    alignSelf: 'center',
    fontSize: 24,
    margin: 16,
    fontFamily:"neutrifpro-regular",
    textAlign: 'center',
  },
  textInputStyle: {
    backgroundColor: 'transparent',
    color: 'black',
    marginStart: 16,
    marginEnd: 16,
    marginBottom: 64,
  },
  TextStyleGeneral: {
    fontSize: 10,
    color: 'black',
    marginStart: 16,
    fontFamily:"neutrifpro-regular",
    marginBottom: 16,
  },
});
