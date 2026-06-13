import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  Image,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import React, {useEffect, useRef, useState} from 'react';
import imagePath from '../../../theme/imagePath';
import styles from './styles';
import {AppButton, KeyboardScroll} from '../../../component';

import AppHeader from '../../../navigation/appHeader';
// import AppButton from '../../../component/commonButton';
import {SafeAreaView} from 'react-native-safe-area-context';

import OTPTextView from 'react-native-otp-textinput';
import BackgroundTimer from 'react-native-background-timer';
import Colors from '../../../theme/colors';
import {showToastMessage} from '../../../utils/Toast';
import {
  SendOtpUserApi,
  checkEmailApiRequest,
  checkOtpForgotRequest,
  forgotPasswordApi,
  registerAction,
  registerApi,
  registerApiRequest,
  resendOtpApi,
  resendOtpApiRequest,
  signUpUserApi,
  verifyOtpApi,
} from '../../../appRedux/actions/userSessionAction';
import {useDispatch, useSelector} from 'react-redux';
import {alert} from '../../../utils/alertController';
import {DEVICE_INFO} from '../../../utils/helper';
import {useHeaderHeight} from '@react-navigation/elements';
import {translateText} from '../../../utils/language';

const OtpVerification = props => {
  const headerHeight = useHeaderHeight();
  const {signUpReq, from, signUp, forgotUser, path, forgetPasswordData} = props
    ?.route?.params
    ? props?.route?.params
    : false;

  // console.log("forgetPasswordData------>",forgetPasswordData);
  // console.log("from-----`>",from);

  const email = props?.route?.params?.email
    ? props?.route?.params?.email
    : signUpReq?.email;
  // console.log("email---->",email);

  // console.log("forgotUser>>",forgotUser);
  // console.log("path---->",path);
  const loaderShow = useSelector(state => state.loading.loadButton);
  const dispatch = useDispatch();
  const otpInput = useRef(null);
  const mobileOtpInput = useRef(null);
  const [otp, setOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [counter, setCounter] = useState(30);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const CELL_COUNT = 6;

  const ref = useBlurOnFulfill({value: otp, cellCount: CELL_COUNT});

  useEffect(() => {
    let interval = BackgroundTimer.setInterval(() => {
      if (counter <= 0) {
        BackgroundTimer.clearInterval(interval);
        BackgroundTimer.stop();
      } else {
        setCounter(counter - 1);
      }
    }, 1000);
    return () => {
      BackgroundTimer.clearInterval(interval);
      BackgroundTimer.stop();
    };
  }, [counter]);

  useEffect(() => {
    AppHeader({
      ...props,
      leftIcon: false,
      leftImage: imagePath.back,
      leftClick: () => {
        if (!loaderShow) {
          props.navigation.goBack();
        }
      },
    });
    if (loaderShow) {
      let backEvent = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );

      return () => {
        backEvent.remove();
      };
    }
  }, [loaderShow]);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
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

  const handleBackButtonClick = () => {
    return true;
  };

  const methodSignUpAPI = async () => {
    Keyboard.dismiss();
    if (otp == '') {
      showToastMessage('Please enter OTP');
      return;
    }
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage('Please enter only numeric values.');
      return;
    }

    if (otp.length != 6) {
      showToastMessage('Invalid OTP.');
      return false;
    }
    Keyboard.dismiss();
    if (signUp == true) {
      const data = {
        email: signUpReq?.email,
        password: signUpReq?.password,
        type: global.user_type,
        device_unique_id: DEVICE_INFO.device_unique_id,
        device_type: DEVICE_INFO.device_type,
        device_token: DEVICE_INFO.device_token,
        otp: otp,
      };
      dispatch(registerAction(data, props.navigation));
    } else {
      if (otp == forgotUser?.otp) {
        props.navigation.navigate('ResetPassword', {
          forgotUser: forgotUser,
          email: email,
        });
      } else {
        showToastMessage('invalid OTP.');
      }
    }
  };

  const methodConvertString = () => {
    let string = signUpReq ? signUpReq?.email : email;
    if (string?.length) {
      let checkLength = string.indexOf('@');
      let newString = [...Array(checkLength)].map(item => (item = '●'));
      let finalString =
        newString.join('') + string?.substring(string.indexOf('@'));
      return finalString;
    } else {
      return '';
    }
  };

  const resentOtp = () => {
    setCounter(30);
    //otpInput?.current?.clear();
    setOtp('');

    if (from == 'forget_password') {
      // console.log("hete-------");

      const request = {...forgetPasswordData};
      // console.log("request---->",request);

      dispatch(forgotPasswordApi(request)).then(() => {});
    } else {
      let dic = {
        ...signUpReq,
        type: global.user_type,
        email,
      };
      // console.log("dic-------------->",dic);

      // const request = {...dic};
      dispatch(resendOtpApi(dic)).then(() => {});
    }
  };

  const methodSubmitForgetVerification = () => {
    Keyboard.dismiss();
    if (otp == '') {
      showToastMessage('Please enter OTP');
      return;
    }
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage('Please enter only numeric values.');
      return;
    }

    if (otp.length != 6) {
      showToastMessage('Please enter valid OTP.');
      return false;
    }
    const dic = {...forgetPasswordData};

    // console.log("dic---ssssss->",dic);

    dic.otp = otp;

    // return

    // dispatch(buttonLoading(true));

    dispatch(verifyOtpApi(dic)).then(res => {
      // dispatch(buttonLoading(false));
      //otpInput?.current?.clear();
      setOtp('');

      if (res) {
        props.navigation.navigate('ResetPassword', {
          from: from,
          forgotUser: forgetPasswordData,
        });
      } else {
        //otpInput?.current?.clear();
        setOtp('');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
        }}
        activeOpacity={1}
        style={{flex: 1}}>
        <KeyboardScroll>
          <View style={styles.logo_view}>
            <Image
              source={imagePath.logo}
              resizeMode={'contain'}
              style={styles.logo_img}
            />
          </View>
          <View style={{marginHorizontal: 25}}>
            <Text style={styles.otpVerificationStyle}>
              {translateText('OTP_Verification')}
            </Text>

            <Text style={styles.otpInstructionStyle}>
              {translateText('A_6_digit')} {`\n`}{' '}
              {translateText('was_just_sent')} {methodConvertString()}
            </Text>

            {/* <View style={styles.view_otp}>
              <OTPTextView
                ref={otpInput}
                handleTextChange={text => setOtp(text)}
                inputCount={6}
                // placeholder={"-"}
                keyboardType="numeric"
                tintColor={'transparent'}
                offTintColor={'transparent'}
                textInputStyle={styles.otpInput}
                style={styles.input_box}
              />
            </View> */}
            <View style={styles.view_otp}>
              <CodeField
                ref={ref}
                value={otp}
                onChangeText={setOtp}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                renderCell={({index, symbol, isFocused}) => {
                  const isFilled = !!symbol;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.otpInput,
                        isFocused && styles.otpInputFocused,
                        isFilled && styles.otpInputFilled,
                      ]}>
                      <Text style={styles.otpText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>

            {counter > 0 ? (
              <Text style={[styles.contDownText]}>
                {translateText('Resend_in')} : {counter} {translateText('sec')}
              </Text>
            ) : null}
            {counter == 0 ? (
              <View style={styles.coded_send_view}>
                {/* <Text style={styles.sec_text}>Didn't receive the code?</Text> */}
                <TouchableOpacity
                  style={styles.resend_button}
                  activeOpacity={0.6}
                  hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
                  onPress={() => {
                    if (!loaderShow) {
                      resentOtp();
                    }
                  }}>
                  {loaderShow ? (
                    <View style={{marginHorizontal: 10}}>
                      <ActivityIndicator
                        size={'small'}
                        color={Colors.primary.BLACK}
                      />
                    </View>
                  ) : (
                    <Text style={styles.sec_text}>
                      {' '}
                      {translateText('Resend')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </View>
        </KeyboardScroll>

        {!keyboardStatus ? (
          <View style={{marginBottom: 30}}>
            <AppButton
              bttTitle={translateText('Verify')}
              // isLoading={loaderShow}
              marginTop={20}
              color={'white'}
              borderRadius={10}
              backgroundColor={'#0B6EBC'}
              onPress={() => {
                if (from == 'forget_password') {
                  methodSubmitForgetVerification();
                } else {
                  methodSignUpAPI();
                }

                // if(forgotUser){
                //   props.navigation.navigate('ResetPassword')
                // }
                // else{
                // props.navigation.navigate("CreateProfile")}
              }}
            />
          </View>
        ) : (
          <></>
        )}

        {/* </ImageBackground> */}
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerification;
