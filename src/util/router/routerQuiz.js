import React, {useState} from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import QuizAnswer from '../../screen/Home/homecomponents/kuis/QuisAnswer';
import QuizDone from '../../screen/Home/homecomponents/kuis/QuisDone';
import QuizReady from '../../screen/Home/homecomponents/kuis/QuisReady';

const StackTab = createMaterialTopTabNavigator();


export default function RouterQuiz({ navigation, route }) {

    const windowWidth = Dimensions.get('window').width;
    

  return (
      <StackTab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        upperCaseLabel: false,
          tabBarItemStyle: { height:45, width: windowWidth/3},
          tabBarStyle: { backgroundColor: 'white', elevation:5, marginTop:0, },
          tabBarActiveTintColor:'#F29836',
          tabBarIndicatorStyle:{
            backgroundColor:'#F29836'
          },
          tabBarLabelStyle:{
            textTransform:'none',
            width:'100%'
          }
      }}>
        <StackTab.Screen
          name="QuizReady"
          component={QuizReady}
          options={{
            tabBarLabel: 'Pertanyaan',
          }}
        />
        <StackTab.Screen
          name="QuizAnswer"
          component={QuizAnswer}
          options={{
            tabBarLabel: 'Dijawab',
          }}
        />
        <StackTab.Screen
          name="QuizDone"
          component={QuizDone}
          options={{
            tabBarLabel: 'Selesai',
          }}
        />
      </StackTab.Navigator>
  );
}
