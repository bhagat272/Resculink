import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Text,
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
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import ImageLoadView from '../../../utils/imageLoadView';
import {confirm} from '../../../utils/alertController';
import {translateText} from '../../../utils/language';
var regExp = /^[a-zA-Z ]*$/;
const EditProfileProvider = props => {
  const placesRef = useRef();
  const map = useRef(null);
  const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.loadButton);
  const ref_phone_Number = useRef();
  const [gender, setGender] = useState('');
  const [selectedAvtar, setSelectedAvtar] = useState('');
  const [showImage, setShowImage] = useState('');
  const [selectedAvtar1, setSelectedAvtar1] = useState('');
  const [showImage1, setShowImage1] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [searchLoc, setSearchLoc] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [modalVisibleCode, setModalVisibleCode] = useState(false);
  const [currentLoc, setCurrentLoc] = useState({});
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    location: '',
    longitude: '',
    gender: '',
    phone_number: '',
    type: global.user_type,
    country_code: '+1',
    venue_id: '',
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
      leftIcon: true,
      headerTitle: true,
      Title: translateText('Edit_Profile'),
      // leftIcon: true,
      // titleColor:"white",
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
  }, []);

  useEffect(() => {
    // console.log("userData?.phone_number-----", userData);
    if (userData) {
      // setGender(userData?.gender)
      setProfileFormData({
        ...profileFormData,
        name: userData?.name ? userData?.name : '',
        gender: userData?.gender ? userData?.gender : '',
        email: userData?.email ? userData?.email : '',
        phone_number: userData?.phone_number ? userData?.phone_number : '',
        country_code: userData?.country_code ? userData?.country_code : '',
        address: userData?.address ? userData?.address : '',
        latitude: userData?.latitude ? userData?.latitude : '',
        longitude: userData?.longitude ? userData?.longitude : '',
        venue_id: userData?.venue_id ? userData?.venue_id : '',
        user_type: userData?.user_type ? userData?.user_type : '',
        // url:userData?.url ? userData?.url : '',
      });
      if (userData?.profile_picture) {
        setSelectedImage(IMAGE_URL + userData?.profile_picture);
      }

      if (userData?.document1) {
        setSelectedAvtar(IMAGE_URL + userData?.document1);
      }
      if (userData?.document2) {
        setSelectedAvtar1(IMAGE_URL + userData?.document2);
      }
      // setCurrentLoc(userData ? userData : '')
    }
  }, [userData]);
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
  const createProfile = async () => {
    // let validForm = ValidateForm(profileFormData);
    // console.log("validForm---->",validForm);
    // setProfileFormData({ ...profileFormData }, validForm.value);

    // if (validForm.status) {
    if (selectedAvtar == '') {
      showToastMessage('Please upload front document');
      return;
    }

    if (selectedAvtar1 == '') {
      showToastMessage('Please upload back document');
      return;
    }

    if (!selectedImage) {
      showToastMessage('Please select photo');
      return;
    }

    if (profileFormData.name == '') {
      showToastMessage('Please enter name');
      return;
    } else if (profileFormData.name.length <= 2) {
      showToastMessage('Please enter minimum 3 characters');
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
    newFormData.append('venue_id', dic?.venue_id);
    dispatch(createProfileProviderApi(newFormData, props?.navigation));
  };

  const chooseImage = () => {
    props.navigation.navigate('ImageController', {
      isCircle: true,
      mediaType: 'photo',
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
      mediaType: 'photo',
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
      mediaType: 'photo',
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

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardScroll>
        <View style={styles.CreateProfile_IconView}>
          <ImageLoadView
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
            <ImageLoadView
              resizeMode={'cover'}
              source={
                {uri: selectedAvtar}
                // selectedAvtar ? { uri: selectedAvtar } : imagePath.event
              }
              style={styles.CreateProfile_Icon1}
            />
            {/* </View> */}
            {selectedAvtar ? (
              <TouchableOpacity
                onPress={() => {
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
                  right: 30,
                  top: 20,
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
              chooseImageone();
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
            <ImageLoadView
              resizeMode={'cover'}
              source={
                // selectedAvtar1 ?
                {
                  uri: selectedAvtar1,
                }
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
                }}
                activeOpacity={0.6}
                style={{
                  position: 'absolute',
                  right: 30,
                  top: 20,
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

        {/* <CustomDropdown
           value={gender}
          //  onValueChange={(value) => setGender(value)}
            data={genderOptions}
            
            selectedOption={gender}
            pickerTop={12}
            onSubmit={res => {
              // setGender(value)
              // console.log('res======option=======>>>>>>', res);
              setGender(res?.label)
              methodProfileRequest('gender', res?.label);
            }}
            // isErrorMsg={profileFormData.validators.business_category?.error}
          /> */}

        <AppInput
          paddingHorizontal={30}
          placeholder={translateText('enter_number')}
          country_code={true}
          maxLength={15}
          keyboardType={'numeric'}
          value={profileFormData.phone_number}
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

        {/* <AppInput
                   placeholder={translateText('Enter_link')}
                    keyboardType={'default'}
                    maxLength={30}
                    leftIcon={imagePath.businessNameImage}
                    value={profileFormData.venue_id}
                   
                    onChangeText={val => {
                          methodProfileRequest('venue_id', val);
                      }}
                      // isErrorMsg={profileFormData.validators.name.error}


                /> */}

        <View style={{marginTop: 14, marginHorizontal: 20}}>
          {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}

          <View style={styles.location_Touch}>
            <Text
              style={[
                styles.location_text,
                {color: profileFormData?.address ? 'black' : '#767980'},
              ]}>
              {profileFormData?.email ? profileFormData?.email : 'Enter email'}
            </Text>
          </View>
        </View>

        <CountryPicker
          show={modalVisibleCode}
          closeModal={() => setModalVisibleCode(false)}
          onSelect={value => methodSetCountryCode(value)}
        />
      </KeyboardScroll>
      {!keyboardStatus ? (
        <>
          <AppButton
            bttTitle="Update"
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
    </View>
  );
};

export default EditProfileProvider;
