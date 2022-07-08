import {Platform, StyleSheet, StatusBar, Dimensions} from 'react-native';
import { colors } from './color';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // ...Platform.select({
    //   ios: {paddingTop: 20},
    //   android: {paddingTop: StatusBar.currentHeight},
    // }),
    backgroundColor: '#F9F9F9',
    margin: 0,
    padding: 0,
    color : 'black',
  },
  conteiner2: {
    width:'100%',
    height:'100%',
  },
  modalStyle: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerSplash: {
    height:windowHeight,
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    top: 0,
    backgroundColor:colors.primary,
    alignItems:'center',
  },
  boxImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    marginTop: 100,
    marginBottom: 20,
  },
  boxImageSplash: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textInputLogin: {
    marginBottom: 16,
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
  btnStyleLogin: {
    width: 100,
    height: 18,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    color: 'white',
  },
  btnStyleGoogle: {
    width: 100,
    height: 100,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 360,
  },
  textInputStyleLogin: {
    color: 'black',
    height: 40,
    width: 40,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
    alignSelf: 'center',
    borderColor: 'black',
  },
});

export default style;
