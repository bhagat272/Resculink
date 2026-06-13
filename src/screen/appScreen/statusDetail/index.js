import React, {useEffect, useRef, useState} from 'react';
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
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import fonts from '../../../theme/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {translateText} from '../../../utils/language';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {SIGNAL_DETAIL_DATA} from '../../../appRedux/constants/appSessionType';
import {
  acceptSignalApi,
  markResolveApi,
  setAppSessionReducer,
  signalDetailApi,
  updtaelatlong,
} from '../../../appRedux/actions/appSessionAction';
import {getTimeDifference} from '../../../utils/helper';
import AssistanceModal from './assistanceModal';
import SecurityModal from './securityModal';
import {AppButton} from '../../../component';
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
} from '../../../component/socket';
import {showToastMessage} from '../../../utils/Toast';
import {getProfileAction} from '../../../appRedux/actions/userSessionAction';
import {AppConstant} from '../../../appRedux/constants/appconstant';
import {useIsFocused} from '@react-navigation/native';
import {geoCurrentLocation} from '../../../permissions/getLocation';
const StatusDetail = props => {
  const mapRef = useRef(null);
  const [showMsg, setShowMsg] = useState(false);
  const {item, itemm, fromSplesh} = props?.route?.params
    ? props?.route?.params
    : false;

  const isFocused = useIsFocused();
  // console.log("fromSplesh---->", fromSplesh);

  const dispatch = useDispatch();
  const [shortHeight, setShortHeight] = useState();
  const userData = useSelector(state => state.session.userData);
  const [localLoader, setLoader] = useState(false);
  const [medicalModalVisible, setMedicalModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  // console.log("userData---->",userData);
  const {signal_detail_data} = useSelector(state => state.appSession);
  // console.log("signal_detail_data------->",signal_detail_data);

  // console.log("latitude--->", parseFloat(signal_detail_data?.latitude));
  // console.log("longitude--->", parseFloat(signal_detail_data?.longitude));

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [initialCoords, setInitialCoords] = useState({
    latitude: parseFloat(signal_detail_data?.latitude)
      ? parseFloat(signal_detail_data?.latitude)
      : 33.753746,
    longitude: parseFloat(signal_detail_data?.longitude)
      ? parseFloat(signal_detail_data?.longitude)
      : -84.38633,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  console.log('=====>', signal_detail_data);

  useEffect(() => {
    socketConnectionCheck();

    let messageReceiverListenerr = DeviceEventEmitter.addListener(
      'canceled_listner',
      async response => {
        if (response) {
          showToastMessage('User has cancelled the request', 'success');

          props.navigation.reset({
            index: 0,
            routes: [{name: 'HomeScreenTwo'}],
          });
        }
      },
    );

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
      messageReceiverListenerr.remove();
    };
  }, []);
  const _keyboardDidShow = e =>
    setShortHeight(Platform.OS == 'android' ? 0 : e.endCoordinates.height);
  const _keyboardDidHide = e => setShortHeight(0);

  useEffect(() => {
    socketConnectionCheck();
    dispatch(loadingShow(true));
    const data = {
      signal_id: item?.id ? item?.id : itemm?.accepted_signal,
    };
    setLoader(true);
    dispatch(signalDetailApi(data)).then(res => {
      console.log('res------>', res);

      if (res) {
        setLoader(false);
        dispatch(loadingShow(false));
      }
    });
    return () => {
      dispatch(setAppSessionReducer(SIGNAL_DETAIL_DATA, ''));
    };
  }, []);

  const methodAceptData = () => {
    socketConnectionCheck();
    let data = {
      user_id: global?.userData?.id,
      signal_id: fromSplesh ? itemm?.accepted_signal : item?.id,
    };
    socketEmit(socketEvent.accept_request, data, res => {
      if (res?.status) {
        const data = {
          signal_id: fromSplesh ? itemm?.accepted_signal : item?.id,
        };
        dispatch(signalDetailApi(data));
      }
    });
  };

  // if(signal_detail_data?.status){
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        AppConstant.appName,
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null, // Don't do anything if 'Cancel' is pressed
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(), // Exit the app if 'YES' is pressed
          },
        ],
        {cancelable: false}, // Prevent dismissing alert by tapping outside
      );
      return true; // Return true to prevent the default back button behavior
    };

    let subscription;

    if (isFocused && signal_detail_data?.status) {
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
  }, [isFocused, signal_detail_data]);
  // }

  const acceptSignal = () => {
    const data = {
      signal_id: fromSplesh ? itemm?.accepted_signal : item?.id,
    };
    dispatch(acceptSignalApi(data)).then(res => {
      // console.log("here000000",res);
      if (res) {
        methodAceptData();
        socketConnectionCheck();
        dispatch(getProfileAction());
        const data = {
          signal_id: fromSplesh ? itemm?.accepted_signal : item?.id,
        };
        dispatch(signalDetailApi(data));
      } else {
        props.navigation.reset({
          index: 1,
          routes: [{name: 'HomeScreenTwo'}],
        });
      }
    });
  };

  const markResolve = () => {
    const data = {
      signal_id: fromSplesh ? itemm?.accepted_signal : item?.id,
    };
    // console.log("data---->",data);
    dispatch(markResolveApi(data)).then(res => {
      // console.log("res------>",res);

      if (res?.status) {
        // props.navigation.goBack();
        props.navigation.reset({
          index: 1,
          routes: [{name: 'HomeScreenTwo'}],
        });
      } else {
        props.navigation.reset({
          index: 1,
          routes: [{name: 'HomeScreenTwo'}],
        });
      }
    });
  };

  const updateLocationAndGetUser = async () => {
    console.log('updateLocationAndGetUser ');

    await geoCurrentLocation(1, data => {
      console.log(' geoCurrentLocation data ', data);

      if (data === null || data === undefined) {
      }
      if (data.latitude && data.longitude) {
        const dic = {
          latitude: data?.latitude ? data?.latitude : '',
          longitude: data?.longitude ? data?.longitude : '',
        };
        // console.log('dic ', dic);

        dispatch(updtaelatlong(dic)).then(res => {
          console.log('updtaelatlong ', res);

          const data = {
            signal_id: item?.id ? item?.id : itemm?.accepted_signal,
          };
          setLoader(true);
          dispatch(signalDetailApi(data)).then(res => {
            console.log('res---->', res);

            if (res) {
              setLoader(false);
              dispatch(loadingShow(false));
            }
          });
          return () => {
            dispatch(setAppSessionReducer(SIGNAL_DETAIL_DATA, ''));
          };
        });
      } else {
        return false;
      }
    });
  };
  const isAndroid = Platform.OS === 'android';

  return (
    <View
      style={{...styles.container, paddingTop: Platform.OS == 'ios' ? 60 : 0}}>
      {signal_detail_data ? (
        <View style={styles.container1}>
          <View
            style={{
              height: 50,
              width: '100%',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 20,
            }}>
            {!signal_detail_data?.status ? (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  props.navigation.goBack();
                }}>
                <Image source={imagePath.leftarrow} />
              </TouchableOpacity>
            ) : (
              <></>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <ImageLoadView
                style={{height: 40, width: 40, borderRadius: 40 / 2}}
                resizeMode="cover"
                source={
                  signal_detail_data?.user_detail?.profile_picture
                    ? {
                        uri:
                          IMAGE_URL +
                          signal_detail_data?.user_detail?.profile_picture,
                      }
                    : imagePath.logo
                }
              />
              <View style={{paddingHorizontal: 10, flex: 1}}>
                <Text numberOfLines={2} style={styles.name}>
                  {signal_detail_data?.user_detail?.name}
                </Text>
                <Text style={styles.time}>
                  {getTimeDifference(signal_detail_data?.created_at)}
                </Text>
              </View>

              {signal_detail_data?.status ? (
                <Text
                  onPress={() => {
                    markResolve();
                  }}
                  style={[
                    styles.time,
                    {
                      textDecorationLine: 'underline',
                      color: '#41EC9C',
                      fontSize: fonts.SIZE_12,
                      fontFamily: fonts.Montserrat_SemiBold,
                    },
                  ]}>
                  Mark Resolved
                </Text>
              ) : (
                <AppButton
                  bttTitle={'Accept'}
                  marginTop={10}
                  color={'white'}
                  width={100}
                  marginHorizontalMain={5}
                  height={30}
                  borderRadius={7}
                  backgroundColor={'#0B6EBC'}
                  onPress={() => {
                    acceptSignal();
                  }}
                />
              )}
            </View>
          </View>

          <MapView
            ref={mapRef}
            initialRegion={initialCoords}
            style={{width: '100%', height: '100%', marginTop: 10}}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            mapType="satellite"
            onLayout={() => {
              if (
                mapRef?.current &&
                signal_detail_data?.latitude &&
                signal_detail_data?.longitude
              ) {
                setTimeout(() => {
                  const region = {
                    latitude: parseFloat(signal_detail_data?.latitude), // Target latitude
                    longitude: parseFloat(signal_detail_data?.longitude), // Target longitude
                    latitudeDelta: LATITUDE_DELTA, // Zoom level (smaller is more zoomed in)
                    longitudeDelta: LONGITUDE_DELTA,
                  };

                  mapRef?.current?.animateToRegion(region, 2000);
                }, 100);
              }
            }}>
            {isAndroid ? (
              <Marker
                onPress={() => {}}
                coordinate={{
                  latitude: parseFloat(
                    signal_detail_data?.user_detail?.latitude,
                  )
                    ? parseFloat(signal_detail_data?.user_detail?.latitude)
                    : 33.753746,
                  longitude: parseFloat(
                    signal_detail_data?.user_detail?.longitude,
                  )
                    ? parseFloat(signal_detail_data?.user_detail?.longitude)
                    : -84.38633,
                }}
                image={
                  signal_detail_data?.user_detail
                    ? {
                        uri:
                          IMAGE_URL +
                          signal_detail_data?.user_detail?.profile_picture,
                      }
                    : imagePath.logo
                }
              />
            ) : (
              <Marker
                onPress={() => {}}
                coordinate={{
                  latitude: parseFloat(
                    signal_detail_data?.user_detail?.latitude,
                  )
                    ? parseFloat(signal_detail_data?.user_detail?.latitude)
                    : 33.753746,
                  longitude: parseFloat(
                    signal_detail_data?.user_detail?.longitude,
                  )
                    ? parseFloat(signal_detail_data?.user_detail?.longitude)
                    : -84.38633,
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  {signal_detail_data?.user_detail ? (
                    <ImageLoadView
                      style={{
                        height: 30,
                        width: 30,
                      }}
                      source={
                        signal_detail_data?.user_detail?.profile_picture
                          ? {
                              uri:
                                IMAGE_URL +
                                signal_detail_data?.user_detail
                                  ?.profile_picture,
                            }
                          : imagePath.logo
                      }
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

          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              height: 65,
              width: 65,
              left: 20,
              position: 'absolute',
              zIndex: 5,
              bottom: signal_detail_data?.status == 1 ? 20 : 100,
              paddingHorizontal: 20,
              backgroundColor: 'white',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              // console.log("item---->",item);
              dispatch(loadingShow(true));
              updateLocationAndGetUser();
            }}>
            <Image resizeMode="cover" source={imagePath.refresh} />
          </TouchableOpacity>

          {signal_detail_data?.status == 0 ? (
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                height: 80,
                backgroundColor: '#ECF4F9',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomColor: '#00000029',
                borderBottomWidth: 1,
                position: 'absolute',
                bottom: 0,
                width: '100%',
              }}>
              <Text
                numberOfLines={2}
                style={{
                  color: '#333333',
                  fontSize: fonts.SIZE_16,
                  fontFamily: fonts.Montserrat_SemiBold,
                  flex: 0.9,
                }}>
                {signal_detail_data?.security_message}
              </Text>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  if (signal_detail_data?.assistance_type == 'medical') {
                    setMedicalModalVisible(true);
                  } else {
                    setSecurityModalVisible(true);
                  }
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    backgroundColor: '#0B6EBC',
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: fonts.Montserrat_Medium,
                      fontSize: fonts.SIZE_14,
                    }}>
                    View Info
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ChatScreen', {
                  other_user_id: signal_detail_data?.user_detail?.id,
                  userDetail: signal_detail_data,
                });
              }}
              activeOpacity={0.6}
              style={{
                height: 65,
                width: 65,
                position: 'absolute',
                right: 20,
                alignSelf: 'flex-end',
                backgroundColor: '#0B6EBC',
                borderRadius: 65 / 2,
                bottom: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                tintColor={'white'}
                source={imagePath.chat}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          )}

          {signal_detail_data?.assistance_type == 'medical' ? (
            <AssistanceModal
              visible={medicalModalVisible}
              userinfo={signal_detail_data?.user_detail?.name}
              applicable={signal_detail_data?.injured}
              pain={signal_detail_data?.descibe_pain}
              breath={signal_detail_data?.short_breath}
              objects={signal_detail_data?.identifiable_object}
              info={signal_detail_data?.additional_information}
              information_type={signal_detail_data?.information_type}
              identifiable_type={signal_detail_data?.identifiable_type}
              onCancel={() => {
                setMedicalModalVisible(false);
              }}
            />
          ) : (
            <SecurityModal
              userinfo={signal_detail_data?.user_detail?.name}
              visible={securityModalVisible}
              applicable={signal_detail_data?.guest_behavior}
              pain={signal_detail_data?.prohibited_item}
              objects={signal_detail_data?.security_identifiable}
              info={signal_detail_data?.security_additional_information}
              security_identifiable_type={
                signal_detail_data?.security_identifiable_type
              }
              security_additional_type={
                signal_detail_data?.security_additional_type
              }
              onCancel={() => {
                setSecurityModalVisible(false);
              }}
            />
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default StatusDetail;
