import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import { methodSecurityDecoded } from '../utils/helper';
import { keys } from '../utils/validation/firebaseRemoteConfig';
import { alert, permissionConfirm } from '../utils/alertController';
import GetLocation from 'react-native-get-location';

export function checkLocationPermission(cb) {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(result => {
    if (result === 'granted') {
      cb(true);
    } else if (result === 'blocked' || result === 'unavailable') {
      cb(false);
    }
  });
}

export async function geoCurrentLocation(alert = 1, cb) {
  if (Platform.OS == 'android') {
    accessLocation(alert, cb);



  } else {
    accessLocation(alert, cb);
  }
}

export function accessLocation(alert, cb) {
  check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(result => {
    if (result === 'granted') {
      slectLatLong(cb);
      return;
    }
    if (result === 'blocked' || result === 'unavailable') {
      if (alert == 1) {
        permissionConfirm(
          'Access to the location has been prohibited please enable it in the Settings app to continue.',
          status => {
            if (status) {
              openSettings().catch(() => {
                console.warn('cannot open settings');
              });
            } else {
              cb({ latitude: '', longitude: '' });
            }
          },
        );
        return;
      }
    }
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    ).then(status => {
      if (status === 'granted') {
        slectLatLong(cb);
      } else {
        cb({ latitude: '', longitude: '' });
      }
    });
  });
}

export function GetAddressFromLatLong(latitude, longitude, cb) {
  fetch(
    'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    latitude +
    ',' +
    longitude +
    '&key=' +
    methodSecurityDecoded(keys.google_place_api_key),
  )
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson && responseJson.results.length > 0) {
        let addressComponent = responseJson.results[0].formatted_address;
        cb(addressComponent);
      } else {
        cb(false);
      }
    })
    .catch(err => {
      cb(false);
    });
}

export function slectLatLong(cb) {
 

  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      if (location.latitude && location?.longitude) {
        let form = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        cb(form);
      }
    })
    .catch(error => {
      setTimeout(() => {
        slectLatLong(cb)
      }, 2000);
    });
}

export function errorCurrentLocation(error) {
  alert('Sorry, something is wrong \nPlease check your Device GPS');
}
