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
  updtaelatlong,
} from '../../../appRedux/actions/appSessionAction';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {socketConnectionCheck} from '../../../component/socket';
import {useIsFocused} from '@react-navigation/native';
import {geoCurrentLocation} from '../../../permissions/getLocation';
const OFFSET_FACTOR = 0.0005;
const EmployeeGroup = props => {
  const [showMsg, setShowMsg] = useState(false);
  const {type, item, allData, venue_detail} = props?.route?.params
    ? props?.route?.params
    : false;

  // console.log("venue_detail---->",venue_detail);

  // console.log("item--rrrrrr-->",venue_detail?.latitude);
  // console.log("item--rrrrrr-->",venue_detail?.longitude);

  const dispatch = useDispatch();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [shortHeight, setShortHeight] = useState();
  const isFocused = useIsFocused();
  const {employeeListData} = useSelector(state => state.appSession);

  // console.log("employeeListData---------->",employeeListData);

  const userData = useSelector(state => state.session.userData);
  // console.log("userData---->",userData);

  const DEFAULT_LATITUDE = 33.753746;
  const DEFAULT_LONGITUDE = -84.38633;
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [initialCoords, setInitialCoords] = useState({
    latitude: parseFloat(venue_detail?.latitude)
      ? parseFloat(venue_detail?.latitude)
      : parseFloat(''),
    longitude: parseFloat(venue_detail?.longitude)
      ? parseFloat(venue_detail?.longitude)
      : parseFloat(''),
    // latitudeDelta: LATITUDE_DELTA,
    // longitudeDelta: LONGITUDE_DELTA,
    latitudeDelta: 0.005, // Decrease for closer zoom
    longitudeDelta: 0.005,
  });

  // const getOffsetCoordinate = (latitude, longitude, index) => {
  //   const offsetLat = latitude + index
  //   const offsetLng = longitude + index
  //   return { latitude: offsetLat, longitude: offsetLng };
  // };

  const getOffsetCoordinate = (latitude, longitude, index, total) => {
    const OFFSET_FACTOR = 0.0001; // Small offset value to prevent overlap
    const angle = (index / total) * (2 * Math.PI); // Spread markers in a circular pattern

    return {
      latitude: latitude + OFFSET_FACTOR * Math.cos(angle),
      longitude: longitude + OFFSET_FACTOR * Math.sin(angle),
    };
  };

  useEffect(() => {
    socketConnectionCheck();

    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      notificationIcon: true,
      notification: imagePath.Groupmember,
      Title: translateText('Employee_Group'),
      notificationClick: () => {
        // setUserModalVisible(true)
        props.navigation.navigate('GroupMembers', {item: item});
      },
      heightRightImg: 44,
      widthRightImg: 44,

      leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
  }, []);

  useEffect(() => {
    socketConnectionCheck();
  }, [isFocused]);

  useEffect(() => {
    dispatch(loadingShow(true));
    const data = {
      venue_id: item,
    };
    // console.log("data---->",data);

    // setLoader(true)
    dispatch(employeeListApi(data)).then(res => {
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
            venue_id: item,
          };
          // console.log("data---->",data);

          // setLoader(true)
          dispatch(employeeListApi(data)).then(res => {
            console.log(' employeeListApi res---->', res);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAwareScrollView style={{ flex:1 }}> */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          position: 'absolute',
          bottom: 50,
          zIndex: 5,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            borderRadius: 65 / 2,
            height: 65,
            width: 65,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            console.log('item---->', item);

            dispatch(loadingShow(true));
            updateLocationAndGetUser();
          }}>
          <Image resizeMode="cover" source={imagePath.refresh} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: 65,
            width: 65,
            backgroundColor: '#0B6EBC',
            borderRadius: 65 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            // console.log("item---->",item);
            socketConnectionCheck(),
              props.navigation.navigate('GroupChatScreen', {
                other_user_id: item,
              });
          }}>
          <Image
            tintColor={'white'}
            resizeMode="cover"
            source={imagePath.chat}
            style={{height: 30, width: 30}}
          />
        </TouchableOpacity>
      </View>
      <MapView
        // region={initialCoords}
        showsUserLocation={true}
        style={styles.map}
        mapType="satellite"
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}>
        {employeeListData?.map((data, index) => {
          const latitude = parseFloat(data?.latitude) || 33.753746;
          const longitude = parseFloat(data?.longitude) || -84.38633;
          // const coordinate = getOffsetCoordinate(latitude, longitude, index);
          const coordinate = getOffsetCoordinate(
            latitude,
            longitude,
            index,
            employeeListData.length,
          );

          const isAndroid = Platform.OS === 'android';

          return isAndroid ? (
            <Marker
              // key={index}

              onPress={() => {
                props.navigation.navigate('GroupMembers', {item: item});
              }}
              key={index}
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
            <Marker
              onPress={() => {
                props.navigation.navigate('GroupMembers', {item: item});
              }}
              key={index}
              coordinate={coordinate}>
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

        {/* <View> */}
      </MapView>
    </SafeAreaView>
  );
};

export default EmployeeGroup;
