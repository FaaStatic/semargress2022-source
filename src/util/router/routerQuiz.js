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
          tabBarItemStyle: { height:45, width: Math.ceil(windowWidth/3)},
          tabBarStyle: { backgroundColor: 'white', elevation:5, marginTop:0, },
          tabBarActiveTintColor:'#0F2E63',
          tabBarIndicatorStyle:{
            backgroundColor:'#0F2E63'
          }
      }}>
        <StackTab.Screen
          name="QuizReady"
          component={QuizReady}
          options={{
            tabBarLabel: 'Berlangsung',
          }}
        />
        <StackTab.Screen
          name="QuizDone"
          component={QuizDone}
          options={{
            tabBarLabel: 'Selesai',
          }}
        />
        <StackTab.Screen
          name="QuizAnswer"
          component={QuizAnswer}
          options={{
            tabBarLabel: 'Dijawab',
          }}
        />
      </StackTab.Navigator>
  );
}
