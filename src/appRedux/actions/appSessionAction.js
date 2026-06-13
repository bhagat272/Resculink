import {DeviceEventEmitter} from 'react-native';
import {post} from '../apis/apiHelper';
import {loadingShow} from './loadingAction';
import {showToastMessage} from '../../utils/Toast';
import {JSON_HEADER, kSorryError, MULTI_PART_HEADER} from '../apis/commonValue';
import {
  ACCEPT_INVITATION,
  ACCEPT_SIGNAL,
  ADD_MORE_MEMBER,
  ADD_PARTY_MEMBER,
  ADD_VENUE_HISTORY,
  BODY_PARTS,
  BREATH_STATUS,
  CANCEL_SIGNAL,
  CATEGORY_LIST,
  CHECK_IN_VENUE,
  CHECKOUT_USER,
  DELETE_VENUE,
  EMPLOYEE_LISTS,
  GUEST_BEHAVIOR,
  INVITE_PARTY_MODE,
  LEAVE_PARTY,
  MARK_RESOLVE,
  NOTIFICATION_COUNT,
  NOTIFICATION_DELETE,
  NOTIFICATION_LIST,
  PARTY_DETAILS,
  PARTY_USER_MAP,
  PARTY_VENUE_UPDATE,
  PROHIBITED_ITEMS,
  PROVIDER_SIGNAL_HISTORY,
  SAVE_MEDICAL_ASSISTANCE,
  SAVE_SECURITY_ASSISTANCE,
  SIGNAL_DETAIL,
  SIGNAL_LIST,
  SIGNAL_LIST_MAP,
  SYNC_CONTACT,
  UNIQUE_VENUE_DETAIL,
  UPDATE_DEVICE_TOKEN,
  UPDATE_LAT_LONG,
  UPDATE_NOTIFICATION_STATUS,
  UPDATE_VISIBILITY,
  USER_SIGNAL_DETAIL,
  USER_SIGNAL_HISTORY,
  VENUE_CONFIRM,
  VENUE_HISTORY,
  VENUE_LIST,
} from '../apis/endpoints';

import * as Helper from '../../utils/helper';
import {
  CLEAR_NOTIFICATION_LIST,
  GET_NOTIFICATION_LIST,
  PULL_TO_REFRESH_NOTIFICATION_LIST,
  NOTIFICATION_COUNTT,
  VENUE_LIST_PAGE_DATA,
  CLEAR_VENUE_LIST_PAGE_DATA,
  HISTORY_LIST_DATA,
  EMPLOYYEE_LIST_DATA,
  CHECK_IN_LIST_DATA,
  CLEAR_SIGNAL_LIST_DATA,
  SIGNAL_LIST_DATA,
  PULL_TO_REFRESH_SIGNAL_LIST_DATA,
  SIGNAL_DETAIL_DATA,
  USER_SIGNAL_DETAIL_DATA,
  CLEAR_PROVIDER_SIGNAL_HISTORY,
  PROVIDER_SIGNAL_HISTORY_DATA,
  PULL_TO_REFRESH_PROVIDER_SIGNAL_HISTORY,
  PULL_TO_REFRESH_USER_SIGNAL_HISTORY,
  USER_SIGNAL_HISTORY_DATA,
  CLEAR_USER_SIGNAL_HISTORY,
  MAP_LIST_DATA,
  PARTY_MAP__LIST_DATA,
} from '../constants/appSessionType';
import {saveUserData, sendToReducer} from './userSessionAction';

export const setAppSessionReducer = (type, payload) => {
  return {
    type,
    payload,
  };
};

export function venueListingApi(request) {
  if (!global?.userToken) {
    return;
  }
  return async dispatch => {
    try {
      const response = await post({
        url: VENUE_LIST,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('=============Venue list', response);
      if (response && response.status && response?.data) {
        if (request?.page == 1) {
          dispatch(setAppSessionReducer(CLEAR_VENUE_LIST_PAGE_DATA, ''));
          dispatch(loadingShow(false));
        }
        if (response && response?.data?.data?.length) {
          let dic = {};
          dic.data = response?.data?.data;
          dic.last_page = response?.data?.last_page;
          dispatch(setAppSessionReducer(VENUE_LIST_PAGE_DATA, dic));
          dispatch(loadingShow(false));
          return Promise.resolve(response?.data?.data);
        }
      } else {
        showToastMessage(response.message);
        console.log('==========else===Venue list', response);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log('=============Venue list error', error);
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function upadteDeviceTokenAction(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: UPDATE_DEVICE_TOKEN,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
      } else {
      }
    } catch (error) {}
  };
}

export function confirmVenueApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: VENUE_CONFIRM,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        showToastMessage(response.message, 'success');
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function checkOutUserApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CHECKOUT_USER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('CHECKOUT_USER=-------->', response);

      dispatch(loadingShow(false));
      // dispatch(Helper.showLoader(false))
      if (response && response.status) {
        saveUserData(dispatch, response);
        // dispatch(Helper.showLoader(false))
        dispatch(loadingShow(false));
        showToastMessage(response.message, 'success');
        return Promise.resolve(response);
      } else {
        // dispatch(Helper.showLoader(false))
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      // dispatch(Helper.showLoader(false))
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function updateVisibilityApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: UPDATE_VISIBILITY,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        saveUserData(dispatch, response);
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function syncContactNumber(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: SYNC_CONTACT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function leavePartyApi(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: LEAVE_PARTY,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('response', response);

      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        saveUserData(dispatch, response);
        //   navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'FirstHome' }],
        // });
        navigation.navigate('HomeScreen');
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function addPartyMembers(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: ADD_PARTY_MEMBER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function addUsersInPartyapi(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: ADD_MORE_MEMBER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function invitePartyModeapi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: INVITE_PARTY_MODE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function bodyPartsApi() {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: BODY_PARTS,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function catListApi() {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CATEGORY_LIST,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function breathStatusApi() {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: BREATH_STATUS,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function guestbehaviorApi() {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: GUEST_BEHAVIOR,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function prohibitedApi() {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: PROHIBITED_ITEMS,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function saveMedicalAssistanceApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SAVE_MEDICAL_ASSISTANCE,
        data: request,
        header: MULTI_PART_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function saveSecurityAssistanceApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SAVE_SECURITY_ASSISTANCE,
        data: request,
        header: MULTI_PART_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function uniquecodeApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: UNIQUE_VENUE_DETAIL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function partyDetailApi(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: PARTY_DETAILS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function addVenueApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: ADD_VENUE_HISTORY,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        DeviceEventEmitter.emit('addvenue');
        showToastMessage(response.message, 'success');
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function venuehistoryApi(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: VENUE_HISTORY,
        header: JSON_HEADER,
      });
      console.log('venuehistoryApi----->', response);

      if (response && response.status) {
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(HISTORY_LIST_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function employeeListApi(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: EMPLOYEE_LISTS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(EMPLOYYEE_LIST_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function partyMapListApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: PARTY_USER_MAP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(PARTY_MAP__LIST_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function mapListApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SIGNAL_LIST_MAP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(MAP_LIST_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function updtaelatlong(request, navigation) {
  if (!global?.userToken) {
    return;
  }
  return async dispatch => {
    try {
      const response = await post({
        url: UPDATE_LAT_LONG,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        return Promise.resolve(response?.data);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      return Promise.resolve(false);
    }
  };
}

export function deletevenueApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: DELETE_VENUE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        showToastMessage(response.message, 'success');
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function checkinvenueApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CHECK_IN_VENUE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('response------->', response);

      if (response && response.status) {
        dispatch(loadingShow(false));
        saveUserData(dispatch, response);
        dispatch(setAppSessionReducer(CHECK_IN_LIST_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        console.log('response---else---->', response);

        return Promise.resolve(false);
      }
    } catch (error) {
      console.log('======checkvenue', error);

      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function signalListDataApi(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: SIGNAL_LIST,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('SIGNAL_LIST------->', response);

      if (response && response?.status && response?.data) {
        if (request?.page == 1) {
          dispatch(setAppSessionReducer(CLEAR_SIGNAL_LIST_DATA, ''));
          dispatch(loadingShow(false));
        }
        if (response?.data?.data && response?.data?.data?.length > 0) {
          let dic = {};
          dic.data = response?.data?.data;
          dic.last_page = response?.data?.last_page;
          dispatch(setAppSessionReducer(SIGNAL_LIST_DATA, dic));
          dispatch(loadingShow(false));
          return Promise.resolve(response?.data?.data);
        } else {
          dispatch(
            dispatch(loadingShow(false)),
            setAppSessionReducer(PULL_TO_REFRESH_SIGNAL_LIST_DATA, false),
          );
          return Promise.resolve(false);
        }
      } else {
        dispatch(loadingShow(false));
        // showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      Helper.showErrorMessage(kSorryError);
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function signalDetailApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SIGNAL_DETAIL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(SIGNAL_DETAIL_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function acceptSignalApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: ACCEPT_SIGNAL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function markResolveApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: MARK_RESOLVE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        DeviceEventEmitter.emit('markresolve');
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function userSignalDetailApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: USER_SIGNAL_DETAIL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(USER_SIGNAL_DETAIL_DATA, response?.data));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function cancelSignalApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CANCEL_SIGNAL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response.status) {
        showToastMessage(response.message, 'success');
        dispatch(loadingShow(false));
        return Promise.resolve(response?.data);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function updateNotification(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: UPDATE_NOTIFICATION_STATUS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response.status == true) {
        saveUserData(dispatch, response);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}

export function notificationApi(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: `${NOTIFICATION_LIST}?page=${request}`,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (request == 1) {
        dispatch(setAppSessionReducer(CLEAR_NOTIFICATION_LIST, ''));
        dispatch(loadingShow(false));
      }
      if (response && response?.status && response?.data) {
        if (response?.data?.data && response?.data?.data?.length > 0) {
          let dic = {};
          dic.data = response?.data?.data;
          dic.last_page = response?.data?.last_page;
          dispatch(setAppSessionReducer(GET_NOTIFICATION_LIST, dic));
          dispatch(loadingShow(false));
          return Promise.resolve(response?.data?.data);
        } else {
          dispatch(
            setAppSessionReducer(PULL_TO_REFRESH_NOTIFICATION_LIST, false),
          );
          dispatch(loadingShow(false));
          return Promise.resolve(false);
        }
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(kSorryError);
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function deleteNotification(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: NOTIFICATION_DELETE,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response.status == true) {
        return Promise.resolve(response);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}

export function acceptInvitaionApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: ACCEPT_INVITATION,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response && response.status && response?.data) {
        return Promise.resolve(response);
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}

export function notificationCountApi() {
  return async dispatch => {
    try {
      const response = await post({
        url: NOTIFICATION_COUNT,
        header: JSON_HEADER,
      });
      if (response && response.status && response?.data) {
        dispatch(setAppSessionReducer(NOTIFICATION_COUNTT, response?.data));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
      }
    } catch (error) {
      showErrorMessage(kSorryError);
      dispatch(loadingShow(false));
    }
  };
}

export function providerSignalHistoryApi(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: `${PROVIDER_SIGNAL_HISTORY}?page=${request}`,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response?.status) {
        if (request == 1) {
          dispatch(setAppSessionReducer(CLEAR_PROVIDER_SIGNAL_HISTORY, ''));
          dispatch(loadingShow(false));
        }
        if (response?.data?.data && response?.data?.data?.length > 0) {
          let dic = {};
          dic.data = response?.data?.data;
          dic.last_page = response?.data?.last_page;
          dispatch(setAppSessionReducer(PROVIDER_SIGNAL_HISTORY_DATA, dic));
          dispatch(loadingShow(false));
        } else {
          dispatch(
            dispatch(loadingShow(false)),
            setAppSessionReducer(
              PULL_TO_REFRESH_PROVIDER_SIGNAL_HISTORY,
              false,
            ),
          );
        }
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
      }
    } catch (error) {
      Helper.showErrorMessage(kSorryError);
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function userSignalHistoryApi(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: `${USER_SIGNAL_HISTORY}?page=${request}`,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response?.status) {
        if (request == 1) {
          dispatch(setAppSessionReducer(CLEAR_USER_SIGNAL_HISTORY, ''));
          dispatch(loadingShow(false));
        }
        if (response?.data?.data && response?.data?.data?.length > 0) {
          let dic = {};
          dic.data = response?.data?.data;
          dic.last_page = response?.data?.last_page;
          dispatch(setAppSessionReducer(USER_SIGNAL_HISTORY_DATA, dic));
          dispatch(loadingShow(false));
        } else {
          dispatch(
            dispatch(loadingShow(false)),
            setAppSessionReducer(PULL_TO_REFRESH_USER_SIGNAL_HISTORY, false),
          );
        }
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
      }
    } catch (error) {
      Helper.showErrorMessage(kSorryError);
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}

export function updatePartyVenue(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: PARTY_VENUE_UPDATE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('responseupdatePartyVenue----', response);

      dispatch(loadingShow(false));
      if (response && response.status) {
        dispatch(loadingShow(false));
        return Promise.resolve(response);
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      return Promise.resolve(false);
    }
  };
}
