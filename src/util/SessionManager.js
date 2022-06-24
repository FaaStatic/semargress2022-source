import AsyncStorage from '@react-native-async-storage/async-storage';

export const SessionManager = {

  StoreAsString: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  },

  StoreAsObject: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
      console.log('Saving Error');
    }
  },

  GetAsString: async (key) => {
    try {
      let value = await AsyncStorage.getItem(key);
      return value !== null ? value : null;
    } catch (e) {
      // error reading value
    }
  },

  GetAsObject: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  },

  GetAllKeys: async () => {
    try {
      let keys = [];
      try {
        keys = await AsyncStorage.getAllKeys();
        console.log(keys);
      } catch (e) {
        // read key error
      }
    } catch (e) {
      // error reading value
    }
  },

  GetAllData: async () => {
    let values;
    try {
      values = await AsyncStorage.multiGet(await AsyncStorage.getAllKeys());
    } catch (e) {
      // read error
    }
    console.log(values);
  },

  RemoveValue: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // remove error
    }
  },

  ClearAllKeys: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
  },
};
