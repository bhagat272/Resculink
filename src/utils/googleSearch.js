import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import Colors from '../theme/colors';
import imagePath from '../theme/imagePath';
// import font from '../theme/fonts';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {geoCurrentLocation, GetAddressFromLatLong} from './locationPermission';
import {isNetworkAvailable} from '../appRedux/apis/network';
import {methodSecurityDecoded} from './helper';
import {keys} from './validation/firebaseRemoteConfig';
const GoogleSearch = props => {
  const map = useRef(null);
  const placesRef = useRef();
  const mapRef = useRef();
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0999;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [location, setLocation] = useState({
    latitude: props?.prefillAddress?.latitude
      ? props?.prefillAddress?.latitude
      : 37.09024,
    longitude: props?.prefillAddress?.longitude
      ? props?.prefillAddress?.longitude
      : -95.712891,
    address: props?.prefillAddress?.address
      ? props?.prefillAddress?.address
      : '',
  });
  // console.log('location------>>>', location);

  const curentLocation = async () => {
    const isConnected = await isNetworkAvailable();
    if (isConnected === false) {
      showToastMessage(kInternetError);
    } else {
      geoCurrentLocation(1, data => {
        // console.log('geoCurrentLocation--------->', data);

        if (data.latitude && data.longitude) {
          GetAddressFromLatLong(data.latitude, data.longitude, address => {
            let curentAddress = {};
            curentAddress.address = address;
            curentAddress.latAdd = data.latitude;
            curentAddress.longAdd = data.longitude;

            // console.log('curentAddress------11', curentAddress);
            placesRef?.current?.setAddressText(curentAddress?.address);
            setLocation({
              ...location,
              latitude: curentAddress.latAdd,
              longitude: curentAddress?.longAdd,
              address: curentAddress?.address,
            });
            map.current.animateCamera({
              center: {
                latitude: curentAddress.latAdd,
                longitude: curentAddress?.longAdd,
              },
              // heading: 0,
              pitch: 70,
              altitude: 3000,
            });
          });
        } else {
        }
      });
    }
  };

  useEffect(() => {
    placesRef.current?.setAddressText(
      props?.prefillAddress?.address ? props?.prefillAddress?.address : '',
    );
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          [
            {
              latitude: props?.prefillAddress?.latitude,
              longitude: props?.prefillAddress?.longitude,
            },
          ],
          {edgePadding: {}, animated: true},
        );
      }
    }, 1000);
  }, []);

  useEffect(() => {
    // console.log("location", location)
  }, [location]);
  return (
    <Modal transparent={true} visible={props?.showGoogleSearch}>
      <View style={styles.container}>
        <View style={styles.search_container}>
          <TouchableOpacity
            style={styles.back_view}
            activeOpacity={0.6}
            onPress={() => {
              props?.onBack();
            }}>
            <Image
              style={styles.back_logo}
              source={imagePath.back_arrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.serachBar}>
            <GooglePlacesAutocomplete
              // style={{colors:"red"}}

              // placeholderTextColor="#000000"
              ref={placesRef}
              placeholder="Enter Location"
              // textInputProps={{ borderWidth: 1, borderRadius: 10, borderColor: Colors.primary.GREY, }}
              autoFocus
              returnKeyType={'search'}
              listViewDisplayed={false}
              fetchDetails={true}
              renderDescription={row => row.description}
              onPress={(data, details = null) => {
                // console.log("data======", data, "details============", details);
                setLocation({
                  ...location,
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  address: data.description,
                });

                let loc = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  address: data.description,
                };

                props?.onSubmit(
                  loc ? loc : {address: props?.prefillAddress?.address},
                );
              }}
              query={{
                key: methodSecurityDecoded(keys.google_place_api_key),
                language: 'en',
              }}
              styles={{
                textInputContainer: {
                  height: 50,
                  width: '100%',
                  backgroundColor: '#fff',
                  // color:'red'
                },

                textInput: {
                  height: 50,
                  // width:'80%',
                  // color:'red',
                  backgroundColor: Colors.primary.WHITE,
                },
                listView: {},
                description: {
                  color: '#000',
                },
                separator: {
                  // backgroundColor: "transaparent"
                },
                placeholderText: styles.placeholder,
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
              showClearButton={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GoogleSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  serachBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    // borderWidth: 1,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: Colors.primary.GREY,
    // borderRadius:10
  },

  search_container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 5,
    marginVertical: 10,
    left: 10,
    position: 'absolute',
    marginTop: Platform.OS == 'ios' ? 60 : 20,
  },
  back_logo: {
    height: 20,
    width: 20,
    right: 0,
    // marginTop:10,
    tintColor: Colors.primary.BLACK,
  },
  back_view: {
    marginTop: '4%',
  },
  loc_logo: {
    height: 30,
    width: 30,
    // tintColor:Colors.primary.BLACK
  },
  loc_view: {
    marginTop: '3%',
    marginHorizontal: 5,
  },
  input: {
    color: '#000000', // Set the text color for both input text and placeholder
  },
  addL_view: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 50,
    right: 20,
  },
  addL_img: {
    height: 60,
    width: 60,
  },
  input: {
    color: '#FFFFFF', // Set the text color for both input text and placeholder
  },
  placeholder: {
    color: '#A9A9A9', // Set the color for the placeholder text
  },
});
