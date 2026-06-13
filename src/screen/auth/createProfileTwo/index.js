import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Text,
  Alert,
  BackHandler,
} from 'react-native';
import imagePath from '../../../theme/imagePath';

import styles from './styles';
import KeyboardScroll from '../../../component/keyboardScroll';
import {showToastMessage} from '../../../utils/Toast';
import AppInput from '../../../component/commonTextInputs';
import {AppButton} from '../../../component';
import AppHeader from '../../../navigation/appHeader';
import {TextInput} from 'react-native-gesture-handler';
import Colors from '../../../theme/colors';
import {ValidateForm} from '../../../utils/validation/validation';
import GoogleSearch from '../../../utils/googleSearch';
import {useDispatch, useSelector} from 'react-redux';
import CountryPicker from '../../../utils/CountryCodePicker';
import {methodSecurityDecoded} from '../../../utils/helper';
import {keys} from '../../../utils/validation/firebaseRemoteConfig';
import fonts from '../../../theme/fonts';
import CustomDropdown from '../../../component/picker';
import {
  createProfileApi,
  createProfileProviderApi,
} from '../../../appRedux/actions/userSessionAction';
import {confirm} from '../../../utils/alertController';
import {
  uniquecodeApi,
  venuehistoryApi,
} from '../../../appRedux/actions/appSessionAction';
import {translateText} from '../../../utils/language';
import ImageLoadView from '../../../utils/imageLoadView';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import {AppConstant} from '../../../appRedux/constants/appconstant';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CreateProfileTwo = props => {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const [selectedAvtar, setSelectedAvtar] = useState('');

  const [selectedAvtar1, setSelectedAvtar1] = useState('');
  const [venue_idd, setVenueIdd] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [codeDetail, setCodeDetail] = useState(false);
  const isFocused = useIsFocused();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [modalVisibleCode, setModalVisibleCode] = useState(false);
  const [venueData, setVenueData] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    unique_code: '',
    name: '',
    address: '',
    latitude: '',
    location: '',
    longitude: '',
    gender: '',
    phone_number: '',
    // type: global.user_type,
    country_code: '+1',
    validators: {
      name: {
        type: 'name',
        error: '',
      },
      address: {
        type: 'address',
        error: '',
      },
    },
  });

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (Platform.OS === 'ios') {
          // Reset scroll position when keyboard hides
          scrollRef.current?.scrollToPosition(0, 0, true);
        }
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const genderOptions = [
    {label: 'Male', value: 'male', id: 1},
    {label: 'Female', value: 'female', id: 2},
    {label: 'Other', value: 'other', id: 3},
  ];

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      // console.log('height', e.endCoordinates.height);
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
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      Title: translateText('create_profile'),
      // leftIcon: true,
      // titleColor:"white",
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
  }, []);

  const methodProfileRequest = (key, value) => {
    if (key == 'name') {
      value = value.replace(
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
        '',
      );
    }
    let dic = {...profileFormData};
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setProfileFormData(dic);
  };

  // const uniquecodeData = unique_code => {
  //   console.log('unique_code====>', unique_code);

  //   const data = {
  //     unique_code: unique_code,
  //   };
  //   // console.log("data--->",data);

  //   dispatch(uniquecodeApi(data)).then(res => {
  //     console.log('res---->', res?.data);
  //     console.log('res---->', res);

  //     if (res?.status) {
  //       setShowDetail(true);
  //       setCodeDetail(true);
  //       setVenueData(res?.data);
  //       // setVenueIdd(res?.unique_code)
  //     } else {
  //       setShowDetail(false);
  //       setCodeDetail(false);
  //       setVenueData('');
  //     }
  //   });
  // };

  const uniquecodeData = unique_code => {
    return new Promise((resolve, reject) => {
      const data = {
        unique_code: unique_code,
      };

      dispatch(uniquecodeApi(data))
        .then(res => {
          console.log('res---->', res?.data);

          if (res?.status) {
            setVenueData(res?.data);
            setShowDetail(true);
            setCodeDetail(true);
            resolve(res?.data); // success
          } else {
            setVenueData('');
            setShowDetail(false);
            setCodeDetail(false);
            resolve(false); // failed
          }
        })
        .catch(err => {
          console.log('uniquecodeApi error:', err);
          reject(err); // in case of error
        });
    });
  };

  const createProfile = async () => {
    if (selectedAvtar == '') {
      showToastMessage('Please upload front document');
      return;
    }
    if (selectedAvtar1 == '') {
      showToastMessage('Please upload back document');
      return;
    }

    if (profileFormData.name == '') {
      showToastMessage('Please enter name');
      return;
    }

    if (!selectedImage) {
      showToastMessage('Please select photo');
      return;
    }

    if (profileFormData.name.length <= 2) {
      showToastMessage('Please enter minimum 3 characters');
      return;
    } else if (profileFormData.unique_code == '') {
      showToastMessage('Please enter unique venue code');
      return;
    } else if (profileFormData.unique_code) {
      setCodeDetail(true);
      setIsEmailValid(true);
    }

    const isCodeValid = await uniquecodeData(profileFormData.unique_code);
    if (!isCodeValid) {
      showToastMessage('No venue found with this code.');
      return;
    }

    Keyboard.dismiss();
    let dic = {...profileFormData};
    delete dic.validators;
    let newFormData = new FormData();
    if (selectedImage) {
      newFormData.append(`profile_picture`, {
        uri: selectedImage,
        name: 'test.jpeg',
        type: 'image/jpeg',
      });
    }

    if (selectedAvtar) {
      newFormData.append(`document1`, {
        uri: selectedAvtar,
        name: 'test.jpeg',
        type: 'image/jpeg',
      });
    }

    if (selectedAvtar1) {
      newFormData.append(`document2`, {
        uri: selectedAvtar1,
        name: 'test.jpeg',
        type: 'image/jpeg',
      });
    }

    newFormData.append('name', dic?.name);
    newFormData.append('country_code', dic?.country_code);
    newFormData.append('phone_number', dic?.phone_number);
    // newFormData.append('venue_id', venueData?.id);
    newFormData.append('venue_id', isCodeValid?.id || venueData?.id);

    console.log('newFormData------->', JSON.stringify(newFormData));
    // return;

    dispatch(createProfileProviderApi(newFormData, props?.navigation));
  };

  const chooseImage = () => {
    props.navigation.navigate('ImageController', {
      isCircle: true,
      onSuccess: res => {
        // console.log("res----->",res);

        if (res.path) {
          setSelectedImage(res.path);
        }
      },
    });
  };

  const chooseImageone = () => {
    props.navigation.navigate('ImageController', {
      isCroping: true,
      onSuccess: res => {
        if (res.path) {
          setSelectedAvtar(res.path);
        }
      },
    });
  };

  const chooseImageTwo = () => {
    // console.log("two");

    props.navigation.navigate('ImageController', {
      isCroping: true,
      onSuccess: res => {
        if (res.path) {
          setSelectedAvtar1(res.path);
        }
      },
    });
  };

  const methodSetCountryCode = code => {
    methodProfileRequest('country_code', code.dial_code);
    setModalVisibleCode(false);
  };

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

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardScroll>
        <SafeAreaView style={styles.container}>
          <View style={styles.CreateProfile_IconView}>
            <Image
              source={
                selectedImage ? {uri: selectedImage} : imagePath.profileImage1
              }
              resizeMode={'cover'}
              style={styles.CreateProfile_Icon}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                chooseImage();
              }}
              style={styles.uploadIcon_Touch}>
              <Image
                source={imagePath.edit_profile_blue}
                style={styles.upload_icon}
                tintColor={'#0B6EBC'}
                resizeMode="contain"
              />
              <Text style={styles.addPhotoText}>
                {translateText('add_photo')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: '#111B34',
              fontSize: fonts.SIZE_14,
              fontFamily: fonts.Montserrat_SemiBold,
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            {translateText('Upload_front')}
          </Text>

          {selectedAvtar ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.navigation.navigate('ViewImage', {
                  itemData: {
                    media_url: selectedAvtar,
                    // media_type: item?.path ? "VIDEO" : "IMAGE",
                    isLocalData: true,
                  },
                });
              }}>
              <Image
                resizeMode={'cover'}
                source={
                  // selectedAvtar ?
                  {uri: selectedAvtar}
                  // : imagePath.event
                }
                style={styles.CreateProfile_Icon1}
              />
              {selectedAvtar ? (
                <TouchableOpacity
                  onPress={() => {
                    // setSelectedAvtar('')
                    confirm(translateText('Do_you_want'), res => {
                      if (res == false) {
                        return;
                      } else if (res == true) {
                        setSelectedAvtar('');
                      }
                    });
                  }}
                  activeOpacity={0.6}
                  style={{
                    position: 'absolute',
                    right: 25,
                    top: 15,
                    height: 30,
                    width: 30,
                    backgroundColor: '#BC0B0B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30 / 2,
                  }}>
                  <Image source={imagePath.deletered} />
                </TouchableOpacity>
              ) : (
                ''
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                chooseImageone();
              }}>
              <Image
                resizeMode={'cover'}
                source={
                  // selectedAvtar ?
                  // { uri: selectedAvtar }
                  // :
                  imagePath.event
                }
                style={styles.CreateProfile_Icon1}
              />
            </TouchableOpacity>
          )}

          <Text
            style={{
              color: '#111B34',
              fontSize: fonts.SIZE_14,
              fontFamily: fonts.Montserrat_SemiBold,
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            {translateText('Upload_back')}
          </Text>
          {selectedAvtar1 ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                props.navigation.navigate('ViewImage', {
                  itemData: {
                    media_url: selectedAvtar1,
                    // media_type: item?.path ? "VIDEO" : "IMAGE",
                    isLocalData: true,
                  },
                });
              }}>
              <Image
                resizeMode={'cover'}
                source={
                  // selectedAvtar1 ?
                  {uri: selectedAvtar1}
                  //  : imagePath.event
                }
                style={styles.CreateProfile_Icon1}
              />
              {selectedAvtar1 ? (
                <TouchableOpacity
                  onPress={() => {
                    confirm(translateText('Do_you_want'), res => {
                      if (res == false) {
                        return;
                      } else if (res == true) {
                        setSelectedAvtar1('');
                      }
                    });
                    // setSelectedAvtar1('')
                  }}
                  activeOpacity={0.6}
                  style={{
                    position: 'absolute',
                    right: 25,
                    top: 15,
                    height: 30,
                    width: 30,
                    backgroundColor: '#BC0B0B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30 / 2,
                  }}>
                  <Image source={imagePath.deletered} />
                </TouchableOpacity>
              ) : (
                ''
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                chooseImageTwo();
              }}>
              <Image
                resizeMode={'cover'}
                source={
                  // selectedAvtar1 ?
                  // { uri: selectedAvtar1 }
                  // //  :
                  imagePath.event
                }
                style={styles.CreateProfile_Icon1}
              />
            </TouchableOpacity>
          )}

          <AppInput
            // lable={"Name"}
            placeholder={translateText('Enter_username')}
            keyboardType={'default'}
            maxLength={30}
            // editable={!loaderShow}
            // marginTop={20}
            // editable={!loaderShow}
            leftIcon={imagePath.businessNameImage}
            value={profileFormData.name}
            onChangeText={val => {
              methodProfileRequest('name', val);
            }}
            // isErrorMsg={profileFormData.validators.name.error}
          />

          <AppInput
            paddingHorizontal={30}
            placeholder={translateText('enter_number')}
            country_code={true}
            maxLength={15}
            keyboardType={'numeric'}
            returnKeyType={'done'}
            click_code={() => {
              setModalVisibleCode(true);
            }}
            country_text={profileFormData.country_code}
            onChangeText={value => {
              methodProfileRequest('phone_number', value);
            }}
            onPressCountry={() => {
              setModalVisibleCode(true);
            }}
          />

          <AppInput
            placeholder="Enter unique venue code"
            // keyboardType={'default'}
            maxLength={30}
            keyboardType={'numeric'}
            returnKeyType={'done'}
            leftIcon={imagePath.businessNameImage}
            rightIcon={isEmailValid ? imagePath.check1 : ''}
            onPressEye={() => {
              // setEyeTwo(!eyeTwo);
              // dispatch(uniquecodeApi());
              // uniquecodeData(profileFormData.unique_code);
            }}
            onBlur={() => {
              if (profileFormData.unique_code) {
                setIsEmailValid(true);
              } else {
                setIsEmailValid(false);
                uniquecodeData(profileFormData?.unique_code);
              }
            }}
            value={profileFormData.unique_code}
            onChangeText={val => {
              methodProfileRequest('unique_code', val);

              if (val.length == 0) {
                setShowDetail(false);
                setIsEmailValid(false);
                setCodeDetail(false);
                setVenueData('');
              }
            }}
            // isErrorMsg={profileFormData.validators.name.error}
            setFocus={() => {
              if (profileFormData?.unique_code) {
                setCodeDetail(true);
                setIsEmailValid(true);
                uniquecodeData(profileFormData?.unique_code);
              } else {
                setIsEmailValid(false);
              }
              // passwordRef.current?.focus();
            }}
          />

          {codeDetail && showDetail ? (
            <View style={styles.card}>
              <View style={styles.row}>
                <ImageLoadView
                  source={
                    venueData?.venue_picture
                      ? {uri: IMAGE_URL + venueData?.venue_picture}
                      : imagePath.profileImage1
                  }
                  resizeMode="cover"
                  style={styles.image}
                />

                <View style={styles.content}>
                  <Text style={styles.name} numberOfLines={1}>
                    {venueData?.venue_name}
                  </Text>

                  <View style={styles.addressRow}>
                    <Image
                      source={imagePath.locationn}
                      resizeMode="contain"
                      style={styles.locationIcon}
                    />

                    <Text style={styles.address} numberOfLines={3}>
                      {venueData?.address}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <></>
          )}

          <CountryPicker
            show={modalVisibleCode}
            closeModal={() => setModalVisibleCode(false)}
            onSelect={value => methodSetCountryCode(value)}
          />

          {!keyboardStatus ? (
            <>
              <AppButton
                bttTitle={translateText('Next')}
                //  marginBottom={10}
                marginTop={20}
                color={'white'}
                // isLoading={loaderShow}
                borderRadius={10}
                backgroundColor={'#0B6EBC'}
                onPress={() => {
                  // props.navigation.navigate("Login")
                  // // loginUser()
                  createProfile();
                }}
              />
            </>
          ) : (
            <></>
          )}
        </SafeAreaView>
      </KeyboardScroll>
    </View>
  );
};

export default CreateProfileTwo;
