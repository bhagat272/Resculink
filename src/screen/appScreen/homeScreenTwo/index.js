import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
  FlatList,
  ScrollView,
  RefreshControl,
  DeviceEventEmitter,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import ImageLoadView from '../../../utils/imageLoadView';
import {
  IMAGE_URL,
  JSON_HEADER,
  kInternetError,
  kUserData,
} from '../../../appRedux/apis/commonValue';
import imagePath from '../../../theme/imagePath';
import fonts from '../../../theme/fonts';
import CustomDropdown from '../../../component/picker';
import {AppButton} from '../../../component';
import CheckInModal from './checkInModal';
import {translateText} from '../../../utils/language';
import {
  getProfileAction,
  setUserDataPayLoad,
} from '../../../appRedux/actions/userSessionAction';
import {setData} from '../../../appRedux/apis/keyChain';
import {
  DEVICE_INFO,
  getDeviceUniqueId,
  getTimeDifference,
  setUserData,
} from '../../../utils/helper';
import {USER_DATA_KEY} from '../../../appRedux/constants/userSessionType';
import {
  checkinvenueApi,
  checkOutUserApi,
  setAppSessionReducer,
  signalListDataApi,
  upadteDeviceTokenAction,
  updtaelatlong,
  venuehistoryApi,
} from '../../../appRedux/actions/appSessionAction';
import NoDataFound from '../../../component/noDataFound';
import {
  CLEAR_SIGNAL_LIST_DATA,
  PAGE_LOADING_SIGNAL_LIST_DATA,
  PULL_TO_REFRESH_SIGNAL_LIST_DATA,
} from '../../../appRedux/constants/appSessionType';
import Colors from '../../../theme/colors';
import {socketConnectionCheck} from '../../../component/socket';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {AppConstant} from '../../../appRedux/constants/appconstant';
import {useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {
  getToken,
  requestAndroidNotificationPermission,
  updateDeviceToken,
} from '../../../permissions/notificationPermissions';
import DeviceInfo from 'react-native-device-info';
import {post} from '../../../appRedux/apis/apiHelper';
import {UPDATE_DEVICE_TOKEN} from '../../../appRedux/apis/endpoints';
import {showToastMessage} from '../../../utils/Toast';
import NotificationController from '../../../utils/NotificationController';
import {
  geoCurrentLocation,
  GetAddressFromLatLong,
} from '../../../permissions/getLocation';
import {isNetworkAvailable} from '../../../appRedux/apis/network';
import {alert} from '../../../utils/alertController';

const HomeScreenTwo = props => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    address: '',
  });
  const userData = useSelector(state => state.session.userData);
  const {
    signalListdata,
    signalListpageloading,
    signalListPullToRefresh,
    signalListLastPage,
  } = useSelector(state => state.appSession);

  const [breath, setBreath] = useState('');
  const [breathParts, setbreathParts] = useState([]);
  const isFocused = useIsFocused();
  const [localLoader, setLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [allData, setAllData] = useState('');
  const [venuIdd, setVenueIdd] = useState('');
  const [CheckIn, setCheckIn] = useState(false);
  const [noData, setNoData] = useState(false);
  const [locationAvailable, setLocationAvailable] = useState(true);
  console.log('userData-------->', userData, breath);

  useEffect(() => {
    dispatch(getProfileAction()).then(resp => {
      if (resp) {
        setAllData(resp);
      }
    });
    dispatch(getProfileAction());
    socketConnectionCheck();
    methodHistoryData();
  }, []);

  useEffect(() => {
    if (userData?.venue_id) {
      dispatch(loadingShow(true));
      const dic = {
        page: 1,
        venue_id: signalListdata?.venue_id,
        type: 'Pending',
      };

      SignalListData(dic);
    }
  }, []);

  useEffect(() => {
    let markResolve = DeviceEventEmitter.addListener('markresolve', () => {
      const dic = {
        page: 1,
        venue_id: breath?.venue_id,
        type: 'Pending',
      };
      SignalListData(dic);
    });

    let notiResolve = DeviceEventEmitter.addListener(
      'notificationCalled',
      () => {
        const dic = {
          page: 1,
          venue_id: breath?.venue_id,
          type: 'Pending',
        };
        SignalListData(dic);
      },
    );

    let addvenue = DeviceEventEmitter.addListener('addvenue', () => {
      methodHistoryData();
    });
    generateToken();

    return () => {
      markResolve.remove();
      addvenue.remove();
      notiResolve.remove();
    };
  }, []);

  const generateToken = async () => {
    if (Platform.OS == 'android') {
      let status = await requestAndroidNotificationPermission();
    }
    getDeviceUniqueId();
    let token = await updateDeviceToken();

    DEVICE_INFO.device_token = token;
    updateDeviceDetail(token);
  };

  const updateDeviceDetail = async token => {
    let deviceUnic = await DeviceInfo.getUniqueId();

    const response = await post({
      url: UPDATE_DEVICE_TOKEN,
      data: JSON.stringify(DEVICE_INFO),
      header: JSON_HEADER,
    });
    if (response && response.status == true) {
    } else {
    }
  };

  useEffect(() => {
    socketConnectionCheck();

    if (userData?.venue_detail) {
      setBreath(userData?.venue_detail);
    } else {
      setBreath(null);
      setCheckIn(false);
    }
  }, [userData]);

  const SignalListData = reqObj => {
    const data = {
      page: reqObj?.page,
      type: reqObj?.type,
      venue_id: reqObj?.venue_id ?? breath?.venue_id ?? userData?.venue_id,
    };
    dispatch(signalListDataApi(data)).then(resp => {
      setCheckIn(true);
      if (resp && Array.isArray(resp) && resp?.length > 0) {
        setNoData(false);
      } else {
        setNoData(true);
      }
    });
  };

  const methodPullToRefresh = () => {
    console.log('eeee');
    dispatch(loadingShow(false));

    if (signalListPullToRefresh || signalListpageloading) {
      return;
    }
    dispatch(setAppSessionReducer(PULL_TO_REFRESH_SIGNAL_LIST_DATA, true));
    setCurrentPage(1);
    // dispatch(loadingShow(false));
    const dic = {
      page: 1,
      venue_id: breath?.venue_id,
      type: selectedTab,
    };
    SignalListData(dic);

    methodHistoryData();
  };

  const methodOnEndReached = () => {
    if (
      signalListLastPage <= currentPage ||
      signalListpageloading ||
      signalListPullToRefresh
    ) {
      return;
    }
    dispatch(setAppSessionReducer(PAGE_LOADING_SIGNAL_LIST_DATA, true));
    setCurrentPage(currentPage + 1);
    const dic = {
      page: currentPage + 1,
      venue_id: breath?.venue_id,
      type: selectedTab,
    };
    SignalListData(dic);
  };

  const methodHistoryData = () => {
    dispatch(venuehistoryApi()).then(res => {
      if (res) {
        let newArr = [...res];
        newArr.forEach(d => {
          let valTemp = d?.venue_detail?.venue_name;
          let valueTemp = d?.venue_detail?.id;
          d.label = valTemp;
          d.value = valueTemp;
          delete d.venue_detail.venue_name;
          delete d.venue_detail.id;
        });
        setbreathParts(newArr);
        dispatch(loadingShow(false));
      } else {
        dispatch(loadingShow(false));
      }
    });
  };

  const methodUpdateNotificationCount = isRead => {
    let dic = {...global?.userData};
    dic.notification_count = isRead ? 0 : 1;
    setData(kUserData, dic);
    setUserData(dic);
    dispatch(setUserDataPayLoad(USER_DATA_KEY, dic));
  };

  const checkInFunction = reqObj => {
    const data = {
      page: 1,
      venue_id: reqObj?.venue_id ?? breath?.venue_id ?? userData?.venue_id,
      type: selectedTab,
    };
    dispatch(checkinvenueApi(data)).then(res => {
      if (res) {
        if (userData?.venue_detail) {
          setBreath(userData?.venue_detail);
        }

        setCheckIn(true);
        const dic = {
          page: 1,
          venue_id: reqObj?.venue_id ?? breath?.venue_id ?? userData?.venue_id,
          type: selectedTab,
        };
        SignalListData(dic);
      }
    });
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        AppConstant.appName,
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {cancelable: false},
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

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    return unsubscribe;
  }, []);

  const curentLocation = async () => {
    const isConnected = await isNetworkAvailable();
    return new Promise((resolve, reject) => {
      if (isConnected === false) {
        showToastMessage(kInternetError);
        resolve(false);
      } else {
        geoCurrentLocation(1, data => {
          if (data === null || data === undefined) {
            resolve(false);
          }
          if (data.latitude && data.longitude) {
            GetAddressFromLatLong(data.latitude, data.longitude, address => {
              let curentAddress = {};
              curentAddress.address = address;
              curentAddress.latAdd = data.latitude;
              curentAddress.longAdd = data.longitude;
              global.coordinates = {
                latitude: curentAddress.latAdd,
                longitude: curentAddress?.longAdd,
                address: curentAddress?.address,
              };
              setLocation({
                ...location,
                latitude: curentAddress.latAdd,
                longitude: curentAddress?.longAdd,
                address: curentAddress?.address,
              });
              resolve(curentAddress);
            });
          } else {
            resolve(false);
          }
        });
      }
    });
  };
  useEffect(() => {
    setLoader(true);
    socketConnectionCheck();
    if (isFocused) {
      (async () => {
        const locationData = await curentLocation();
        const dic = {
          latitude: location?.latitude ? location?.latitude : '',
          longitude: location?.longitude ? location?.longitude : '',
        };
        if (locationData) {
          setLocationAvailable(true);
          dic.latitude = locationData?.latAdd ? locationData?.latAdd : '';
          dic.longitude = locationData?.longAdd ? locationData?.longAdd : '';
          dispatch(updtaelatlong(dic));
        } else {
          setLoader(false);
          setLocationAvailable(false);
        }
      })();
    }
  }, []);

  const goToNotification = item => {
    props.navigation.navigate('Notifications');
  };

  // const goToSingleChat = item => {
  //   socketConnectionCheck(),
  //     props.navigation.navigate('ChatScreen', {
  //       other_user_id: item?.user_id,
  //       item: user_signal_detail_data,
  //       providerAllData: providerData,
  //     });
  // };

  const goToGroupChat = item => {
    props.navigation.navigate('GroupChatScreen', {
      other_user_id: item?.venue_id,
    });
  };

  const redirectToscreen = item => {
    let encryptedData = item?.data;
    console.log('encryptedData---->', encryptedData);

    if (
      encryptedData?.type == 'medical_assistance' ||
      encryptedData?.type == 'security_assistance'
    ) {
      goToNotification(encryptedData);
    }

    if (encryptedData?.type == 'broadcast_notification') {
      goToNotification(encryptedData);
    }

    // if (encryptedData?.type == 'single_msg') {
    // goToSingleChat(encryptedData);
    // }

    if (encryptedData?.type == 'venue_group') {
      goToGroupChat(encryptedData);
    }
  };

  const createNotificationListeners = async () => {
    await messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
      }
    });

    await messaging().onNotificationOpenedApp(async remoteMessage => {
      let encryptedData = remoteMessage?.data;

      if (encryptedData) {
        if (
          encryptedData?.type == 'medical_assistance' ||
          encryptedData?.type == 'security_assistance' ||
          encryptedData?.type == 'broadcast_notification'
        ) {
          goToNotification(encryptedData);
        }
        if (encryptedData?.type == 'venue_group') {
          goToGroupChat(encryptedData);
        }
      }
    });

    await messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        let encryptedData = remoteMessage?.data;
        if (encryptedData) {
          if (
            encryptedData?.type == 'medical_assistance' ||
            encryptedData?.type == 'security_assistance' ||
            encryptedData?.type == 'broadcast_notification'
          ) {
            goToNotification(encryptedData);
          }

          if (encryptedData?.type == 'venue_group') {
            goToGroupChat(encryptedData);
          }
        }
      });
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      createNotificationListeners();
    }
  };

  useEffect(() => {
    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      createNotificationListeners();
    }
  }, []);
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('StatusDetail', {item: item});
        }}
        activeOpacity={0.6}
        key={index}
        style={styles.card}>
        <View
          style={{flexDirection: 'row', width: '90%', alignItems: 'center'}}>
          <ImageLoadView
            style={styles.image}
            resizeMode="cover"
            source={
              item?.user_detail?.profile_picture
                ? {uri: IMAGE_URL + item?.user_detail?.profile_picture}
                : imagePath.logo
            }
          />

          <View style={{width: '75%'}}>
            <Text style={styles.name}>{item?.security_message}</Text>
            <Text style={styles.time}>
              {getTimeDifference(item?.created_at)}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={imagePath.mapblack}
            tintColor={'black'}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemAcept = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('StatusDetail', {item: item});
        }}
        activeOpacity={0.6}
        key={index}
        style={styles.card}>
        <View style={{flexDirection: 'row', width: '90%'}}>
          <ImageLoadView
            style={styles.image}
            resizeMode="cover"
            source={
              item?.user_detail?.profile_picture
                ? {uri: IMAGE_URL + item?.user_detail?.profile_picture}
                : imagePath.logo
            }
          />
          <View style={{width: '75%'}}>
            <Text style={styles.name}>{item?.security_message}</Text>
            <Text style={styles.time}>
              {getTimeDifference(item?.created_at)}
            </Text>
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 5,
                backgroundColor: '#0B6EBC1A',
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Text
                style={[
                  styles.time,
                  {
                    color: '#0B6EBC',
                    fontSize: fonts.SIZE_12,
                    fontFamily: fonts.Montserrat_Regular,
                  },
                ]}>
                Sent by {item?.user_detail?.name}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}></View>
      </TouchableOpacity>
    );
  };

  console.log('breath --->', breath);

  const checkoutFunction = () => {
    // dispatch(showLoader(true));
    dispatch(checkOutUserApi()).then(res => {
      console.log('res-------sss--->', res);
      if (res) {
        setVenueIdd('');
        setBreath(null);
        // console.log("userData?.venue_detail---->",userData?.venue_detail, data.venue_name);
        setCheckIn(false);

        // dispatch(getProfileAction()).then(resp => {

        //   console.log("resp------>",resp);

        // })

        // setBreath(res?.venue_detail)
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: Platform.OS == 'ios' ? 10 : 30,
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ProfileScreen');
          }}>
          <ImageLoadView
            source={
              userData?.profile_picture
                ? {uri: IMAGE_URL + userData?.profile_picture}
                : imagePath.profileImage1
            }
            resizeMode="cover"
            style={{height: 40, width: 40, borderRadius: 40 / 2}}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#111B34',
            fontFamily: fonts.Montserrat_SemiBold,
            fontSize: fonts.SIZE_18,
          }}>
          {translateText('Home')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (!CheckIn) {
                showToastMessage(
                  'Please make sure to check in at a venue before proceeding.',
                );
                return;
              } else {
                props.navigation.navigate('EmployeeGroup', {
                  venue_detail: breath,
                  item: breath?.venue_id ?? userData?.venue_id,
                  allData: allData,
                });
              }
            }}>
            <ImageLoadView
              source={imagePath.groupp}
              resizeMode="contain"
              style={{height: 45, width: 45, right: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              methodUpdateNotificationCount(true);
              props.navigation.navigate('Notifications');
            }}
            activeOpacity={0.6}>
            <ImageLoadView
              source={
                global?.userData?.notification_count == 0
                  ? imagePath.noo
                  : imagePath.notificationcount
              }
              resizeMode="contain"
              style={{height: 45, width: 45}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: '#0B6EBC0D',
          borderRadius: 30,
          marginHorizontal: 10,
          marginTop: 20,
        }}>
        <CustomDropdown
          value={breath ? breath?.venue_name : translateText('Select_venue')}
          data={breathParts}
          colorr="black"
          backgroundColor={'white'}
          selectedOption={breath}
          venue={translateText('Select_venue')}
          onSubmit={res => {
            console.log('res--->', res);

            setCheckIn(false);
            setBreath(res);
            setVenueIdd(res?.venue_id);
          }}
        />
        <AppButton
          bttTitle={CheckIn ? 'Checked-In' : translateText('Check_in')}
          marginTop={30}
          color={'white'}
          marginHorizontalMain={15}
          height={54}
          borderRadius={10}
          backgroundColor={'#0B6EBC'}
          onPress={() => {
            if (venuIdd == '') {
              showToastMessage('Please select venue first.');
              return;
            } else {
              checkInFunction(venuIdd);
            }
          }}
        />

        <AppButton
          bttTitle={translateText('Check Out')}
          mainWidth={'100%'}
          // marginBottom={20}
          marginTop={10}
          height={54}
          color={'white'}
          // isLoading={loaderShow}
          borderRadius={12}
          backgroundColor={'#FF518E'}
          onPress={() => {
            if (!CheckIn) {
              showToastMessage(
                'Please make sure to check in at a venue before proceeding.',
              );
              return;
            } else {
              checkoutFunction();
            }
          }}
        />
      </View>

      <View style={{borderRadius: 5, marginTop: 20}}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View style={styles.tabs}>
            <View style={styles.tabButtons}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  dispatch(loadingShow(true));
                  dispatch(setAppSessionReducer(CLEAR_SIGNAL_LIST_DATA, []));
                  const dic = {
                    page: 1,
                    venue_id: breath?.venue_id,
                    type: 'Pending',
                  };
                  setSelectedTab('Pending'), SignalListData(dic);
                }}
                style={
                  selectedTab === 'Pending'
                    ? styles.activeTab
                    : styles.inactiveTab
                }>
                <Text
                  style={
                    selectedTab === 'Pending'
                      ? styles.activeText
                      : styles.inactiveText
                  }>
                  {translateText('Pending')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  dispatch(loadingShow(true));
                  dispatch(setAppSessionReducer(CLEAR_SIGNAL_LIST_DATA, []));
                  const dic = {
                    page: 1,
                    venue_id: breath?.venue_id,
                    type: 'Accepted',
                  };

                  setSelectedTab('Accepted');
                  SignalListData(dic);
                }}
                style={
                  selectedTab === 'Accepted'
                    ? styles.activeTab
                    : styles.inactiveTab
                }>
                <Text
                  style={
                    selectedTab === 'Accepted'
                      ? styles.activeText
                      : styles.inactiveText
                  }>
                  {translateText('Resolved')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {selectedTab === 'Pending' ? (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('PendingMapView', {
                  item: breath?.venue_id ?? userData?.venue_id,
                  allData: allData,
                });
              }}
              activeOpacity={0.6}>
              <Image
                source={imagePath.lockk}
                resizeMode="contain"
                style={styles.tabImage}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>

      {selectedTab == 'Pending' || noData ? (
        <FlatList
          style={{flex: 1, paddingHorizontal: 20, marginTop: 16}}
          data={signalListdata}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={methodOnEndReached}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            noData ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fonts.SIZE_13,
                    fontFamily: fonts.Montserrat_Bold,
                    color: Colors.primary.BLACK,
                    marginTop: 0,
                  }}>
                  No data found
                </Text>
              </View>
            ) : (
              <View />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={signalListPullToRefresh}
              onRefresh={methodPullToRefresh}
            />
          }
        />
      ) : (
        <FlatList
          style={{flex: 1, paddingHorizontal: 20, marginTop: 16}}
          data={signalListdata}
          renderItem={renderItemAcept}
          keyExtractor={item => item.id}
          onEndReached={methodOnEndReached}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={
            noData ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fonts.SIZE_13,
                    fontFamily: fonts.Montserrat_Bold,
                    color: Colors.primary.BLACK,
                    marginTop: 0,
                  }}>
                  No data found
                </Text>
              </View>
            ) : (
              <View />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={signalListPullToRefresh}
              onRefresh={methodPullToRefresh}
            />
          }
        />
      )}
      <CheckInModal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        onConfirm={() => {
          setShowModal(false);
        }}
      />

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
    </SafeAreaView>
  );
};

export default HomeScreenTwo;
