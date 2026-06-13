import {get, post, retryUploadChatAttachment} from '../apis/apiHelper';
import {loadingButton, loadingShow} from './loadingAction';
import {showToastMessage} from '../../utils/Toast';
import {
  JSON_HEADER,
  kRememberData,
  kRememberDataUser,
  kSorryError,
  kUserData,
  kUserToken,
  MULTI_PART_HEADER,
} from '../apis/commonValue';
import {
  CHECK_USER,
  GET_PROFILE,
  SIGN_UP,
  VERIFY_OTP,
  FORGOT_PASSWORD,
  RESEND_OTP,
  RESET_PASSWORD,
  LOGIN,
  LOGOUT,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  SETUP_PROFILE,
  WELCOME,
  EDIT_PROFILE,
  CREATE_PROVIDER,
} from '../apis/endpoints';
import {logout, showErrorMessage} from '../../utils/helper';
import {setData} from '../apis/keyChain';
import {USER_DATA_KEY} from '../constants/userSessionType';
import * as Helper from '../../utils/helper';

export const saveUserData = (dispatch, response) => {
  // console.log("response-userData -------->>", response?.data);
  setData(kUserData, response?.data);
  Helper.setUserData(response?.data);
  // console.log('response.token====>1111/1', response?.token);
  if (response?.token) {
    global.userToken = response?.token;
    // console.log('response.token====>222222', response?.token);
    setData(kUserToken, response?.token);
    Helper.setGlobalUserToken(response?.token);
  }
  dispatch(setUserDataPayLoad(USER_DATA_KEY, response?.data));
};

export const sendToUserReducer = (type, payload) => {
  // console.log('sendToUserReducer', type, payload);
  return {
    type,
    payload,
  };
};

export const setUserDataPayLoad = (type, response) => {
  // console.log("response---payload---", type, response);
  return {
    type: type,
    payload: response,
  };
};

// console.log('userType>>>>>>>', userType);

// Check user Request Api
export function checkUserApi(request, navigation, type) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CHECK_USER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response?.status) {
        showToastMessage(response?.message, 'success');
        navigation.navigate('OtpVerification', {
          signUpReq: request,
          signUp: true,
        });
        dispatch(loadingShow(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function checkUserApiCutomer(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CHECK_USER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response?.status) {
        showToastMessage(response?.message, 'success');
        navigation.navigate('OtpVerification', {
          signUpReq: request,
          signUp: true,
        });
        dispatch(loadingShow(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function registerAction(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SIGN_UP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status && response?.data) {
        dispatch(loadingShow(false));
        saveUserData(dispatch, response);

        if (global.user_type == 'user') {
          navigation.reset({
            index: 1,
            routes: [{name: 'CreateProfile'}],
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [{name: 'CreateProfileTwo'}],
          });
        }
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function getProfileAction(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_PROFILE,
        header: JSON_HEADER,
      });
      console.log('response----->', response);

      if (response && response.status && response?.data) {
        saveUserData(dispatch, response);
        return Promise.resolve(response?.data);
      } else {
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(kSorryError);
      return Promise.resolve(false);
    }
  };
}

export function registerActionn(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SIGN_UP,
        data: request,
        header: MULTI_PART_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status && response?.data) {
        dispatch(loadingShow(false));
        saveUserData(dispatch, response);

        if (global.user_type == 'business') {
          navigation.reset({
            index: 1,
            routes: [{name: 'CreateProfile'}],
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [{name: 'WelcomeTwo'}],
          });
        }
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function resetPasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: RESET_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        navigation.navigate('Login');
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
    }
  };
}

export function changePasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CHANGE_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        navigation.goBack();
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function logOutApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: LOGOUT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('=========>logout response', response);
      if (response && response.status) {
        dispatch(loadingShow(false));
        showToastMessage(response.message, 'success');
        logout();
        return Promise.resolve(true);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
      return Promise.resolve(false);
    }
  };
}

export function WelcomeApi(request) {
  return async dispatch => {
    try {
      const response = await get({
        url: WELCOME,
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response?.data);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
      return Promise.resolve(false);
    }
  };
}

export function resendOtpApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: RESEND_OTP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
      return Promise.resolve(false);
    }
  };
}

export function createProfileApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    // try {
    //   const response = await post({
    //     url: SETUP_PROFILE,
    //     data: request,
    //     header: MULTI_PART_HEADER,
    //   });
    try {
      const response = await retryUploadChatAttachment(
        () =>
          post({
            url: SETUP_PROFILE,
            data: request,
            header: MULTI_PART_HEADER,
          }),
        3, // 🔁 retry count
        1000, // ⏱ delay (ms)
      );

      dispatch(loadingShow(false));
      if (response && response.status && response?.data) {
        showToastMessage(response.message, 'success');
        saveUserData(dispatch, response);
        navigation.reset({
          index: 1,
          routes: [{name: 'FirstHome'}],
        });
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function createProfileProviderApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    // try {
    //   const response = await post({
    //     url: CREATE_PROVIDER,
    //     data: request,
    //     header: MULTI_PART_HEADER,
    //   });
    try {
      const response = await retryUploadChatAttachment(
        () =>
          post({
            url: CREATE_PROVIDER,
            data: request,
            header: MULTI_PART_HEADER,
          }),
        3, // 🔁 retry count
        1000, // ⏱ delay (ms)
      );

      dispatch(loadingShow(false));
      if (response && response.status && response?.data) {
        showToastMessage(response.message, 'success');
        saveUserData(dispatch, response);
        navigation.reset({
          index: 1,
          routes: [{name: 'HomeScreenTwo'}],
        });
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function editProfileApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    // try {
    //   const response = await post({
    //     url: EDIT_PROFILE,
    //     data: request,
    //     header: MULTI_PART_HEADER,
    //   });

    try {
      const response = await retryUploadChatAttachment(
        () =>
          post({
            url: EDIT_PROFILE,
            data: request,
            header: MULTI_PART_HEADER,
          }),
        3, // 🔁 retry count
        1000, // ⏱ delay (ms)
      );

      dispatch(loadingShow(false));
      if (response && response.status && response?.data) {
        showToastMessage(response.message, 'success');
        saveUserData(dispatch, response);
        navigation.goBack();
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function deleteAccountApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: DELETE_ACCOUNT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        logout();
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function createUserApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    // try {
    //   const response = await post({
    //     url: SETUP_PROFILE,
    //     data: request,
    //     header: MULTI_PART_HEADER,
    //   });

    try {
      const response = await retryUploadChatAttachment(
        () =>
          post({
            url: SETUP_PROFILE,
            data: request,
            header: MULTI_PART_HEADER,
          }),
        3, // 🔁 retry count
        1000, // ⏱ delay (ms)
      );

      dispatch(loadingShow(false));
      if (response && response.status) {
        saveUserData(dispatch, response);
        navigation.reset({
          index: 1,
          routes: [{name: 'WelcomeUser'}],
        });
      } else {
        showToastMessage(response.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function loginUserApi(request, navigation, remember) {
  return async dispatch => {
    dispatch(loadingShow(true));
    console.log('=======>', request);
    try {
      const response = await post({
        url: LOGIN,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      console.log(response);
      if (response && response?.status && response?.data) {
        saveUserData(dispatch, response);
        if (response?.data?.user_type == 'user') {
          if (remember) {
            setData(kRememberData, {
              ...request,
              email: request.email,
              password: request.password,
              type: request.type,
            });
          } else {
            setData(kRememberData, null);
          }
          navigation.reset({
            index: 1,
            routes: [{name: 'FirstHome'}],
          });
        } else {
          if (remember) {
            setData(kRememberDataUser, {
              ...request,
              email: request.email,
              password: request.password,
              type: request.type,
            });
          } else {
            setData(kRememberDataUser, null);
          }
          navigation.reset({
            index: 1,
            routes: [{name: 'HomeScreenTwo'}],
          });
        }
      } else {
        showToastMessage(response.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

export function forgotPasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: FORGOT_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        return Promise.resolve(response);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
      return Promise.resolve(false);
    }
  };
}

export function verifyOtpApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: VERIFY_OTP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        return Promise.resolve(response);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
      return Promise.resolve(false);
    }
  };
}

export function getProfileApi(loader) {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_PROFILE,
        header: JSON_HEADER,
      });
      if (response && response.status && response?.data) {
        saveUserData(dispatch, response);
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
      return Promise.resolve(false);
    }
  };
}
