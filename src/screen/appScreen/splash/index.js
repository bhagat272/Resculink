import React, {useEffect} from 'react';
import SplashScreen from 'react-native-bootsplash';
import {useDispatch} from 'react-redux';
import {setUserDataPayLoad} from '../../../appRedux/actions/userSessionAction';
import {
  kUserData,
  kUserToken,
  kUserType,
} from '../../../appRedux/apis/commonValue';
import {getData} from '../../../appRedux/apis/keyChain';
import {USER_DATA_KEY} from '../../../appRedux/constants/userSessionType';
import {
  setDefaultValues,
  setGlobalUserToken,
  setUserData,
} from '../../../utils/helper';

const Splash = props => {
  const dispatch = useDispatch();
  let token = null;
  let userData = null;
  let userType = null;
  useEffect(() => {
    // socketConnectionCheck();

    setDefaultValues(props.navigation);
    setAsyncData();
    setTimeout(() => {
      (async () => {
        // console.log('userData====>', JSON.stringify(userData));
        console.log('token----->', token);
        // console.log("userType----->", userType);

        if (
          token &&
          userData &&
          userData?.user_type == 'user' &&
          userData.setup_profile == 1 &&
          userData?.pending_signal == 0 &&
          userData?.party_key == 0
        ) {
          // console.log("00000");

          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          // props.navigation.reset({
          //     index: 0,
          //     routes: [{name: 'HomeScreen'}],
          //   });

          props.navigation.reset({
            index: 0,
            routes: [{name: 'FirstHome'}],
          });
        } else if (
          token &&
          userData &&
          userData?.user_type == 'user' &&
          userData?.setup_profile == 1 &&
          userData?.pending_signal != 0
        ) {
          // console.log("11111");

          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          // props.navigation.reset({
          //     index: 0,
          //     routes: [{name: 'HomeScreen'}],
          //   });

          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'DetailScreen',
                params: {
                  item: userData, // this second parameter is for sending the params
                },
              },
            ],
          });
        } else if (
          token &&
          userData &&
          userData?.user_type == 'user' &&
          userData?.setup_profile == 1 &&
          userData?.party_key > 0 &&
          userData?.pending_signal == 0
        ) {
          console.log('11111', userData, token);

          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          // props.navigation.reset({
          //     index: 0,
          //     routes: [{name: 'HomeScreen'}],
          //   });

          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'PartyModeScreen',
                params: {
                  item: userData, // this second parameter is for sending the params
                },
              },
            ],
          });
        } else if (
          token &&
          userData?.user_type == 'user' &&
          userData?.setup_profile == 0
        ) {
          // console.log("222222");
          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          props.navigation.reset({
            index: 0,
            routes: [{name: 'CreateProfile'}],
          });
        }
        // props.navigation.reset({
        //   index: 0,
        //   routes: [{name: 'HomeScreen'}],
        // });
        else if (
          token &&
          userData?.user_type == 'provider' &&
          userData?.setup_profile == 0 &&
          userData?.party_key == 0 &&
          userData?.pending_signal == 0
        ) {
          // console.log("3333");
          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          props.navigation.reset({
            index: 0,
            routes: [{name: 'CreateProfileTwo'}],
          });
        } else if (
          token &&
          userData?.user_type == 'provider' &&
          userData?.setup_profile == 1 &&
          userData?.accepted_signal != 0
        ) {
          // console.log("3333");
          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          // props.navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'StatusDetail' }],
          // })

          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'StatusDetail',
                params: {
                  itemm: userData,
                  fromSplesh: true, // this second parameter is for sending the params
                },
              },
            ],
          });
        } else if (
          token &&
          userData?.user_type == 'provider' &&
          userData?.setup_profile == 1
        ) {
          // console.log("4444");
          global.user_type = userType;
          setGlobalUserToken(token);
          setUserData(userData);
          dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          props.navigation.reset({
            index: 0,
            routes: [{name: 'HomeScreenTwo'}],
          });
        } else {
          // global.user_type = userType;
          // setGlobalUserToken(token);
          // setUserData(userData);
          // dispatch(setUserDataPayLoad(USER_DATA_KEY, userData));
          props.navigation.reset({
            index: 0,
            routes: [{name: 'Welcome'}],
          });
        }
        setTimeout(() => {
          SplashScreen.hide();
        }, 500);
      })();
    }, 3000);
  }, []);

  const setAsyncData = async () => {
    token = await getData(kUserToken);
    userData = await getData(kUserData);
    userType = await getData(kUserType);
  };
  return (
    // <ImageBackground
    //   source={imagePath.spl}
    //   style={{flex: 1}}
    //   resizeMode="cover"></ImageBackground><>
    <></>
  );
};
export default Splash;
