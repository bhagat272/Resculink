import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import moment from 'moment';
import {IMAGE_URL} from '../../../appRedux/apis/commonValue';
import ImageLoadView from '../../../utils/imageLoadView';
import imagePath from '../../../theme/imagePath';
import MapView, {Marker} from 'react-native-maps';
const SendComponent = (item, props) => {
  // console.log("item is ---ssss-->",item?.latitude);
  // console.log("item is ---ssss-ssssssss->",Number(item?.longitude));
  // const latitude = parseFloat(item.latitude.replace(/'/g, ""));
  // const longitude = parseFloat(item.longitude.replace(/'/g, ""));
  return (
    <View style={styles.user_container}>
      <View style={styles.view_user}>
        {item?.message_type == 'TEXT' ? (
          <View style={styles.view_send_msg}>
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
                  latitude: Number(item?.latitude),
                  longitude: Number(item?.longitude),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                style={styles.rec_image}>
                <Marker
                  coordinate={{
                    latitude: Number(item?.latitude), // Marker latitude
                    longitude: Number(item?.longitude), // Marker longitude
                  }}
                />
              </MapView>
            </TouchableOpacity>
          </View>
        ) : null}

        {item?.message_type == 'AUDIO' ? (
          <View style={styles.audio_view}>
            <TouchableOpacity
              style={styles.touch_play}
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

        {item?.message_type == 'VIDEO' ? (
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
                let image = item?.msg;
                let data = {
                  item: {media: image, type: 'VIDEO'},
                };
                props.navigation.navigate('StoryView', {item: data});
              }}>
              <Image
                resizeMode="cover"
                style={styles.play_image}
                source={imagePath.play}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {/* {item?.profile_picture || item?.image ? (
          <ImageLoadView
            resizeMode="cover"
            style={styles.user_image}
            source={
              item?.profile_picture
                ? {uri: IMAGE_URL + item?.profile_picture}
                : {uri: IMAGE_URL + item?.image}
            }
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.secondary.CYAN_BLUE,
              height: 30,
              width: 30,
              borderRadius: 15,
              marginLeft: 5,
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
        )} */}
      </View>
      <Text style={styles.time_text}>
        {moment.utc(item?.created_at).local().fromNow()}
      </Text>
    </View>
  );
};

export default SendComponent;

const styles = StyleSheet.create({
  user_container: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'flex-end',
    // bottom:100
  },
  view_user: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  view_send_msg: {
    alignSelf: 'flex-end',
    backgroundColor: '#F2F2F2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    maxWidth: Dimensions.get('screen').width / 1.7,
  },
  rec_image1: {
    height: 100,
    width: 100,
    // marginHorizontal: 10,    // borderWidth: 6,
    // borderRadius: 22,
    // borderColor: Colors.secondary.RED_CARROT
  },
  time_text: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_12,
    color: '#AEAEAE',
    alignSelf: 'flex-end',
    // marginRight: 40,
    marginTop: 6,
  },
  audio_view: {
    justifyContent: 'center',
    flexDirection: 'row',
    height: 20,
    width: 100,
    // backgroundColor:'red'
  },
  play_image: {
    height: 35,
    width: 35,
    left: 10,
  },
  touch_play: {
    position: 'absolute',
    bottom: 2,
    alignSelf: 'center',
  },
  text_msg: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.secondary.CARBON,
  },
  rec_image: {
    height: 143,
    width: 215,
    marginRight: 10,
    // borderWidth: 6,
    borderRadius: 22,
    // borderColor: Colors.secondary.RED_CARROT
  },
  user_image: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 8,
  },
});
