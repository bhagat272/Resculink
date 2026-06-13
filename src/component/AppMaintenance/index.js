import React, {useEffect, useState} from 'react';
import {
  Linking,
  Text,
  Alert,
  View,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

import CompareVersions from './CompareVersions';
import deviceInfoModule from 'react-native-device-info';

import {AppState} from 'react-native';
import {SETTING} from '../../appRedux/apis/endpoints';
import {JSON_HEADER, MULTI_PART_HEADER} from '../../appRedux/apis/commonValue';
import {post} from '../../appRedux/apis/apiHelper';
import imagePath from '../../theme/imagePath';
import {hideLoader, showErrorMessage} from '../../utils/helper';
import {firebaseRemoteFetchData} from '../../utils/ firebaseConfigData';

const titleAlert = (title, alertMessage, cb) => {
  Alert.alert(
    title,
    alertMessage,
    [
      {
        text: 'OK',
        onPress: () => {
          if (cb) cb(true);
          // console.log('OK Pressed');
        },
      },
    ],
    {cancelable: false},
  );
};

const titleConfirm = (title, alertMessage, cb) => {
  Alert.alert(
    title,
    alertMessage,
    [
      {
        text: 'OK',
        onPress: () => {
          if (cb) cb(true);
          // console.log('OK Pressed');
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          if (cb) cb(false);
        },
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
};

const AppMaintenanceDialog = props => {
  // return;
  const [isShow, setIsShow] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  // const dispatch = useDispatch();
  useEffect(() => {
    getFirebaseConfigData();

    AppState.addEventListener('change', nextAppState => {
      // console.log("===nextAppState===",nextAppState);
      if (
        //  appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        getFirebaseConfigData();
      }
      setAppState(nextAppState);
    });
  }, []);

  const getFirebaseConfigData = async () => {
    getAppVersionCall();
    // console.log("getFirebaseConfigData------>");
    let data = await firebaseRemoteFetchData();
    console.log('data------->', data);
    // console.log("firebaseRemoteFetchData---------",data?.is_firebase)
    if (data?.is_firebase == '1') {
      checkFirebaseData(data);
    } else {
      // getAppVersionCall();
    }
  };

  const checkFirebaseData = data => {
    // console.log("here--------",data);

    if (Platform.OS == 'ios') {
      if (data?.ios_version) {
        checkVersionData(data?.ios_version);
      }
    } else {
      if (data?.android_version) {
        checkVersionData(data?.android_version);
      }
    }
  };
  const getAppVersionCall = async () => {
    try {
      const response = await post({
        url: SETTING,
        header: JSON_HEADER,
      });
      console.log('version response---->', response);
      if (response) {
        // console.log("response of time zone api", response);
        if (response?.data) {
          // console.log("response of time one", response);

          checkVersionData(response?.data);

          //   console.log("appVersion", appVersion, checkVersion);
          //   console.log(
          //     "validation check-----",
          //     appMaintenance && appMaintenance == "1"
          //   );
        }
      }
    } catch (error) {
      hideLoader();
      showErrorMessage();
      //   console.log("review-error----------", error);
    }
  };

  const checkVersionData = data => {
    // console.log("DAtaa==,==",data);
    let appVersion = '';
    let appMaintenance = '';
    let maintenanceMassage = '';
    let checkVersion = '';
    let updateForce = '';
    let LinkingUrl = '';

    if (Platform.OS == 'android') {
      // console.log("response of hey---", response);
      appVersion = deviceInfoModule.getVersion();
      appMaintenance = data.is_maintenance; // android_maintenance
      // appMaintenance = true;
      maintenanceMassage = data.android_message;
      checkVersion = data.android_version;
      updateForce = data.android_force_update;
      LinkingUrl = data.android_app_link;
    } else {
      appVersion = deviceInfoModule.getVersion();
      appMaintenance = data.is_maintenance; // ios_maintenance
      maintenanceMassage = data.ios_message;
      checkVersion = data.ios_version;
      updateForce = data.ios_force_update;
      LinkingUrl = data.ios_app_link;
    }
    if (appMaintenance == 1) {
      // alert("called");
      setIsShow(true);
    } else {
      setIsShow(false);
    }

    /* Check app version work */
    checkUpdateValidation(
      appVersion,
      checkVersion,
      updateForce,
      maintenanceMassage,
      LinkingUrl,
    );
  };

  /* Update Available App Version Validation Function */
  const checkUpdateValidation = async (
    appVersion,
    checkVersion,
    updateForce,
    massage,
    LinkingUrl,
  ) => {
    // console.log(
    //   "ddddd",
    //   appVersion,
    //   checkVersion,
    //   updateForce,
    //   massage,
    //   LinkingUrl
    // );
    // console.log("updateForce", updateForce);
    if (CompareVersions(String(checkVersion), String(appVersion)) == 1) {
      // console.log(
      //   "massage",
      //   massage,
      //   appVersion,
      //   checkVersion,
      //   updateForce,
      //   LinkingUrl
      // );
      if (updateForce && updateForce == 1) {
        // console.log("updateForce");
        titleAlert('Update available', massage, cb => {
          if (cb) {
            Linking.openURL(LinkingUrl).catch(err =>
              console.error('An error occurred', err),
            );
          }
        });
      } else {
        // console.log("updateForce not");

        titleConfirm('Update available', massage, cb => {
          if (cb) {
            Linking.openURL(LinkingUrl).catch(err =>
              console.error('An error occurred', err),
            );
          }
        });
      }
    } else {
      // console.log("not in setting");
    }
  };

  return (
    <>
      {isShow ? (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 1,
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: Dimensions.get('window').width - 50,
              height: Dimensions.get('window').width - 50,
            }}
            resizeMode={'contain'}
            source={imagePath.maintenance}
          />
          <View>
            <Text style={{fontSize: 18, color: '#000000', textAlign: 'center'}}>
              We're undergoing a bit of Scheduled Maintenance
            </Text>
            <Text style={{fontSize: 15, color: 'grey', textAlign: 'center'}}>
              Sorry for the inconvenience. We'll be back and running as fast as
              possible.
            </Text>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

// export default AppMaintenanceDialog;
export default React.memo(AppMaintenanceDialog);
