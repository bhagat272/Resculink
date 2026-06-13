import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
  ScrollView,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import styles from './styles';
import imagePath from '../../../theme/imagePath';
import LogoutModal from './logoutModal';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteAccountApi,
  logOutApi,
  saveUserData,
} from '../../../appRedux/actions/userSessionAction';
import {
  DEVICE_INFO,
  hideLoader,
  showErrorMessage,
  showLoader,
} from '../../../utils/helper';
import DeleteAccountModal from './deleteAccountModal';
import {
  IMAGE_URL,
  JSON_HEADER,
  klocation,
} from '../../../appRedux/apis/commonValue';
import ImageLoadView from '../../../utils/imageLoadView';
import Colors from '../../../theme/colors';
import {
  GetAddressFromLatLong,
  geoCurrentLocation,
} from '../../../permissions/getLocation';
import {showToastMessage} from '../../../utils/Toast';
import {isNetworkAvailable} from '../../../appRedux/apis/network';
import {setData} from '../../../appRedux/apis/keyChain';
import {
  UPDATE_DEVICE_TOKEN,
  UPDATE_NOTIFICATION_STATUS,
} from '../../../appRedux/apis/endpoints';
import {post} from '../../../appRedux/apis/apiHelper';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {
  setAppSessionReducer,
  updateNotification,
} from '../../../appRedux/actions/appSessionAction';
import {updateDeviceToken} from '../../../permissions/notificationPermissions';
import {NOTIFICATION_COUNTT} from '../../../appRedux/constants/appSessionType';
import fonts from '../../../theme/fonts';
import AppHeader from '../../../navigation/appHeader';
import {translateText} from '../../../utils/language';
import {socketConnectionCheck} from '../../../component/socket';

const ProfileScreen = props => {
  const dispatch = useDispatch();
  // let userData = await getData(kUserData);
  //
  let userType = global.user_type;
  // console.log("userType----->",userType);

  const loaderShow = useSelector(state => state.loading.loadButton);
  const [isLoading, setIsLoading] = useState(false);
  const userData = useSelector(state => state.session.userData);
  const [guestUser, setGuestUser] = useState(false);
  // console.log('userData------>>>>>', userData);
  const [toggle, setToggle] = useState(
    global?.userData?.is_notified == 0 ? false : true,
  );
  // const [toggle, setToggle] = useState();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      Title: translateText('Profile'),
      leftIcon: true,
      // titleColor:"white",
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
    console.log('DeviceInfo====', {DEVICE_INFO});
  }, []);

  useEffect(() => {
    if (global?.isGuestUser) {
      setGuestUser(true);
    }
  }, []);

  const methodLogOut = async () => {
    let req = {
      ...DEVICE_INFO,
      user_type: userType,
    };
    console.log('data-------->', req);
    setIsLoading(true);
    dispatch(logOutApi(req)).finally(() => {
      setIsLoading(false);
      setLogoutModalVisible(false);
    });
  };

  const methodSetNotificationPermission = permission => {
    let dic = {
      is_notified: toggle ? 0 : 1,
      // type: "msg_notification",
    };
    // console.log("dic is ------>",dic);
    // return
    dispatch(updateNotification(dic));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.container, {marginTop: 0}]}>
        {/* <Text style={styles.profileText}>Profile</Text> */}
        {/* <View style={{ marginTop: 30 }}>
            <View style={styles.profileImage}> */}
        {/* {userData?.profile_picture ?
                <ImageLoadView
                  source={{ uri: IMAGE_URL + userData?.profile_picture }}
                  resizeMode="cover"
                  style={styles.profileImage}
                />
                :
                <Image source={imagePath.profileImage} style={styles.profileImage} resizeMode="cover" />
  
              } */}
        {/* <Image source={imagePath.profileImage} style={styles.profileImage} resizeMode="cover" />

            </View>
          </View> */}

        {/* <View style={styles.userDataView}>
            <Text style={styles.userName} numberOfLines={1}>{userData?.name}</Text>
            <Text style={styles.emailText} numberOfLines={1}>{userData?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileTouch} activeOpacity={0.8} onPress={() => {
            if (userType == "business") {
              props.navigation.navigate("EditProfile")
            }
            else {
              props.navigation.navigate("EditProfileCustomer")
            }
  
          }}>
            <Image source={imagePath.edit_profile_blue} style={styles.editProfileImage} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity > */}

        <View
          style={{flexDirection: 'row', paddingHorizontal: 20, marginTop: 0}}>
          <View style={{flex: 0.9, flexDirection: 'row'}}>
            {/* <TouchableOpacity onPress={() => {
                  // console.log("global.user_type",global.user_type);
                  
                  if(global.user_type=="user"){
                  props.navigation.navigate("EditProfile")
                }
                  else{
                    props.navigation.navigate("EditProfileProvider")
                  }
                }}> */}

            <ImageLoadView
              source={
                userData?.profile_picture
                  ? {uri: IMAGE_URL + userData?.profile_picture}
                  : imagePath.profileImage1
              }
              resizeMode="cover"
              style={{
                height: 70,
                width: 70,
                borderRadius: userData?.profile_picture ? 22 : 70 / 2,
              }}
            />
            {/* </TouchableOpacity> */}

            <View style={{flex: 0.95, paddingHorizontal: 10}}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: fonts.Montserrat_SemiBold,
                  fontSize: fonts.SIZE_18,
                  color: '#1E2022',
                }}>
                {userData?.name}
              </Text>
              <Text
                style={{
                  color: '#1E2022',
                  fontFamily: fonts.Montserrat_Regular,
                  fontSize: fonts.SIZE_14,
                }}>
                {userData?.email}
              </Text>
            </View>
          </View>

          <View style={{flex: 0.2}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (global.user_type == 'user') {
                  props.navigation.navigate('EditProfile');
                } else {
                  props.navigation.navigate('EditProfileProvider');
                }
              }}>
              <Image
                source={imagePath.edit}
                // resizeMode="contain"
                style={{height: 50, width: 50}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <Text style={styles.accountText}>{translateText('Account')}</Text>
          <View style={styles.accountView}>
            {global.user_type == 'user' ? (
              <TouchableOpacity
                style={[styles.overallTouch, {marginBottom: 10}]}
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.navigate('DistressSignalHistory');
                }}>
                <Image
                  source={imagePath.history}
                  resizeMode="contain"
                  style={styles.overallRatingImage}
                />
                <Text style={styles.overallText}>
                  {translateText('Distress_signal_history')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.overallTouch, {marginBottom: 10}]}
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.navigate('ManageVenue');
                }}>
                <Image
                  source={imagePath.history}
                  resizeMode="contain"
                  style={styles.overallRatingImage}
                />
                <Text style={styles.overallText}>
                  {translateText('Manage_venues')}
                </Text>
              </TouchableOpacity>
            )}

            {userType == 'provider' ? (
              <TouchableOpacity
                style={[styles.overallTouch, {marginBottom: 10}]}
                activeOpacity={0.8}
                onPress={() => {
                  props.navigation.navigate('CompletedTask');
                }}>
                <Image
                  source={imagePath.complete}
                  resizeMode="contain"
                  style={styles.overallRatingImage}
                />
                <Text style={styles.overallText}>
                  {translateText('Completed_tasks')}
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}

            <View style={styles.notification}>
              <Image
                source={imagePath.notificationSettingsImage}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              <Text style={styles.overallText}>
                {translateText('Notification_settings')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setToggle(!toggle);
                  methodSetNotificationPermission(!toggle);
                }}>
                <Image
                  source={!toggle ? imagePath.toggle_off : imagePath.toggle_on}
                  resizeMode="contain"
                  style={styles.toggleImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.settingText}>{translateText('Others')}</Text>
          <View style={styles.settingsView}>
            <TouchableOpacity
              style={styles.overallTouch}
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('ChangePassword');
              }}>
              <Image
                source={imagePath.changePasswordImage}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              <Text style={styles.overallText}>
                {translateText('Change_Password')}
              </Text>
              <Image
                source={imagePath.nextImage}
                resizeMode="contain"
                style={styles.nextImage}
              />
            </TouchableOpacity>
            <View style={styles.lineView} />
            <TouchableOpacity
              style={styles.overallTouch}
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('PrivacyPolicy', {
                  title: 'About Us',
                });
              }}>
              <Image
                source={imagePath.aboutImage}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              <Text style={styles.overallText}>{translateText('About')}</Text>
              <Image
                source={imagePath.nextImage}
                resizeMode="contain"
                style={styles.nextImage}
              />
            </TouchableOpacity>
            <View style={styles.lineView} />
            <TouchableOpacity
              style={styles.overallTouch}
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('PrivacyPolicy', {
                  title: translateText('Privacy_Policy'),
                });
              }}>
              <Image
                source={imagePath.privacyPolicyImage}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              <Text style={styles.overallText}>
                {translateText('Privacy_Policy')}
              </Text>
              <Image
                source={imagePath.nextImage}
                resizeMode="contain"
                style={styles.nextImage}
              />
            </TouchableOpacity>
            <View style={styles.lineView} />
            <TouchableOpacity
              style={styles.overallTouch}
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.navigate('PrivacyPolicy', {
                  title: translateText('T_C'),
                });
              }}>
              <Image
                source={imagePath.termsConditions}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              <Text style={styles.overallText}>{translateText('T_C')}</Text>
              <Image
                source={imagePath.nextImage}
                resizeMode="contain"
                style={styles.nextImage}
              />
            </TouchableOpacity>
            <View style={styles.lineView} />

            <TouchableOpacity
              style={styles.overallTouch}
              activeOpacity={0.8}
              onPress={() => {
                setLogoutModalVisible(true);
              }}>
              <Image
                source={imagePath.logoutImage}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              {/* {isLoading ? */}

              <Text style={styles.overallText}>{translateText('Logout')}</Text>

              <Image
                source={imagePath.nextImage}
                resizeMode="contain"
                style={styles.nextImage}
              />
            </TouchableOpacity>
            <View style={styles.lineView} />
            <TouchableOpacity
              style={styles.notification}
              activeOpacity={0.8}
              onPress={() => {
                setDeleteModalVisible(true);
              }}>
              <Image
                source={imagePath.deleteAccountImage}
                resizeMode="contain"
                style={styles.overallRatingImage}
              />
              <Text style={styles.overallText}>
                {translateText('Delete_account')}
              </Text>
              <Image
                source={imagePath.nextImage}
                resizeMode="contain"
                style={styles.nextImage}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <LogoutModal
          visible={logoutModalVisible}
          onCancel={() => {
            setLogoutModalVisible(false);
          }}
          onConfirm={() => {
            //   dispatch(setAppSessionReducer(NOTIFICATION_COUNTT, 0))
            if (!isLoading) {
              methodLogOut();
            }
            // props.navigation.navigate('Welcome');
          }}
        />

        <DeleteAccountModal
          visible={deleteModalVisible}
          onCancel={() => {
            setDeleteModalVisible(false);
          }}
          onConfirm={() => {
            setDeleteModalVisible(false);
            props.navigation.navigate('DeleteAccount');
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
