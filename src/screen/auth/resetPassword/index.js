import React, { useEffect, useRef, useState } from 'react';
import { Text, ImageBackground, Image, Keyboard, SafeAreaView, BackHandler, View } from 'react-native';
import imagePath from '../../../theme/imagePath';
import styles from './styles';

import KeyboardScroll from '../../../component/keyboardScroll';
import AppInput from '../../../component/commonTextInputs';
import { AppButton } from '../../../component';
import { ValidateForm } from '../../../utils/validation/validation';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordApi } from '../../../appRedux/actions/userSessionAction';
import AppHeader from '../../../navigation/appHeader';
import { translateText } from '../../../utils/language';

const ResetPassword = props => {
    const dispatch = useDispatch();
    const loaderShow = useSelector(state => state.loading.loadButton);
    const [keyboardStatus, setKeyboardStatus] = useState(0);
    const { forgotUser } = props?.route?.params ? props?.route?.params : false;

    const email = props?.route?.params?.email
    // console.log("email------->",email);
    // console.log("forgotUser----->",forgotUser);
    const [eyeToggle, setEyeToggle] = useState(true);
    const [eyeTwo, setEyeTwo] = useState(true);
    const passwordRef = useRef('');
    const [resetReq, setResetReq] = useState({
        email: props?.route?.params?.email,
        new_password: '',
        confirm_password: '',
        type: global.user_type,
        validators: {
            new_password: {
                type: 'new_password',
                error: '',
            },
            confirm_password: {
                type: 'confirm_password',
                error: '',
            },
        },
    });
    const methodSetupResetRequest = (key, value) => {
        value = value.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            '',
        );
        if (key == 'new_password' || key == 'confirm_password') {
            value = value.replace(/\s/g, '');
        }
        let dic = { ...resetReq };
        dic[key] = value;
        if (dic.validators && dic.validators[key]) {
            dic.validators[key].error = '';
        }
        setResetReq(dic);
    };
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
            // console.log('height', e.endCoordinates.height);
            setKeyboardStatus(e.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardStatus(0);
        });
        const hideSubscriptionDid = Keyboard.addListener("keyboardDidHide", () => {
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
            Title: "",
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
    const resetUserPassword = async () => {
        let validForm = ValidateForm(resetReq);
        setResetReq({ ...resetReq }, validForm.value);
        if (validForm.status) {
            Keyboard.dismiss();
            let dic = { ...resetReq, ...forgotUser };
            let new_password = dic.new_password;
            let email = email;
            delete dic.new_password;
            delete dic.validators;
            dic.new_password = new_password;
            // console.log("dic request", dic)
            // props.navigation.navigate('Login');
            // return
            dispatch(resetPasswordApi(dic, props.navigation));
        }
    };
    return (
        <View style={{flex:1,backgroundColor:'white'}} >
        <SafeAreaView style={styles.container}>
            <KeyboardScroll>
                <Image
                    source={imagePath.logo}
                    style={styles.logoIcon}
                    // resizeMode="contain"
                />
                <Text style={styles.reset_text}>{translateText('Reset_Password')} </Text>
                <Text style={styles.resetInstruction_text}>
                {translateText('Set_a_new_password')}{'\n'} {translateText('your_account')}
                </Text>

                <AppInput
                    // line
                    // paddingHorizontal={25}
                    lable={"Password"}
                    placeholder={translateText('enter_Password')}
                    rightIcon={eyeToggle ? imagePath.eyeoff : imagePath.eyeon}
                    onPressEye={() => {
                        setEyeToggle(!eyeToggle);
                    }}
                    editable={!loaderShow}
                    keyboardType={'default'}
                    returnKeyType={'next'}
                    setFocus={() => {
                        passwordRef.current?.focus();
                    }}
                    value={resetReq.new_password}
                    onChangeText={value => methodSetupResetRequest('new_password', value)}
                    secureTextEntry={eyeToggle}
                    isErrorMsg={resetReq.validators.new_password.error}
                    maxLength={10}
                    leftIcon={imagePath.password}
                    // marginTop={34}
                />
                <AppInput
                    // line
                    // paddingHorizontal={25}
                    lable={"Confirm Password"}
                    // placeholder={'Re-enter password'}
                    placeholder={translateText('Re_enter_password')}
                    rightIcon={eyeTwo ? imagePath.eyeoff : imagePath.eyeon}
                    onPressEye={() => {
                        setEyeTwo(!eyeTwo);
                    }}
                    editable={!loaderShow}
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    getFocus={passwordRef}
                    value={resetReq.confirm_password}
                    onChangeText={value =>
                        methodSetupResetRequest('confirm_password', value)
                    }
                    secureTextEntry={eyeTwo}
                    isErrorMsg={resetReq.validators.confirm_password.error}
                    maxLength={10}
                    leftIcon={imagePath.password}
                />


            </KeyboardScroll>
            {!keyboardStatus ?
                <AppButton

Submit
                    bttTitle={translateText('Submit')}
                    marginBottom={30}
                    color={"white"}
                    borderRadius={10}
                    backgroundColor={'#0B6EBC'}
                    isLoading={loaderShow}
                    onPress={() => {
                        resetUserPassword();
                        // props.navigation.navigate('Login');
                    }}
                /> : <></>}
        </SafeAreaView>
   </View>
    );
};

export default ResetPassword;
