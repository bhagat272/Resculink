import EmployeeGroup from '../../screen/appScreen/employeeGroup';
import {

  HISTORY_LIST_DATA,
  EMPLOYYEE_LIST_DATA,
  MAP_LIST_DATA,

  GET_NOTIFICATION_LIST,
  PULL_TO_REFRESH_NOTIFICATION_LIST,
  PAGE_LOADING_NOTIFICATION_LIST,
  CLEAR_NOTIFICATION_LIST,

  NOTIFICATION_COUNTT,

  VENUE_LIST_PAGE_DATA,
  CLEAR_VENUE_LIST_PAGE_DATA,
  PULL_TO_REFRESH_VENUE_LIST_PAGE_DATA,
  PAGE_LOADING_VENUE_LIST_PAGE_DATA,

  SIGNAL_LIST_DATA,
  PULL_TO_REFRESH_SIGNAL_LIST_DATA,
  PAGE_LOADING_SIGNAL_LIST_DATA,
  CLEAR_SIGNAL_LIST_DATA,

  SIGNAL_DETAIL_DATA,

  USER_SIGNAL_DETAIL_DATA,

  PROVIDER_SIGNAL_HISTORY_DATA,
  PULL_TO_REFRESH_PROVIDER_SIGNAL_HISTORY,
  PAGE_LOADING_PROVIDER_SIGNAL_HISTORY,
  CLEAR_PROVIDER_SIGNAL_HISTORY,
  USER_SIGNAL_HISTORY_DATA,
  PULL_TO_REFRESH_USER_SIGNAL_HISTORY,
  PAGE_LOADING_USER_SIGNAL_HISTORY,
  CLEAR_USER_SIGNAL_HISTORY,
  CLEAR_HISTORY_LIST_DATA,
  PARTY_MAP__LIST_DATA,
} from '../constants/appSessionType';

const initialState = {
  historyListData: [],

  mapListData: [],

  employeeListData: [],


  provider_history_list_data: [],
  providerhistorypageloading: false,
  providerhistoryPullToRefresh: false,
  providerhistoryLastPage: 1,


  user_history_list_data: [],
  userhistorypageloading: false,
  userhistoryPullToRefresh: false,
  userhistoryLastPage: 1,

  signalListdata: [],
  signalListpageloading: false,
  signalListPullToRefresh: false,
  signalListLastPage: 1,





  catHeaderdata: [],

  notification_count: 0,












  notification_list_data: [],
  notificationpageloading: false,
  notificationPullToRefresh: false,
  notificationLastPage: 1,



  partyMapListData: [],





  signal_detail_data: null,
  user_signal_detail_data: null,















  venuedata: [],
  venuedatapageloading: false,
  venuedataPullToRefresh: false,
  venueepagedataLastPage: 1,

};

const appSessionReducer = (state = initialState, action) => {



  const { type, payload } = action;
  switch (type) {




    case VENUE_LIST_PAGE_DATA: {
      // console.log('payload----------------', payload);
      return {
        ...state,
        venuedata: state.venuedata
          ? state.venuedata.concat(payload.data)
          : payload.data,
        venueepagedataLastPage: payload.last_page,
        venuedataPullToRefresh: false,
        venuedatapageloading: false,
      };
    }

    case CLEAR_VENUE_LIST_PAGE_DATA: {
      // console.log('clear data payload----------------', payload);
      return {
        ...state,
        venuedata: [],
        venuedatapageloading: false,
        venuedataPullToRefresh: false,
        venueepagedataLastPage: 1,
      };
    }

    case PULL_TO_REFRESH_VENUE_LIST_PAGE_DATA: {
      return {
        ...state,
        venuedataPullToRefresh: payload,
        venuedatapageloading: false,
      };
    }
    case PAGE_LOADING_VENUE_LIST_PAGE_DATA: {
      return {
        ...state,
        venuedatapageloading: payload,
        venuedataPullToRefresh: false,
      };
    }



    case PROVIDER_SIGNAL_HISTORY_DATA: {
      return {
        ...state,
        provider_history_list_data: state.provider_history_list_data
          ? state.provider_history_list_data.concat(payload.data)
          : payload.data,
        providerhistoryLastPage: payload.last_page,
        providerhistoryPullToRefresh: false,
        providerhistorypageloading: false,
      };
    }
    case PULL_TO_REFRESH_PROVIDER_SIGNAL_HISTORY: {
      return {
        ...state,
        providerhistoryPullToRefresh: payload,
        providerhistorypageloading: false,
      };
    }
    case PAGE_LOADING_PROVIDER_SIGNAL_HISTORY: {
      return {
        ...state,
        providerhistorypageloading: payload,
        providerhistoryPullToRefresh: false,
      };
    }
    case CLEAR_PROVIDER_SIGNAL_HISTORY: {

      return {
        ...state,
        provider_history_list_data: [],
        providerhistoryLastPage: 1,
        providerhistoryPullToRefresh: false,
        providerhistorypageloading: false,
      };
    }








    case USER_SIGNAL_HISTORY_DATA: {
      return {
        ...state,
        user_history_list_data: state.user_history_list_data
          ? state.user_history_list_data.concat(payload.data)
          : payload.data,
        userhistoryLastPage: payload.last_page,
        userhistoryPullToRefresh: false,
        userhistorypageloading: false,
      };
    }
    case PULL_TO_REFRESH_USER_SIGNAL_HISTORY: {
      return {
        ...state,
        userhistoryPullToRefresh: payload,
        userhistorypageloading: false,
      };
    }
    case PAGE_LOADING_USER_SIGNAL_HISTORY: {
      return {
        ...state,
        userhistorypageloading: payload,
        userhistoryPullToRefresh: false,
      };
    }
    case CLEAR_USER_SIGNAL_HISTORY: {

      return {
        ...state,
        user_history_list_data: [],
        userhistoryLastPage: 1,
        userhistoryPullToRefresh: false,
        userhistorypageloading: false,
      };
    }
















    case HISTORY_LIST_DATA: {
      // console.log('payload----------------',payload);
      return {
        ...state,
        historyListData: payload,
      };
    }


    case CLEAR_HISTORY_LIST_DATA: {
      // console.log('payload----------------',payload);
      return {
        ...state,
        historyListData: [],
      };
    }





    case EMPLOYYEE_LIST_DATA: {
      // console.log('payload----------------',payload);
      return {
        ...state,
        employeeListData: payload,
      };
    }

    case PARTY_MAP__LIST_DATA: {
      // console.log('payload----------------',payload);
      return {
        ...state,
        partyMapListData: payload,
      };
    }


    case MAP_LIST_DATA: {
      // console.log('payload----------------',payload);
      return {
        ...state,
        mapListData: payload,
      };
    }






    case SIGNAL_LIST_DATA: {
      // console.log('payload--------qqqqqqqq--------', JSON.stringify(payload));
      return {
        ...state,
        signalListdata: state.signalListdata
          ? state.signalListdata.concat(payload.data)
          : payload.data,
        // catHeaderdata: payload.informationHeaders,
        signalListLastPage: payload.last_page,
        signalListPullToRefresh: false,
        signalListpageloading: false,
      };
    }

    case PULL_TO_REFRESH_SIGNAL_LIST_DATA: {
      return {
        ...state,
        signalListPullToRefresh: payload,
        signalListpageloading: false,
      };
    }
    case PAGE_LOADING_SIGNAL_LIST_DATA: {
      return {
        ...state,
        signalListpageloading: payload,
        signalListPullToRefresh: false,
      };
    }

    case CLEAR_SIGNAL_LIST_DATA: {
      return {
        ...state,
        signalListdata: [],
        signalListLastPage: 1,
        signalListPullToRefresh: false,
        signalListpageloading: false,
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









    case SIGNAL_DETAIL_DATA: {
      return {
        ...state,
        signal_detail_data: payload,
      };
    }


    case USER_SIGNAL_DETAIL_DATA: {
      return {
        ...state,
        user_signal_detail_data: payload,
      };
    }
































    case NOTIFICATION_COUNTT: {
      // console.log('NOTIFICATION_COUNTT========raduser=========',payload);
      return {
        ...state,
        notification_count: payload,
      };
    }


    default:
      return { ...state };
  }
};
export default appSessionReducer;
