import {Platform, StyleSheet, StatusBar} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    ...Platform.select({
      ios: {paddingTop: 20},
      android: {paddingTop: StatusBar.currentHeight},
    }),
    backgroundColor: 'white',
    margin: 0,
    padding: 0,
  },
  boxImage: {
    alignSelf: 'center',
    height: 150,
    width: 150,
    marginTop: 100,
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
