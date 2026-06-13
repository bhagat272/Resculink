import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import ImageLoadView from '../../../utils/imageLoadView';
import {IMAGE_URL, JSON_HEADER} from '../../../appRedux/apis/commonValue';
import imagePath from '../../../theme/imagePath';
import fonts from '../../../theme/fonts';
import {
  getProfileAction,
  getProfileApi,
  setUserDataPayLoad,
} from '../../../appRedux/actions/userSessionAction';
import {updateVisibilityApi} from '../../../appRedux/actions/appSessionAction';
import {getAllContact} from '../../../permissions/getContact';
import {translateText} from '../../../utils/language';
import {socketConnectionCheck} from '../../../component/socket';
import {useIsFocused} from '@react-navigation/native';
import {
  requestAndroidNotificationPermission,
  updateDeviceToken,
} from '../../../permissions/notificationPermissions';
import {DEVICE_INFO, getDeviceUniqueId} from '../../../utils/helper';
import DeviceInfo from 'react-native-device-info';
import {UPDATE_DEVICE_TOKEN} from '../../../appRedux/apis/endpoints';
import {SELECTED_VENUE_ID} from '../../../appRedux/constants/userSessionType';

const HomeScreen = props => {
  const isFocused = useIsFocused();
  const userData = useSelector(state => state.session.userData);
  const [storeImage, SetStoreImage] = useState();
  const {StoreIs, selectedVenueId} = props?.route?.params
    ? props?.route?.params
    : false;

  console.log('selectedVenueId------aaaaaa', selectedVenueId);

  const [visibility, setVisbilty] = useState(userData?.visibility);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      socketConnectionCheck();
      dispatch(getProfileAction());
      getProfile();
    }
  }, [isFocused]);

  useEffect(() => {
    generateToken();
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

  const getProfile = () => {
    dispatch(getProfileApi()).then(res => {
      if (res) {
        setVisbilty(res?.data?.visibility);
      }
    });
  };

  const confirmVenue = () => {
    const data = {
      visibility: visibility ? 0 : 1,
    };
    dispatch(updateVisibilityApi(data)).then(res => {
      if (res) {
        dispatch(getProfileAction());
        setVisbilty(res?.data?.visibility);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: Platform.OS == 'ios' ? 20 : 50,
          }}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('FirstHome');
              dispatch(setUserDataPayLoad(SELECTED_VENUE_ID, null));
            }}>
            <Image source={imagePath.back} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{}}
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
        </View>
        <View style={{paddingHorizontal: 20}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <TouchableOpacity
              onPress={() => {
                confirmVenue();
              }}>
              <Image
                source={
                  visibility == 0 ? imagePath.togleoff : imagePath.togleon
                }
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: fonts.Montserrat_SemiBold,
                fontSize: fonts.SIZE_16,
                color: '#0B6EBC',
                left: 10,
              }}>
              {translateText('Visibility')}
            </Text>
          </View>

          <View style={styles.card}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
              }}>
              <ImageLoadView
                resizeMode="cover"
                source={{
                  uri:
                    IMAGE_URL + global?.userData?.venue_detail?.venue_picture,
                }}
                style={[
                  styles.image,
                  {width: 100, height: 100, borderRadius: 10},
                ]}
              />
              <View style={{width: '70%'}}>
                <Text
                  style={[
                    styles.name,
                    {width: '70%', fontFamily: fonts.Montserrat_Bold},
                  ]}>
                  {userData?.venue_detail?.venue_name}
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
                    {userData?.venue_detail?.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              marginTop: 13,
              color: '#111B34',
              fontFamily: fonts.Montserrat_Bold,
              fontSize: fonts.SIZE_24,
            }}>
            {translateText('I_need_assistance')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              props.navigation.navigate('Medical');
            }}>
            <View
              style={{
                width: '100%',
                marginTop: 20,
                borderRadius: 20,
                justifyContent: 'center',
              }}>
              <Image source={imagePath.medical} style={{width: '100%'}} />
              <Text
                style={{
                  position: 'absolute',
                  color: 'white',
                  fontSize: fonts.SIZE_33,
                  fontFamily: fonts.Montserrat_Bold,
                  left: 30,
                }}>
                {translateText('MEDICAL')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              props.navigation.navigate('Security');
            }}>
            <View
              style={{
                width: '100%',
                marginTop: 20,
                borderRadius: 20,
                justifyContent: 'center',
              }}>
              <Image source={imagePath.security} style={{width: '100%'}} />
              <Text
                style={{
                  position: 'absolute',
                  color: 'white',
                  fontSize: fonts.SIZE_33,
                  fontFamily: fonts.Montserrat_Bold,
                  left: 30,
                }}>
                {translateText('SECURITY')}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <View
              style={{
                height: 1,
                width: '40%',
                backgroundColor: '#E4E4E4',
              }}></View>
            <Text
              style={{
                fontFamily: fonts.Montserrat_Bold,
                fontSize: fonts.SIZE_18,
                color: '#111B34',
              }}>
              {translateText('OR')}
            </Text>
            <View
              style={{
                height: 1,
                width: '40%',
                backgroundColor: '#E4E4E4',
              }}></View>
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              getAllContact(res => {
                if (res) {
                  props.navigation.navigate('InviteToParty', {
                    selectedVenueId: selectedVenueId,
                  });
                }
                //
              });
            }}>
            <View
              style={{
                width: '100%',
                marginTop: 20,
                borderRadius: 20,
                justifyContent: 'center',
              }}>
              <Image source={imagePath.partymode} style={{width: '100%'}} />
              <Text
                style={{
                  position: 'absolute',
                  color: 'white',
                  fontSize: fonts.SIZE_33,
                  fontFamily: fonts.Montserrat_Bold,
                  left: 30,
                }}>
                {translateText('PARTY_MODE')}
              </Text>

              <Image
                source={imagePath.info}
                style={{position: 'absolute', right: 20, top: 15}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
