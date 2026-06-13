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
const SelectedVenue = props => {
  const userData = useSelector(state => state.session.userData);

  const dispatch = useDispatch();
  const [showMsg, setShowMsg] = useState(false);
  const {type, selectedId} = props?.route?.params
    ? props?.route?.params
    : false;

  // console.log("selectedId-ssssss--->",selectedId);

  // console.log("userrrr",userData?.venue_detail?.id);

  const sendSelectedUsers = () => {
    const data = {
      user_ids: selectedId,
      venue_id: userData?.venue_detail?.id,
    };

    // console.log("data----->",data);

    dispatch(invitePartyModeapi(data)).then(res => {
      // console.log("res---->",res);

      if (res) {
        dispatch(loadingShow(false));
        dispatch(getProfileAction());

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
    // props.navigation.navigate("PartyModeScreen",{item:res})
  };

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

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: fonts.Montserrat_SemiBold,
          fontSize: fonts.SIZE_16,
          color: '#333333',
          paddingHorizontal: 20,
        }}>
        Selected Venue
      </Text>

      <View style={styles.card}>
        <View
          style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
          <ImageLoadView
            source={
              userData?.venue_detail?.venue_picture
                ? {uri: IMAGE_URL + userData?.venue_detail?.venue_picture}
                : imagePath.profileImage1
            }
            resizeMode={'cover'}
            style={styles.image}
          />
          <View>
            <Text style={styles.name}>
              {userData?.venue_detail?.venue_name}{' '}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 10, width: '75%'}}>
              <Image
                source={imagePath.locationn}
                tintColor={'white'}
                resizeMode="contain"
                style={{height: 20, width: 20}}
              />

              <Text numberOfLines={3} style={[styles.time, {width: '100%'}]}>
                {userData?.venue_detail?.address}
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
      </View>

      <View style={{position: 'absolute', bottom: 10, width: '100%'}}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            // console.log("here");

            props?.navigation?.navigate('SelectVenue', {
              selectedIdd: selectedId,
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
              bottom: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props?.navigation?.navigate('SelectVenue', {
                  selectedIdd: selectedId,
                });
              }}>
              <Image
                source={imagePath.add1}
                style={{right: 5, height: 27, width: 27}}
              />
            </TouchableOpacity>
            <Text
              activeOpacity={0.6}
              onPress={() => {
                props?.navigation?.navigate('SelectVenue', {
                  selectedIdd: selectedId,
                });
              }}
              style={{
                left: 5,
                fontFamily: fonts.Montserrat_SemiBold,
                fontSize: fonts.SIZE_16,
                color: '#0B6EBC',
              }}>
              Add different venue
            </Text>
          </View>
        </TouchableOpacity>

        <AppButton
          bttTitle={translateText('Confirm_this_venue')}
          marginBottom={10}
          color={'white'}
          borderRadius={10}
          backgroundColor={'#0B6EBC'}
          onPress={() => {
            sendSelectedUsers();
          }}
        />
      </View>
    </View>
  );
};

export default SelectedVenue;
