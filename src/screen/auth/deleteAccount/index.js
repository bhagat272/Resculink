import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, ImageBackground, Keyboard, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import imagePath from '../../../theme/imagePath';
import AppHeader from '../../../navigation/appHeader';
import styles from './styles';
import { changePasswordApi, deleteAccountApi } from '../../../appRedux/actions/userSessionAction';
// import {useDispatch} from 'react-redux';
import KeyboardScroll from '../../../component/keyboardScroll';
import AppInput from '../../../component/commonTextInputs';
import { AppButton } from '../../../component';
import { ValidateForm } from '../../../utils/validation/validation';
import { useDispatch, useSelector } from 'react-redux';

const DeleteAccount = props => {
    let userType = global.user_type;
    const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.loadButton);
    const [eyeToggle, setEyeToggle] = useState(true);
    const nameRef = useRef();
    const [keyboardStatus, setKeyboardStatus] = useState(0);
    const passwordRef = useRef(null);

    const [changePasswordReq, setChangePasswordRequest] = useState({
       password: '',
       user_type: global.user_type,
        validators: {
            password: {
                type: 'password',
                from:"login",
                error: '',
            },
        },
    });

    useEffect(() => {
        AppHeader({
            ...props,
            leftIcon: false,
            headerTitle: true,
            Title: 'Delete Account',
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
            key == 'password'
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
       
        // return
        let validForm = ValidateForm(changePasswordReq);
        setChangePasswordRequest({ ...changePasswordReq }, validForm.value);
        if (validForm.status) {
            // console.log('---validForm.status---', validForm.status);
            Keyboard.dismiss();
            let dic = { ...changePasswordReq };
            // console.log("dic=====",dic);
            // return
            delete dic.validators;
            // props.navigation.navigate('Welcome');
            // return
            dispatch(deleteAccountApi(dic, props.navigation));
        }
    };

    return (

        <SafeAreaView  style={styles.container}>
            <TouchableOpacity onPress={()=>{
                Keyboard.dismiss()
            }} activeOpacity={1} style={styles.container} >
            <KeyboardScroll>


                <Image
                    source={imagePath.logo}
                    style={styles.imageLogo}
                    resizeMode="contain"
                />

                <Text style={styles.resetInstruction_text}>
                    Enter your password {"\n"} to delete your account
                </Text>
                <AppInput
                    // line
                    marginViewTop={40}
                    placeholder={'Enter Password'}
                    // paddingHorizontal={25}
                    lable={"Password"}
                    // marginTop={26}
                    editable={!loaderShow}
                    keyboardType={'default'}
                    returnKeyType={'next'}
                    rightIcon={eyeToggle ? imagePath.eyeoff : imagePath.eyeon}
                    onPressEye={() => {
                        setEyeToggle(!eyeToggle);
                    }}
                    value={changePasswordReq.password}
                    onChangeText={value => {
                        methodSetupChangePasswordRequest('password', value);
                    }}
                    setFocus={() => {
                        nameRef.current?.focus();
                    }}
                    isErrorMsg={changePasswordReq.validators.password.error}
                    maxLength={10}
                    secureTextEntry={eyeToggle}
                    leftIcon={imagePath.password}
                />
              
             
            </KeyboardScroll>
            {/* <View style={{position:'absolute',bottom:20,width:'100%',}}>   */}
            {!keyboardStatus ?
              <AppButton
                    bttTitle="Delete Account"
                    // marginTop={"50%"}
                    marginBottom={20}
                    color={"white"}
                    isLoading={loaderShow}
                    borderRadius={10}
                    backgroundColor={'#0B6EBC'}
                    onPress={() => {
                        methodChangePassword();
                    }}
                />:<></>}
                {/* </View>     */}
               
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default DeleteAccount;
