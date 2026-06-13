import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import moment from 'moment';

import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import ImageLoadView from '../../../utils/imageLoadView';
import imagePath from '../../../theme/imagePath';
import MapView, {Marker} from 'react-native-maps';

const ReceiveComponent = (item, props) => {
  // console.log("ReceiveComponent--->",item?.latitude);

  // console.log("ReceiveComponent--->",Number(item?.longitude));
  // console.log("item is ---ssss-->",Number(item?.latitude));
  // console.log("item is ---ssss-ssssssss->",Number(item?.longitude));
  return (
    <View style={styles.user_container}>
      <View style={styles.view_user}>
        {item?.image ? (
          <ImageLoadView
            source={{uri: IMAGE_URL + item?.image}}
            resizeMode="cover"
            style={styles.user_image}
          />
        ) : (
          // />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.secondary.DARK_SKY_BLUE,
              height: 30,
              width: 30,
              borderRadius: 15,
              marginRight: 5,
            }}>
            <Text
              style={{
                fontFamily: fonts.Montserrat_SemiBold,
                fontSize: fonts.SIZE_16,
                color: Colors.primary.WHITE,
                textTransform: 'capitalize',
              }}>
              {item?.user_name?.substring(0, 1)}
            </Text>
          </View>
        )}

        <View>
          {item?.message_type == 'TEXT' ? (
            <View style={styles.view_res_msg}>
              <Text style={styles.text_msg}>{item?.message}</Text>
            </View>
          ) : null}

          {item?.message_type == 'IMAGE' ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  let itemm = {
                    item: {media: item?.message, type: 'IMAGE'},
                  };
                  // console.log("here");

                  props.navigation.navigate('StoryView', {item: itemm});
                }}>
                <ImageLoadView
                  resizeMode="cover"
                  style={styles.rec_image}
                  source={{
                    uri: IMAGE_URL + item?.message,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {item?.message_type == 'LOCATION' ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  const url = `https://www.google.com/maps?q=${Number(item?.latitude)},${Number(item?.longitude)}`;
                  Linking.openURL(url).catch(err =>
                    console.error('An error occurred', err),
                  );
                }}>
                <MapView
                  initialRegion={{
                    latitude: parseFloat(item?.latitude),
                    longitude: parseFloat(item?.longitude),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  style={styles.rec_image}>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(item?.latitude), // Marker latitude
                      longitude: parseFloat(item?.longitude), // Marker longitude
                    }}
                  />
                </MapView>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* {item?.message_type == "VIDEO" ? (
            <View style={styles.video_view}>
              <ImageLoadView
                resizeMode="cover"
                style={styles.rec_image}
                source={{uri: IMAGE_URL + item?.thumb_image}}
              />
              <TouchableOpacity
              style={styles.touch_play}
              activeOpacity={0.6}
              onPress={() => {

                let image = item?.msg
                let data = {
                  item: { media: image, type: "VIDEO" }
                }
                props.navigation.navigate('StoryView', { item: data });

              }}>
                <Image
                  resizeMode="cover"
                  style={styles.play_image}
                  source={imagePath.play}
                />
              </TouchableOpacity>
            </View>
          ) : null} */}
          {item?.message_type == 'AUDIO' ? (
            <View style={styles.audio_view}>
              <TouchableOpacity
                // style={styles.touch_play}
                activeOpacity={0.6}
                onPress={() => {
                  // playAudio(item?.message)
                  let image = item?.message;
                  let data = {
                    item: {media: image, type: 'AUDIO'},
                  };
                  props.navigation.navigate('StoryView', {item: data});
                }}>
                <Image
                  resizeMode="cover"
                  style={styles.play_image}
                  source={imagePath.play_btn}

                  // source={imagePath.play_btn}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <Text style={styles.time_text}>
            {moment.utc(item?.created_at).local().fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReceiveComponent;

const styles = StyleSheet.create({
  user_container: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  view_user: {
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
  user_image: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginRight: 8,
  },

  view_res_msg: {
    backgroundColor: '#0B6EBC',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-start',
    maxWidth: Dimensions.get('screen').width / 1.7,
  },
  text_msg: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },

  rec_image: {
    height: 143,
    width: 215,
    marginHorizontal: 10, // borderWidth: 6,
    borderRadius: 22,
    // borderColor: Colors.secondary.RED_CARROT
  },

  rec_image1: {
    height: 100,
    width: 100,
    // marginHorizontal: 10,    // borderWidth: 6,
    // borderRadius: 22,
    // borderColor: Colors.secondary.RED_CARROT
  },
  audio_view: {
    justifyContent: 'center',
    // alignSelf:'flex-start',
    alignItems: 'center',
    // flexDirection:'row',
    // marginBottom:20,
    // height:20,
    width: 80,
    // backgroundColor:'red'
  },
  play_image: {
    height: 45,
    width: 45,
    // marginBottom:10,
    // right:15
  },
  touch_play: {
    position: 'absolute',
    // bottom:20,
    // alignSelf: "center"
  },

  time_text: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_12,
    color: Colors.secondary.NOBEL,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  video_view: {
    justifyContent: 'center',
  },
  play_image: {
    height: 42,
    width: 42,
  },
  touch_play: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
