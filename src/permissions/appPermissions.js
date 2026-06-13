import React from 'react';
import {Alert, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';

import {getData, setData} from '../appRedux/apis/keyChain';
import {kAndroidProminent} from '../appRedux/apis/commonValue';
import {messages} from './permissionMessage';
import {AppConstant} from '../constants/appconstant';

export const settingAlert = msg => {
  Alert.alert(
    AppConstant.appName,
    msg,
    Platform.OS == 'ios'
      ? [
          {
            text: 'CONTINUE',
            onPress: () => {},
            style: 'cancel',
          },
        ]
      : [
          {
            text: 'CONTINUE',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'SETTINGS',
            onPress: () => {
              openSettings().catch(() => {
                console.warn('cannot open settings');
              });
            },
          },
        ],
    {cancelable: false},
  );
};

export const cameraPermissions = async cb => {
  await check(
    Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  ).then(result => {
    if (result == 'granted' || result == 'limited') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.CAMERA_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
    ).then(status => {
      if (status == 'granted') {
        return cb(true);
      } else if (status == 'blocked') {
        settingAlert(messages.CAMERA_PERMISSION_SETTING);
        cb(false);
      }
    });
  });
};

export const galleryPermissions = async cb => {
  await check(
    Platform.select({
      android:
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    }),
  ).then(result => {
    console.log('result----------', result);
    if (Platform.OS === 'android') {
      return cb(true);
    }
    if (result == 'granted' || result == 'limited') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.GALLERY_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android:
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    ).then(status => {
      console.log('status----------', status);

      if (status == 'granted') {
        cb(true);
      } else if (status == 'blocked') {
        if (Platform.OS === 'ios') {
          settingAlert(messages.GALLERY_PERMISSION_SETTING);
        }
        cb(false);
      }
    });
  });
};

export const contactPermissions = async cb => {
  await check(
    Platform.select({
      android:
        PERMISSIONS.ANDROID.WRITE_CONTACTS && PERMISSIONS.ANDROID.READ_CONTACTS,
      ios: PERMISSIONS.IOS.CONTACTS,
    }),
  ).then(result => {
    if (result == 'granted') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.CONTACT_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android:
          PERMISSIONS.ANDROID.WRITE_CONTACTS &&
          PERMISSIONS.ANDROID.READ_CONTACTS,
        ios: PERMISSIONS.IOS.CONTACTS,
      }),
    ).then(status => {
      if (status == 'granted') {
        return cb(true);
      }
    });
  });
};

export const methodAndroidContactPermission = async cb => {
  let status = await getData(kAndroidProminent);
  if (status) {
    return cb(true);
  } else {
    Alert.alert('Contacts Permission', messages.CONTACT_PERMISSION_NEED, [
      {
        text: 'OK',
        onPress: () => {
          setData(kAndroidProminent, true);
          return cb(true);
        },
      },
    ]);
  }
};

export const locationPermissions = async cb => {
  await check(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  ).then(result => {
    if (result == 'granted' || result == 'limited') {
      return cb(true);
    } else if (result == 'blocked' || result == 'unavailable') {
      settingAlert(messages.LOCATION_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    ).then(status => {
      if (status == 'granted') {
        return cb(true);
      } else {
        cb(false);
      }
    });
  });
};

export const checkMicroPhonePermission = async () => {
  return new Promise(async (resolve, reject) => {
    await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        ios: PERMISSIONS.IOS.MICROPHONE,
      }),
    ).then(result => {
      if (result == 'granted') {
        resolve(true);
      } else if (result == 'blocked' || result == 'unavailable') {
        settingAlert(messages.MICROPHONE_PERMISSION_SETTING);
        resolve(false);
        return;
      }
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.RECORD_AUDIO,
          ios: PERMISSIONS.IOS.MICROPHONE,
        }),
      ).then(status => {
        if (status == 'granted' || status == 'limited') {
          resolve(true);
        } else {
          settingAlert(messages.MICROPHONE_PERMISSION_SETTING);
          resolve(false);
          return;
        }
      });
    });
  });
};

export const checkCameraPermission = async () => {
  return new Promise(async (resolve, reject) => {
    await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
    ).then(result => {
      if (result == 'granted') {
        resolve(true);
      } else if (result == 'blocked' || result == 'unavailable') {
        settingAlert(messages.CAMERA_PERMISSION_SETTING);
        resolve(false);
        return;
      }
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        }),
      ).then(status => {
        if (status == 'granted' || status == 'limited') {
          resolve(true);
        } else {
          settingAlert(messages.CAMERA_PERMISSION_SETTING);
          resolve(false);
          return;
        }
      });
    });
  });
};
