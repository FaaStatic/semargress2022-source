import { useCallback } from 'react';
import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';


  export const currentLocation = async () => {
    try {
         Geolocation.getCurrentPosition(
          async (pos) => {
          const datapos = pos.coords;
          console.log("current", datapos)
          return datapos;
          },
          (err) => {
            console.log(err.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    } catch (error) {
      console.log(error.message);
    }
   
  }

 export const GrantLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
        title: 'Semargres Meminta Izin Lokasi',
        message:
          'Semargres Membutuhkan akses lokasi untuk menyesuaikna merchant terdekat pengguna',
        buttonNeutral: 'Tanya Nanti',
        buttonNegative: 'Batal',
        buttonPositive: 'Iya',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTES) {
        console.log('StatusLokasi', granted);
        return granted;
      } else {
        console.log('StatusLokasi', granted);
        return granted;
      }
    } catch (error) {
      console.log(error.message);
    }
 
}
