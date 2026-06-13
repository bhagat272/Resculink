import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import {translateText} from '../../../utils/language';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import NoDataFound from '../../../component/noDataFound';
import {
  deleteNotification,
  notificationApi,
  setAppSessionReducer,
} from '../../../appRedux/actions/appSessionAction';
import {
  NOTIFICATION_COUNTT,
  PAGE_LOADING_NOTIFICATION_LIST,
  PULL_TO_REFRESH_NOTIFICATION_LIST,
} from '../../../appRedux/constants/appSessionType';
import DeleteNotificationModal from '../UserNotification/deleteNotificationModal';
import {getTimeDifference} from '../../../utils/helper';
import {socketConnectionCheck} from '../../../component/socket';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
const Notifications = props => {
  const userData = useSelector(state => state.session.userData);
  // console.log("userData----->",userData);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [localLoader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loaderShow = useSelector(state => state.loading.show);
  const [noData, setNoData] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const {
    notification_list_data,
    notificationpageloading,
    notificationPullToRefresh,
    notificationLastPage,
  } = useSelector(state => state.appSession);
  const [updateClick, setUpdateClick] = useState(false);
  useEffect(() => {
    dispatch(loadingShow(true));
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      Title: translateText('Notifications'),
      leftIcon: true,
      notificationIcon: notification_list_data?.length ? true : false,
      heightRightImg: 35,
      widthRightImg: 35,
      notification: imagePath.delete,
      // leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      notificationClick: () => {
        setDeleteModalVisible(true);
      },
      leftImage: imagePath.back,
    });
  }, [notification_list_data]);
  useEffect(() => {
    socketConnectionCheck();
    dispatch(setAppSessionReducer(NOTIFICATION_COUNTT, 0));
    setTimeout(() => {
      NotificationData(1);
    }, 1000);
    // NotificationData(1)
  }, []);

  const deleteNotificationfunction = () => {
    dispatch(deleteNotification()).then(response => {
      // console.log("res------>", response);
      if (response) {
        setDeleteModalVisible(false);
        NotificationData(1);
        setUpdateClick(true);
      }
    });
  };

  const NotificationData = page => {
    setLoader(true);
    dispatch(notificationApi(page)).then(resp => {
      // console.log("resp=======>",resp);
      setLoader(false);
      if (resp && Array.isArray(resp) && resp?.length > 0) {
        DeviceEventEmitter.emit('notificationCalled');
        setNoData(false);
        dispatch(loadingShow(false));
      } else {
        setNoData(true);
        dispatch(loadingShow(false));
      }
    });
  };

  const methodPullToRefresh = () => {
    if (notificationPullToRefresh || notificationpageloading) {
      return;
    }
    dispatch(setAppSessionReducer(PULL_TO_REFRESH_NOTIFICATION_LIST, true));
    setCurrentPage(1);
    NotificationData(1);
  };
  const methodOnEndReached = () => {
    // console.log("methodOnEndReached--------------", notificationLastPage, currentPage);
    if (
      notificationLastPage <= currentPage ||
      notificationpageloading ||
      notificationPullToRefresh
    ) {
      return;
    }
    dispatch(setAppSessionReducer(PAGE_LOADING_NOTIFICATION_LIST, true));
    setCurrentPage(currentPage + 1);
    NotificationData(currentPage + 1);
  };

  const noDataFound = () => {
    return noData ? <NoDataFound NoData="No notifications found" /> : <></>;
  };
  const data = [1, 2, 3, 4];

  const goToDetail = item => {
    // console.log("item----->",item,);
    // return

    props.navigation.navigate('StatusDetail', {item: item});
  };

  const onNavigation = item => {
    // console.log('item=====>', item);
    let convertData = JSON.parse(item?.data);
    // console.log('convertData===>', convertData);
    // return;
    if (convertData) {
      if (
        convertData?.type == 'medical_assistance' ||
        convertData?.type == 'security_assistance'
      ) {
        goToDetail(convertData);
      }

      // else if (convertData?.type == 'event_reservation') {
      //   goToEventDetail(convertData);
      // }
      // else if (convertData?.type == 'rated_business') {
      //   goToReview(convertData);
      // }

      // else if (convertData?.type == 'story_added' || convertData?.type == "event_added") {
      //   goToBusinessDiscription(convertData);
      // }
      // else if (convertData?.type == 'friend_request' || convertData?.type == "accept_friend_request") {

      //   if (convertData?.type == "accept_friend_request") {
      //     goToFriend(convertData, "accept_friend_request");
      //   } else {
      //     goToFriend(convertData);
      //   }

      // }
    }
  };

  const renderItem = ({item, index}) => {
    // console.log("renderItem----renderItem->",item);

    return (
      <View key={index} style={styles.renderItem_View}>
        <ImageLoadView
          style={{height: 24, width: 24, borderRadius: 24 / 2, marginRight: 10}}
          resizeMode="cover"
          source={item?.image ? {uri: IMAGE_URL + item?.image} : imagePath.logo}
        />
        <TouchableOpacity
          onPress={() => {
            onNavigation(item);
            // console.log('item onPress----->', item);
          }}
          disabled={
            item?.type == 'broadcast_notification' || item?.manage == 1
              ? true
              : false
          }>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                width: '95%',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.name_txt, {flex: 1}]}>{item?.title}</Text>
              <Text style={[styles.time_text, {textAlign: 'right'}]}>
                {getTimeDifference(item?.created_at)}
              </Text>
              {/* <Text style={styles.time_text}>getTimeDifference(item?.created_at)</Text> */}
            </View>
            <View style={{width: '95%'}}>
              <Text style={[styles.item_txt, {}]}>{item?.message}</Text>
            </View>
            {item?.manage == 1 ? (
              <Text style={{color: 'red', marginTop: 5}}>expired</Text>
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[
          styles.container,
          {marginTop: Platform.OS == 'ios' ? 120 : 100},
        ]}>
        <FlatList
          data={notification_list_data}
          renderItem={renderItem}
          onEndReached={methodOnEndReached}
          ListEmptyComponent={noDataFound()}
          // ListFooterComponent={footerComponent()}
          refreshControl={
            <RefreshControl
              refreshing={notificationPullToRefresh}
              onRefresh={methodPullToRefresh}
            />
          }
          // onEndReached={methodOnEndReached}
          // ListEmptyComponent={noDataFound()}
          // ListFooterComponent={footerComponent()}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={notificationPullToRefresh}
          //     onRefresh={methodPullToRefresh}
          //   />
          // }
          // keyExtractor={item => item.id}
        />
      </SafeAreaView>

      <DeleteNotificationModal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
        }}
        onConfirm={() => {
          deleteNotificationfunction();
          setDeleteModalVisible(false);

          // props.navigation.navigate("DeleteAccount")
        }}
      />
    </View>
  );
};

export default Notifications;
