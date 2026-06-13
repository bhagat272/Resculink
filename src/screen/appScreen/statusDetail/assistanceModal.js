import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import {translateText} from '../../../utils/language';
import {KeyboardScroll} from '../../../component';
import imagePath from '../../../theme/imagePath';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');
const AssistanceModal = props => {
  const [playone, setPlayone] = useState(false);
  const [playtwo, setPlayTwo] = useState(false);
  const soundRef = React.useRef(null);
  // const playIdentifiableAudio = async (audio1) => {
  //     // console.log("item", audio1);
  //     setPlayTwo(true)

  //     let audioFile = IMAGE_URL + audio1
  //     // console.log("audio file", audioFile)
  //     const playerData = await audioRecorderPlayer1.startPlayer(audioFile);
  //     // console.log("hehe", playerData)

  //     audioRecorderPlayer1.setVolume(100)
  //     audioRecorderPlayer1.addPlayBackListener(e => {
  //         // console.log("play back started")
  //         // setCurrentTime(Math.floor(e.currentPosition / 1000));
  //         if (e.currentPosition === e.duration) {
  //             audioRecorderPlayer1.stopPlayer();
  //             setPlayTwo(false)
  //             audioRecorderPlayer1.removePlayBackListener();

  //         }
  //     });

  // }

  // const pauseAudio = async () => {
  //     // console.log("called------>");

  //     await audioRecorderPlayer.pausePlayer();
  //     setPlayone(false)
  // };

  // const pauseAudio1 = async () => {
  //     // console.log("called-----ssssss->");
  //     await audioRecorderPlayer1.pausePlayer();
  //     // setPlayone(false)
  //     setPlayTwo(false)
  // };

  // const playInformationaudio = async (audio) => {
  //     setPlayone(true)

  //     let audioFile = IMAGE_URL + audio
  //     // console.log("audio file", audioFile)
  //     const playerData = await audioRecorderPlayer.startPlayer(audioFile);
  //     // console.log("hehe", playerData)

  //     audioRecorderPlayer.setVolume(100)
  //     audioRecorderPlayer.addPlayBackListener(e => {
  //         // console.log("play back started")
  //         // setCurrentTime(Math.floor(e.currentPosition / 1000));
  //         if (e.currentPosition === e.duration) {
  //             audioRecorderPlayer.stopPlayer();
  //             setPlayone(false)
  //             audioRecorderPlayer.removePlayBackListener();

  //         }
  //     });

  // }

  const playIdentifiableAudio = async audio => {
    await stopAudio(); // always stop first

    setPlayTwo(true);
    const audioFile = IMAGE_URL + audio;

    const sound = new Sound(audioFile, '', error => {
      if (error) {
        console.log('failed to load the sound', error);
        setPlayTwo(false);
        return;
      }
      soundRef.current = sound;
      sound.play(success => {
        setPlayTwo(false);
        if (soundRef.current) {
          soundRef.current.release();
          soundRef.current = null;
        }
      });
    });
  };

  const pauseAudio = async () => {
    await stopAudio();
  };

  const playInformationaudio = async audio => {
    await stopAudio(); // always stop first

    setPlayone(true);
    const audioFile = IMAGE_URL + audio;

    const sound = new Sound(audioFile, '', error => {
      if (error) {
        console.log('failed to load the sound', error);
        setPlayone(false);
        return;
      }
      soundRef.current = sound;
      sound.play(success => {
        setPlayone(false);
        if (soundRef.current) {
          soundRef.current.release();
          soundRef.current = null;
        }
      });
    });
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
    setPlayone(false);
    setPlayTwo(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        stopAudio();
        props.onCancel(false);
      }}>
      <View style={styles.modal_container}>
        <View style={styles.modal_view1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 20,
              }}>
              <Text></Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fonts.Montserrat_SemiBold,
                  fontSize: fonts.SIZE_24,
                  color: '#3B4750',
                }}>
                {props?.userinfo + ' Info'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  stopAudio();

                  props.onCancel();
                }}>
                <Image
                  source={imagePath.close}
                  style={{height: 25, width: 25}}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.logoutText}>
              {translateText('if_applicable')}
            </Text>
            <View style={{marginTop: 14, marginHorizontal: 20}}>
              {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}

              <View style={styles.location_Touch}>
                <Text style={[styles.location_text]}>{props?.applicable}</Text>
              </View>
            </View>
            <Text style={[styles.logoutText, {marginTop: 10}]}>
              {translateText('Describe_your_pain')}
            </Text>
            <View style={{marginTop: 14, marginHorizontal: 20}}>
              {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}

              <View style={styles.location_Touch}>
                <Text style={[styles.location_text]}>{props?.pain}</Text>
              </View>
            </View>

            <Text style={[styles.logoutText, {marginTop: 10}]}>
              {translateText('Are_you_short_of_breath')}
            </Text>
            <View style={{marginTop: 14, marginHorizontal: 20}}>
              {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}

              <View style={styles.location_Touch}>
                <Text style={[styles.location_text]}>{props?.breath}</Text>
              </View>
            </View>
            <Text style={[styles.logoutText, {marginTop: 10}]}>
              {translateText('Identifiable_objects')}
            </Text>
            <View style={{marginTop: 14, marginHorizontal: 20}}>
              {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}

              {props?.identifiable_type == 'audio' ? (
                <TouchableOpacity
                  //   onPress={() => {
                  //     // !playtwo?
                  //     // playIdentifiableAudio(props?.objects)
                  //     // :pauseAudio();
                  //     if (playone || playtwo) {
                  //       if (playone) {
                  //         pauseAudio();
                  //         playIdentifiableAudio(props?.objects);
                  //       } else {
                  //         pauseAudio1();
                  //         playIdentifiableAudio(props?.objects);
                  //       }
                  //     } else {
                  //       playIdentifiableAudio(props?.objects);
                  //     }
                  //   }}
                  onPress={() =>
                    playtwo
                      ? pauseAudio()
                      : playIdentifiableAudio(props?.objects)
                  }>
                  <Image
                    source={!playtwo ? imagePath.play_btn : imagePath.pause_btn}
                    style={{height: 50, width: 50}}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.location_Touch}>
                  <Text style={[styles.location_text]}>{props?.objects}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.logoutText, {marginTop: 10}]}>
              {translateText('Additional_information')}
            </Text>
            <View
              style={{marginTop: 14, marginHorizontal: 20, marginBottom: 10}}>
              {/* <Text style={{color:'#0E1121',fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_16}} >Email</Text> */}
              {props?.information_type == 'audio' ? (
                <TouchableOpacity
                  //   onPress={() => {
                  //     // !playone ?
                  //     //     playInformationaudio(props?.info)
                  //     //     : pauseAudio1()

                  //     if (playone || playtwo) {
                  //       if (playone) {
                  //         pauseAudio();
                  //         playInformationaudio(props?.info);
                  //       } else {
                  //         pauseAudio1();
                  //         playInformationaudio(props?.info);
                  //       }
                  //     } else {
                  //       playInformationaudio(props?.info);
                  //     }
                  //   }}
                  onPress={() =>
                    playone ? pauseAudio() : playInformationaudio(props?.info)
                  }>
                  <Image
                    source={!playone ? imagePath.play_btn : imagePath.pause_btn}
                    style={{height: 50, width: 50}}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.location_Touch}>
                  <Text style={[styles.location_text]}>{props?.info}</Text>
                </View>
              )}
            </View>

            {/* <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 24, marginTop: 35, marginBottom: 23, justifyContent: 'center' }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => { props.onCancel() }} style={styles.cancelTouch}>
                                <Text style={styles.cancelText}>{translateText('Close')}</Text>
                            </TouchableOpacity>


                        </View> */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0000009e',
    // marginBottom:20
  },
  modal_view1: {
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 16,
    marginHorizontal: 10,
    maxHeight: Dimensions.get('window').height - 200,
    minHeight: 300,
  },
  location_text: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.primary.BLACK,
    flex: 1,
    left: 5,
    marginHorizontal: 10,
  },
  location_Touch: {
    // borderWidth:1,
    // borderColor:Colors.secondary.PLATINUM,
    // height: 85,
    minHeight: 56,
    // paddingVertical:15,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    // marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    // justifyContent: 'space-between',
    // marginTop: 11,
    marginBottom: 10,
  },
  logoutText: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.BLACK,
    //   textAlign:"center",
    paddingHorizontal: 20,
    marginTop: 20,
    lineHeight: 24,
  },
  cancelTouch: {
    backgroundColor: Colors.secondary.GREY_CHATEAU,
    height: 44,
    //   flex:1,
    paddingHorizontal: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  applyTouch: {
    backgroundColor: '#0B6EBC',
    height: 44,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelText: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
});

export default AssistanceModal;
