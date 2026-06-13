import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  DeviceEventEmitter,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AppState,
  Alert,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState} from 'react';

import imagePath from '../../../theme/imagePath';
import {
  IMAGE_URL,
  kInternetError,
  MULTI_PART_HEADER,
} from '../../../appRedux/apis/commonValue';
import ImageLoadView from '../../../utils/imageLoadView';
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
} from '../../../component/socket';
import UserInfoModal from '../detailScreen/userInfoModal';
import {translateText} from '../../../utils/language';
import Colors from '../../../theme/colors';
import AppHeader from '../../../navigation/appHeader';
import {checkMicroPhonePermission} from '../../../permissions/appPermissions';
import {loadingShow} from '../../../appRedux/actions/loadingAction';
import {useDispatch, useSelector} from 'react-redux';
import {alert} from '../../../utils/alertController';
import {showToastMessage} from '../../../utils/Toast';
import {UPLOAD_CHAT_MEDIA} from '../../../appRedux/apis/endpoints';
import {post, retryUploadChatAttachment} from '../../../appRedux/apis/apiHelper';
import {showErrorMessage} from '../../../utils/helper';
import {AppConstant} from '../../../appRedux/constants/appconstant';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {KeyboardScroll} from '../../../component';
import SendComponent from './sendComponent';
import ReceiveComponent from './receiveComponent';
import styles from './styles';
import fonts from '../../../theme/fonts';
import CancelModal from './cancelModal';
import OwnerModal from '../PartyModeScreen/ownerModal';
import MemberModal from '../PartyModeScreen/memberModal';
import {leavePartyApi} from '../../../appRedux/actions/appSessionAction';
import {getProfileAction} from '../../../appRedux/actions/userSessionAction';
import GoogleSearch from '../../../utils/googleSearch';
import {useIsFocused} from '@react-navigation/native';
import {isNetworkAvailable} from '../../../appRedux/apis/network';
import {
  geoCurrentLocation,
  GetAddressFromLatLong,
} from '../../../permissions/getLocation';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let messageData = [];
let lastMsgId = 0;
let firstMsgId = 0;
const audioRecorderPlayer = new AudioRecorderPlayer();
var RNFS = require('react-native-fs');
const PartyChat = props => {
  const dispatch = useDispatch();
  const {item, OtherDetail, providerAllData, userDetail} = props?.route?.params
    ? props?.route?.params
    : false;

  // console.log("item----->", item);

  const userDataa = useSelector(state => state.session.userData);
  const {other_user_id, userData, userId} = props?.route?.params
    ? props?.route?.params
    : '';
  // console.log("userId----->", userId);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [ownerModalVisible, setOwnerModalVisible] = useState(false);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const appState = useRef(AppState.currentState);
  const [chatHistoryData, setChatHistoryData] = useState([]);
  const [firstMessageId, setFirstMessageId] = useState(firstMsgId);
  const [lastMessageId, setLastMessageId] = useState(lastMsgId);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const [audioFile, setAudioFile] = useState('');
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [recording, setRecording] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [shortHeight, setShortHeight] = useState();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [showItems, setShowItems] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    address: '',
  });
  const [searchLoc, setSearchLoc] = useState(false);
  const [currentLoc, setCurrentLoc] = useState({});
  const isFocused = useIsFocused();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const soundRef = useRef(null);
  const playInterval = useRef(null);

  const startPlayTimeInterval = () => {
    if (playInterval.current) clearInterval(playInterval.current);
    playInterval.current = setInterval(() => {
      if (soundRef.current && soundRef.current.isLoaded()) {
        soundRef.current.getCurrentTime((seconds) => {
           setCurrentTime(Math.floor(seconds));
        });
      }
    }, 1000);
  };

  const stopPlayTimeInterval = () => {
    if (playInterval.current) {
        clearInterval(playInterval.current);
        playInterval.current = null;
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      if (recording) stopRecording();
      if (playing) {
        if (soundRef.current) soundRef.current.stop();
        stopPlayTimeInterval();
        setPlaying(false);
        setPaused(false);
      }
    });

    return unsubscribe;
  }, [props.navigation, recording, playing]);

  useEffect(() => {
    socketConnectionCheck();
    // if(userData?.id!=userId){

    let receiveMsgListener = DeviceEventEmitter.addListener(
      'become_admin',
      res => {
        // console.log("receive_party_group_messageoooooooo",res);
        if (res?.data) {
          dispatch(getProfileAction());
          // props.navigation.reset({
          //     index: 0,
          //     routes: [{name: 'FirstHome'}],
          //   });
        }
      },
    );

    return () => {
      receiveMsgListener.remove();

      // };
    };
  }, []);

  useEffect(() => {
    // setIsLoading(true);
    socketConnectionCheck();

    setTimeout(() => {
      socketConnectionCheck();
    }, 1000);
    methodGetAllChat();
    let receiveMsgListener = DeviceEventEmitter.addListener(
      'receive_party_group_message',
      res => {
        // alert('1')

        // console.log("receive_party_group_messageoooooooo",res);

        if (res?.data) {
          methodReceiveMessage(res?.data);
        }
      },
    );

    return () => {
      receiveMsgListener.remove();

      messageData = [];
      setChatHistoryData([]);
      lastMsgId = 0;
      firstMsgId = 0;
    };
  }, []);

  useEffect(() => {
    const appStateManage = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        methodGetAllChat('after');
      }
      appState.current = nextAppState;
    });
    return () => {
      appStateManage.remove();
    };
  }, []);

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };
  useEffect(() => {
    socketConnectionCheck();
  }, [isFocused]);

  const methodReceiveMessage = newMessage => {
    // console.log('data received', newMessage);
    let hasDuplicate = messageData?.findIndex(d => d?.id == newMessage?.id);

    if (
      hasDuplicate == -1
      // &&
      // (newMessage?.conversation_id == userData?.conversation_id ||
      //   !('conversation_id' in userData))
    ) {
      messageData = [newMessage, ...messageData];
      setChatHistoryData(messageData);
    }

    const dic = {id: newMessage?.id};
    socketEmit(socketEvent.read_message, dic);
  };

  const methodGetAllChat = (listType = 'before') => {
    const dic = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      type: 'GROUP',
      list_type: listType,
      last_id:
        listType == 'after'
          ? messageData?.length
            ? messageData[0]?.id
            : 0
          : messageData?.length
            ? messageData[messageData?.length - 1]?.id
            : 0,
      limit: 10,
    };

    // console.log("sdsdsdddsds",dic);

    socketEmit(socketEvent.get_party_group_chats, dic, res => {
      // console.log('data of get chats', res);
      setIsLoading(false);
      if (res && res?.data && Array?.isArray(res?.data)) {
        if (listType == 'after') {
          messageData = [...res?.data, ...messageData];
        } else {
          messageData = [...messageData, ...res?.data];
        }
        setChatHistoryData(messageData);
        setFirstMessageId(messageData?.length ? messageData[0]?.id : 0);
        setLastMessageId(
          messageData?.length ? messageData[messageData?.length - 1]?.id : 0,
        );
        firstMsgId = messageData?.length ? messageData[0]?.id : 0;

        lastMsgId = messageData?.length
          ? messageData[messageData?.length - 1]?.id
          : 0;
      }
    });
  };

  const memberLeave = () => {
    setMemberModalVisible(false);
    dispatch(loadingShow(false));

    const data = {
      party_id: other_user_id,
    };

    // console.log("data=====",data);

    // return
    dispatch(leavePartyApi(data, props?.navigation)).then(res => {
      // console.log("res----->",res);
      if (res) {
        dispatch(getProfileAction());

        //  props.navigation.reset({
        //                   index: 0,
        //                   routes: [{name: 'FirstHome'}],
        //                 });
      } else {
        setMemberModalVisible(false);
        dispatch(loadingShow(false));
      }
    });
  };

  const ownerLeave = () => {
    setOwnerModalVisible(false);
    dispatch(loadingShow(true));
    const data = {
      party_id: other_user_id,
    };

    // console.log("data-------->",data);

    // return
    dispatch(leavePartyApi(data, props?.navigation)).then(res => {
      // console.log("res----->",res);
      if (res) {
        dispatch(loadingShow(false));
        dispatch(getProfileAction());

        //  props.navigation.reset({
        //                   index: 0,
        //                   routes: [{name: 'FirstHome'}],
        //                 });
      } else {
        setOwnerModalVisible(false);
        dispatch(loadingShow(false));
      }
    });
  };

  const methodSendMessage = text => {
    setShowItems(false);
    const dic = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      message: text,
      type: 'GROUP',
      message_type: 'TEXT',
    };

    // console.log("dic--jjjj--->", dic);

    setMessage('');
    socketEmit(socketEvent.send_party_group_message, dic, res => {
      // console.log('res----hhhhh---', res);

      if (res && res?.data) {
        messageData = [res?.data, ...messageData];
        setChatHistoryData(messageData);
        scrollToTop();
      }
    });
  };

  const chooseImage = async type => {
    if (type == 'video') {
      let microPermission = await checkMicroPhonePermission();
      if (!microPermission) {
        return;
      }
    }
    props.navigation.navigate('ImageController', {
      isCircle: true,
      mediaType: type,
      onSuccess: res => {
        // console.log("res---->",res);

        if (res?.path) {
          if (res?.mime.includes('image')) {
            if (res?.size <= 5242880) {
              sendMedia(res, 'IMAGE');
              dispatch(loadingShow(true));
            } else {
              showToastMessage('Please upload an image size lower than 5 Mb');
            }
          } else {
            if (res?.duration > 30000) {
              alert('Video file size must be in 30 sec.');
              dispatch(loadingShow(false));
              return;
            } else {
              dispatch(loadingShow(true));
              // getCompressedVideo(res?.path, (data) => {
              sendMedia(res?.path, 'VIDEO');
              // });
              // sendMedia(res, 'VIDEO');
            }
          }
        }
        // if (res.path) {
        //     setSelectedImage(res.path);
        // }
      },
    });
  };

  const sendMedia = async (imgData, type) => {
    // console.log('image data======<', imgData);
    // console.log('type type======<', type);
    let formdata = new FormData();
    formdata.append(`chatmedia`, {
      uri: type == 'IMAGE' ? imgData.path : imgData,
      name: type == 'IMAGE' ? 'test.jpg' : 'video.mp4',
      type: type == 'IMAGE' ? 'image/jpg' : 'video/mp4',
    });
    formdata.append('media_type', type);
    // console.log('formdataformdata====<', JSON.stringify(formdata));
    // return
    // try {
    //   const response = await post({
    //     url: UPLOAD_CHAT_MEDIA,
    //     data: formdata,
    //     header: MULTI_PART_HEADER,
    //   });

    try {
      const response = await retryUploadChatAttachment(
        () =>
          post({
            url: UPLOAD_CHAT_MEDIA,
            data: formdata,
            header: MULTI_PART_HEADER,
          }),
        3, // 🔁 retry count
        1000, // ⏱ delay (ms)
      );

      // console.log("hbhvbhvhvhvhvhvhv", response);
      dispatch(loadingShow(false));
      if (response && response.status == true) {
        const url = `${response?.data?.media}`;
        getMessageSend(type, url, response?.data?.media_thumb);
        dispatch(loadingShow(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage();
    }
  };

  const sendAudio = async (imgData, type) => {
    // console.log('image data======<', imgData);
    // console.log('type type======<', type);

    // return .
    let formdata = new FormData();
    // formdata.append('chatmedia',imgData);

    formdata.append('chatmedia', {
      uri: imgData,
      // uri: audioFile,
      type: 'audio/m4a',
      name: 'audio.m4a',
    });
    formdata.append('type', type);
    // console.log('formdataformdata====<', JSON.stringify(formdata));
    // return
    try {
      dispatch(loadingShow(true));
      const response = await post({
        url: UPLOAD_CHAT_MEDIA,
        data: formdata,
        header: MULTI_PART_HEADER,
      });
      // console.log("hbhvbhvhvhvhvhvhv", response);
      // return
      dispatch(loadingShow(false));
      if (response && response.status == true) {
        const url = `${response?.data?.media}`;
        getMessageSend(type, url, response?.data?.media);
        dispatch(loadingShow(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage();
    }
  };

  const getMessageSend = (type, url, thumb_url) => {
    socketConnectionCheck();
    let userData = global?.userData;
    let data = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      message: url ?? message,
      message_type: type,
      thumb_image: thumb_url,
      type: 'GROUP',
      other_data: '',
    };
    // console.log('data of send -----', data);
    setMessage('');
    // socketEmit(socketEvent.send_message, data);
    socketEmit(socketEvent.send_party_group_message, data, res => {
      // console.log('res-------', res);

      if (res && res?.data) {
        messageData = [res?.data, ...messageData];
        setChatHistoryData(messageData);
        scrollToTop();
      }
    });
    // DeviceEventEmitter.emit('msggg');
  };

  const onScrollPage = () => {
    if (!isLoading && firstMsgId != 0 && firstMsgId != lastMsgId) {
      // setIsLoading(true);
      methodGetAllChat('before');
    }
  };

  const renderChat = ({item, index}) => {
    // console.log("renderChat----------------->", item);

    return (
      <View key={index} style={styles.view_render}>
        {/* {console.log("item?.user_id item?.user_id ",item?.user_id,global?.userData?.id )
          } */}
        {item?.user_id === global?.userData?.id ? (
          <View>{SendComponent(item, props)}</View>
        ) : (
          <View>{ReceiveComponent(item, props)}</View>
        )}
      </View>
    );
  };

  const PagingLoader = () => {
    return <ActivityIndicator size={'large'} />;
  };

  useEffect(() => {
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      notificationIcon: false,
      notification: imagePath.Groupmember,
      Title: 'My Party',
      skip: 'Leave',
      fontSizee: fonts.SIZE_15,
      colorss: '#FF518E',
      fontFamilyy: fonts.Montserrat_SemiBold,
      skipClick: () => {
        if (userDataa?.id == userId) {
          setOwnerModalVisible(true);
        } else {
          setMemberModalVisible(true);
        }
        // alert("hello")
        // return
        // props.navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'FirstHome' }],
        // });
      },
      heightRightImg: 44,
      widthRightImg: 44,

      leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });
  }, []);

  const secondsToMinutes = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Ensure the seconds are always two digits
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  };

  const startRecording = async () => {
    // setShowItems(false)
    // console.log("startRecording------>");

    setShowRecording(true);

    if (Platform.OS === 'android') {
      const hasPermission = await checkMicroPhonePermission();
      if (!hasPermission) return;
    }

    // Unique file path for recording 1
    const path = Platform.select({
      ios: 'recording1.m4a',
      android: `${RNFS.DocumentDirectoryPath}/recording1.m4a`,
    });
    
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
    };

    setCurrentTime(0);
    const result = await audioRecorderPlayer.startRecorder(path, audioSet); // Pass the unique path for recording 1
    // console.log("result---->", result);

    setRecording(true);
    audioRecorderPlayer.addRecordBackListener(e => {
      setCurrentTime(Math.floor(e.currentPosition / 1000));
      if (Math.floor(e.currentPosition) / 1000 > 20) {
        stopRecording();
      }
    });
  };

  const stopRecording = async () => {
    setShowItems(false);
    const result = await audioRecorderPlayer.stopRecorder();

    audioRecorderPlayer.removeRecordBackListener();
    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }
    setAudioFile(result);
  };

  const stopRecording1 = async () => {
    setShowItems(false);
    setRecording(false);
    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }
    sendAudio(audioFile, 'AUDIO');
  };

  const cancelRecording = async () => {
    setShowItems(false);
    const result = await audioRecorderPlayer.stopRecorder();

    audioRecorderPlayer.removeRecordBackListener();
    setRecording(false);
    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }
    setAudioFile('');
    setPlaying(false);
    setPaused(false);
  };

  const playAudio = async () => {
    if (paused && soundRef.current) {
      soundRef.current.play(success => {
        setPlaying(false);
        setPaused(false);
        setCurrentTime(0);
        stopPlayTimeInterval();
        if (soundRef.current) {
          soundRef.current.release();
          soundRef.current = null;
        }
      });
      setPlaying(true);
      setPaused(false);
      startPlayTimeInterval();
    } else {
      if (soundRef.current) {
        soundRef.current.release();
      }
      const sound = new Sound(audioFile, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        soundRef.current = sound;
        setPlaying(true);
        setPaused(false);
        startPlayTimeInterval();

        sound.play(success => {
          setPlaying(false);
          setPaused(false);
          setCurrentTime(0);
          stopPlayTimeInterval();
          sound.release();
          soundRef.current = null;
        });
      });
    }
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
    stopPlayTimeInterval();
    setPaused(true);
    setPlaying(false);
  };

  const curentLocation = async () => {
    const isConnected = await isNetworkAvailable();
    return new Promise((resolve, reject) => {
      if (isConnected === false) {
        showToastMessage(kInternetError);
        resolve(false);
      } else {
        geoCurrentLocation(1, data => {
          if (data === null || data === undefined) {
            resolve(false);
          }
          if (data.latitude && data.longitude) {
            GetAddressFromLatLong(data.latitude, data.longitude, address => {
              let curentAddress = {};
              curentAddress.address = address;
              curentAddress.latAdd = data.latitude;
              curentAddress.longAdd = data.longitude;
              global.coordinates = {
                latitude: curentAddress.latAdd,
                longitude: curentAddress?.longAdd,
                address: curentAddress?.address,
              };
              setLocation({
                ...location,
                latitude: curentAddress.latAdd,
                longitude: curentAddress?.longAdd,
                address: curentAddress?.address,
              });

              console.log('location----->', location);

              resolve(curentAddress);
            });
          } else {
            resolve(false);
          }
        });
      }
    });
  };

  const curentLocation1 = async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        const locationData = await curentLocation();
        const dic = {
          latitude: locationData?.latAdd ? locationData?.latAdd : '',
          longitude: locationData?.longAdd ? locationData?.longAdd : '',
        };
        let latitude = dic?.latitude;
        let longitude = dic?.longitude;
        // let address = text?.address
        socketConnectionCheck();
        let userData = global?.userData;
        let data = {
          user_id: global?.userData?.id,
          other_user_id: other_user_id,
          message: '',
          latitude: latitude,
          longitude: longitude,
          message_type: 'LOCATION',
          type: 'GROUP',
          other_data: '',
        };
        dispatch(loadingShow(true));
        socketEmit(socketEvent.send_party_group_message, data, res => {
          if (res && res?.data) {
            dispatch(loadingShow(false));
            messageData = [res?.data, ...messageData];
            setChatHistoryData(messageData);
            scrollToTop();
          } else {
            dispatch(loadingShow(false));
          }
        });
      })();
    });
  };

  const sendLocationFunction = () => {
    setShowItems(false);
    setSearchLoc(true);
  };

  const sendLocation = text => {
    let latitude = text?.latitude;
    let longitude = text?.longitude;
    let address = text?.address;
    socketConnectionCheck();
    let userData = global?.userData;
    let data = {
      user_id: global?.userData?.id,
      other_user_id: other_user_id,
      message: '',
      latitude: latitude,
      longitude: longitude,
      address: address,
      message_type: 'LOCATION',
      // thumb_image: thumb_url,
      type: 'GROUP',
      other_data: '',
    };
    dispatch(loadingShow(true));

    socketEmit(socketEvent.send_party_group_message, data, res => {
      // console.log('res-------', res);

      if (res && res?.data) {
        dispatch(loadingShow(false));
        messageData = [res?.data, ...messageData];
        setChatHistoryData(messageData);
        scrollToTop();
      } else {
        dispatch(loadingShow(false));
      }
    });

    // console.log("data----sss-->",data);
  };
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS == 'android') {
      Keyboard.addListener('keyboardDidShow', nativeEvent => {
        console.log('keyboardDidShow===', nativeEvent.endCoordinates.height);
        setHeight(nativeEvent.endCoordinates.height);
      });
      Keyboard.addListener('keyboardDidHide', nativeEvent => {
        console.log('keyboardDidHide===', nativeEvent.endCoordinates.height);

        setHeight(nativeEvent.endCoordinates.height);
      });
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight + 20 : height / 3}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            inverted
            data={chatHistoryData}
            renderItem={renderChat}
            keyExtractor={(item, index) => index.toString()}
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            onEndReached={onScrollPage}
            onEndReachedThreshold={0.2}
            ListFooterComponent={<View>{isLoading && <PagingLoader />}</View>}
          />

          {!recording ? (
            <View style={{marginBottom: Platform.OS === 'ios' ? insets.bottom : 30, width: '100%'}}>
              <View style={[styles.footer_view, {marginBottom: shortHeight}]}>
                <TouchableOpacity
                  onPress={() => {
                    setShowItems(!showItems);
                  }}>
                  <Image
                    // style={styles.camera_pic}
                    source={imagePath.addmedia}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <View style={styles.textInput_view}>
                  <TextInput
                    style={styles.textInput_style}
                    placeholder={translateText('Write_a_message')}
                    multiline
                    //   maxLength={500}
                    keyboardType={'default'}
                    underlineColorAndroid="transparent"
                    value={message}
                    onChangeText={value => setMessage(value)}
                  />
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                      // Keyboard.dismiss()

                      if (message == '') {
                        showToastMessage('Please enter message');
                        return;
                      }

                      if (message?.trim()) {
                        methodSendMessage(message?.trim());
                      }
                    }}>
                    <Image
                      // style={styles.send_pic}
                      source={imagePath.btn_send}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {searchLoc && (
                <GoogleSearch
                  showGoogleSearch={searchLoc}
                  onBack={() => setSearchLoc(false)}
                  onSubmit={data => {
                    // console.log('onSubmitData---sssss--HomeScreen--', data);
                    // methodProfileRequest('address', data?.address);
                    setCurrentLoc(data);
                    setSearchLoc(false);

                    sendLocation(data);
                  }}
                />
              )}

              {showItems ? (
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    onPress={
                      () => {
                        setShowItems(false), curentLocation1();
                      }
                      // sendLocationFunction()
                    }
                    activeOpacity={0.6}
                    style={[styles.actionButton, {backgroundColor: '#57E57B'}]}>
                    {/* <Icon name="location-on" size={25} color="#fff" /> */}
                    <Image
                      // style={styles.send_pic}
                      source={imagePath.locationon}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.buttonText}>Send Location</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setShowItems(false), chooseImage('photo');
                      // Alert.alert(AppConstant.appName, "Please select image", [
                      // { text: "Cancel", onPress: () => { }, style: "cancel" },
                      // {
                      //   text: "Image",
                      //   onPress: () =>
                      //     chooseImage("photo"),
                      // },

                      // ])
                    }}
                    activeOpacity={0.6}
                    style={[styles.actionButton, {backgroundColor: '#FF518E'}]}>
                    {/* <Icon name="photo-camera" size={25} color="#fff" /> */}
                    <Image
                      // style={styles.send_pic}
                      source={imagePath.photocamera}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.buttonText}>Send Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      // setShowItems(false)
                      startRecording()
                    }
                    activeOpacity={0.6}
                    style={[styles.actionButton, {backgroundColor: '#2FC5F7'}]}>
                    {/* <Icon name="mic" size={25} color="#fff" /> */}
                    <Image
                      // style={styles.send_pic}
                      source={imagePath.microphone}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.buttonText}>Send Audio</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <View
              style={{
                marginBottom: 30,
                paddingHorizontal: 20,
                flexDirection: 'row',
                height: 40,
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  cancelRecording();
                }}>
                <Image source={imagePath.delete} />
              </TouchableOpacity>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text>recording</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tapToRecord_text,
                    {paddingHorizontal: 20, marginTop: 5},
                  ]}>
                  {recording
                    ? '' + secondsToMinutes(currentTime)
                    : audioFile
                      ? secondsToMinutes(currentTime)
                      : ''}
                </Text>
              </View>

              {showItems ? (
                <TouchableOpacity
                  onPress={() => {
                    stopRecording();
                  }}>
                  <Image
                    style={{height: 30, width: 30}}
                    source={imagePath.pause_btn}
                  />
                </TouchableOpacity>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() => {
                      let data = {
                        item: {media: audioFile, type: 'AUDIO'},
                      };
                      props.navigation.navigate('StoryView', {item: data});
                    }}>
                    <Image
                      style={{height: 30, width: 30, right: 10}}
                      source={imagePath.play_btn}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      stopRecording1();
                    }}>
                    <Image
                      style={{height: 25, width: 25}}
                      resizeMode="contain"
                      source={imagePath.btn_send}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        <CancelModal
          visible={cancelModalVisible}
          onCancel={() => {
            setCancelModalVisible(false);
          }}
          onConfirm={() => {
            cancleSignal();
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PartyChat;
