import React, { useEffect, useRef, useState } from 'react';
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
import { showToastMessage } from '../../../utils/Toast';
import AppInput from '../../../component/commonTextInputs';
import { AppButton } from '../../../component';
import AppHeader from '../../../navigation/appHeader';
import { TextInput } from 'react-native-gesture-handler';
import Colors from '../../../theme/colors';
import { ValidateForm } from '../../../utils/validation/validation';
import GoogleSearch from '../../../utils/googleSearch';
import { useDispatch, useSelector } from 'react-redux';
import CountryPicker from '../../../utils/CountryCodePicker';
import { methodSecurityDecoded } from '../../../utils/helper';
import { keys } from '../../../utils/validation/firebaseRemoteConfig';
import fonts from '../../../theme/fonts';
import CustomDropdown from '../../../component/picker';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import { editProfileApi } from '../../../appRedux/actions/userSessionAction';
import ImageLoadView from '../../../utils/imageLoadView';
import { translateText } from '../../../utils/language';

var regExp = /^[a-zA-Z ]*$/;

const EditProfile = props => {
  const placesRef = useRef();
  const map = useRef(null);
  const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.loadButton);
  const ref_phone_Number = useRef();
  const userData = useSelector(state => state.session.userData);
  // console.log("data------", userData);
  const [gender, setGender] = useState('');
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
    email: '',
    phone_number: '',
    country_code: '+1',
    longitude: '',
    type: global.user_type,
    gender: '',
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
    { label: 'Male', value: 'male', id: 1 },
    { label: 'Female', value: 'female', id: 2 },
    { label: 'Other', value: 'other', id: 3 },
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
      Title: translateText('Edit_Profile'),
      leftIcon: true,
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
      setGender(userData?.gender);
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
        user_type: userData?.user_type ? userData?.user_type : '',
        // url:userData?.url ? userData?.url : '',
      });
      if (userData?.profile_picture) {
        setSelectedImage(IMAGE_URL + userData?.profile_picture);
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
    let dic = { ...profileFormData };
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
    if (profileFormData.name == '') {
      showToastMessage('Please enter name');
      return;
    } else if (profileFormData.name.length <= 2) {
      showToastMessage('Please enter minimum 3 characters');
      return;
    }

    if (profileFormData.gender == '') {
      showToastMessage('Please select gender');
      return;
    }

    // if (profileFormData?.address=="")
    // {
    //     showToastMessage("Please enter address");
    //     return;
    //   }

    if (!selectedImage) {
      showToastMessage('Please select photo');
      return;
    }

    Keyboard.dismiss();
    let dic = { ...profileFormData };
    delete dic.validators;

    let newFormData = new FormData();

    newFormData.append('name', dic?.name);
    newFormData.append('gender', gender);
    newFormData.append('phone_number', dic?.phone_number);
    newFormData.append('country_code', dic?.country_code);
    //   if (currentLoc) {
    //   newFormData.append(
    //     'location',
    //     currentLoc?.address ? currentLoc?.address : '',
    //   );
    //   newFormData.append(
    //     'latitude',
    //     currentLoc?.latitude ? currentLoc?.latitude : '',
    //   );
    //   newFormData.append(
    //     'longitude',
    //     currentLoc?.longitude ? currentLoc?.longitude : '',
    //   );
    // }
    if (selectedImage) {
      newFormData.append(`profile_picture`, {
        uri: selectedImage,
        name: 'test.jpeg',
        type: 'image/jpeg',
      });
    }
    // if (selectedImage) {
    //   newFormData.append(`profile_picture`, {
    //     uri: selectedImage,
    //     name: "test.jpeg",
    //     type: "image/jpeg",
    //   });
    // }

    //  console.log("datacresteprofilr>>>>>",newFormData);
    //  return
    // props.navigation.reset({
    //   index: 1,
    //   routes: [{ name: 'BottomTab' }],
    // });
    // return
    dispatch(editProfileApi(newFormData, props?.navigation));
    // }
  };

  const chooseImage = () => {
    props.navigation.navigate('ImageController', {
      isCircle: true,
      onSuccess: res => {
        if (res.path) {
          setSelectedImage(res.path);
        }
      },
    });
  };

  const methodSetCountryCode = code => {
    methodProfileRequest('country_code', code.dial_code);
    setModalVisibleCode(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={styles.container}>
        {/* <Text style={{ fontSize: fonts.SIZE_20,
              fontFamily: fonts.Montserrat_SemiBold,
              color:  "#111B34",alignSelf:'center'}}>Edit Profile</Text> */}
        <KeyboardScroll>
          <View style={styles.CreateProfile_IconView}>
            <ImageLoadView
              source={
                selectedImage ? { uri: selectedImage } : imagePath.profileImage1
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
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          <AppInput
            // lable={"Name"}
            placeholder={'Enter Name'}
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
            // line
            paddingHorizontal={30}
            // placeholder={'000 0000 0000'}
            // keyboardType={'default'}
            // lable={"Mobile Number (optional)"}
            placeholder={'Enter Number (optional)'}
            country_code={true}
            maxLength={15}
            keyboardType={'numeric'}
            returnKeyType={'done'}
            // editable={!loaderShow}
            // marginTop={20}
            click_code={() => {
              setModalVisibleCode(true);
            }}
            // editable={!loaderShow}
            // leftIcon={imagePath.phone}
            value={profileFormData.phone_number}
            // getFocus={ref_phone_Number}
            country_text={profileFormData.country_code}
            onChangeText={value => {
              methodProfileRequest('phone_number', value);
            }}
            onPressCountry={() => {
              setModalVisibleCode(true);
            }}
          />

          <CustomDropdown
            value={gender}
            onValueChange={value => setGender(value)}
            data={genderOptions}
            backgroundColor={'#F6F6F6'}
            selectedOption={gender}
            pickerTop={0}
            onSubmit={res => {
              // setGender(value)
              // console.log('res======option=======>>>>>>', res);
              setGender(res?.label);
              methodProfileRequest('gender', res?.label);
            }}
          // isErrorMsg={profileFormData.validators.business_category?.error}
          />

          {/* <View style={{marginTop: 14,marginHorizontal: 20,}} >
<Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Location</Text>
<TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // if (loaderShow) {
            //   return;
            // }
            setSearchLoc(true)
            // methodFetchUserCurrentLocation();
          }}
          style={styles.location_Touch}>
             {/* <Image
            source={imagePath.businessAddressImage}
            style={styles.svg_gps_icon}
            resizeMode="contain"
          /> */}
          {/* <View style={{height:25,width:1,left:11.5, backgroundColor:'#E4E4E4'}} ></View> */}

          {/* <Text style={[styles.location_text,{color:profileFormData?.address?'black':"#767980"}]}>
            {profileFormData?.address ? profileFormData?.address : 'Enter Address'}
          </Text>
         
        </TouchableOpacity>
        </View>  */}

          <View style={{ marginTop: 14, marginHorizontal: 20 }}>
            {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}

            <View style={styles.location_Touch}>
              <Text
                style={[
                  styles.location_text,
                  { color: profileFormData?.address ? 'black' : '#767980' },
                ]}>
                {profileFormData?.email
                  ? profileFormData?.email
                  : 'Enter email'}
              </Text>
            </View>
          </View>

          <CountryPicker
            show={modalVisibleCode}
            closeModal={() => setModalVisibleCode(false)}
            onSelect={value => methodSetCountryCode(value)}
          />

          {searchLoc && (
            <GoogleSearch
              showGoogleSearch={searchLoc}
              onBack={() => setSearchLoc(false)}
              onSubmit={data => {
                // console.log('onSubmitData-----HomeScreen--', data);
                methodProfileRequest('address', data?.address);
                setCurrentLoc(data);
                setSearchLoc(false);
              }}
            />
          )}
        </KeyboardScroll>
        {!keyboardStatus ? (
          <>
            <AppButton
              bttTitle="Update"
              marginBottom={10}
              //  marginTop={30}
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
    </View>
  );
};

export default EditProfile;
