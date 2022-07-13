import DeviceInfo from 'react-native-device-info'
import {Platform} from 'react-native'

var _Environments = {
    production:  {BASE_URL: 'https://admin.semaranggreatsale.com/', ENV: 'PRODUCTION', API_KEY: ''},
    staging:     {BASE_URL: 'https://dev.semaranggreatsale.com/', ENV: 'STAGING', API_KEY: ''},
    development: {BASE_URL: 'https://dev.semaranggreatsale.com/', ENV: 'DEVELOPMENT', API_KEY: ''},
}

function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    var platform = 'development';
    let bundleId = DeviceInfo.getBundleId();
    let deviceOS = Platform.OS;
    if(deviceOS == 'android'){

        let data = bundleId.split('.');
        let devic = data.length;
        if(data[devic-1] == 'dev'){
            platform = 'development';
        }else{
            platform = 'production';
        }
        return _Environments[platform]
    }

    // ...now return the correct environment
    return _Environments[platform]
}

export const Environment = getEnvironment()
//module.exports = Environment