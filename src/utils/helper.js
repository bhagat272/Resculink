import React from 'react';
import {Alert, Platform} from 'react-native';
import {handleSetRoot} from '../navigation/navigationService';
import {kUserData, kUserToken, kSorryError} from '../appRedux/apis/commonValue';
import {getData, removeItemValue, setData} from '../appRedux/apis/keyChain';
import {showToastMessage} from './Toast';
import DeviceInfo from 'react-native-device-info';
import base64 from 'react-native-base64';
import {Video} from 'react-native-compressor';
import {kPass} from './validation/firebaseRemoteConfig';
import {setAppSessionReducer} from '../appRedux/actions/appSessionAction';
import {NOTIFICATION_COUNTT} from '../appRedux/constants/appSessionType';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {
  socketCustomLogoutDisconnect,
  socketIsConnected,
} from '../component/socket';
// const dispatch = useDispatch();
// import { socketCustomLogoutDisconnect, socketIsConnected } from "../component/socket";
export const loaderRef = ref => {
  globalLoader = ref;
};
export const addReferenceToLoader = ref => {
  globalLoader = ref;
};

export const getCompressedVideo = async (path, cb) => {
  Video.compress(path, {compressionMethod: 'manual'}).then(res => cb(res));
};

export const socketInstance = {
  socket: null,
  isCustomDisconnect: false,
};
export const methodSecurityDecoded = data => {
  let doubleDecodeString = base64.decode(data);
  let singleDat = doubleDecodeString.split(kPass);
  if (singleDat && singleDat.length > 0) {
    let singleEndCodeData = singleDat[0];
    let singleDecodeString = base64.decode(singleEndCodeData);
    // console.log('methodSecurityDecoded==sendEDncode-----------', singleDecodeString)
    return singleDecodeString;
  }
};

// export const countDelete = () =>{
//   dispatch(setAppSessionReducer(NOTIFICATION_COUNTT, 0))
// }

export const methodSecurityEncoded = data => {
  let singleEncode = base64.encode(data);
  let encodeSingleWithPass = base64.encode(singleEncode + kPass);
  let sendEncode = base64.encode(singleEncode + kPass + encodeSingleWithPass);
  // console.log('sendEncode-----------', sendEncode)
  return sendEncode;
};

export const showLoader = () => {
  globalLoader?.showLoader();
};

export const hideLoader = () => {
  globalLoader?.hideLoader();
};

export const hasNotchDisplay = val => {
  global.hasNotch = val;
};
export const setDefaultValues = navigation => {
  global.navRef = navigation;
};

const setGlobalUserToken = token => {
  global.userToken = token;
};
const setUserData = data => {
  global.userData = data;
};

export const showErrorMessage = () => {
  showToastMessage(kSorryError);
};

export const setUserType = type => {
  // console.log("type-->>111", type);
  global.user_type = type;
};

export const getTimeDifference = oldTime => {
  let old = new Date(oldTime);
  // moment.utc(date).local().format;

  const currentTime = new Date(); // Get the current time
  const timeDiff = currentTime.getTime() - old.getTime(); // Calculate the difference in milliseconds
  // Convert the time difference to minutes, hours, days, etc.
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
  const dateDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7 * 4));
  const newTime = new Date(old.getTime() + dateDays); // Add 4 weeks to the old time
  //4 weeks later date come
  // Return the time difference in the desired format
  if (dateDays > 0) {
    return moment(newTime).format('DD/MM/YYYY');
  } else if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    if (minutes >= 1) {
      return `${minutes}m`;
    } else {
      return `Just Now`;
    }
  }
};

export const logout = async (isLogin = true) => {
  // countDelete()
  global.user_type = '';
  setGlobalUserToken('');
  global.userToken = '';
  setUserData('');
  let removeUser = await removeItemValue(kUserData);
  let removeToken = await removeItemValue(kUserToken);
  // console.log("removeUser--->", removeUser, "removeToken -----", removeToken);

  if (socketIsConnected()) {
    socketCustomLogoutDisconnect();
  }
  if (isLogin) {
    // console.log("isLogin--",isLogin);

    handleSetRoot({name: 'Welcome'});
  }
  // socketCustomLogoutDisconnect();
};

export const getDeviceUniqueId = async () => {
  let device = await DeviceInfo.getUniqueId();
  DEVICE_INFO.device_unique_id = device;
  return device;
};

export const DEVICE_INFO = {
  device_type: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
  device_id: DeviceInfo.getDeviceId(),
  device_unique_id: getDeviceUniqueId(),
  device_token: 'Simulator',
};

export const saveAuthToken = authToken => {
  global.AuthToken = authToken;
};

export {setGlobalUserToken, setUserData};
