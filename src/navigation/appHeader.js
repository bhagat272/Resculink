import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Colors from "../theme/colors";
import fonts from "../theme/fonts";
import { useSelector } from "react-redux";
import ImageLoadView from "../utils/imageLoadView";
const AppHeader = (props) => {
  return props.navigation.setOptions({
    headerLeft: () => (
      <View style={styles.header_view}>
        {props.leftIcon ? (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              hitSlop={styles.hit_style}
              onPress={() => props.leftClick()}
            >
              <Image
                resizeMode={"contain"}
                source={props.leftImage}
                style={{
                  height: props.heightLeftImg ? props.heightLeftImg : 44,
                  width: props.widthLeftImg ? props.widthLeftImg : 44,
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </>
        ) : null}
        {props.leftTitle ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: props.titleSize ? props.titleSize : fonts.SIZE_20,
              fontFamily: props.fontFamily
                ? props?.fontFamily
                : fonts.Montserrat_SemiBold,
              color: props.titleColor ? props.titleColor : Colors.primary.BLACK,
            }}
          >
            {props.leftTitle}
          </Text>
        ) : null}
      </View>
    ),

    headerTitle: () => (
      <View
        style={[
          styles.title,
          {
            marginLeft: props.marginLeftTitle,
            width:'90%'
          },
        ]}
      >
        {props.headerTitle ? (
          <Text
            style={{
              right:props.paddingHorizontal?props.paddingHorizontal:0,
              fontSize: props.titleSize ? props.titleSize : fonts.SIZE_18,
              fontFamily: props.fontFamily
                ? props?.fontFamily
                : fonts.Montserrat_SemiBold,
              color: props.titleColor ? props.titleColor : Colors.primary.BLACK,
              
            }}
          >
            {props.Title}
          </Text>
        ) : null}
        {props.headerTitleImage ? (
          <Image
            resizeMode={"contain"}
            source={props.titleImage}
            style={{
              height: props.heightShareImg ? props.heightShareImg : 60,
              width: props.widthShareImg ? props.widthShareImg : 120,
              marginHorizontal: props.marginHorizontalShareImg
                ? props.marginHorizontalShareImg
                : 0,
            }}
          />
        ) : null}
      </View>
    ),

    headerRight: () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {props.shareIcon ? (
          <TouchableOpacity
            hitSlop={{ left: 10, bottom: 5, top: 5, right: 5 }}
            activeOpacity={0.6}
            onPress={() => props.shareClick()}
            style={styles.head_rightOne}
          >
            <ImageLoadView
              resizeMode={"cover"}
              source={props.share}
              style={{
                height: props.heightShareImg ? props.heightShareImg : 19,
                width: props.widthShareImg ? props.widthShareImg : 19,
                marginHorizontal: props.marginHorizontalShareImg
                  ? props.marginHorizontalShareImg
                  : 0,
                  borderRadius:props.borderRadiusShare
                  ? props.borderRadiusShare
                  : 0,
              }}
            />
          </TouchableOpacity>
        ) : null}

        {props.notificationIcon ? (
          <>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => props.notificationClick()}
              hitSlop={{ left: 5, bottom: 5, top: 5, right: 5 }}
            >
              <Image
                resizeMode={"contain"}
                source={props.notification}
                style={{
                  height: props.heightRightImg ? props.heightRightImg : 20,
                  width: props.widthRightImg ? props.widthRightImg : 20,
                  marginRight: props.marginRight ? props.marginRight : 20,
                }}
              />

            </TouchableOpacity>
            {props?.filterApply ? (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => props.notificationClick()}
                style={styles.count}
              >
                <Text style={styles.text_count}>{props?.count > 9 ? '+9' : props?.count}</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </>
        ) : null}

        {props.skip ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => props.skipClick()}
            hitSlop={{ left: 5, bottom: 5, top: 5, right: 5 }}
          >
            <Text style={{

fontFamily: props.fontFamilyy?props.fontFamilyy:fonts.Urbanist_Regular,
fontSize: props.fontSizee?props.fontSizee:fonts.SIZE_16,
color: props.colorss?props.colorss:Colors.primary.BLACK,
marginRight: 20,

            }}>{props.skip}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    ),

    headerStyle: {
      height: Platform.OS == "ios" ? 120 : 100,
      backgroundColor:
        props.headerBackgroundColor
          ? props.headerBackgroundColor
          : Colors.primary.WHITE,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth:0
    },
  });
};

export default AppHeader;

const styles = StyleSheet.create({
  header_view: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  hit_style: { top: 20, left: 20, right: 20, bottom: 20 },
  title: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  head_rightOne: {
    marginRight: 15,
  },
  userName: {
    color: Colors.primary.WHITE,
    fontSize: fonts.SIZE_16,
    fontFamily: fonts.Montserrat_SemiBold,
    marginLeft: 15,
  },
  skip_text: {
    fontFamily: fonts.Urbanist_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    marginRight: 20,
  },
  skip_right: {
    marginRight: 25,
  },
  count: {
    backgroundColor: Colors.secondary.JADE_GREEN,
    height: 20,
    width: 20,
    borderRadius: 50,
    position: "absolute",
    right: 10,
    top: -10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text_count: {
    fontFamily: fonts.Urbanist_Regular,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.WHITE,
  }
});
