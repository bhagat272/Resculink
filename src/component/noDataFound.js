import React from 'react';
import Colors from '../theme/colors';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  View,
} from 'react-native';
import fonts from '../theme/fonts';
const NoDataFound = props => {
  return (
    <View
      style={{
        height: Dimensions.get('window').height - 250,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
      <Text
        style={{
          fontSize: fonts.SIZE_13,
          fontFamily: fonts.Montserrat_Bold,
          color: props?.color ? props?.color : Colors.primary.BLACK,
          marginTop:props?.marginTop?props?.marginTop:0
        }}>
        {props.NoData}
      </Text>
    </View>
  );
};
export default NoDataFound;
