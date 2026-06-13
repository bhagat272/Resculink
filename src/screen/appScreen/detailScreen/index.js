import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  TextInput,
  Dimensions,
  Keyboard,
  DeviceEventEmitter,
  Alert,
  BackHandler,
} from 'react-native';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import fonts from '../../../theme/fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CancelModal from './cancelModal';
import UserInfoModal from './userInfoModal';
import { translateText } from '../../../utils/language';
import {
  cancelSignalApi,
  setAppSessionReducer,
  userSignalDetailApi,
} from '../../../appRedux/actions/appSessionAction';
import { loadingShow } from '../../../appRedux/actions/loadingAction';
import { USER_SIGNAL_DETAIL_DATA } from '../../../appRedux/constants/appSessionType';
import { getProfileAction } from '../../../appRedux/actions/userSessionAction';
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
} from '../../../component/socket';
import MarkResolveModal from './markresolveModal';
import { showToastMessage } from '../../../utils/Toast';
import { useIsFocused } from '@react-navigation/native';
import { AppConstant } from '../../../appRedux/constants/appconstant';
import NotificationController from '../../../utils/NotificationController';

const DetailScreen = props => {
  const { type, item } = props?.route?.params ? props?.route?.params : false;

  console.log('type-->', type);

  const dispatch = useDispatch();
  const { user_signal_detail_data } = useSelector(state => state.appSession);
  const isFocused = useIsFocused();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [markModalVisible, setMarkModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [shortHeight, setShortHeight] = useState();
  const [providerData, setProviderData] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  console.log("user_signal_detail_data----->", user_signal_detail_data);
  const userData = useSelector(state => state.session.userData);

  // console.log("userData---->",userData);
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.099;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [initialCoords, setInitialCoords] = useState({
    latitude: parseFloat(userData.latitude)
      ? parseFloat(userData?.latitude)
      : 33.753746,
    longitude: parseFloat(userData?.longitude)
      ? parseFloat(userData?.longitude)
      : -84.38633,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    // methodAceptData()

    socketConnectionCheck();

    let messageReceiverListenerr = DeviceEventEmitter.addListener(
      'resolved_listner',
      async response => {
        // console.log("responeeee0000000",response);
        // setProviderData(response)
        if (response) {
          DeviceEventEmitter.emit('markresolve');
          showToastMessage('Your issue has been resolved', 'success');
          // setMarkModalVisible(true);
          // props.navigation.reset({
          //   index: 0,
          //   routes: [{name: 'FirstHome'}],
          // });

          props.navigation.navigate('HomeScreen');
          // methodSelfMsg(response)
        }
      },
    );
    console.log('=================>showhelp', showHelp)
    let messageReceiverListener = DeviceEventEmitter.addListener(
      'accept_request_listener',
      async response => {
        console.log('responeeee0000000', response);

        setShowHelp(true)
        socketConnectionCheck();
        setProviderData(response);
        if (response) {
          const data = {
            signal_id: item?.data?.id ? item?.data?.id : item?.pending_signal,
          };
          dispatch(userSignalDetailApi(data));

          // methodSelfMsg(response)
        }
      },
    );

    dispatch(getProfileAction());

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidShowListenerHide = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    if (keyboardDidShowListener && keyboardDidShowListener.remove)
      keyboardDidShowListener.remove();

    if (keyboardDidShowListenerHide && keyboardDidShowListenerHide.remove)
      keyboardDidShowListenerHide.remove();

    return () => {
      messageReceiverListener.remove();
      messageReceiverListenerr.remove();

      //   msgData = [];
      //   global.chatToUser = '';
      //   if (keyboardDidShowListener && keyboardDidShowListener.remove)
      //     keyboardDidShowListener.remove();

      //   if (keyboardDidShowListenerHide && keyboardDidShowListenerHide.remove)
      //     keyboardDidShowListenerHide.remove();
    };
  }, []);
  const _keyboardDidShow = e =>
    setShortHeight(Platform.OS == 'android' ? 0 : e.endCoordinates.height);
  const _keyboardDidHide = e => setShortHeight(0);

  const methodAceptData = () => {
    socketConnectionCheck();

    // console.log("groupData-----------------", data);
    // return
    socketEmit(socketEvent.accept_request_listener, data => {
      // console.log("data-----sssssss--->",data);

      if (data?.status) {
        const data = {
          signal_id: item?.data?.id ? item?.data?.id : item?.pending_signal,
        };
        dispatch(userSignalDetailApi(data));
      }
    });
  };

  useEffect(() => {
    socketConnectionCheck();
  }, [isFocused]);

  useEffect(() => {
    dispatch(loadingShow(true));
    const data = {
      signal_id: item?.data?.id ? item?.data?.id : item?.pending_signal,
    };
    // console.log("data---->",data);

    // setLoader(true)
    dispatch(userSignalDetailApi(data)).then(res => {
      // console.log("res---->",res);

      if (res) {
        setProviderData(res);
        // setLoader(false);
        dispatch(loadingShow(false));
      }
    });
    return () => {
      dispatch(setAppSessionReducer(USER_SIGNAL_DETAIL_DATA, ''));
    };
  }, []);

  const cancleSignal = () => {
    setCancelModalVisible(false);
    const data = {
      signal_id: user_signal_detail_data?.id,
    };
    // console.log("data=---->",data);
    // return
    dispatch(cancelSignalApi(data)).then(res => {
      // console.log("res",res);

      if (res) {
        // if (item?.pending_signal != 0)
        if (res) {
          dispatch(getProfileAction());

          props.navigation.reset({
            index: 0,
            routes: [{ name: 'FirstHome' }],
          });
        } else {
          dispatch(getProfileAction());
          setCancelModalVisible(false);
          props.navigation.pop(2);
        }
      }
    });
  };

  // const BackButtonAlertScreen = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        AppConstant.appName,
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false },
      );
      return true;
    };

    let subscription;

    if (isFocused) {
      subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    }

    return () => {
      // This is the correct way
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isFocused]);

  const goToNotification = item => {
    props.navigation.navigate('UserNotification');
  };

  const redirectToscreen = item => {
    let encryptedData = item?.data;
    if (
      encryptedData?.type == 'party_invitation' ||
      encryptedData?.type == 'broadcast_notification' ||
      encryptedData?.type == 'checkout'
    ) {
      goToNotification(encryptedData);
    }
    if (encryptedData?.type == 'party_group') {
      goToPartyGroup(encryptedData);
    }
  };

  const goToPartyGroup = item => { };

  const createNotificationListeners = () => {
    messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        console.log('remoteMessage================ onMessage', remoteMessage);
        // if (remoteMessage) {
        //   console.log('remoteMessage?.data?.type===' + remoteMessage?.data);
        //   if (remoteMessage?.data?.type == 'accept_signal') {
        //     const data = {
        //       signal_id: remoteMessage?.data?.signal_id,
        //     };
        //     dispatch(userSignalDetailApi(data));
        //   }
        // }
      }
    });
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'remoteMessage================ onNotificationOpenedApp',
        remoteMessage,
      );
      let encryptedData = remoteMessage?.data;
      if (encryptedData) {
        if (
          encryptedData?.type == 'party_invitation' ||
          encryptedData?.type == 'broadcast_notification' ||
          encryptedData?.type == 'checkout'
        ) {
          goToNotification(encryptedData);
        }
        if (encryptedData?.type == 'party_group') {
          goToPartyGroup(encryptedData);
        }
      }
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log(
          'remoteMessage================ getInitialNotification',
          remoteMessage,
        );
        let encryptedData = remoteMessage?.data;
        if (encryptedData) {
          if (
            encryptedData?.type == 'party_invitation' ||
            encryptedData?.type == 'broadcast_notification'
          ) {
            goToNotification(encryptedData);
          }
          if (encryptedData?.type == 'party_group') {
            goToPartyGroup(encryptedData);
          }
        }
      });
  };
  return (
    <View
      style={{ ...styles.container, paddingTop: Platform.OS == 'ios' ? 60 : 0 }}>
      {user_signal_detail_data ? (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: Platform.OS == 'ios' ? 20 : 50,
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                dispatch(getProfileAction());
              }}>
              <Image source={imagePath.location} />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: fonts.Montserrat_SemiBold,
                fontSize: fonts.SIZE_16,
                color: '#0B6EBC',
              }}>
              {item?.data?.assistance_type == 'medical'
                ? 'Medical'
                : 'Security'}
            </Text>
            <Text
              onPress={() => {
                setCancelModalVisible(true);
              }}
              style={{
                fontFamily: fonts.Montserrat_Regular,
                fontSize: fonts.SIZE_12,
                color: '#0B6EBC',
                textDecorationLine: 'underline',
              }}>
              {translateText('Cancel')}
            </Text>
          </View>
          {/* <KeyboardAwareScrollView style={{ marginBottom: 60 }}> */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: fonts.Montserrat_SemiBold,
                fontSize: fonts.SIZE_18,
                marginTop: 20,
                color: '#111B34',
              }}>

              {showHelp || user_signal_detail_data?.status ? translateText('Help_is_on_the_way') : translateText('Sending your request for help...')}
            </Text>
            <Text
              style={{
                fontFamily: fonts.Montserrat_Regular,
                fontSize: fonts.SIZE_14,
                color: '#111B34',
                marginTop: 2,
              }}>
              {translateText('Your_location')} {'\n'}{' '}
              {translateText('the_responders')}
            </Text>
          </View>

          <MapView
            initialRegion={initialCoords}
            style={styles.map}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
          // showsMyLocationButton={true}
          >
            {!Platform.OS === 'ios' ? (
              <Marker
                onPress={() => { }}
                coordinate={initialCoords}
                image={
                  userData?.profile_picture
                    ? {
                      uri: IMAGE_URL + userData?.profile_picture,
                    }
                    : imagePath.logo
                }
              />
            ) : (
              <Marker
                onPress={() => { }}
                coordinate={{
                  latitude: parseFloat(userData?.latitude)
                    ? parseFloat(userData?.latitude)
                    : 33.753746,
                  longitude: parseFloat(userData?.longitude)
                    ? parseFloat(userData?.longitude)
                    : -84.38633,
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {userData?.profile_picture ? (
                    <ImageLoadView
                      style={{
                        height: 30,
                        width: 30,
                      }}
                      source={{
                        uri: IMAGE_URL + userData?.profile_picture,
                      }}
                    />
                  ) : (
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                      }}
                      source={imagePath.logo}
                    />
                  )}
                </View>
              </Marker>
            )}
          </MapView>

          {user_signal_detail_data?.status ? (
            <TouchableOpacity
              onPress={() => {
                socketConnectionCheck(),
                  props.navigation.navigate('ChatScreen', {
                    other_user_id: user_signal_detail_data?.provider_detail?.id,
                    item: user_signal_detail_data,
                    providerAllData: providerData,
                  });
              }}
              activeOpacity={0.6}
              style={{
                height: 65,
                width: 65,
                position: 'absolute',
                bottom: 20,
                right: 20,
                alignSelf: 'flex-end',
                backgroundColor: '#0B6EBC',
                borderRadius: 65 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                tintColor={'white'}
                source={imagePath.chat}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}

          <CancelModal
            visible={cancelModalVisible}
            onCancel={() => {
              setCancelModalVisible(false);
            }}
            onConfirm={() => {
              // setCancelModalVisible(false);
              cancleSignal();
            }}
          />

          <MarkResolveModal
            visible={markModalVisible}
            onCancel={() => {
              setMarkModalVisible(false);
            }}
            onConfirm={() => {
              setMarkModalVisible(false);
              // setCancelModalVisible(false);
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'FirstHome' }],
              });
            }}
          />

          <UserInfoModal
            visible={userModalVisible}
            onCancel={() => {
              setUserModalVisible(false);
            }}
            onConfirm={() => {
              setUserModalVisible(false);
              //   props.navigation.pop(2)
            }}
          />
        </View>
      ) : (
        <></>
      )}
      {Platform.OS == 'android' ? (
        <NotificationController
          onClick={onClick => {
            redirectToscreen(onClick);
          }}
          props={props}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

export default DetailScreen;
