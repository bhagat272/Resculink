import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import {socketConnectionCheck} from '../../../component/socket';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import styles from './styles';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const StoryView = props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const soundRef = React.useRef(null);
  const item = props?.route?.params?.item;

  const audioUrl = IMAGE_URL + item?.item?.media;

  useEffect(() => {
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftClick: () => {
        stopAudio();
        props.navigation.goBack();
      },
      leftIcon: true,
      leftImage: imagePath.back,
      showTitle: true,
      tintColor: 'white',
      Title: '',
      titleColor: 'black',
    });
  }, []);

  const playAudio = async () => {
    let audioPath = audioUrl;
    if (
      audioUrl.startsWith('file://') ||
      audioUrl.includes('/var/mobile/') ||
      audioUrl.includes('/data/user/')
    ) {
      audioPath = decodeURIComponent(
        audioUrl.replace('https://resculink.app/file://', 'file://'),
      ); // Ensure local file is properly formatted
    }

    try {
      setIsPlaying(true);
      if (soundRef.current) {
        soundRef.current.play(success => {
          setIsPlaying(false);
        });
        return;
      }

      const sound = new Sound(audioPath, '', error => {
        if (error) {
          console.log('failed to load the sound', error);
          setIsPlaying(false);
          return;
        }
        soundRef.current = sound;
        setDuration(sound.getDuration() * 1000);

        sound.play(success => {
          if (soundRef.current) {
            soundRef.current.release();
            soundRef.current = null;
          }
          setIsPlaying(false);
          setCurrentPosition(0);
        });
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const formatTime = milliseconds => {
    return Math.floor(milliseconds / 1000); // Display whole seconds, rounded down
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
    setIsPlaying(false);
  };
  
  const stopAudio = async () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPosition(0);
  };

  return (
    <View style={styles.container}>
      {item?.item?.type == 'IMAGE' ? (
        <ImageLoadView
          source={
            item?.item?.media
              ? {
                  uri: IMAGE_URL + item?.item?.media,
                }
              : imagePath.store
          }
          resizeMode="contain"
          style={styles.flat_img}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <View style={styles.audio_view}>
            {!isPlaying ? <Text>Play audio</Text> : <Text>Pause audio</Text>}
            <TouchableOpacity
              style={styles.touch_play}
              activeOpacity={0.6}
              onPress={() => {
                isPlaying ? pauseAudio() : playAudio();
              }}>
              <Image
                resizeMode="cover"
                style={styles.play_image}
                source={isPlaying ? imagePath.pause_btn : imagePath.play_btn}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default StoryView;
