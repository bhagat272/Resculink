import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import font from '../theme/fonts';
import Colors from '../theme/colors';
const AppButton = props => {
  return (
    <View
      style={{
        width: props.mainWidth ? props.mainWidth : '100%',
        paddingHorizontal: props.marginHorizontalMain
          ? props.marginHorizontalMain
          : 16,
      }}>
      <TouchableOpacity
        disabled={props?.disabled || props?.isLoading}
        activeOpacity={0.8}
        onPress={() => props.onPress()}
        style={{
          height: props.height ? props.height : 60,
          width: props.width ? props.width : '100%',
          borderRadius: props.borderRadius ? props.borderRadius : 10,
          marginHorizontal: props.marginHorizontal ? props.marginHorizontal : 0,

          marginTop: props.marginTop,

          marginBottom: props.marginBottom,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : Colors.primary.WHITE,

          borderWidth: props.borderWidth ? props.borderWidth : 0,
          borderColor: props.borderColor
            ? props.borderColor
            : Colors.primary.WHITE,
          // shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          alignSelf: 'center',
          shadowOpacity: props.shadowfalse ? props.shadowfalse : 0.2,
          shadowRadius: 3,
          elevation: props.shadowfalse ? props.shadowfalse : 3,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              props.textStyle
                ? props.textStyle
                : {
                    fontSize: font.SIZE_14,
                    fontFamily: font.Montserrat_Medium,
                    textAlign: 'center',
                    color: props.color ? props.color : Colors.primary.WHITE,
                  },
            ]}>
            {props.bttTitle}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default AppButton;
