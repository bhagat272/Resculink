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
  Dimensions,
  Keyboard,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import fonts from '../../../theme/fonts';
import CustomDropdown from '../../../component/picker';
import {AppButton, KeyboardScroll} from '../../../component';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppInput from '../../../component/commonTextInputs';
import Colors from '../../../theme/colors';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {
  guestbehaviorApi,
  prohibitedApi,
  saveSecurityAssistanceApi,
} from '../../../appRedux/actions/appSessionAction';
import {showToastMessage} from '../../../utils/Toast';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {useNavigation} from '@react-navigation/native';
import {checkMicroPhonePermission} from '../../../permissions/appPermissions';
import {translateText} from '../../../utils/language';
import {socketConnectionCheck} from '../../../component/socket';
import {getProfileAction} from '../../../appRedux/actions/userSessionAction';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
const audioRecorderPlayer = new AudioRecorderPlayer();
const audioRecorderPlayer1 = new AudioRecorderPlayer();
var RNFS = require('react-native-fs');
const Security = props => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.session.userData);
  // console.log("userData---->",userData);
  const {width, height} = Dimensions.get('window');
  const [gender, setGender] = useState('');
  const [behavior, setBehavior] = useState('');
  const [prohibiteddata, setProhibitedData] = useState('');
  const [guestBehavior, setGuestBehavior] = useState([]);
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  const flatListRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFile, setAudioFile] = useState('');
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showRecording, setShowRecording] = useState(false);

  const [recording1, setRecording1] = useState(false);
  const [currentTime1, setCurrentTime1] = useState(0);
  const [audioFile1, setAudioFile1] = useState('');
  const [playing1, setPlaying1] = useState(false);
  const [paused1, setPaused1] = useState(false);
  const [showRecording1, setShowRecording1] = useState(false);

  const soundRef = useRef(null);
  const soundRef1 = useRef(null);
  const playInterval = useRef(null);
  const playInterval1 = useRef(null);

  const startPlayTimeInterval = () => {
    if (playInterval.current) clearInterval(playInterval.current);
    playInterval.current = setInterval(() => {
      if (soundRef.current && soundRef.current.isLoaded()) {
        soundRef.current.getCurrentTime(seconds => {
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

  const startPlayTimeInterval1 = () => {
    if (playInterval1.current) clearInterval(playInterval1.current);
    playInterval1.current = setInterval(() => {
      if (soundRef1.current && soundRef1.current.isLoaded()) {
        soundRef1.current.getCurrentTime(seconds => {
          setCurrentTime1(Math.floor(seconds));
        });
      }
    }, 1000);
  };

  const stopPlayTimeInterval1 = () => {
    if (playInterval1.current) {
      clearInterval(playInterval1.current);
      playInterval1.current = null;
    }
  };

  const navigation = useNavigation();
  const navigation1 = useNavigation();
  const [prohibited, setProhibited] = useState([]);
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.099;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [initialCoords, setInitialCoords] = useState({
    latitude: parseFloat(userData.latitude)
      ? parseFloat(userData?.latitude)
      : 33.753746,
    longitude: parseFloat(userData?.longitude)
      ? parseFloat(userData?.longitude)
      : -84.38633,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [securityFormData, setSecurityFormData] = useState({
    behavior: '',
    prohibited: '',
    located: '',
    additionalInfo: '',
  });

  useEffect(() => {
    methodGuestbehavior();
    methodprohibited();
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      Title: translateText('Requesting assistance'),
      leftIcon: true,
      notificationIcon: true,
      heightRightImg: 35,
      widthRightImg: 35,
      notification: imagePath.refresh,
      // leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      notificationClick: () => {
        dispatch(getProfileAction());
        // setDeleteModalVisible(true)
        // props.navigation.navigate("GroupMembers")
      },
      leftImage: imagePath.back,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Stop recording if navigating away
      if (recording) {
        stopRecording();
      }
      // Stop playback if playing
      if (playing) {
        if (soundRef.current) {
          soundRef.current.stop();
        }
        stopPlayTimeInterval();
        setPlaying(false);
        setPaused(false);
      }
    });

    return unsubscribe;
  }, [navigation, recording, playing]);

  useEffect(() => {
    const unsubscribe = navigation1.addListener('blur', () => {
      // Stop recording if navigating away
      if (recording1) {
        stopRecording1();
      }
      // Stop playback if playing
      if (playing1) {
        if (soundRef1.current) {
          soundRef1.current.stop();
        }
        stopPlayTimeInterval1();
        setPlaying1(false);
        setPaused1(false);
      }
    });

    return unsubscribe;
  }, [navigation1, recording1, playing1]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      // console.log('height', e.endCoordinates.height);
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

  const secondsToMinutes = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Ensure the seconds are always two digits
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  };

  const secondsToMinutes1 = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Ensure the seconds are always two digits
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  };

  const startRecording = async () => {
    // console.log("startRecording------>");
    if (recording1) {
      await stopRecording1(); // Stop and save second recording if active
    }
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

    setRecording(true);
    audioRecorderPlayer.addRecordBackListener(e => {
      setCurrentTime(Math.floor(e.currentPosition / 1000));
      if (Math.floor(e.currentPosition) / 1000 > 20) {
        stopRecording();
      }
    });
  };

  const startRecording1 = async () => {
    // console.log("startRecording1------>");
    if (recording) {
      await stopRecording(); // Stop and save first recording if active
    }

    setShowRecording1(true);

    if (Platform.OS === 'android') {
      const hasPermission = await checkMicroPhonePermission();
      if (!hasPermission) return;
    }

    // Unique file path for recording 2
    const path = Platform.select({
      ios: 'recording2.m4a',
      android: `${RNFS.DocumentDirectoryPath}/recording2.m4a`,
    });

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
    };

    setCurrentTime1(0);
    const result = await audioRecorderPlayer1.startRecorder(path, audioSet); // Pass the unique path for recording 2

    setRecording1(true);
    audioRecorderPlayer1.addRecordBackListener(e => {
      setCurrentTime1(Math.floor(e.currentPosition / 1000));
      if (Math.floor(e.currentPosition) / 1000 > 20) {
        stopRecording1();
      }
    });
    if (flatListRef.current) {
      flatListRef.current.scrollToPosition(0, height, true);
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

  const playAudio = async () => {
    if (playing1) {
      await pauseAudio1();
    }

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

  const playAudio1 = async () => {
    if (playing) {
      await pauseAudio();
    }

    if (paused1 && soundRef1.current) {
      soundRef1.current.play(success => {
        setPlaying1(false);
        setPaused1(false);
        setCurrentTime1(0);
        stopPlayTimeInterval1();
        if (soundRef1.current) {
          soundRef1.current.release();
          soundRef1.current = null;
        }
      });
      setPlaying1(true);
      setPaused1(false);
      startPlayTimeInterval1();
    } else {
      if (soundRef1.current) {
        soundRef1.current.release();
      }
      const sound = new Sound(audioFile1, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        soundRef1.current = sound;
        setPlaying1(true);
        setPaused1(false);
        startPlayTimeInterval1();

        sound.play(success => {
          setPlaying1(false);
          setPaused1(false);
          setCurrentTime1(0);
          stopPlayTimeInterval1();
          sound.release();
          soundRef1.current = null;
        });
      });
    }
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecording(false);
    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }
    setAudioFile(result);
  };

  const stopRecording1 = async () => {
    const result = await audioRecorderPlayer1.stopRecorder();
    audioRecorderPlayer1.removeRecordBackListener();
    setRecording1(false);
    if (soundRef1.current) {
      soundRef1.current.release();
      soundRef1.current = null;
    }
    setAudioFile1(result);
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToPosition(0, height, true);
      }
    }, 400);
  };

  const pauseAudio1 = async () => {
    if (soundRef1.current) {
      soundRef1.current.pause();
    }
    stopPlayTimeInterval1();
    setPaused1(true);
    setPlaying1(false);
  };

  const methodprohibited = () => {
    dispatch(prohibitedApi()).then(res => {
      if (res?.status) {
        let newArr = [...res?.data];
        newArr.forEach(d => {
          let valTemp = d?.item_name;
          let valueTemp = d?.id;
          d.label = valTemp;
          d.value = valueTemp;
          delete d.item_name;
          delete d.id;
        });
        setProhibited(res?.data);
      }
    });
  };
  const methodGuestbehavior = () => {
    dispatch(guestbehaviorApi()).then(res => {
      if (res?.status) {
        let newArr = [...res?.data];
        newArr.forEach(d => {
          let valTemp = d?.behavior;
          let valueTemp = d?.id;
          d.label = valTemp;
          d.value = valueTemp;
          delete d.behavior;
          delete d.id;
        });
        setGuestBehavior(res?.data);
      }
    });
  };
  const DoneQuestion = () => {
    if (behavior == '') {
      showToastMessage(translateText('please_select_guest_behavior'));
      return;
    }

    if (prohibiteddata == '') {
      showToastMessage(translateText('please_select_prohibited_item'));
      return;
    }

    if (securityFormData.located == '' && audioFile == '') {
      showToastMessage(translateText('Please type or record your assistance'));
      return;
    }

    if (securityFormData.located && audioFile) {
      showToastMessage(
        translateText('Please select either an audio or help text'),
      );
      return;
    }

    if (securityFormData.additionalInfo == '' && audioFile1 == '') {
      showToastMessage(translateText('please_enter_or_record'));
      return;
    }

    if (securityFormData.additionalInfo && audioFile1) {
      showToastMessage(
        translateText(
          'Please select either an audio or additional information text',
        ),
      );
      return;
    }

    // const data = {
    //   behavior: behavior,
    //   prohibited: prohibiteddata,
    //   located: securityFormData.located,
    //   additionalInfo: securityFormData.additionalInfo
    // }

    let newFormData = new FormData();
    newFormData.append('guest_behavior', behavior);
    newFormData.append('prohibited_item', prohibiteddata);
    if (securityFormData.located) {
      newFormData.append('security_identifiable', securityFormData.located);
      newFormData.append('security_identifiable_type', 'text');
    }
    if (securityFormData.additionalInfo) {
      newFormData.append(
        'security_additional_information',
        securityFormData.additionalInfo,
      );
      newFormData.append('security_additional_type', 'text');
    }
    if (audioFile) {
      newFormData.append('security_identifiable', {
        uri: audioFile,
        type: 'audio/m4a',
        name: 'audio.m4a',
      });
      newFormData.append('security_identifiable_type', 'audio');
    }
    if (audioFile1) {
      newFormData.append('security_additional_information', {
        uri: audioFile1,
        type: 'audio/m4a',
        name: 'audio.m4a',
      });
      newFormData.append('security_additional_type', 'audio');
    }

    dispatch(saveSecurityAssistanceApi(newFormData, props?.navigation)).then(
      res => {
        if (res) {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'DetailScreen',
                params: {
                  type: 'Security',
                  item: res,
                },
              },
            ],
          });
        }
      },
    );
  };
  const methodSecurityRequest = (key, value) => {
    let dic = {...securityFormData};
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setSecurityFormData(dic);
  };

  const scrollToTop = () => {
    // console.log("here---->");

    if (flatListRef.current) {
      flatListRef.current.scrollToPosition(0, height, true);
    }
  };
  const isAndroid = Platform.OS === 'android';

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          color: '#FF518E',
          fontFamily: fonts.Montserrat_Bold,
          fontSize: fonts.SIZE_24,
          textAlign: 'center',
          marginBottom: 10,
        }}>
        {translateText('Security')}
      </Text>

      <KeyboardScroll>
        <MapView
          region={initialCoords}
          style={styles.map}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}>
          {isAndroid ? (
            <Marker
              onPress={() => {}}
              coordinate={{
                latitude: parseFloat(userData?.latitude)
                  ? parseFloat(userData?.latitude)
                  : 33.753746,
                longitude: parseFloat(userData?.longitude)
                  ? parseFloat(userData?.longitude)
                  : -84.38633,
              }}
              image={
                userData?.profile_picture
                  ? {
                      uri: IMAGE_URL + userData?.profile_picture,
                    }
                  : imagePath.logo
              }
            />
          ) : (
            <Marker
              onPress={() => {}}
              coordinate={{
                latitude: parseFloat(userData?.latitude)
                  ? parseFloat(userData?.latitude)
                  : 33.753746,
                longitude: parseFloat(userData?.longitude)
                  ? parseFloat(userData?.longitude)
                  : -84.38633,
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {userData?.profile_picture ? (
                  <ImageLoadView
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={{
                      uri: IMAGE_URL + userData?.profile_picture,
                    }}
                  />
                ) : (
                  <Image
                    style={{
                      height: 30,
                      width: 30,
                    }}
                    source={imagePath.logo}
                  />
                )}
              </View>
            </Marker>
          )}
        </MapView>

        <CustomDropdown
          value={behavior}
          lab={translateText('Guest_behavior')}
          backgroundColor={'#F6F6F6'}
          data={guestBehavior}
          venue={translateText('Select')}
          selectedOption={behavior}
          redAsterik={true}
          pickerTop={30}
          onSubmit={res => {
            setBehavior(res?.label);
            methodSecurityRequest('behaviour', res?.label);
          }}
        />

        <CustomDropdown
          value={prohibiteddata}
          marginTop={20}
          lab={translateText('Prohibited_items')}
          backgroundColor={'#F6F6F6'}
          data={prohibited}
          venue={translateText('Select')}
          redAsterik={true}
          selectedOption={prohibiteddata}
          pickerTop={12}
          onSubmit={res => {
            setProhibitedData(res?.label);
            methodSecurityRequest('prohibited', res?.label);
          }}
        />

        <Text
          style={{
            marginHorizontal: 20,
            fontFamily: fonts.Montserrat_SemiBold,
            fontSize: fonts.SIZE_16,
            color: Colors.secondary.MIRAGE,
            marginTop: 20,
          }}>
          {translateText('Identifiable_objects')}
          <Text style={styles.redAsterik}>*</Text>
        </Text>
        <AppInput
          placeholder={translateText('Enter_here')}
          returnKeyType={'done'}
          keyboardType={'default'}
          marginTop={-15}
          multiline={true}
          // marginTop={-15}
          maxHeight={150}
          rightIcon={imagePath.voice}
          disabled={audioFile ? true : false}
          onPressEye={() => {
            recording ? stopRecording() : startRecording();
            // methodStartRecording()
          }}
          value={securityFormData.located}
          onChangeText={value => {
            methodSecurityRequest('located', value);
          }}
        />

        {showRecording && (
          <Text
            numberOfLines={1}
            style={[
              styles.tapToRecord_text,
              {paddingHorizontal: 20, marginTop: 10},
            ]}>
            {recording
              ? '' + secondsToMinutes(currentTime)
              : audioFile
                ? secondsToMinutes(currentTime)
                : ''}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {audioFile && !recording && (
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
                onPress={() => {
                  playing ? pauseAudio() : playAudio();
                  // methodPlayAudio(0)
                }}>
                <Image
                  source={playing ? imagePath.pause_btn : imagePath.play_btn}
                  style={styles.pause_icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          {audioFile && !recording && (
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
              onPress={() => {
                setAudioFile('');
                if (soundRef.current) {
                  soundRef.current.stop();
                  soundRef.current.release();
                  soundRef.current = null;
                }
                stopPlayTimeInterval();
                setPlaying(false);
                setPaused(false);
                setShowRecording(false);
              }}>
              <Image
                source={imagePath.delete}
                style={{width: 35, height: 35}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={{
            marginHorizontal: 20,
            fontFamily: fonts.Montserrat_SemiBold,
            fontSize: fonts.SIZE_16,
            color: Colors.secondary.MIRAGE,
            marginTop: 20,
          }}>
          {translateText('Additional_information')}
          <Text style={styles.redAsterik}>*</Text>
        </Text>
        <AppInput
          placeholder={translateText('Additional_information')}
          returnKeyType={'done'}
          keyboardType={'default'}
          // marginTop={-15}
          multiline={true}
          marginTop={-15}
          maxHeight={150}
          rightIcon={imagePath.voice}
          disabled={audioFile1 ? true : false}
          onPressEye={() => {
            scrollToTop(), recording1 ? stopRecording1() : startRecording1();
            // methodStartRecording()
          }}
          value={securityFormData.additionalInfo}
          onChangeText={value => {
            methodSecurityRequest('additionalInfo', value);
          }}
        />
        {showRecording1 && (
          <Text
            numberOfLines={1}
            style={[
              styles.tapToRecord_text,
              {paddingHorizontal: 20, marginTop: 10},
            ]}>
            {recording1
              ? '' + secondsToMinutes1(currentTime1)
              : audioFile1
                ? secondsToMinutes1(currentTime1)
                : ''}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {audioFile1 && !recording1 && (
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
                onPress={() => {
                  playing1 ? pauseAudio1() : playAudio1();
                  // methodPlayAudio(1)
                }}>
                <Image
                  source={playing1 ? imagePath.pause_btn : imagePath.play_btn}
                  style={styles.pause_icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          {audioFile1 && !recording1 && (
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{left: 5, right: 5, top: 5, bottom: 5}}
              onPress={() => {
                setAudioFile1('');
                if (soundRef1.current) {
                  soundRef1.current.stop();
                  soundRef1.current.release();
                  soundRef1.current = null;
                }
                stopPlayTimeInterval1();
                setPlaying1(false);
                setPaused1(false);
                setShowRecording1(false);
              }}>
              <Image
                source={imagePath.delete}
                style={{width: 35, height: 35}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        <AppButton
          bttTitle={translateText('Done')}
          marginTop={30}
          marginBottom={30}
          color={'white'}
          borderRadius={10}
          backgroundColor={'#0B6EBC'}
          onPress={() => {
            DoneQuestion();
          }}
        />
      </KeyboardScroll>
      {/* {!keyboardStatus ? (
        <>
          <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
           
          </View>
        </>
      ) : (
        <></>
      )} */}
    </SafeAreaView>
  );
};

export default Security;
