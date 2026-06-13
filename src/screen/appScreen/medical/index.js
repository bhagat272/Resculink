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
import Colors from '../../../theme/colors';
import AppInput from '../../../component/commonTextInputs';
import {useDispatch, useSelector} from 'react-redux';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  birthStatusApi,
  bodyPartsApi,
  breathStatusApi,
  saveMedicalAssistanceApi,
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
import {translateText} from '../../../utils/language';
import {socketConnectionCheck} from '../../../component/socket';
import {checkMicroPhonePermission} from '../../../permissions/appPermissions';
import {getProfileAction} from '../../../appRedux/actions/userSessionAction';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');
const audioRecorderPlayer = new AudioRecorderPlayer();
const audioRecorderPlayer1 = new AudioRecorderPlayer();
var RNFS = require('react-native-fs');
const Medical = props => {
  const [body, setBody] = useState('');
  const [breath, setBreath] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [breathStatus, setBreathStatus] = useState([]);
  const dispatch = useDispatch();
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

  const userData = useSelector(state => state.session.userData);
  // console.log("userData---->",userData);
  const {width, height} = Dimensions.get('window');
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
  const [medicalFormData, setMedicalFormData] = useState({
    body: '',
    breath: '',
    description: '',
    located: '',
    additionalInfo: '',
  });

  useEffect(() => {
    updateLocationAndGetUser();
    methodBodyParts();
    methodBreathStatus();
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

  //   dispatch(syncContactNumber(dic)).then((res) => {

  //     });
  // };

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
      // console.log("here");

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
    // console.log("result----->",result);

    setRecording(true);
    audioRecorderPlayer.addRecordBackListener(e => {
      setCurrentTime(Math.floor(e.currentPosition / 1000));
      if (Math.floor(e.currentPosition) / 1000 >= 20) {
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
      if (Math.floor(e.currentPosition) / 1000 >= 20) {
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

  const methodBodyParts = () => {
    dispatch(bodyPartsApi()).then(res => {
      if (res?.status) {
        let newArr = [...res?.data];
        newArr.forEach(d => {
          let valTemp = d?.body_part_name;
          let valueTemp = d?.id;
          d.label = valTemp;
          d.value = valueTemp;
          delete d.body_part_name;
          delete d.id;
        });
        setBodyParts(res?.data);
      }
    });
  };

  const updateLocationAndGetUser = async () => {
    console.log('updateLocationAndGetUser ');

    await geoCurrentLocation(1, data => {
      console.log(' geoCurrentLocation data ', data);

      if (data === null || data === undefined) {
      }
      if (data.latitude && data.longitude) {
        const dic = {
          latitude: data?.latitude ? data?.latitude : '',
          longitude: data?.longitude ? data?.longitude : '',
        };
        // console.log('dic ', dic);

        dispatch(updtaelatlong(dic)).then(res => {
          console.log('updtaelatlong ', res);
        });
      } else {
        return false;
      }
    });
  };

  const methodBreathStatus = () => {
    dispatch(breathStatusApi()).then(res => {
      if (res?.status) {
        let newArr = [...res?.data];
        newArr.forEach(d => {
          let valTemp = d?.breath_status;
          let valueTemp = d?.id;
          d.label = valTemp;
          d.value = valueTemp;
          delete d.breath_status;
          delete d.id;
        });
        setBreathStatus(res?.data);
      }
    });
  };

  const methodMedicalRequest = (key, value) => {
    let dic = {...medicalFormData};
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setMedicalFormData(dic);
  };

  const DoneQuestion = () => {
    if (body == '') {
      showToastMessage(translateText('select_your_pain'));
      return;
    }
    if (medicalFormData.description == '') {
      showToastMessage(translateText('enter_your_pain_description'));
      return;
    }
    if (breath == '') {
      showToastMessage(translateText('please_select_your_breath'));
      return;
    }

    if (medicalFormData.located == '' && audioFile == '') {
      showToastMessage(translateText('Please type or record your assistance'));
      return;
    }

    if (medicalFormData.located && audioFile) {
      showToastMessage(
        translateText('Please select either an audio or assistance text'),
      );
      return;
    }

    if (medicalFormData.additionalInfo == '' && audioFile1 == '') {
      showToastMessage(translateText('please_enter_or_record'));
      return;
    }

    if (medicalFormData.additionalInfo && audioFile1) {
      showToastMessage(
        translateText(
          'Please select either an audio or additional information text',
        ),
      );
      return;
    }

    let newFormData = new FormData();
    newFormData.append('injured', body);
    newFormData.append('descibe_pain', medicalFormData.description);

    newFormData.append('short_breath', breath);

    if (medicalFormData.located) {
      newFormData.append('identifiable_object', medicalFormData.located);
      newFormData.append('identifiable_type', 'text');
    }

    if (medicalFormData.additionalInfo) {
      newFormData.append(
        'additional_information',
        medicalFormData.additionalInfo,
      );
      newFormData.append('information_type', 'text');
    }

    if (audioFile) {
      newFormData.append('identifiable_object', {
        uri: audioFile,
        type: 'audio/m4a',
        name: 'audio.m4a',
      });
      newFormData.append('identifiable_type', 'audio');
    }
    if (audioFile1) {
      newFormData.append('additional_information', {
        uri: audioFile1,
        type: 'audio/m4a',
        name: 'audio.m4a',
      });
      newFormData.append('information_type', 'audio');
    }
    dispatch(saveMedicalAssistanceApi(newFormData, props?.navigation)).then(
      res => {
        if (res) {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'DetailScreen',
                params: {
                  type: 'Medical',
                  item: res,
                },
              },
            ],
          });
        }
      },
    );
  };

  const methodEmptyPicker = () => {};

  const scrollToTop = () => {
    // console.log("here---->");

    if (flatListRef.current) {
      flatListRef.current.scrollToPosition(0, height, true);
    }
  };
  const isAndroid = Platform.OS === 'android';
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardScroll>
        <Text
          style={{
            color: '#0B6EBC',
            fontFamily: fonts.Montserrat_Bold,
            fontSize: fonts.SIZE_24,
            textAlign: 'center',
            marginBottom: 10,
          }}>
          {translateText('Medical')}
        </Text>
        <MapView
          region={initialCoords}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}>
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
          value={body}
          lab={translateText('if_applicable')}
          backgroundColor={'#F6F6F6'}
          data={bodyParts}
          redAsterik={true}
          venue={translateText('Select')}
          selectedOption={body}
          pickerTop={30}
          onSubmit={res => {
            // setGender(value)
            // console.log('res======option=======>>>>>>', res);
            setBody(res?.label);
            methodMedicalRequest('body', res?.label);
          }}
          // onEmptyValue={ }
          // isErrorMsg={medicalFormData.validators.business_category?.error}
        />

        <View style={styles.view_modal}>
          <Text
            style={{
              fontFamily: fonts.Montserrat_SemiBold,
              fontSize: fonts.SIZE_16,
              color: Colors.secondary.MIRAGE,
            }}>
            {translateText('Describe_your_pain')}
            <Text style={styles.redAsterik}>*</Text>
          </Text>
          <TextInput
            style={styles.viewDescribe}
            placeholder={translateText('Enter_describe')}
            placeholderTextColor={Colors.primary.GREY}
            keyboardType={'default'}
            multiline={true}
            returnKeyType={'done'}
            // keyboardType={'default'}
            maxLength={500}
            onChangeText={value => {
              methodMedicalRequest('description', value);
            }}
            value={medicalFormData.description}
          />
        </View>

        <CustomDropdown
          value={breath}
          lab={translateText('Are_you_short_of_breath')}
          backgroundColor={'#F6F6F6'}
          data={breathStatus}
          venue={translateText('Select')}
          selectedOption={breath}
          redAsterik={true}
          pickerTop={12}
          onSubmit={res => {
            setBreath(res?.label);
            methodMedicalRequest('breath', res?.label);
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
          multiline={true}
          marginTop={-15}
          maxHeight={150}
          rightIcon={imagePath.voice}
          disabled={audioFile ? true : false}
          onPressEye={() => {
            recording ? stopRecording() : startRecording();
          }}
          onChangeText={value => {
            methodMedicalRequest('located', value);
          }}
          value={medicalFormData.located}
          // maxLength={15}
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
          // line
          // paddingHorizontal={25}
          // lable={"Password"}
          placeholder={translateText('Additional_information')}
          returnKeyType={'done'}
          keyboardType={'default'}
          // marginTop={-15}
          multiline={true}
          marginTop={-15}
          maxHeight={150}
          // leftIcon={imagePath.voice}
          rightIcon={imagePath.voice}
          // secureTextEntry={eyeOne}
          // rightIcon={imagePath.voice}
          disabled={audioFile1 ? true : false}
          onPressEye={() => {
            recording1 ? stopRecording1() : startRecording1();
            // methodStartRecording()
          }}
          // editable={!loaderShow}
          // getFocus={emailRef}
          // value={loginReq.password}
          onChangeText={value => {
            methodMedicalRequest('additionalInfo', value);
          }}
          value={medicalFormData.additionalInfo}
          // isErrorMsg={loginReq.validators.password.error}
          // maxLength={15}
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
                  scrollToTop(), playing1 ? pauseAudio1() : playAudio1();
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
          bttTitle="Done"
          marginTop={30}
          marginBottom={30}
          color={'white'}
          // isLoading={loaderShow}
          borderRadius={10}
          backgroundColor={'#0B6EBC'}
          onPress={() => {
            // props.navigation.navigate("Login")
            // // loginUser()
            DoneQuestion();
          }}
        />
      </KeyboardScroll>
      {/* {!keyboardStatus ? <></> : <></>} */}
    </SafeAreaView>
  );
};

export default Medical;
