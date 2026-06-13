import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import { translateText } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptInvitaionApi,
  checkOutUserApi,
  deleteNotification,
  notificationApi,
  setAppSessionReducer,
} from '../../../appRedux/actions/appSessionAction';
import { useIsFocused } from '@react-navigation/native';
import NoDataFound from '../../../component/noDataFound';
import {
  NOTIFICATION_COUNTT,
  PAGE_LOADING_NOTIFICATION_LIST,
  PULL_TO_REFRESH_NOTIFICATION_LIST,
} from '../../../appRedux/constants/appSessionType';
import DeleteNotificationModal from './deleteNotificationModal';
import { getTimeDifference } from '../../../utils/helper';
import { saveUserData } from '../../../appRedux/actions/userSessionAction';
import { socketConnectionCheck } from '../../../component/socket';
import Colors from '../../../theme/colors';
import { loadingShow } from '../../../appRedux/actions/loadingAction';
import { showToastMessage } from '../../../utils/Toast';
const UserNotification = props => {
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
  const userData = useSelector(state => state.session.userData);
  // console.log("userData ssss-->",userData);

  // console.log("notification_list_data--user---->", notification_list_data);
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
  const data = [1, 2, 3, 4];

  useEffect(() => {
    dispatch(setAppSessionReducer(NOTIFICATION_COUNTT, 0));

    setTimeout(() => {
      NotificationData(1);
    }, 1000);
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

  const onNavigation = item => {
    let convertData = JSON.parse(item?.data);
    // console.log('convertData===>', convertData?.member_related_id);

    let member_related_id = convertData?.member_related_id;

    const data = {
      member_related_id: member_related_id,
      noti_id: item?.id,
      accepted: 1,
    };

    // console.log("data---->", data);

    // console.log("convertData----->", convertData);

    dispatch(acceptInvitaionApi(data)).then(response => {
      // console.log("res------>", response);
      if (response) {
        socketConnectionCheck();
        saveUserData(dispatch, response);
        props.navigation.reset({
          index: 0,
          routes: [
            {
              name: 'PartyModeScreen',
              params: {
                item: convertData, // this second parameter is for sending the params
              },
            },
          ],
        });
      } else {
        NotificationData(1);
      }
    });
  };

  const onNavigation1 = item => {
    let convertData = JSON.parse(item?.data);
    // console.log('convertData===>', convertData?.member_related_id);

    let member_related_id = convertData?.member_related_id;

    const data = {
      member_related_id: member_related_id,
      noti_id: item?.id,
      accepted: 0,
    };

    // console.log("data---->", data);

    // console.log("convertData----->", convertData);

    dispatch(acceptInvitaionApi(data)).then(response => {
      // console.log("res------>", response);
      if (response) {
        socketConnectionCheck();
        saveUserData(dispatch, response);
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'FirstHome' }],
        });
      }
    });
  };
  const renderItem = ({ item, index }) => {
    console.log('item is  kkkkkkkkkkk', item);

    return (
      <View key={index} style={styles.renderItem_View}>
        <ImageLoadView
          style={{ height: 65, width: 65, marginRight: 10 }}
          resizeMode="cover"
          source={item?.image ? { uri: IMAGE_URL + item?.image } : imagePath.logo}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={[styles.name_txt, { flex: 1 }]}>{item?.title}</Text>
            <Text style={styles.time_text}>
              {getTimeDifference(item?.created_at)}
            </Text>
          </View>
          <Text style={styles.item_txt}>{item?.message}</Text>

          {item?.manage == 1 ? (
            <Text
              style={{
                color: item?.par_message == 'Invite Accepted' ? 'green' : 'red',
              }}>
              {item?.par_message}
            </Text>
          ) : (
            <></>
          )}

          {item?.type == 'checkout' ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.goBack();
                }}

                style={[styles.applyTouch, { marginLeft: 0, marginRight: 10 }]}>
                <Text style={[styles.acptText]}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  let dic = {
                    notification_id: item?.id
                  }
                  console.log('dic -------->', dic);
                  dispatch(loadingShow(true));
                  dispatch(checkOutUserApi(dic)).then((res: any) => {
                    if (res?.status) {
                      dispatch(loadingShow(false));
                      setTimeout(() => {
                        props.navigation.goBack();
                      }, 300);
                    }
                  })
                }}

                style={[styles.cancelTouch, { marginRight: 0 }]}>
                <Text style={styles.cancelText}>No</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}

          {item?.type == 'party_invitation' && !item?.manage == 1 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onNavigation1(item);
                }}
                disabled={
                  item?.type == 'broadcast_notification' || item?.manage == 1
                    ? true
                    : false
                }
                style={styles.cancelTouch}>
                <Text style={styles.cancelText}>{translateText('Cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onNavigation(item);
                }}
                disabled={
                  item?.type == 'broadcast_notification' || item?.manage == 1
                    ? true
                    : false
                }
                style={styles.applyTouch}>
                <Text style={styles.acptText}>{translateText('Accept')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[
          styles.container,
          { marginTop: Platform.OS == 'ios' ? 120 : 100 },
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

export default UserNotification;
