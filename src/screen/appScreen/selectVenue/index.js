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
  kInternetError,
  kUserData,
} from '../../../appRedux/apis/commonValue';
import imagePath from '../../../theme/imagePath';
import fonts from '../../../theme/fonts';
import AppHeader from '../../../navigation/appHeader';
import Colors from '../../../theme/colors';
import {AppButton} from '../../../component';
import {isNetworkAvailable} from '../../../appRedux/apis/network';
import {showToastMessage} from '../../../utils/Toast';
import {
  geoCurrentLocation,
  GetAddressFromLatLong,
} from '../../../permissions/getLocation';
import {useIsFocused} from '@react-navigation/native';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {
  confirmVenueApi,
  customerHomeDataApi,
  invitePartyModeapi,
  partyDetailApi,
  setAppSessionReducer,
  storeListingApi,
  updtaelatlong,
  venueListingApi,
} from '../../../appRedux/actions/appSessionAction';
import {
  PAGE_LOADING_VENUE_LIST_PAGE_DATA,
  PULL_TO_REFRESH_VENUE_LIST_PAGE_DATA,
} from '../../../appRedux/constants/appSessionType';

import {translateText} from '../../../utils/language';
import {setData} from '../../../appRedux/apis/keyChain';
import {setUserData, showLoader} from '../../../utils/helper';
import {
  getProfileAction,
  setUserDataPayLoad,
} from '../../../appRedux/actions/userSessionAction';
import {USER_DATA_KEY} from '../../../appRedux/constants/userSessionType';
import {socketConnectionCheck} from '../../../component/socket';

let searchTimer = null;
const SelectVenue = props => {
  const [placeHide, setPlaceHide] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [onoff, setOnOff] = useState(false);
  const [localLoader, setLoader] = useState(false);
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

  const userData = useSelector(state => state.session.userData);
  const {
    venuedata,
    venuedatapageloading,
    venuedataPullToRefresh,
    venueepagedataLastPage,
  } = useSelector(state => state.appSession);

  const [showMsg, setShowMsg] = useState(false);
  const {type, selectedIdd} = props?.route?.params
    ? props?.route?.params
    : false;

  // console.log("selectedIdd---tttttt->",selectedIdd);

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
    socketConnectionCheck();
    if (isFocused) {
      dispatch(loadingShow(true));
      setLoader(true);
      (async () => {
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

        // console.log("locationDatajnsdjsndsndjsndsjnbd",locationData);

        if (locationData) {
          dic.latitude = locationData?.latAdd ? locationData?.latAdd : '';
          dic.longitude = locationData?.longAdd ? locationData?.longAdd : '';
          dic.search = params?.search ? params?.search : '';
          dic.radius = filter?.radius ? filter?.radius : '';
          dic.category = filter?.category ? filter?.category : '';
          dic.page = 1;
        }
        setLoader(true);
        dispatch(venueListingApi(dic)).then(res => {
          dispatch(loadingShow(false));
          setLoader(false);
          if (res && Array.isArray(res) && res?.length > 0) {
            setNoData(false);
            dispatch(loadingShow(false));
          } else {
            setNoData(true);
            dispatch(loadingShow(false));
          }
        });
      })();
    }
  }, []);

  useEffect(() => {
    dispatch(getProfileAction());
  }, [isFocused]);

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
    setSelectedVenueId(id);
  };

  const renderItemAcept = ({item, index}) => {
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
              style={[
                styles.name,
                {width: '70%', fontFamily: fonts.Montserrat_Bold},
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
              <Image source={imagePath.locationn} />

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
          longitude: location?.longitude ? location?.latitude : '',
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
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftIcon: true,
      headerTitle: true,
      Title: translateText('Select_your_venue'),
      leftIcon: true,
      notificationIcon: false,
      heightRightImg: 45,
      widthRightImg: 45,
      notification: imagePath.notificationcount,

      leftClick: () => {
        props.navigation.goBack();
      },
      notificationClick: () => {
        props.navigation.navigate('UserNotification');
      },
      leftImage: imagePath.back,
    });
  }, []);

  const confirmVenueFunction = () => {
    // dispatch(loadingShow(true));
    // console.log("selectedVenueId====",selectedVenueId);

    if (selectedVenueId == '') {
      showToastMessage('Please select venue');
      return;
    }

    const data = {
      user_ids: selectedIdd,
      venue_id: selectedVenueId,
    };

    // console.log("data---sssssss-->",data);

    dispatch(invitePartyModeapi(data)).then(res => {
      // console.log("res---->",res);

      if (res) {
        dispatch(loadingShow(false));

        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'PartyModeScreen',
              params: {
                item: res, // this second parameter is for sending the params
              },
            },
          ],
        });
        // props.navigation.navigate("PartyModeScreen",{item:res})
        // const data = {
        //     party_id:res?.data?.id
        // }

        // console.log("data--->",data);

        // dispatch(partyDetailApi(data)).then(res => {

        //     if(res){
        //         props.navigation.navigate("PartyModeScreen",{item:res})
        //         dispatch(loadingShow(false));
        //     }

        //     else{
        //         dispatch(loadingShow(false));
        //     }

        // })
      }
    });

    // console.log("data---",data);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {localLoader ? (
          <></>
        ) : (
          <>
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
                    style={{right: 10}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
              {/* <TouchableOpacity activeOpacity={0.6} onPress={() => {
              methodFilterButtonClick();

            }} >
              <Image
                source={imagePath.filter}
                style={styles.search_icon}
                resizeMode="contain"
              />
            </TouchableOpacity> */}
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
                  <AppButton
                    bttTitle={translateText('Confirm_this_venue')}
                    marginBottom={10}
                    color={'white'}
                    // isLoading={loaderShow}
                    borderRadius={10}
                    backgroundColor={'#0B6EBC'}
                    onPress={() => {
                      confirmVenueFunction();

                      //   if (selectedVenueId == '') {
                      //     showToastMessage("Select venue first.")
                      //     return
                      //   }
                      //   else {
                      //     setShowModal(true);
                      //   }
                    }}
                  />
                </View>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SelectVenue;
