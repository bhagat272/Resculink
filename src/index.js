import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  LogBox,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import Routes from './navigation/navigationStack';
import LoaderView from './utils/loaderView';
import { Provider } from 'react-redux';
import configureStore from '../src/appRedux/store';
import Colors from './theme/colors';
import fonts from './theme/fonts';
import base64 from 'react-native-base64';
import NetInfo from '@react-native-community/netinfo';
import {
  requestAndroidNotificationPermission,
  updateDeviceToken,
} from './permissions/notificationPermissions';
import {
  DEVICE_INFO,
  methodSecurityDecoded,
  methodSecurityEncoded,
} from './utils/helper';
import { kPass } from './utils/validation/firebaseRemoteConfig';
import NotificationController from './utils/NotificationController';
import AppMaintenance from './component/AppMaintenance';
import {
  socketConnectionCheck,
  socketCustomDisconnect,
  socketIsConnected,
} from './component/socket';
import { SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreLogs(['new NativeEventEmitter']);
LogBox.ignoreAllLogs();
const store = configureStore();
const App = props => {
  const [checkConnection, setCheckConnection] = useState(null);
  const appState = useRef(AppState.currentState);

  // useEffect(() => {

  //   // methodSecurityEncoded("sk_test_51L3wN0AOi4vXufEG82HQKG7036Ss9t2QrX18hA65J9BpAzaXttpwJ8ckBnCnXhNvfiGFi8BtlVuAGIIDQYP4Y85h00eQPWdDiK");
  //   // methodSecurityDecoded("YzJ0ZmRHVnpkRjgxTVV3emQwNHdRVTlwTkhaWWRXWkZSemd5U0ZGTFJ6Y3dNelpUY3psME1sRnlXREU0YUVFMk5VbzVRbkJCZW1GWWRIUndkMG80WTJ0Q2JrTnVXR2hPZG1acFIwWnBPRUowYkZaMVFVZEpTVVJSV1ZBMFdUZzFhREF3WlZGUVYyUkVhVXM9ZmJpb3BlbnVwWXpKMFptUkhWbnBrUmpneFRWVjNlbVF3TkhkUlZUbHdUa2hhV1dSWFdrWlNlbWQ1VTBaR1RGSjZZM2ROZWxwVVkzcHNNRTFzUm5sWFJFVTBZVVZGTWs1VmJ6VlJia0pDWlcxR1dXUklVbmRrTUc4MFdUSjBRMkpyVG5WWFIyaFBaRzFhY0ZJd1duQlBSVW93WWtaYU1WRlZaRXBUVlZKU1YxWkJNRmRVWnpGaFJFRjNXbFpHVVZZeVVrVmhWWE05Wm1KcGIzQmxiblZ3");

  //   // generateToken()
  //   if (Text.defaultProps == null) Text.defaultProps = {};
  //   Text.defaultProps.allowFontScaling = false;
  //   if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  //   TextInput.defaultProps.allowFontScaling = false;
  //   LogBox.ignoreLogs(['ViewPropTypes']);//ViewPropTypes Error
  //   NetInfo.addEventListener(networkState => {
  //     if (networkState.isInternetReachable) {
  //       setCheckConnection(true);
  //     } else {
  //       setCheckConnection(false);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    //   methodSecurityEncoded("");
    //  methodSecurityDecoded("");
    generateToken();
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;

    LogBox.ignoreLogs(['ViewPropTypes']);

    const unsubscribe = NetInfo.addEventListener(networkState => {
      setCheckConnection(networkState.isInternetReachable);
    });

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts.
    };
  }, []);

  const generateToken = async () => {
    if (Platform.OS == 'android') {
      let status = await requestAndroidNotificationPermission();
    }
    // getDeviceUniqueId();
    console.log('Vishal');
    let token = await updateDeviceToken();
    console.log('token styhgxgcvb======', token);

    DEVICE_INFO.device_token = token ? token : 'Simulator';
  };

  useEffect(() => {
    // when app is background ---------
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (global?.userData?.id) {
          socketConnectionCheck();
        }
      } else {
        if (socketIsConnected()) {
          socketCustomDisconnect();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const usePlatformEdges = () => {
    return useMemo(
      () =>
        Platform.OS === 'android'
          ? ['left', 'right', 'bottom']
          : ['left', 'right'],
      [],
    );
  };
  const edges = usePlatformEdges();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges} >
      <Provider store={store}>
        <Routes />

        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <FlashMessage
          duration={3000}
          position="top"
          style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          }}
        />
        <AppMaintenance />

        <LoaderView />
        {/* <NotificationController/> */}
      </Provider>
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  view_connection: {
    backgroundColor: Colors.primary.RED,
    alignItems: 'center',
    justifyContent: 'center',
    height: Platform.OS == 'ios' ? 45 : 45,
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  text_connection: {
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
    fontFamily: fonts.Montserrat_Bold,
  },
});
