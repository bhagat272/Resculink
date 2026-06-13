

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Colors from "../theme/colors";
import imagePath from "../theme/imagePath";
import fonts from "../theme/fonts";

const AppPicker = (props) => {

  return (
    <View
      style={[
        styles.Picker_view,
        { marginTop: props.marginTop ? props.marginTop : 0 },
      ]}
    >
      <RNPickerSelect
        placeholder={
          props.placeholder ? props.placeholder : { label: "", value: null }
        }
        items={props.items}
        placeholderTextColor={
          props.placeholderTextColor ? props.placeholderTextColor : "#919191"
        }
        value={props.value}
        onValueChange={props.onValueChange}
        useNativeAndroidPickerStyle={false}
        disabled={false}
        style={{
          ...pickerSelectStyles,
          iconContainer: { position: "absolute", 
          top: 28,
           right: 0 },
        }}
        Icon={() => {
          return (
           
              <Image
                source={
                  props.img_down == true ? imagePath.down : imagePath.down
                }
              />
         
          );
        }}
      />
    </View>
  );
};

export default AppPicker;

const styles = StyleSheet.create({
  Picker_view: {
    height: 60,
    alignSelf: "center",
    borderRadius: 8,
    paddingRight: 12,
    paddingLeft: 28,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: Colors.primary.BLACK,
    maxWidth: "100%",
    minWidth: "100%",
    height: 60,
    fontSize: 16,
    fontFamily: fonts.Montserrat_Medium,
  },
  inputAndroid: {
    color: Colors.primary.BLACK,
    maxWidth: "100%",
    minWidth: "100%",
    height: 60,
    fontSize: 16,
  },
  placeholder: { color: Colors.primary.GREY },
});
