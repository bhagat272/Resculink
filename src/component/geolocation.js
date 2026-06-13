import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import {Platform} from 'react-native';
import {locationPermissions} from './appPermissions';
import {getDistance} from 'geolib';
import { methodSecurityDecoded } from '../utils/helper';
import { keys } from '../utils/validation/firebaseRemoteConfig';
import { PERMISSIONS, openSettings } from 'react-native-permissions';
import { permissionConfirm } from '../utils/alertController';

export async function geoCurrentLocation(alert = 1, cb) {
  if (Platform.OS == 'android') {
  accessLocation(alert, cb);
  } 
  else {
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

export function slectLatLong(cb) {
  Geolocation.getCurrentPosition(
    info => {
      if (info && info.coords && info.coords.latitude) {
        let form = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        };
        cb(form);
      }
    },
    error => errorCurrentLocation(error),
    {
      enableHighAccuracy: false,
      timeout: 200000,
      maximumAge: 1000,
      distanceFilter: 30,
    },
  );
}

export function errorCurrentLocation(error) {
  alert('Sorry, something is wrong \nPlease check your Device GPS');
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

export function GetDisatnceBetweenTwoLocation(fromPos, toPos) {
  return getDistance(fromPos, toPos);
}
