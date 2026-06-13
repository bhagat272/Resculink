import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
  ImageBackground,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import styles from './styles';
import {
  AppButton,
  KeyboardScroll,
  LinearGradientButton,
} from '../../../component';
import imagePath from '../../../theme/imagePath';
import AppHeader from '../../../navigation/appHeader';
import AppInput from '../../../component/commonTextInputs';
import {showToastMessage} from '../../../utils/Toast';
import {checkUserApi} from '../../../appRedux/actions/userSessionAction';
import {useDispatch, useSelector} from 'react-redux';
import {DEVICE_INFO} from '../../../utils/helper';
import {
  ValidateForm,
  maxLengthEmail,
  minLengthPassword,
  maxLengthPassword,
} from '../../../utils/validation/validation';
import {translateText} from '../../../utils/language';
import fonts from '../../../theme/fonts';
const SignUp = props => {
  const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.loadButton);
  const [eyeOne, setEyeOne] = useState(true);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const [eyetwo, setEyeTwo] = useState(true);
  const [agree, setAgree] = useState(false);
  const email = useRef();
  const passRef = useRef();
  const [signupFormData, setSignupFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    ...DEVICE_INFO,
    type: global.user_type,
    validators: {
      email: {
        type: 'email',
        maxLength: maxLengthEmail,
        required: true,
        email: true,
        emoji: false,
        error: '',
      },

      password: {
        type: 'password',
        minLength: minLengthPassword,
        maxLength: maxLengthPassword,
        error: '',
      },
      confirm_password: {
        type: 'confirm_password',
        error: '',
      },
    },
  });
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

  const methodSetupSignUpRequest = (key, value) => {
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );

    if (key == 'email' || key == 'password' || key == 'confirm_password') {
      value = value.replace(/\s/g, '');
    }

    let dic = {...signupFormData};
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setSignupFormData(dic);
  };

  const signUpUser = async () => {
    // console.log("herererere");

    // return
    let validForm = ValidateForm(signupFormData);
    setSignupFormData({...signupFormData}, validForm.value);

    if (validForm.status) {
      if (!agree) {
        showToastMessage(
          'Please agree with Privacy Policy and Terms & Conditions',
        );
        return;
      }
      Keyboard.dismiss();
      let request = {...signupFormData, type: global.user_type};
      // console.log("request>>>>>>", request);
      delete request.validators;

      // delete request.device_unique_id;
      // request.device_unique_id = DeviceInfo.getDeviceId();
      // props.navigation.navigate('OtpVerification',{signUp:true});
      // return
      dispatch(checkUserApi(request, props?.navigation));
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView style={styles.container}>
        <KeyboardScroll>
          <Image
            source={imagePath.logo}
            style={{
              alignSelf: 'center',
              marginTop: Platform.OS == 'ios' ? 30 : 80,
            }}
          />
          <Text style={styles.loginText}>{translateText('signup')}</Text>
          <Text style={styles.Enter}>
            {' '}
            {translateText('enter_your_detail_to_create')}
            {`\n`}
            {translateText('your_account')}
          </Text>
          <AppInput
            // line
            // paddingHorizontal={25}
            lable={'Email Address'}
            // keyboardType={'email-address'}
            // marginTop={40}
            // editable={!loaderShow}
            leftIcon={imagePath.email}
            placeholder={translateText('enter_email')}
            returnKeyType={'next'}
            value={signupFormData.email}
            onChangeText={value => methodSetupSignUpRequest('email', value)}
            // getFocus={email}
            setFocus={() => {
              email.current.focus();
            }}
            isErrorMsg={signupFormData.validators.email.error}
            maxLength={50}
          />
          <AppInput
            // line
            // paddingHorizontal={25}
            lable={'Password'}
            placeholder={translateText('enter_Password')}
            keyboardType={'default'}
            returnKeyType={'next'}
            // marginTop={15}
            editable={!loaderShow}
            leftIcon={imagePath.password}
            rightIcon={eyeOne ? imagePath.eyeoff : imagePath.eyeon}
            secureTextEntry={eyeOne}
            onPressEye={() => {
              setEyeOne(!eyeOne);
            }}
            value={signupFormData.password}
            onChangeText={value => methodSetupSignUpRequest('password', value)}
            getFocus={email}
            setFocus={() => {
              passRef.current.focus();
            }}
            isErrorMsg={signupFormData.validators.password.error}
            maxLength={10}
          />

          <AppInput
            // line
            // paddingHorizontal={25}
            lable={'Confirm Password'}
            placeholder={translateText('Re_enter_password')}
            returnKeyType={'done'}
            keyboardType={'default'}
            // marginTop={15}
            editable={!loaderShow}
            leftIcon={imagePath.password}
            rightIcon={eyetwo ? imagePath.eyeoff : imagePath.eyeon}
            secureTextEntry={eyetwo}
            onPressEye={() => {
              setEyeTwo(!eyetwo);
            }}
            value={signupFormData.confirm_password}
            onChangeText={value =>
              methodSetupSignUpRequest('confirm_password', value)
            }
            isErrorMsg={signupFormData.validators.confirm_password.error}
            maxLength={10}
            getFocus={passRef}
          />
          <View style={styles.agreeView}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // if (loaderShow) {
                //   return;
                // }
                setAgree(!agree);
              }}>
              <Image
                source={!agree ? imagePath.uncheckk : imagePath.check1}
                style={{height: 22, width: 22}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <Text style={styles.agreeText}>
              {' '}
              {translateText('i_agree_with')}{' '}
              <Text
                onPress={() => {
                  if (!loaderShow) {
                    props.navigation.navigate('PrivacyPolicy', {
                      title: translateText('Privacy_Policy'),
                    });
                  }
                }}
                style={styles.tcText}>
                {translateText('Privacy_Policy')}{' '}
              </Text>{' '}
              <Text style={styles.andText}>&</Text>{' '}
              <Text
                onPress={() => {
                  if (!loaderShow) {
                    props.navigation.navigate('PrivacyPolicy', {
                      title: translateText('T_C'),
                    });
                  }
                }}
                style={styles.policyText}>
                {translateText('T_C')}
              </Text>
            </Text>
          </View>
        </KeyboardScroll>
        {!keyboardStatus ? (
          <View>
            <AppButton
              bttTitle={translateText('signup')}
              marginTop={20}
              color={'white'}
              // borderWidth={""}
              borderRadius={10}
              backgroundColor={'#0B6EBC'}
              isLoading={loaderShow}
              onPress={() => {
                signUpUser();
                // props.navigation.navigate("OtpVerification")
                // props.navigation.navigate('OtpVerification')
              }}
            />
            <Text style={styles.accountText}>
              {translateText('have_an_account')}{' '}
              <Text
                onPress={() => {
                  // if (!loaderShow) {
                  //   let dic = {...loginReq};
                  //   dic.validators['email'].error = '';
                  //   dic.validators['password'].error = '';
                  //   (dic.email = ''), (dic.password = ''), setLoginRequest(dic);

                  //   // if (global.user_type == 'customer') {
                  //   //   props.navigation.navigate('SignUpCustomer');
                  //   // } else {
                  //   props.navigation.navigate('SignUp');
                  //   // }
                  // }
                  props.navigation.goBack();
                }}
                style={{
                  color: '#0B6EBC',
                  textDecorationLine: 'underline',
                  fontFamily: fonts.Montserrat_SemiBold,
                }}>
                {translateText('login')}
              </Text>{' '}
            </Text>
            {/* <View style={styles.switchView}>
              <Text style={styles.switchText}>
                {translateText('have_an_account')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  // if (!loaderShow) {
                  //   let dic = {...signupFormData};
                  //   dic.validators['email'].error = '';
                  //   dic.validators['password'].error = '';
                  //   dic.validators['confirm_password'].error = '';
                  //   (dic.email = ''),
                  //     (dic.password = ''),
                  //     (dic.confirm_password = ''),
                  //     setSignupFormData(dic);

                  //   // props.navigation.navigate("Login");
                  //   props.navigation.goBack();
                  // }

                  props.navigation.goBack();
                }}>
                <Text style={styles.loginText1}> {translateText('login')}</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        ) : (
          <></>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SignUp;
