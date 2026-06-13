import { CLEAR_NOTIFICATION_LIST,  GET_NOTIFICATION_LIST,  NOTIFICATION_UPDATE,  PAGE_LOADING_NOTIFICATION_LIST, PULL_TO_REFRESH_NOTIFICATION_LIST,  USER_DATA_KEY,  NOTIFICATION_COUNTT, SELECTED_VENUE_ID  } from "../constants/userSessionType";

const initialState = {
  userData: global?.userData,
  notification_list_data: [],
  notificationpageloading: false,
  notificationPullToRefresh: false,
  notificationLastPage: 1,
  notification_count: 0,
  selected_venue_id: null
};

const userSessionReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_DATA_KEY: {
      return {
        ...state,
        userData: payload,
      };
    }

    case NOTIFICATION_UPDATE: {
      return {
        ...state,
        notification_list_data: payload,
      };
    }

    case NOTIFICATION_COUNTT: {
      return {
        ...state,
        notification_count: payload,
      };
    }

    case SELECTED_VENUE_ID: {
      return {
        ...state,
        selected_venue_id: payload,
      };
    }


    case GET_NOTIFICATION_LIST: {
      return {
        ...state,
        notification_list_data: state.notification_list_data
          ? state.notification_list_data.concat(payload.data)
          : payload.data,
        notificationLastPage: payload.last_page,
        notificationPullToRefresh: false,
        notificationpageloading: false,
      };
    }
    case PULL_TO_REFRESH_NOTIFICATION_LIST: {
      return {
        ...state,
        notificationPullToRefresh: payload,
        notificationpageloading: false,
      };
    }
    case PAGE_LOADING_NOTIFICATION_LIST: {
      return {
        ...state,
        notificationpageloading: payload,
        notificationPullToRefresh: false,
      };
    }
    case CLEAR_NOTIFICATION_LIST: {
      return {
        ...state,
        notification_list_data: [],
        notificationLastPage: 1,
        notificationPullToRefresh: false,
        notificationpageloading: false,
      };
    }

    default:
      return { ...state ,
        userData: global?.userData,
};
  }
};
export default userSessionReducer;
