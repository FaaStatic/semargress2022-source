import React from 'react';
import Router from './src/util/router/router';
import FlashMessage from "react-native-flash-message";
import { StatusBar, SafeAreaView} from 'react-native';

function App() {
  return (
    <>
      <Router />
      <FlashMessage 
          hideStatusBar={false}
          statusBarHeight={StatusBar.currentHeight}
          floating={true}
          animationDuration={240}
          position="bottom" /> 
    </>
  );
}

export default App;
