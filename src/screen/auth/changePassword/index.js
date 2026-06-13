import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, ImageBackground, Keyboard, SafeAreaView, Text } from 'react-native';

import imagePath from '../../../theme/imagePath';
import AppHeader from '../../../navigation/appHeader';
import styles from './styles';
import { changePasswordApi } from '../../../appRedux/actions/userSessionAction';
// import {useDispatch} from 'react-redux';
import KeyboardScroll from '../../../component/keyboardScroll';
import AppInput from '../../../component/commonTextInputs';
import { AppButton } from '../../../component';
import { ValidateForm } from '../../../utils/validation/validation';
import { useDispatch, useSelector } from 'react-redux';
import { translateText } from '../../../utils/language';

const ChangePassword = props => {
    let userType = global.user_type;
    //   const dispatch = useDispatch();
    const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.loadButton);
    const [eyeToggle, setEyeToggle] = useState(true);
    const [eyeOne, setEyeOne] = useState(true);
    const [eyeTwo, setEyeTwo] = useState(true);
    const nameRef = useRef();
    const [keyboardStatus, setKeyboardStatus] = useState(0);
    const passwordRef = useRef(null);

    const [changePasswordReq, setChangePasswordRequest] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
        type: userType,
        validators: {
            old_password: {
                type: 'old_password',
                error: '',
            },
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

    useEffect(() => {
        AppHeader({
            ...props,
            leftIcon: false,
            headerTitle: true,
            Title: translateText('Change_Password'),
            leftIcon: true,
            leftClick: () => {
                props.navigation.goBack();
            },
            leftImage: imagePath.back,
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

const handleBackButtonClick = () => {
    return true;
  };

    const methodSetupChangePasswordRequest = (key, value) => {
        value = value.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            '',
        );
        if (
            key == 'new_password' ||
            key == 'old_password' ||
            key == 'confirm_password'
        ) {
            value = value.replace(/\s/g, '');
        }
        let dic = { ...changePasswordReq };
        dic[key] = value;
        if (dic.validators && dic.validators[key]) {
            dic.validators[key].error = '';
        }
        setChangePasswordRequest(dic);
    };

    const methodChangePassword = async () => {
        let validForm = ValidateForm(changePasswordReq);
        setChangePasswordRequest({ ...changePasswordReq }, validForm.value);
        if (validForm.status) {
            // console.log('---validForm.status---', validForm.status);
            Keyboard.dismiss();
            let dic = { ...changePasswordReq };
            // console.log("dic=====",dic);
            // return
            delete dic.validators;


            // props.navigation.goBack();
            // return
            dispatch(changePasswordApi(dic, props.navigation));
        }
    };

    return (

        <SafeAreaView style={styles.container}>
            <KeyboardScroll>
                <Image
                    source={imagePath.logo}
                    style={styles.imageLogo}
                    resizeMode="contain"
                />

                <Text style={styles.resetInstruction_text}>
           {translateText('Set_new_password')}{"\n"}{translateText('your_account')}
                </Text>
                <AppInput
                    // line
                    // paddingHorizontal={25}
                    lable={"Old Password"}
                    placeholder={translateText('enter_Password')} 
                    // marginTop={26}
                    keyboardType={'default'}
                    returnKeyType={'next'}
                    editable={!loaderShow}
                    rightIcon={eyeToggle ? imagePath.eyeoff : imagePath.eyeon}
                    onPressEye={() => {
                        setEyeToggle(!eyeToggle);
                    }}
                    value={changePasswordReq.old_password}
                    onChangeText={value => {
                        methodSetupChangePasswordRequest('old_password', value);
                    }}
                    setFocus={() => {
                        nameRef.current?.focus();
                    }}
                    isErrorMsg={changePasswordReq.validators.old_password.error}
                    maxLength={10}
                    secureTextEntry={eyeToggle}
                    leftIcon={imagePath.password}
                />
                <AppInput
                    // line
                    // paddingHorizontal={25}
                    lable={"New Password"}
                    leftIcon={imagePath.password}
                    placeholder={translateText('Enter_new_password')} 
                    
                    keyboardType={'default'}
                    editable={!loaderShow}
                    returnKeyType={'next'}
                    value={changePasswordReq.new_password}
                    onChangeText={value => {
                        methodSetupChangePasswordRequest('new_password', value);
                    }}
                    getFocus={nameRef}
                    setFocus={() => {
                        passwordRef.current?.focus();
                    }}
                    isErrorMsg={changePasswordReq.validators.new_password.error}
                    maxLength={10}
                    rightIcon={eyeOne ? imagePath.eyeoff : imagePath.eyeon}
                    onPressEye={() => {
                        setEyeOne(!eyeOne);
                    }}
                    secureTextEntry={eyeOne}
                />
                <AppInput
                    // line
                    // paddingHorizontal={25}
                    lable={"Confirm New Password"}
                    
                    leftIcon={imagePath.password}
                    placeholder={translateText('Re_enter_password')} 
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    editable={!loaderShow}
                    getFocus={passwordRef}
                    rightIcon={eyeTwo ? imagePath.eyeoff : imagePath.eyeon}
                    onPressEye={() => {
                        setEyeTwo(!eyeTwo);
                    }}
                    secureTextEntry={eyeTwo}
                    value={changePasswordReq.confirm_password}
                    onChangeText={value => {
                        methodSetupChangePasswordRequest('confirm_password', value);
                    }}
                    isErrorMsg={changePasswordReq.validators.confirm_password.error}
                    maxLength={10}
                />

                
            </KeyboardScroll>
            {!keyboardStatus ?
            <AppButton
                    // bttTitle="Update"
                    bttTitle={translateText('Update')}
                    marginBottom={20}
                    color={"white"}
                    isLoading={loaderShow}
                    borderRadius={10}
                    backgroundColor={'#0B6EBC'}
                    onPress={() => {
                        
                        methodChangePassword();
                    }}
                />:<></>}
        </SafeAreaView>
    );
};

export default ChangePassword;
