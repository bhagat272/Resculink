import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  TextInput,
  Dimensions,
  Keyboard,
  RefreshControl,
  DeviceEventEmitter,
  BackHandler,
  Alert,
} from 'react-native';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import fonts from '../../../theme/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import {translateText} from '../../../utils/language';
import {
  employeeListApi,
  leavePartyApi,
  partyDetailApi,
} from '../../../appRedux/actions/appSessionAction';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {AppButton} from '../../../component';
import CancelModal from './cancelModal';
import {useIsFocused} from '@react-navigation/native';
import NoDataFound from '../../../component/noDataFound';
import {socketConnectionCheck} from '../../../component/socket';
import {
  setGlobalUserToken,
  setUserData,
  showLoader,
} from '../../../utils/helper';
import OwnerModal from './ownerModal';
import MemberModal from './memberModal';
import {getProfileAction} from '../../../appRedux/actions/userSessionAction';
import {AppConstant} from '../../../appRedux/constants/appconstant';

const PartyModeScreen = props => {
  const [showMsg, setShowMsg] = useState(false);
  const isFocused = useIsFocused();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [ownerModalVisible, setOwnerModalVisible] = useState(false);
  const [partData, setPartyData] = useState([]);
  const [resfresh, setRefresh] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const {type, item} = props?.route?.params ? props?.route?.params : false;
  const userData = useSelector(state => state.session.userData);
  //   console.log("item----->",item);
  const dispatch = useDispatch();

  useEffect(() => {
    // if(userData?.id!=userId){

    let receiveMsgListener = DeviceEventEmitter.addListener(
      'become_admin',
      res => {
        // console.log("receive_party_group_messageoooooooo",res);
        if (res) {
          const data = {
            party_id: item?.data?.id ? item?.data?.id : item?.party_key,
          };
          // console.log("data is here----->",data);
          dispatch(partyDetailApi(data)).then(res => {
            // console.log("res---- /->",JSON.stringify(res));
            dispatch(getProfileAction());
            setUserId(res?.data?.user_id);

            // console.log("userData-----",userData?.id+"userId"+userId);

            if (res) {
              setIsLoading(true);
              setPartyData(res?.data?.member);
              // props.navigation.navigate("PartyModeScreen",{item:res})
              dispatch(loadingShow(false));
            } else {
              setIsLoading(false);
              dispatch(loadingShow(false));
            }
          });

          // props.navigation.reset({
          //     index: 0,
          //     routes: [{ name: 'FirstHome' }],
          // });
        }
      },
    );

    return () => {
      receiveMsgListener.remove();

      // };
    };
  }, []);

  useEffect(() => {
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      notificationIcon: userData?.id == userId ? true : false,
      notification: imagePath.addinvite,
      Title: 'My Party',
      shareIcon: true,
      widthShareImg: 30,
      heightShareImg: 30,
      share: imagePath.map,
      shareClick: () => {
        props.navigation.navigate('MyPartyMap', {
          item: item?.data?.id ? item?.data?.id : item?.party_key,
        });
      },
      notificationClick: () => {
        // setUserModalVisible(true)
        props.navigation.navigate('AddinParty', {
          item: item?.data?.id ? item?.data?.id : item?.party_key,
        });
      },
      heightRightImg: 44,
      widthRightImg: 44,

      leftIcon: false,
      leftClick: () => {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'FirstHome'}],
        });
        // props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
  }, [userId]);

  useEffect(() => {
    // dispatch(getProfileAction())
    dispatch(loadingShow(true));
    const data = {
      party_id: item?.data?.id ? item?.data?.id : item?.party_key,
    };
    // console.log("data is here----->",data);
    dispatch(partyDetailApi(data)).then(res => {
      // console.log("res---- /->",JSON.stringify(res));
      setUserId(res?.data?.user_id);

      // console.log("userData-----",userData?.id+"userId"+userId);

      if (res) {
        setIsLoading(true);
        setPartyData(res?.data?.member);
        // props.navigation.navigate("PartyModeScreen",{item:res})
        dispatch(loadingShow(false));
      } else {
        setIsLoading(false);
        dispatch(loadingShow(false));
      }
    });
  }, [isFocused]);

  const methodGenerateLetterPicture = key => {
    let name = key;
    if (name?.length) {
      return name.slice(0, 1);
    } else {
      return '';
    }
  };

  const renderItemAcept = ({item, index}) => {
    // console.log("item----->",item);

    let firstLetter = methodGenerateLetterPicture(item?.member_detail?.name);
    return (
      <View key={index} style={styles.card}>
        <View style={styles.flatlistmainview}>
          {item?.member_detail?.profile_picture ? (
            <ImageLoadView
              style={styles.nameview}
              source={{
                uri: IMAGE_URL + item?.member_detail?.profile_picture,
              }}
            />
          ) : (
            <View style={styles.nameview}>
              <Text
                style={[
                  styles.firstLetterText,
                  {
                    color: 'white',
                    fontFamily: fonts.Montserrat_Bold,
                    fontSize: fonts.SIZE_20,
                  },
                ]}>
                {firstLetter}
              </Text>
            </View>
          )}

          <View style={styles.imageview}>
            <Text
              style={[
                styles.name,
                {width: '70%', fontFamily: fonts.Montserrat_Bold},
              ]}>
              {item?.member_detail?.name
                ? item?.member_detail?.name
                : item?.member_detail?.phone_number}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: fonts.Montserrat_Regular,
                  color: '#777',
                  flexGrow: 1,
                  marginTop: -15,
                },
              ]}>
              {item?.member_detail?.address}
            </Text>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: fonts.Montserrat_Regular,
                  color: '#777',
                  flexGrow: 1,
                  marginTop: -15,
                },
              ]}>
              {item?.member_detail?.gender}
            </Text>
          </View>

          {/* <TouchableOpacity onPress={() => {
                    methodSelection(item);
                }}>
                    <Image
                        source={checkSelectionItem(item) ? imagePath.check1 : imagePath.uncheckk}
                        style={{ height: 25, width: 25, marginRight: 10 }} />
                </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  const memberLeave = () => {
    setMemberModalVisible(false);
    dispatch(loadingShow(true));
    const data = {
      party_id: item?.data?.id ? item?.data?.id : item?.party_key,
    };

    // console.log("data=====",data);
    // return
    dispatch(leavePartyApi(data, props?.navigation)).then(res => {
      // console.log("res----->",res);
      if (res) {
        dispatch(loadingShow(false));
        dispatch(getProfileAction());
        // props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'FirstHome' }],
        // });
      } else {
        setMemberModalVisible(false);
        dispatch(loadingShow(false));
      }
    });
  };

  useEffect(() => {
    // Handle the back button press
    const backAction = () => {
      // Show the alert when back button is pressed
      Alert.alert(
        AppConstant.appName,
        'Are you sure you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => null, // Don't do anything if 'Cancel' is pressed
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => BackHandler.exitApp(), // Exit the app if 'YES' is pressed
          },
        ],
        {cancelable: false}, // Prevent dismissing alert by tapping outside
      );
      return true; // Return true to prevent the default back button behavior
    };

    let subscription;

    if (isFocused) {
      subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    }

    return () => {
      // This is the correct way
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isFocused]);

  const ownerLeave = () => {
    setOwnerModalVisible(false);
    dispatch(loadingShow(true));
    const data = {
      party_id: item?.data?.id ? item?.data?.id : item?.party_key,
    };

    // console.log("data-------->",data);

    // return
    dispatch(leavePartyApi(data, props?.navigation)).then(res => {
      // console.log("res----->",res);
      if (res) {
        dispatch(loadingShow(false));
        dispatch(getProfileAction());

        // props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'FirstHome' }],
        // });
      } else {
        setOwnerModalVisible(false);
        dispatch(loadingShow(false));
      }
    });
  };

  const methodPullToRefresh = () => {
    setRefresh(true);
    const data = {
      party_id: item?.data?.id ? item?.data?.id : item?.party_key,
    };

    // console.log("data is here---sssss-->",data);

    dispatch(partyDetailApi(data)).then(res => {
      setRefresh(false);
      // console.log("res----->",JSON.stringify(res));
      setUserId(res?.data?.user_id);

      // console.log("userData-----",userData?.id+"userId"+userId);

      if (res) {
        setIsLoading(true);
        setPartyData(res?.data?.member);
        // props.navigation.navigate("PartyModeScreen",{item:res})
        dispatch(loadingShow(false));
      } else {
        setIsLoading(false);
        dispatch(loadingShow(false));
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setCancelModalVisible(true);
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#0B6EBC',
            width: '55%',
            borderRadius: 20,
            alignSelf: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            tintColor={'white'}
            style={{right: 5}}
            source={imagePath.notification}
          />
          <Text
            style={{
              color: 'white',
              left: 5,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: fonts.SIZE_14,
            }}>
            Send Distress Signal
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        style={{flex: 1, marginTop: 20}}
        data={partData}
        renderItem={renderItemAcept}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
        refreshControl={
          <RefreshControl
            refreshing={resfresh}
            onRefresh={methodPullToRefresh}
          />
        }
        ListHeaderComponent={
          <>
            {isLoading && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            )}
          </>
        }
        ListFooterComponent={<View style={{height: 10}}></View>}
        ListEmptyComponent={
          !isLoading ? (
            <NoDataFound NoData={'No contacts found..!'} />
          ) : (
            <View />
          )
        }
      />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          socketConnectionCheck(),
            props.navigation.navigate('PartyChat', {
              item: item,
              other_user_id: item?.data?.id ? item?.data?.id : item?.party_key,
              userId: userId,
            });
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#0B6EBC',
            width: '55%',
            borderRadius: 10,
            alignSelf: 'center',
            marginBottom: 50,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            tintColor={'white'}
            style={{right: 5}}
            source={imagePath.msgg}
          />
          <Text
            style={{
              color: 'white',
              left: 5,
              fontFamily: fonts.Montserrat_Medium,
              fontSize: fonts.SIZE_14,
            }}>
            Show Messages
          </Text>
        </View>
      </TouchableOpacity>

      {/* <View style={{ justifyContent:'center',alignItems:'center',width:'100%'}}> */}

      <AppButton
        bttTitle={'Leave Party'}
        marginBottom={10}
        backgroundColor={'#FF518E'}
        color={'white'}
        borderRadius={10}
        onPress={() => {
          // console.log("userData?.id==userId",userData?.id,"njanddjnjns"+userId);

          // return

          if (userData?.id == userId) {
            setOwnerModalVisible(true);
          } else {
            setMemberModalVisible(true);
          }

          // props.navigation.reset({
          //   index: 0,
          //   routes: [{name: 'FirstHome'}],
          // });

          // sendSelectedUsers()
        }}
      />
      {/* </View> */}

      <CancelModal
        visible={cancelModalVisible}
        onMedical={() => {
          setCancelModalVisible(false);
          props.navigation.navigate('Medical');
        }}
        onSecurity={() => {
          setCancelModalVisible(false);
          props.navigation.navigate('Security');
          //   cancleSignal()
        }}
        oncross={() => {
          setCancelModalVisible(false);
        }}
      />

      <OwnerModal
        visible={ownerModalVisible}
        onSecurity={() => {
          ownerLeave();
        }}
        oncross={() => {
          setOwnerModalVisible(false);
        }}
      />

      <MemberModal
        visible={memberModalVisible}
        onSecurity={() => {
          memberLeave();
        }}
        oncross={() => {
          setMemberModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default PartyModeScreen;
