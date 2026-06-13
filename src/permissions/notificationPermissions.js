import {DeviceEventEmitter, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {DEVICE_INFO} from '../utils/helper';

export async function updateDeviceToken() {
  let token = null;
  if (Platform.OS === 'android') {
    token = await getToken();
  } else {
    console.log('Vishal1');
    token = await checkPermission();
  }
  return token;
}

export async function sendToken(fcmToken) {
  DEVICE_INFO.device_token = fcmToken;
  if (global.userData) {
    const data = {
      device_unique_id: DEVICE_INFO.device_unique_id,
      device_type: DEVICE_INFO.device_type,
      device_token: DEVICE_INFO.device_token,
    };
  }

  return fcmToken;
}

export async function getToken() {
  if (Platform.OS === 'ios') {
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
  }

  let fcmToken = null;
  console.log('error raised in fcm token');
  try {
    fcmToken = await messaging().getToken();
  } catch (error) {
    console.log('error raised in fcm token', error);
  }
  console.log('fcmToken------->', fcmToken);
  if (fcmToken) {
    DEVICE_INFO.device_token = fcmToken;
    return fcmToken;
  } else {
    DEVICE_INFO.device_token = 'Simulator';
    return fcmToken;
  }
}

export async function checkPermission() {
  const authStatus = await messaging().hasPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return getToken();
  } else {
    return requestPermission();
  }
}

export async function requestPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      return getToken();
    }
  } catch (error) {
    console.log('Permission rejected/error', error);
  }
}
export const requestAndroidNotificationPermission = async () => {
  return new Promise((resolve, reject) => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      }),
    )
      .then(result => {
        if (
          result === 'blocked' ||
          result === 'unavailable' ||
          result === 'denied'
        ) {
          request(
            Platform.select({
              android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
            }),
          )
            .then(res => {
              resolve(true);
            })
            .catch(e => {
              resolve(false);
            });
        } else {
          resolve(true);
        }
      })
      .catch(e => {
        resolve(false);
      });
  });
};

async function updateNotificationToken(request) {}
