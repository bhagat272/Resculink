import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import imagePath from '../theme/imagePath';
import Colors from '../theme/colors';
import fonts from '../theme/fonts';

const CustomDropdown = props => {
  const {value} = props;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  // console.log("props?.value--->", props?.value, selectedOption);

  useEffect(() => {
    if (!isVisible && value) {
      setSelectedOption(value);
    }
  }, [isVisible, props?.value]);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const handleOptionSelect = option => {
    setSelectedOption(option?.label);
    props?.onSubmit(option);
    toggleModal();
  };

  return (
    <View>
      <View style={{marginTop: props?.pickerTop ?? 0}}>
        <Text
          style={[
            styles.labelText,
            // {marginTop: props?.marginTop ? props?.marginTop : ''},
          ]}>
          {props?.lab ?? ''}
          {props?.redAsterik && <Text style={styles.redAsterik}>*</Text>}
        </Text>
        <TouchableOpacity
          disabled={props?.disabled ?? false}
          onPress={toggleModal}
          style={[
            styles.dataViewShow,
            {
              backgroundColor: props?.backgroundColor
                ? props?.backgroundColor
                : '',
            },
          ]}>
          <Text
            style={[
              styles.selectDataText,
              {
                color: !selectedOption
                  ? props?.colorr
                    ? props?.colorr
                    : '#767980'
                  : Colors.secondary.MIRAGE,
              },
            ]}>
            {selectedOption ? selectedOption : props?.venue}
          </Text>
          <Image
            source={props?.Down ? props?.Down : imagePath.down}
            resizeMode={'contain'}
            style={styles.downArrowImage}
          />
        </TouchableOpacity>
      </View>
      {isVisible && (
        <View>
          <Modal visible={isVisible} transparent={true} animationType="fade">
            <View style={styles.modal_container}>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.removeTouch}
                activeOpacity={0.8}>
                <Image
                  source={imagePath.cancle}
                  resizeMode={'contain'}
                  style={styles.removeImage}
                />
              </TouchableOpacity>
              <View style={styles.dataView}>
                <FlatList
                  data={props.data}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => handleOptionSelect(item)}
                      style={styles.flatListDataTouch}
                      activeOpacity={0.8}>
                      <Text style={styles.itemText}>{item.label}</Text>
                      <View style={styles.lineView} />
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.toString()}
                />
              </View>
            </View>
          </Modal>
        </View>
      )}

      {props?.isErrorMsg ? (
        <Text
          style={[
            styles.error,
            {marginHorizontal: props?.errorMargin ? props?.errorMargin : 40},
          ]}>
          {'Please select business type'}
        </Text>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modal_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0000009e',
  },
  dataViewShow: {
    backgroundColor: '#F6F6F6',
    height: 56,
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
  },
  labelText: {
    marginHorizontal: 20,
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: fonts.SIZE_16,
    color: Colors.secondary.MIRAGE,
  },
  selectDataText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_13,
    flex: 1,
  },
  itemText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.secondary.MIRAGE,
    textAlign: 'center',
    marginVertical: 10,
  },
  removeImage: {
    width: 30,
    height: 30,
    tintColor: Colors.primary.WHITE,
  },
  removeTouch: {
    alignSelf: 'center',
  },
  dataView: {
    backgroundColor: Colors.primary.WHITE,
    marginHorizontal: 40,
    borderRadius: 20,
    marginTop: 10,
    maxHeight: Dimensions.get('window').height - 250,
  },
  emailImage: {
    height: 24,
    width: 24,
  },
  downArrowImage: {
    height: 9,
    width: 15,
    tintColor: Colors.primary.BLACK,
  },
  flatListDataTouch: {},
  lineView: {
    backgroundColor: Colors.secondary.IRON,
  },
  error: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_17,
    color: '#E01E61',
    marginTop: 5,
  },
  redAsterik: {
    color: Colors.secondary.DARK_RED,
    fontSize: 20,
  },
});
export default CustomDropdown;
