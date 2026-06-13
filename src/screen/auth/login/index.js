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
import {AppButton, KeyboardScroll} from '../../../component';
import imagePath from '../../../theme/imagePath';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import AppInput from '../../../component/commonTextInputs';

import {DEVICE_INFO} from '../../../utils/helper';
import {
  kRememberData,
  kRememberDataUser,
} from '../../../appRedux/apis/commonValue';
import {loginUserApi} from '../../../appRedux/actions/userSessionAction';
import {useDispatch, useSelector} from 'react-redux';
import {getData} from '../../../appRedux/apis/keyChain';
import {ValidateForm} from '../../../utils/validation/validation';
import {translateText} from '../../../utils/language';
// import { kRememberData } from "../../../appRedux/apis/commonValue";
// import { loginUserApi } from "../../../appRedux/actions/userSessionAction";
// import { useDispatch, useSelector } from "react-redux";
// import { getData } from "../../../appRedux/apis/keyChain";
const Login = props => {
  // console.log("user_type----->",user_type);
  const dispatch = useDispatch();
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  // console.log("global.user_type",global.user_type);
  const loaderShow = useSelector(state => state.loading.loadButton);
  const [eyeOne, setEyeOne] = useState(true);
  const [remember, setRemember] = useState(false);
  const emailRef = useRef(null);
  const [loginReq, setLoginRequest] = useState({
    email: '',
    password: '',
    ...DEVICE_INFO,
    type: global.user_type,
    validators: {
      email: {
        // required: true,
        type: 'email',
        // email: true,
        error: '',
      },
      password: {
        type: 'password',
        error: '',
      },
    },
  });
  // useEffect(() => {

  //     // AppHeader({
  //     //     ...props,
  //     //     leftClick: () => {
  //     //       if (!loaderShow) {
  //     //         props.navigation.goBack();
  //     //       }
  //     //     },
  //     //     heightLeftImg: 40,
  //     //     widthLeftImg: 40,
  //     //     leftIcon: true,
  //     //     leftImage: imagePath.back,
  //     //     Title: false,
  //     //     //   titleColor: Colors.primary.WHITE,
  //     //     Title: "",
  //     //     //   imagetintColor: Colors.primary.WHITE,
  //     // });
  //     if (loaderShow) {
  //       let backEvent = BackHandler.addEventListener(
  //         'hardwareBackPress',
  //         handleBackButtonClick,
  //       );

  //       return () => {
  //         backEvent.remove();
  //       };
  //     }
  // }, [loaderShow]);
  const handleBackButtonClick = () => {
    return true;
  };
  // useEffect(() => {
  //   (async () => {
  //     let RememberMeData = await getData(kRememberData);
  //     console.log("RememberMeData------------------------>", RememberMeData);
  //     if (RememberMeData) {
  //     setLoginRequest({
  //       ...loginReq,
  //       email: RememberMeData?.email,
  //       password: RememberMeData?.password,
  //     });
  //     setRemember(RememberMeData == null ? false : true);
  //   }

  //   })();
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     let RememberMeData = await getData(kRememberData);
  //     let RememberMeDataa = await getData(kRememberDataUser);
  //     // console.log('RememberMeData------------------------>', RememberMeData);
  //     // console.log('RememberMeDataa------------------------>', RememberMeData);
  //     if (RememberMeData) {
  //       setLoginRequest({
  //         ...loginReq,
  //         email: RememberMeData?.email,
  //         password: RememberMeData?.password,
  //       });
  //       setRemember(RememberMeData == null ? false : true);
  //     }
  //     // else if (
  //     //   RememberMeDataa &&
  //     //   RememberMeDataa?.user_type == global.user_type
  //     // ) {
  //     //   setLoginRequest({
  //     //     ...loginReq,
  //     //     email: RememberMeDataa?.email,
  //     //     password: RememberMeDataa?.password,
  //     //   });
  //     //   setRemember(RememberMeDataa == null ? false : true);
  //     // }
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      let RememberMeData = await getData(kRememberData);
      let RememberMeDataa = await getData(kRememberDataUser);
      // console.log('RememberMeData------------------------>', RememberMeData);
      // console.log('RememberMeDataa------------------------>', RememberMeData);
      if (RememberMeData && RememberMeData?.type == global.user_type) {
        setLoginRequest({
          ...loginReq,
          email: RememberMeData?.email,
          password: RememberMeData?.password,
        });
        setRemember(RememberMeData == null ? false : true);
      } else if (RememberMeDataa && RememberMeDataa?.type == global.user_type) {
        setLoginRequest({
          ...loginReq,
          email: RememberMeDataa?.email,
          password: RememberMeDataa?.password,
        });
        setRemember(RememberMeDataa == null ? false : true);
      }
    })();
  }, []);
  const methodSetupSignInRequest = (key, value) => {
    if (key == 'password' || key == 'email') {
      value = value.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        '',
      );
    }
    if (key == 'password' || key == 'email') {
      value = value.replace(/\s/g, '');
    }
    let dic = {...loginReq};
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setLoginRequest(dic);
  };
  const loginUser = async () => {
    // console.log('hre',loginReq);
    let validForm = ValidateForm(loginReq);
    // console.log("validForm",validForm);
    setLoginRequest({...loginReq}, validForm.value);
    // console.log('validForm.status----->', JSON.stringify(validForm));
    if (validForm.status) {
      Keyboard.dismiss();
      let dic = {...loginReq};
      delete dic.validators;
      // console.log('dic---------->', dic);
      //  props.navigation.reset({
      //                 index: 1,
      //                 routes: [{ name: 'BottomTab' }],
      //               });
      // return
      dispatch(loginUserApi(dic, props.navigation, remember));
      // props.navigation.navigate('BottomTab');
      // props?.Login(dic);
    }
  };
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
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView style={styles.container}>
        <KeyboardScroll>
          <Image
            source={imagePath.logo}
            style={{
              alignSelf: 'center',
              marginTop: Platform.OS == 'ios' ? 30 : 80,
              // height:190,width:190
            }}
          />

          <Text style={styles.loginText}>{translateText('login')}</Text>
          <Text style={styles.Enter}>
            {translateText('enter_login_details_to')} {`\n`}{' '}
            {translateText('access_account')}
          </Text>
          <AppInput
            // line
            // paddingHorizontal={25}
            marginViewTop={50}
            lable={'Email Address'}
            placeholder={translateText('enter_email')}
            keyboardType={'email-address'}
            // marginTop={40}
            // editable={!loaderShow}
            // leftIcon={imagePath.email}
            value={loginReq.email}
            onChangeText={value => {
              methodSetupSignInRequest('email', value);
            }}
            setFocus={() => {
              emailRef.current?.focus();
            }}
            isErrorMsg={loginReq.validators.email.error}
            maxLength={50}
          />
          <AppInput
            // line
            // paddingHorizontal={25}
            lable={'Password'}
            placeholder={translateText('enter_Password')}
            returnKeyType={'done'}
            keyboardType={'default'}
            // marginTop={15}
            // leftIcon={imagePath.password}
            rightIcon={eyeOne ? imagePath.eyeoff : imagePath.eyeon}
            secureTextEntry={eyeOne}
            onPressEye={() => {
              setEyeOne(!eyeOne);
            }}
            // editable={!loaderShow}
            getFocus={emailRef}
            value={loginReq.password}
            onChangeText={value => {
              methodSetupSignInRequest('password', value);
            }}
            isErrorMsg={loginReq.validators.password.error}
            maxLength={10}
          />

          <View style={styles.rememberView}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // if (loaderShow) {
                //   return;
                // }
                setRemember(!remember);
              }}>
              <Image
                source={!remember ? imagePath.uncheckk : imagePath.check1}
                resizeMode={'contain'}
                style={{height: 22, width: 22}}
              />
            </TouchableOpacity>
            <Text style={styles.rememberText}>
              {translateText('remember_me')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // if (!loaderShow) {
                props.navigation.navigate('ForgetPassword');
                // }
              }}>
              <Text style={styles.forgotText}>
                {translateText('forgot_pass')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* <LinearGradientButton
              titel="Login"
              onPress={()=>{
                loginUser();
              }}
              isLoading={loaderShow}
              > 
              </LinearGradientButton> */}
        </KeyboardScroll>

        {!keyboardStatus ? (
          <View>
            <AppButton
              bttTitle={translateText('login')}
              marginTop={20}
              color={'white'}
              isLoading={loaderShow}
              borderRadius={10}
              backgroundColor={'#0B6EBC'}
              onPress={() => {
                loginUser();
                // props.navigation.reset({
                //   index: 1,
                //   routes: [{ name: 'BottomTab' }],
                // });
              }}
            />
            <Text style={styles.accountText}>
              {translateText('dont_have_acc')}{' '}
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
                  props.navigation.navigate('SignUp');
                }}
                style={{
                  color: '#0B6EBC',
                  textDecorationLine: 'underline',
                  fontFamily: fonts.Montserrat_SemiBold,
                }}>
                {translateText('signup')}
              </Text>{' '}
            </Text>
          </View>
        ) : (
          <></>
        )}
        {/* {user_type=="customer"?
<AppButton
            bttTitle="Login as a guest user"
            marginTop={20}
            color={'white'}
            isLoading={loaderShow}
            borderRadius={10}
            backgroundColor={'#108DEF'}
            onPress={() => {
              // loginUser();
              global.isGuestUser = true;
              props.navigation.navigate("BottomTab");
            }}
          />:<></>} */}
      </SafeAreaView>
    </View>
  );
};

export default Login;
