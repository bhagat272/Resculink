import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  import Colors from '../../../theme/colors';
  import fonts from '../../../theme/fonts';
  import imagePath from '../../../theme/imagePath';
  import ImageLoadView from '../../../utils/imageLoadView';
  import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
  import moment from 'moment';
  // import LinearGradient from "react-native-linear-gradient";
  
  const SendComponent = (item,props) => {
    // console.log('SendComponent===>', item);
    return (
      <View style={styles.user_container}>
         
        <View style={styles.view_user}>
  
       
          {/* -------- TEXT---------- */}
          {item?.message_type == 'TEXT' ? (
            <>
              <View
                style={styles.view_send_msg}>
                <Text style={styles.text_msg}>{item?.msg}</Text>
              </View>
              
            </>
          ) : null}
          {/* ---------- VIDEO -----------  */}
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
          ) : null}
          {/* ---------- IMAGE ---------- */}
          {item?.message_type == 'IMAGE' ? (
            <View>
              <TouchableOpacity onPress={() => {
              let itemm = {
                item: { media: item?.msg , type: "IMAGE" }
              }
              props.navigation.navigate('StoryView', { item: itemm });
            }}  >
              <ImageLoadView
                resizeMode="cover"
                style={styles.rec_image}
                source={{
                  uri: IMAGE_URL + item?.msg,
                }}
              />
              </TouchableOpacity>
            </View>
          ) : null}

{item?.message_type == 'LOCATION' ? (
            <View>
              <TouchableOpacity onPress={() => {
              // let itemm = {
              //   item: { media: item?.msg , type: "IMAGE" }
              // }
              // props.navigation.navigate('StoryView', { item: itemm });
            }}  >
              <ImageLoadView
                resizeMode="cover"
                style={styles.rec_image}
                source={imagePath.locationMap}
              />
              </TouchableOpacity>
            </View>
          ) : null}
          {item?.profile_picture ? (
              <ImageLoadView
                source={{ uri: IMAGE_URL + item?.profile_picture }}
                resizeMode="cover"
                style={styles.user_image}
              />
            ) : (
              <View style={styles.view_name}>
                <Text style={styles.text_name}>
                  {item?.name && item?.name?.length > 0
                    ? item?.name.slice(0, 1)?.toUpperCase()
                    : ""}
                </Text>
              </View>
            )}
        </View>
        
        <Text style={styles.Time_Text}>{moment.utc(item?.created_at).local().format("hh:mm a")}</Text>
      </View>
    );
  };
  
  export default SendComponent;
  
  const styles = StyleSheet.create({
    user_container: {
      alignSelf: 'flex-end',
      //   marginHorizontal: 15,
      marginVertical: 2,
    },
    view_user: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginRight: 15,
    },
    view_send_msg: {
      alignSelf: 'flex-end',
      backgroundColor: "green",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      marginRight: 14,
      maxWidth: Dimensions.get('screen').width / 1.7,
    },
    text_msg: {
      fontFamily: fonts.Montserrat_Light,
      fontSize: fonts.SIZE_14,
      color: Colors.primary.WHITE,
      lineHeight: 20,
    },
    user_image: {
      height: 30,
      width: 30,
      borderRadius: 30 / 2,
      // alignSelf: "flex-end",
      // marginRight: 17,
      // marginTop:8,
      // borderRadius:10
    },
    rec_image: {
      height: 143,
      width: 215,
      marginRight: 10,
      // borderWidth: 6,
      borderRadius: 22,
      // borderColor: Colors.secondary.RED_CARROT
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
    Time_Text: {
      fontFamily: fonts.Montserrat_Light,
      fontSize: fonts.SIZE_10,
      color: 'white',
      alignSelf: 'flex-end',
      marginTop: 11,
      marginRight: 56,
    },
    view_name: {
      height: 40,
      width: 40,
      marginTop: 5,
      borderRadius: 50,
      backgroundColor: "blue",
      alignItems: "center",
      justifyContent: "center",
    },
    text_name: {
      fontFamily: fonts.Montserrat_Bold,
      fontSize: fonts.SIZE_23,
      color: Colors.primary.WHITE,
    },
  });
  