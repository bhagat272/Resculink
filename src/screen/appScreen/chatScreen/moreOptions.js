import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const MoreOptions = props => {
  const {cb} = props?.route?.params ?? false;
  return (
    <View style={styles.container}>
      <View style={styles.modal_view}>
        <SafeAreaView style={{flex: 1}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.goBack();
              cb && cb(true);
            }}
            style={styles.row_view}>
            <Text style={styles.text_style}>Block User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.goBack();
            }}
            style={styles.row_view_cancel}>
            <Text style={styles.text_style}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default MoreOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal_view: {
    backgroundColor: Colors.secondary.CYAN_BLUE,
    height: 120,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row_view: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.primary.WHITE,
    borderBottomWidth: 1,
  },
  row_view_cancel: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_style: {
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
});
