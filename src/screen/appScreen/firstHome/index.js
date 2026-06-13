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
  TextInput,
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
import AppHeader from '../../../navigation/appHeader';
import Colors from '../../../theme/colors';
import {AppButton} from '../../../component';
import VisiblityModal from './visiblityModal';
import {isNetworkAvailable} from '../../../appRedux/apis/network';
import {showToastMessage} from '../../../utils/Toast';
import {
  geoCurrentLocation,
  GetAddressFromLatLong,
} from '../../../permissions/getLocation';
import {useIsFocused} from '@react-navigation/native';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {
  checkOutUserApi,
  confirmVenueApi,
  customerHomeDataApi,
  setAppSessionReducer,
  storeListingApi,
  upadteDeviceTokenAction,
  updtaelatlong,
  venueListingApi,
} from '../../../appRedux/actions/appSessionAction';
import {
  PAGE_LOADING_VENUE_LIST_PAGE_DATA,
  PULL_TO_REFRESH_VENUE_LIST_PAGE_DATA,
} from '../../../appRedux/constants/appSessionType';
import {getAllContact} from '../../../permissions/getContact';
import {translateText} from '../../../utils/language';
import {setData} from '../../../appRedux/apis/keyChain';
import {
  DEVICE_INFO,
  getDeviceUniqueId,
  setUserData,
  showLoader,
} from '../../../utils/helper';
import {
  getProfileAction,
  setUserDataPayLoad,
} from '../../../appRedux/actions/userSessionAction';
import {
  SELECTED_VENUE_ID,
  USER_DATA_KEY,
} from '../../../appRedux/constants/userSessionType';
import {socketConnectionCheck} from '../../../component/socket';
import {AppConstant} from '../../../appRedux/constants/appconstant';
import messaging from '@react-native-firebase/messaging';
import {UPDATE_DEVICE_TOKEN} from '../../../appRedux/apis/endpoints';
import {post} from '../../../appRedux/apis/apiHelper';
import {
  getToken,
  requestAndroidNotificationPermission,
  updateDeviceToken,
} from '../../../permissions/notificationPermissions';
import DeviceInfo from 'react-native-device-info';
import NotificationController from '../../../utils/NotificationController';
import {alert} from '../../../utils/alertController';
let searchTimer = null;
const FirstHome = props => {
  const userData = useSelector(state => state.session.userData);

  // console.log("userData--------->",userData?.venue_id);

  const [placeHide, setPlaceHide] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [onoff, setOnOff] = useState(userData?.visibility == 0 ? false : true);
  const [localLoader, setLoader] = useState(false);

  const [locData, setLocData] = useState(true);

  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [noData, setNoData] = useState(false);
  const [filter, setFilter] = useState('');
  const isFocused = useIsFocused();
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    address: '',
  });
  const [params, setParams] = useState({
    latitude: '',
    longitude: '',
    search: '',
    category: '',
    radius: 0,
  });

  const [locationAvailable, setLocationAvailable] = useState(true);

  const {
    venuedata,
    venuedatapageloading,
    venuedataPullToRefresh,
    venueepagedataLastPage,
  } = useSelector(state => state.appSession);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    return unsubscribe;
  }, []);

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

  const goToPartyGroup = item => {};

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
    generateToken();
    if (Platform.OS == 'ios') {
      requestUserPermission();
    } else {
      createNotificationListeners();
    }
  }, []);

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

  const generateToken = async () => {
    if (Platform.OS == 'android') {
      let status = await requestAndroidNotificationPermission();
    }
    getDeviceUniqueId();
    let token = await updateDeviceToken();
    console.log('token===', token);

    DEVICE_INFO.device_token = token;
    updateDeviceDetail(token);
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
          search: params?.search ? params?.search : '',
          radius: filter?.radius ? filter?.radius : '',
          category: filter?.category ? filter?.category : '',
          page: 1,
        };

        if (locationData) {
          setLocationAvailable(true);

          dic.latitude = locationData?.latAdd ? locationData?.latAdd : '';
          dic.longitude = locationData?.longAdd ? locationData?.longAdd : '';
          dic.search = params?.search ? params?.search : '';
          dic.radius = filter?.radius ? filter?.radius : '';
          dic.category = filter?.category ? filter?.category : '';
          dic.page = 1;

          dispatch(updtaelatlong(dic));
          dispatch(venueListingApi(dic)).then(res => {
            // console.log("here------>",res);

            setLoader(false);

            setTimeout(() => {
              setLocationAvailable(false);
            }, 2000);
            if (res && Array.isArray(res) && res?.length > 0) {
              setNoData(false);
            } else {
              setNoData(true);
            }
          });
        } else {
          setLoader(false);
          setLocationAvailable(false);
        }
      })();
    }
  }, []);

  var backActionHandler;

  useEffect(() => {
    // Handle the back button press
    const backAction = () => {
      // Show the alert when back button is pressed
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

    if (isFocused) {
      // Add the event listener for back button press
      backActionHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      // Clean up the listener when the component is unmounted
      return () => {
        backActionHandler.remove();
      };
    }
  }, [isFocused]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardStatus(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardStatus(0);
    });
    const hideSubscriptionDid = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(getProfileAction());
      socketConnectionCheck();
      setOnOff(userData?.visibility);
    }
  }, [isFocused]);

  useEffect(() => {
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      // paddingHorizontal:5,
      // paddingHorizontalLeftTitle:10,
      paddingHorizontal: 20,
      Title: translateText('Select_your_venue'),
      leftIcon: true,
      notificationIcon: true,
      shareIcon: true,
      titleSize: 16,
      heightShareImg: 40,
      widthShareImg: 40,
      shareClick: () => {
        props.navigation.navigate('ProfileScreen');
      },
      borderRadiusShare: 10,
      share: userData?.profile_picture
        ? {uri: IMAGE_URL + userData?.profile_picture}
        : imagePath.profileImage1,
      heightRightImg: 45,
      widthRightImg: 45,
      notification:
        global?.userData?.notification_count == 0
          ? imagePath.noo
          : imagePath.notificationcount,

      leftClick: () => {
        curentLocation1();
      },
      notificationClick: () => {
        methodUpdateNotificationCount(true);
        props.navigation.navigate('UserNotification');
      },
      leftImage: imagePath.location,
    });
  }, [global?.userData]);

  const curentLocation = async () => {
    // console.log("here");

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

  const curentLocation1 = async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        setLocationAvailable(true);
        const locationData =
          await // null;
          curentLocation();
        const dic = {
          latitude: location?.latitude ? location?.latitude : '',
          longitude: location?.longitude ? location?.longitude : '',
          search: params?.search ? params?.search : '',
          radius: filter?.radius ? filter?.radius : '',
          category: filter?.category ? filter?.category : '',
          page: 1,
        };

        // console.log("dic-----444---->",dic);

        if (locationData) {
          dic.latitude = locationData?.latAdd ? locationData?.latAdd : '';
          dic.longitude = locationData?.longAdd ? locationData?.longAdd : '';
          dic.search = params?.search ? params?.search : '';
          dic.radius = filter?.radius ? filter?.radius : '';
          dic.category = filter?.category ? filter?.category : '';
          dic.page = 1;

          setLoader(true);
          dispatch(updtaelatlong(dic));
          dispatch(venueListingApi(dic)).then(res => {
            setTimeout(() => {
              setLocationAvailable(false);
            }, 1000);
            setLoader(false);
            if (res && Array.isArray(res) && res?.length > 0) {
              setNoData(false);
            } else {
              setNoData(true);
            }
          });
        } else {
          setLocationAvailable(false);
          setLoader(false);
        }
      })();
    });
  };

  const methodUpdateNotificationCount = isRead => {
    let dic = {...global?.userData};
    dic.notification_count = isRead ? 0 : 1;
    setData(kUserData, dic);
    setUserData(dic);
    dispatch(setUserDataPayLoad(USER_DATA_KEY, dic));
  };

  const confirmVenue = () => {
    const data = {
      venue_id: selectedVenueId,
      visibility: !onoff ? 0 : 1,
    };
    dispatch(confirmVenueApi(data)).then(res => {
      if (res) {
        setSelectedVenueId('');
        props.navigation.navigate('HomeScreen', {
          StoreIs: res,
          selectedVenueId: selectedVenueId,
        });
      }
    });
  };
  const methodPullToRefresh = () => {
    if (venuedataPullToRefresh || venuedatapageloading) {
      return;
    }
    dispatch(setAppSessionReducer(PULL_TO_REFRESH_VENUE_LIST_PAGE_DATA, true));
    setCurrentPage(1);
    const dic = {
      latitude: location?.latitude ? location?.latitude : '',
      longitude: location?.longitude ? location?.longitude : '',
      search: params?.search ? params?.search : '',
      page: 1,
      radius: filter?.radius ? filter?.radius : '',
      category: filter?.category ? filter?.category : '',
    };
    dispatch(venueListingApi(dic));
  };

  const methodOnEndReached = () => {
    const dic = {
      latitude: location?.latitude ? location?.latitude : '',
      longitude: location?.longitude ? location?.longitude : '',
      search: params?.search ? params?.search : '',
      radius: filter?.radius ? filter?.radius : '',
      category: filter?.category ? filter?.category : '',
    };
    if (
      venueepagedataLastPage <= currentPage ||
      venuedatapageloading ||
      venuedataPullToRefresh
    ) {
      return;
    }
    dispatch(setAppSessionReducer(PAGE_LOADING_VENUE_LIST_PAGE_DATA, true));
    setCurrentPage(currentPage + 1);

    dic.page = currentPage + 1;
    dispatch(venueListingApi(dic));
  };

  const handleSelect = id => {
    // Set the selected venue id and update the userData (you might want to dispatch this to redux)
    setSelectedVenueId(id);
    dispatch(setUserDataPayLoad(SELECTED_VENUE_ID, id));
  };
  useEffect(() => {
    console.log('console.log(userData?.venue_id)--->', userData?.venue_id);

    if (userData?.venue_id) {
      setSelectedVenueId(userData?.venue_id);
      dispatch(setUserDataPayLoad(SELECTED_VENUE_ID, userData?.venue_id));
    } else {
      setSelectedVenueId('');
    }
  }, [userData?.venue_id]);

  const renderItemAcept = ({item, index}) => {
    // console.log("item?.distance ",item?.distance );

    // const isSelected = item?.id === selectedVenueId;
    const isSelected = item?.id === selectedVenueId;

    return (
      <View key={index} style={styles.card}>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <ImageLoadView
            resizeMode="cover"
            source={{uri: IMAGE_URL + item?.venue_picture}}
            style={[styles.image, {width: 100, height: 100, borderRadius: 10}]}
          />
          <View style={{flex: 1}}>
            <Text
              numberOfLines={3}
              style={[
                styles.name,
                {
                  width: '70%',
                  fontFamily: fonts.Montserrat_Bold,
                  marginTop: 10,
                },
              ]}>
              {item?.venue_name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                width: '70%',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Image source={imagePath.locationn} resizeMode="contain" />

              <Text
                numberOfLines={2}
                style={[
                  styles.name,
                  {
                    fontFamily: fonts.Montserrat_Regular,
                    color: '#777',
                    left: 10,
                  },
                ]}>
                {item?.address}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '70%',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <Image source={imagePath.lrarrow} />

              <Text
                style={[
                  styles.name,
                  {
                    fontFamily: fonts.Montserrat_Regular,
                    color: '#777',
                    flexGrow: 1,
                    left: 10,
                    marginBottom: 5,
                  },
                ]}>
                {item?.distance + ' Miles'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              handleSelect(item.id);
            }}>
            <Image
              source={!isSelected ? imagePath.uncheckk : imagePath.check1}
              style={{height: 25, width: 25, marginRight: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const methodFilterButtonClick = () => {
    props.navigation.navigate('Filter', {
      onFilterList: res => {
        const dic = {
          latitude: location?.latitude ? location?.latitude : '',
          longitude: location?.longitude ? location?.longitude : '',
          search: params?.search ? params?.search : '',
          radius: res?.radius,
          category: res?.category?.value,
          page: 1,
        };

        dispatch(venueListingApi(dic));
        setFilter(res);
      },
      initialFilterData: filter,
    });
  };
  // console.log('location====',location);

  const checkoutFunction = () => {
    setSelectedVenueId('');
    // dispatch(showLoader(true));
    dispatch(checkOutUserApi()).then(res => {
      console.log('res-------sss--->', res);
      if (res) {
        dispatch(getProfileAction());

        // dispatch(showLoader(false));
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {locationAvailable ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // display: !location?.latitude && !location?.longitude ? 'flex' : 'none'
          }}>
          <Text
            style={{
              fontSize: fonts.SIZE_13,
              fontFamily: fonts.Montserrat_Bold,

              color: Colors.primary.BLACK,
              marginTop: 0,
            }}>
            Please wait! Fetching location...
          </Text>
        </View>
      ) : localLoader || (!location?.latitude && !location?.longitude) ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            display:
              !location?.latitude && !location?.longitude ? 'flex' : 'none',
          }}>
          <Text
            style={{
              fontSize: fonts.SIZE_13,
              fontFamily: fonts.Montserrat_Bold,

              color: Colors.primary.BLACK,
              marginTop: 0,
            }}>
            Enable your location for get venues
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
            <View style={styles.searchHere_View}>
              <Image
                source={imagePath.search}
                style={styles.search_icon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Search"
                placeholderTextColor={Colors.secondary.GREY_CHATEAU}
                value={params?.search}
                onChangeText={text => {
                  if (text?.trim()) {
                    setPlaceHide(true);
                  } else {
                    setPlaceHide(false);
                  }
                  const dic = {...params};
                  dic.search = text;
                  dic.page = 1;
                  dic.radius = '';
                  dic.category = '';
                  dic.latitude = location?.latitude ? location?.latitude : '';
                  dic.longitude = location?.longitude
                    ? location?.longitude
                    : '';
                  setCurrentPage(1);
                  setParams(dic);
                  if (searchTimer) {
                    clearTimeout(searchTimer);
                  }
                  searchTimer = setTimeout(() => {
                    dispatch(venueListingApi(dic));
                  }, 1000);
                }}
              />

              {placeHide ? (
                <TouchableOpacity
                  onPress={() => {
                    setPlaceHide(false);
                    setParams({...params, search: ''});
                    if (searchTimer) {
                      clearTimeout(searchTimer);
                    }
                    searchTimer = setTimeout(() => {
                      setCurrentPage(1);
                      let dic = {...params};
                      dic.search = '';
                      dic.latitude;
                      dispatch(venueListingApi(dic));
                    }, 1000);
                  }}>
                  <Image
                    source={imagePath.cancle}
                    style={{right: -10}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  // props.navigation.navigate("Filter")
                  methodFilterButtonClick();
                }}>
                <Image
                  source={imagePath.filter}
                  style={styles.search_icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                alert(
                  'Venues will not respond to distress signals once an event has ended and are not held liable if you submit a distress signal while not on the venue property.',
                );
              }}>
              <Image
                source={imagePath.letter_i}
                style={{width: 35, height: 35, marginLeft: 15}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            style={{flex: 1, marginTop: 20}}
            data={venuedata}
            showsVerticalScrollIndicator={false}
            renderItem={renderItemAcept}
            onEndReached={methodOnEndReached}
            keyExtractor={(item, index) => index?.toString()}
            refreshControl={
              <RefreshControl
                refreshing={venuedataPullToRefresh}
                onRefresh={methodPullToRefresh}
              />
            }
            ListEmptyComponent={
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
                  {translateText('No_data_found')}
                </Text>
              </View>
            }
            contentContainerStyle={{flexGrow: 1}}
            // keyExtractor={item => item.id}
          />

          {!keyboardStatus ? (
            <>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 17,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <AppButton
                    bttTitle={translateText('Confirm_this_venue')}
                    mainWidth={'50%'}
                    // marginBottom={10}
                    color={'white'}
                    // isLoading={loaderShow}
                    borderRadius={12}
                    backgroundColor={'#0B6EBC'}
                    onPress={() => {
                      if (selectedVenueId == '' || selectedVenueId == null) {
                        showToastMessage('Select venue first.');
                        return;
                      } else {
                        setShowModal(true);
                      }
                    }}
                  />

                  <AppButton
                    bttTitle={translateText('Check Out')}
                    mainWidth={'50%'}
                    // marginBottom={20}

                    color={'white'}
                    // isLoading={loaderShow}
                    borderRadius={12}
                    backgroundColor={'#FF518E'}
                    onPress={() => {
                      if (userData?.venue_id == null) {
                        showToastMessage('Please confirm the venue first');
                        return;
                      } else {
                        checkoutFunction();
                      }
                    }}
                  />
                </View>

                <AppButton
                  bttTitle={translateText('Initiate_party_mode')}
                  marginBottom={20}
                  color={'white'}
                  // isLoading={loaderShow}
                  borderRadius={10}
                  backgroundColor={'#1BCC4A'}
                  onPress={() => {
                    if (userData?.venue_id == null) {
                      showToastMessage('Please confirm the venue first');
                      return;
                    }
                    getAllContact(res => {
                      // console.log("res----->",res);

                      if (res) {
                        props.navigation.navigate('InviteToParty', {
                          selectedVenueId: selectedVenueId,
                        });
                      }
                      //
                    });
                    // props.navigation.navigate('InviteToParty');
                    // methodChangePassword();
                  }}
                />
              </View>
            </>
          ) : (
            <></>
          )}

          <VisiblityModal
            onoff={!onoff ? imagePath.togleoff : imagePath.togleon}
            visible={showModal}
            onOff={() => {
              setOnOff(!onoff);
            }}
            onCancel={() => {
              setShowModal(false);
            }}
            onConfirm={() => {
              //   dispatch(setAppSessionReducer(NOTIFICATION_COUNTT, 0))
              setShowModal(false);
              setCurrentPage(1);

              confirmVenue();
              dispatch(getProfileAction());
              // methodLogOut();
              // props.navigation.navigate('HomeScreen');
            }}
          />
        </>
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
    </SafeAreaView>
  );
};

export default FirstHome;
