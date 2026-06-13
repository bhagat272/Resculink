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
import AppHeader from '../../../navigation/appHeader';
import AppInput from '../../../component/commonTextInputs';
import {ValidateForm} from '../../../utils/validation/validation';
import {forgotPasswordApi} from '../../../appRedux/actions/userSessionAction';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../../theme/colors';
import {translateText} from '../../../utils/language';
import {DEVICE_INFO} from '../../../utils/helper';

// import { forgotPasswordApi } from "../../../appRedux/actions/userSessionAction";
// import { useDispatch, useSelector } from "react-redux";
const ForgetPassword = props => {
  const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.loadButton);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [forgotReq, setForgotReq] = useState({
    email: '',
    type: global.user_type,
    validators: {
      email: {
        type: 'email',
        error: '',
      },
    },
  });
  const methodSetupForgotRequest = (key, value) => {
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
    if (key == 'email') {
      value = value.replace(/\s/g, '');
    }
    let dic = {...forgotReq};
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setForgotReq(dic);
  };

  const forgotUser = () => {
    let validForm = ValidateForm(forgotReq);
    setForgotReq({...forgotReq}, validForm.value);
    if (validForm.status) {
      Keyboard.dismiss();
      let dic = {...forgotReq, ...DEVICE_INFO};
      delete dic.validators;
      dispatch(forgotPasswordApi(dic)).then(res => {
        if (res.status) {
          props.navigation.navigate('OtpVerification', {
            from: 'forget_password',
            forgetPasswordData: dic,
          });
        }
      });
    }
  };

  useEffect(() => {
    AppHeader({
      ...props,
      leftClick: () => {
        //   if (!loaderShow) {
        props.navigation.goBack();
        //   }
      },
      heightLeftImg: 40,
      widthLeftImg: 40,
      leftIcon: true,
      leftImage: imagePath.back,
      Title: false,
      //   titleColor: Colors.primary.WHITE,
      Title: '',
      //   imagetintColor: Colors.primary.WHITE,
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
  const handleBackButtonClick = () => {
    return true;
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
    <View style={{flex: 1, backgroundColor: Colors.primary.WHITE}}>
      <SafeAreaView style={styles.container}>
        <KeyboardScroll>
          <Image
            source={imagePath.logo}
            style={{
              alignSelf: 'center',
              marginTop: Platform.OS == 'ios' ? 80 : 110,
            }}
          />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.loginText}>
              {translateText('Forgot_Password')}
            </Text>
            <Text style={styles.Enter}>
              {translateText('enter_your_registered')} {`\n`}
              {translateText('to_receive_OTP')}
            </Text>
          </View>
          <AppInput
            // line
            // paddingHorizontal={25}
            marginViewTop={32}
            lable={'Email Address'}
            placeholder={translateText('enter_email')}
            keyboardType={'email-address'}
            // marginTop={40}
            // leftIcon={imagePath.email}
            editable={!loaderShow}
            value={forgotReq.email}
            onChangeText={value => methodSetupForgotRequest('email', value)}
            isErrorMsg={forgotReq.validators.email.error}
            maxLength={50}
          />
        </KeyboardScroll>
        {!keyboardStatus ? (
          <>
            {/* <View style={{marginBottom:30}} >
          <LinearGradientButton 
           titel="NEXT"
          onPress={()=>{
            forgotUser()}}
            // isLoading={loaderShow}
              >
               
              </LinearGradientButton>
              </View> */}
            <AppButton
              bttTitle={translateText('Verify')}
              //  marginTop={20}
              //  isLoading={loaderShow}
              marginBottom={40}
              backgroundColor={'#0B6EBC'}
              color={'white'}
              onPress={() => {
                forgotUser();
                // props.navigation.navigate("Login")
                // props.navigation.navigate('OtpVerification',{forgotUser:true})
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

export default ForgetPassword;
