import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Colors from "../theme/colors";
import font from "../theme/fonts";
import imagePath from "../theme/imagePath";
import fonts from "../theme/fonts";

const AppInput = (props) => {
  return (
    <View style={{marginTop:props?.marginViewTop?props?.marginViewTop:0}}>
      <Text style={{ marginHorizontal: 20, marginBottom: 10, color: "black", fontFamily: fonts.Montserrat_SemiBold, fontSize: fonts.SIZE_16 }}></Text>

      <View
        style={{

          maxHeight: props?.maxHeight?props?.maxHeight:56,
          paddingVertical: Platform.OS == 'ios' ? 0 : 0,
          borderRadius: props.borderRadius ? props.borderRadius : 16,
          alignSelf: "center",
          alignItems: "center",
          marginBottom:props.marginBottom
          ? props.marginBottom
          : 0,
          marginHorizontal: props.marginHorizontal
            ? props.marginHorizontal
            : 20,
          height: props.height ? props.height : 56,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : "#F6F6F6",
          flexDirection: "row",
          paddingHorizontal: props.paddingHorizontal?props.paddingHorizonta:16,
          marginTop: props.marginTop,
        }}
      >


        {props.country_code && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => props.click_code()}
            hitSlop={{ top: 25, bottom: 15 }}
            style={styles.view_code}
          >
            <View style={styles.img_down} />

            <Text style={styles.text_code}>{props.country_text}</Text>
            <Image source={imagePath.down} style={{ right: 0 }} />
          </TouchableOpacity>
        )}

        <TextInput
          style={{
            fontFamily: props.fontFamily
              ? props.fontFamily
              : font.Montserrat_Regular,
            flex: 1,
            fontSize: props.size ? props.size : font.SIZE_14,
            color: props.colorText
              ? props.colorText
              : Colors.primary.BLACK,
            paddingHorizontal: props?.paddingHorizontal ? props?.paddingHorizontal : 0,
          }}
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor={
            props.placeholderTextColor
              ? props.placeholderTextColor
              : "#767980"
          }

          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          blurOnSubmit={props.blurOnSubmit}
          keyboardType={props.keyboardType || "default"}
          returnKeyType={props.returnKeyType}
          underlineColorAndroid="transparent"
          autoFocus={props.autoFocus}
          maxLength={props.maxLength}
          multiline={props.multiline}
          ref={props.getFocus}
          onSubmitEditing={props.setFocus}
          editable={props.editable}
          onBlur={props.onBlur}
        />

        {props.rightIcon1 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.onPressEyeee()}
            hitSlop={{ right: 20, left: 20, top: 10, bottom: 10 }}
            style={{ justifyContent: "center", marginRight: 10 }}
          >
            <Image
              source={props.rightIcon1}
              style={{
                height: 20,
                width: 22,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {props.rightIcon ? (
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={props.disabled}
            onPress={() => props.onPressEye()}
            hitSlop={{ right: 20, left: 20, top: 10, bottom: 10 }}
            style={{ justifyContent: "center", marginRight: 5 }}
          >
            <Image
              source={props.rightIcon}
              style={{
                height: 20,
                width: 22,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      {props.isErrorMsg ? (
        <Text
          style={[
            styles.error,
            { marginHorizontal: props.errorMargin ? props.errorMargin : 32 },
          ]}
        >
          {props.isErrorMsg}
        </Text>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    fontFamily: font.Roboto_Regular,
    fontSize: font.SIZE_17,
    color: "#E01E61",
    marginHorizontal: 32,
  },
  text_code: {
    fontFamily: font.Montserrat_Bold,
    fontSize: font.SIZE_16,
    color: Colors.primary.BLACK,
    right: 10
  },
  view_bar: {
    height: 20,
    width: 2,
    backgroundColor: Colors.primary.GRAYISH,
    marginLeft: 5,
  },
  view_code: {
    flexDirection: "row",
    alignItems: "center",
    left: 20
  },
  img_down: {
    height: 15,
    width: 13,
  },
});

export default AppInput;
