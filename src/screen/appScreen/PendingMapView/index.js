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
  mapListApi,
} from '../../../appRedux/actions/appSessionAction';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {socketConnectionCheck} from '../../../component/socket';
const OFFSET_FACTOR = 0.0005;
const PendingMapView = props => {
  const [showMsg, setShowMsg] = useState(false);
  const {type, item, allData} = props?.route?.params
    ? props?.route?.params
    : false;

  // console.log("latitude---->",allData?.data?.venue_detail?.latitude);

  // console.log("longitude---->",allData?.data?.venue_detail?.longitude);
  const DEFAULT_LATITUDE = 33.753746;
  const DEFAULT_LONGITUDE = -84.38633;
  const dispatch = useDispatch();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [shortHeight, setShortHeight] = useState();

  const {mapListData} = useSelector(state => state.appSession);

  // console.log("mapListData---------->",mapListData);

  const userData = useSelector(state => state.session.userData);
  // console.log("userData---->",userData);

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  // latitudeDelta: 0.05,
  //   longitudeDelta: 0.05,
  const [initialCoords, setInitialCoords] = useState({
    latitude: parseFloat(userData.latitude)
      ? parseFloat(userData?.latitude)
      : parseFloat(DEFAULT_LATITUDE),
    longitude: parseFloat(userData?.longitude)
      ? parseFloat(userData?.longitude)
      : parseFloat(DEFAULT_LONGITUDE),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const getOffsetCoordinate = (latitude, longitude, index) => {
    const offsetLat = latitude + index;
    const offsetLng = longitude + index;
    return {latitude: offsetLat, longitude: offsetLng};
  };

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

          const data = {venue_id: item};

          dispatch(mapListApi(data)).then(res => {
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
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      notificationIcon: true,
      notification: imagePath.refresh,
      Title: 'Map View',
      notificationClick: () => {
        dispatch(loadingShow(true));
        const data = {
          venue_id: item,
        };

        dispatch(mapListApi(data)).then(res => {
          if (res) {
            updateLocationAndGetUser();
            dispatch(loadingShow(false));
          }
        });
      },
      heightRightImg: 35,
      widthRightImg: 35,

      leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
  }, []);

  useEffect(() => {
    socketConnectionCheck();
    dispatch(loadingShow(true));
    const data = {
      venue_id: item,
    };
    // console.log("data---->",data);

    // setLoader(true)
    dispatch(mapListApi(data)).then(res => {
      // console.log("res---->",res);

      if (res) {
        dispatch(loadingShow(false));
      }
    });
  }, []);

  useEffect(() => {
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
  }, []);
  const _keyboardDidShow = e =>
    setShortHeight(Platform.OS == 'android' ? 0 : e.endCoordinates.height);
  const _keyboardDidHide = e => setShortHeight(0);
  const isAndroid = Platform.OS === 'android';

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAwareScrollView style={{ flex:1 }}> */}

      <MapView
        region={initialCoords}
        showsUserLocation={true}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="satellite"
        // showsMyLocationButton={true}
      >
        {mapListData?.map((data, index) => {
          // console.log("data------>",data);

          const latitude = parseFloat(data?.latitude) || 33.753746;
          const longitude = parseFloat(data?.longitude) || -84.38633;
          const coordinate = getOffsetCoordinate(latitude, longitude, index);

          return isAndroid ? (
            <Marker
              key={index}
              onPress={() => {}}
              coordinate={coordinate}
              image={
                data?.profile_picture
                  ? {
                      uri: IMAGE_URL + data?.profile_picture,
                    }
                  : imagePath.logo
              }
            />
          ) : (
            <Marker key={index} onPress={() => {}} coordinate={coordinate}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {data?.profile_picture ? (
                  <ImageLoadView
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={{
                      uri: IMAGE_URL + data?.profile_picture,
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
          );
        })}
      </MapView>
    </SafeAreaView>
  );
};

export default PendingMapView;
