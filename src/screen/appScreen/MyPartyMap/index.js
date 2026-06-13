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
import {
  employeeListApi,
  partyMapListApi,
  updtaelatlong,
} from '../../../appRedux/actions/appSessionAction';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import CancelModal from '../PartyModeScreen/cancelModal';
import {socketConnectionCheck} from '../../../component/socket';
import {geoCurrentLocation} from '../../../permissions/getLocation';
const OFFSET_FACTOR = 0.0005;
const MyPartyMap = props => {
  const [showMsg, setShowMsg] = useState(false);
  const {type, item} = props?.route?.params || false;

  const dispatch = useDispatch();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [shortHeight, setShortHeight] = useState();
  const {partyMapListData} = useSelector(state => state.appSession);
  console.log('partyMapListData----->', partyMapListData);

  const userData = useSelector(state => state.session.userData);

  const DEFAULT_LATITUDE = 33.753746;
  const DEFAULT_LONGITUDE = -84.38633;
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [initialCoords, setInitialCoords] = useState({
    latitude: parseFloat(userData?.latitude) || parseFloat(DEFAULT_LATITUDE),
    longitude: parseFloat(userData?.longitude) || parseFloat(DEFAULT_LONGITUDE),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const updateLocationAndGetUser = async () => {
    await geoCurrentLocation(1, data => {
      console.log(' data ', data);

      if (data === null || data === undefined) {
      }
      if (data.latitude && data.longitude) {
        const dic = {
          latitude: data?.latitude ? data?.latitude : '',
          longitude: data?.longitude ? data?.longitude : '',
        };
        console.log('dic ', dic);

        dispatch(updtaelatlong(dic)).then(res => {
          console.log('updtaelatlong ', res);

          const data = {party_id: item};

          dispatch(partyMapListApi(data)).then(res => {
            console.log('res ', res);

            if (res) {
              dispatch(loadingShow(false));
            }
          });
        });
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      notificationClick: () => {
        dispatch(loadingShow(true));

        updateLocationAndGetUser();
      },
      headerTitle: true,
      notificationIcon: true,
      notification: imagePath.refresh,
      Title: 'My Party',
      fontSizee: fonts.SIZE_15,
      colorss: '#FF518E',
      fontFamilyy: fonts.Montserrat_SemiBold,
      skipClick: () => {},
      heightRightImg: 35,
      widthRightImg: 35,
      leftImage: imagePath.back,
    });
  }, []);

  useEffect(() => {
    dispatch(loadingShow(true));
    const data = {party_id: item};

    dispatch(partyMapListApi(data)).then(res => {
      console.log('res---o-o0-o-o-0o-o', res);

      if (res) {
        dispatch(loadingShow(false));
      }
    });
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = e =>
    setShortHeight(Platform.OS == 'android' ? 0 : e.endCoordinates.height);
  const _keyboardDidHide = () => setShortHeight(0);

  // Function to generate slight random offsets for each marker
  const getOffsetCoordinate = (latitude, longitude, index) => {
    const offsetLat = latitude + (Math.random() * 0.0001 - 0.00005) * index; // Slight variation for each marker
    const offsetLng = longitude + (Math.random() * 0.0001 - 0.00005) * index; // Slight variation for each marker
    return {
      latitude: offsetLat,
      longitude: offsetLng,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          position: 'absolute',
          backgroundColor: '#0B6EBC',
          borderRadius: 20,
          paddingHorizontal: 30,
          paddingVertical: 10,
          marginTop: 20,
          zIndex: 5,
          alignSelf: 'center',
        }}
        activeOpacity={0.8}
        onPress={() => setCancelModalVisible(true)}>
        <Image
          tintColor={'white'}
          style={{right: 5}}
          source={imagePath.notification}
        />
        <Text
          style={{
            color: 'white',
            left: 5,
            fontFamily: fonts.Montserrat_Medium,
            fontSize: fonts.SIZE_14,
          }}>
          Send Distress Signal
        </Text>
      </TouchableOpacity>

      <MapView
        region={initialCoords}
        showsUserLocation={true}
        style={styles.map}
        provider={PROVIDER_GOOGLE}>
        {partyMapListData?.map((data, index) => {
          console.log('data-------->', data);

          const latitude = parseFloat(data?.latitude) || DEFAULT_LATITUDE;
          const longitude = parseFloat(data?.longitude) || DEFAULT_LONGITUDE;

          // Apply slight offsets for all markers
          const coordinate = getOffsetCoordinate(latitude, longitude, index);
          const isAndroid = Platform.OS === 'android';

          return isAndroid ? (
            <Marker
              key={`${data?.id}-${coordinate.latitude}-${coordinate.longitude}`} // Use a unique key for each marker
              coordinate={coordinate}
              title={data?.name}
              image={
                data?.profile_picture
                  ? {
                      uri: IMAGE_URL + data?.profile_picture,
                    }
                  : imagePath.logo
              }
            />
          ) : (
            <Marker
              key={`${data?.id}-${coordinate.latitude}-${coordinate.longitude}`} // Use a unique key for each marker
              coordinate={coordinate}
              title={data?.name}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {data?.profile_picture ? (
                  <ImageLoadView
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={{uri: IMAGE_URL + data?.profile_picture}}
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
          );
        })}
      </MapView>

      <CancelModal
        visible={cancelModalVisible}
        onMedical={() => {
          setCancelModalVisible(false);
          props.navigation.navigate('Medical');
        }}
        onSecurity={() => {
          setCancelModalVisible(false);
          props.navigation.navigate('Security');
        }}
        oncross={() => {
          setCancelModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default MyPartyMap;
