import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Platform,
  Linking,
  Keyboard,
} from 'react-native';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import {AppButton} from '../../../component';
import {useDispatch, useSelector} from 'react-redux';
import {getAllContact} from '../../../permissions/getContact';
import NoDataFound from '../../../component/noDataFound';
import {
  syncContactNumber,
  updatePartyVenue,
} from '../../../appRedux/actions/appSessionAction';
import {showToastMessage} from '../../../utils/Toast';
import {translateText} from '../../../utils/language';
import {useIsFocused} from '@react-navigation/native';
import {socketConnectionCheck} from '../../../component/socket';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {getProfileAction} from '../../../appRedux/actions/userSessionAction';
let searchTime = null;
let selectedUserIds = [];

const InviteToParty = props => {
  const selected_venueId = useSelector(
    state => state.session.selected_venue_id,
  );
  console.log('selected_venueId--------->', selected_venueId);

  const {selectedVenueId} = props?.route?.params ? props?.route?.params : false;
  console.log('selectedVenueId---->', selectedVenueId);

  const [placeHide, setPlaceHide] = useState(false);
  const dispatch = useDispatch();
  const loaderShow = useSelector(state => state.loading.show);
  const [showButton, setShowButton] = useState(false);
  const isFocused = useIsFocused();
  const [inviteContact, setInviteContact] = useState([]);
  const [selectedId, sertSelectedId] = useState([]);

  const [oldSearchData, setOldSearchData] = useState([]);
  const [userSelected, setUserSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  useEffect(() => {
    dispatch(loadingShow(true));
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      Title: translateText('Invite_to_party'),
      leftIcon: true,
      notificationIcon: false,
      heightRightImg: 35,
      widthRightImg: 35,
      notification: imagePath.Groupuser,
      leftClick: () => {
        props.navigation.goBack();
      },
      notificationClick: () => {},
      leftImage: imagePath.back,
    });
  }, []);

  useEffect(() => {
    updatePartyVenueData();
  }, [selectedVenueId]);

  useEffect(() => {
    getAllContact(res => {
      if (res) {
        setIsLoading(true);
        methodSyncContact(res);
      } else {
        setIsLoading(false);
      }
    });
    return () => {
      searchTime = null;
    };
  }, [isFocused]);

  const methodSyncContact = perData => {
    let request = perData?.length
      ? perData?.map(item => {
          return item?.phoneNum;
        })
      : [];

    let dic = {
      contacts: request.toString(),
    };
    dispatch(syncContactNumber(dic)).then(res => {
      if (res?.status) {
        dispatch(loadingShow(false));
        setInviteContact(res?.data);
        setOldSearchData(res?.data);
      }
      dispatch(loadingShow(false));
      setIsLoading(false);
    });
  };
  console.log('=====>', selectedVenueId, selected_venueId, '=======>');

  const updatePartyVenueData = () => {
    let json = {
      venue_id: selectedVenueId ? selectedVenueId : selected_venueId,
    };
    console.log('data--------->>>>>>>>', json);

    dispatch(updatePartyVenue(json)).then(res => {
      console.log('ress--------->>>>>>>>', res);

      if (res) {
        // props.navigation.navigate('PartyDetails')
        dispatch(getProfileAction());
      }
    });
  };

  const methodMatchUnAvailableUser = async (list, oldContact) => {
    let arr = [...oldContact];
    const mobileNumbers = new Set(list.data.map(item => item.phone_number));
    const filteredArr = arr.filter(item => !mobileNumbers.has(item.phoneNum));
    let sortedArr = filteredArr.sort((a, b) => {
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0;
    });
    setInviteContact(sortedArr);
    setOldSearchData(sortedArr);
  };

  const checkSelectionItem = item => {
    let tempArr = [...userSelected];
    let userIdx = tempArr?.findIndex(
      data => data?.phone_number == item?.phone_number,
    );
    return userIdx != -1 ? true : false;
  };

  const searchTextMethod = e => {
    let text = e.toLowerCase();
    let trucks = [...oldSearchData];
    let filteredName = trucks.filter(truck => {
      return truck?.name?.toLowerCase()?.includes(text);
    });
    if (!text || text === '') {
      setInviteContact(oldSearchData);
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      setInviteContact([]);
    } else if (Array.isArray(filteredName)) {
      setInviteContact(filteredName);
    }
  };

  const methodSearchKey = text => {
    if (text == ' ') {
      return;
    }
    setText(text);
    if (searchTime) {
      clearTimeout(searchTime);
    }
    searchTime = setTimeout(() => {
      searchTextMethod(text);
    }, 200);
  };

  const sendSelectedUsers = () => {
    props?.navigation?.navigate('SelectedVenue', {selectedId: selectedId});
  };

  const methodSelection = item => {
    let tempArr = [...userSelected];
    let userIdx = tempArr?.findIndex(
      data => data?.phone_number == item?.phone_number,
    );
    if (userIdx == -1) {
      tempArr.push(item);
    } else {
      tempArr?.splice(userIdx, 1);
    }
    setUserSelected(tempArr);

    const selectedIds = tempArr.map(user => user.id);
    sertSelectedId(selectedIds);
  };

  const sendSMS = async singleInvite => {
    try {
      let numArr = [];
      if (singleInvite) {
        numArr = singleInvite;
      } else {
        numArr =
          userSelected?.length &&
          userSelected?.map(item => item?.phoneNum).join(',');
      }
      const message = getAppSettingData?.data?.share_url
        ? getAppSettingData?.data?.share_url
        : ``;

      const encodedMessage = encodeURIComponent(message);
      const separator = Platform.OS === 'ios' ? '&' : '?';
      const url = `sms:${numArr}${separator}body=${getAppSettingData?.data?.share_msg}${'\n'}${encodedMessage}`;
      Linking.openURL(url);
      setTimeout(() => {
        setUserSelected([]);
      }, 3000);
    } catch (error) {
      console.error('Failed to open SMS app:', error);
    }
  };

  const methodGenerateLetterPicture = key => {
    let name = key;
    if (name?.length) {
      return name.slice(0, 1);
    } else {
      return '';
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardStatus(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardStatus(0);
    });
    const hideSubscriptionDid = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);
  const renderItemAcept = ({item, index}) => {
    let firstLetter = methodGenerateLetterPicture(item?.name);
    return (
      <View key={index} style={styles.card}>
        <View style={styles.flatlistmainview}>
          {item?.profile_picture ? (
            <ImageLoadView
              style={styles.nameview}
              source={{
                uri: IMAGE_URL + item?.profile_picture,
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
              {item.name ? item?.name : item?.phone_number}
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
              {item?.address}
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
              {item?.gender}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              methodSelection(item);
            }}>
            <Image
              source={
                checkSelectionItem(item) ? imagePath.check1 : imagePath.uncheckk
              }
              style={{height: 25, width: 25, marginRight: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHere_View}>
        <Image
          source={imagePath.search}
          style={styles.search_icon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.textInputStyle}
          placeholder={translateText('Search')}
          placeholderTextColor={Colors.secondary.GREY_CHATEAU}
          value={text}
          onChangeText={text => {
            if (text.trim() == '') {
              setPlaceHide(false);
            } else {
              setPlaceHide(true);
            }
            methodSearchKey(text);
          }}
          blurOnSubmit={() => {
            methodSearchKey(search);
          }}
          returnKeyType="search"
        />

        {placeHide ? (
          <TouchableOpacity
            onPress={() => {
              setPlaceHide(false);
              setInviteContact(oldSearchData);
              setText('');
            }}>
            <Image
              source={imagePath.cancle}
              style={{right: 10}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>

      <FlatList
        style={{flex: 1, marginTop: 20}}
        data={inviteContact}
        renderItem={renderItemAcept}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
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

      {!keyboardStatus && userSelected?.length > 0 ? (
        <>
          <AppButton
            bttTitle={translateText('Invite_users')}
            marginBottom={10}
            color={'white'}
            borderRadius={10}
            backgroundColor={'#0B6EBC'}
            onPress={() => {
              sendSelectedUsers();
            }}
          />
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

export default InviteToParty;
