import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import CustomDropdown from '../../../component/picker';
import {translateText} from '../../../utils/language';
import {catListApi} from '../../../appRedux/actions/appSessionAction';
import {useDispatch} from 'react-redux';
import {socketConnectionCheck} from '../../../component/socket';
import Slider from '@react-native-community/slider';
import SliderBarView from '../../../component/SliderBarView';
import {CustomSlider} from '../../../component';

const ScreenWidth = Dimensions.get('screen').width;

const Filter = props => {
  const temp = props?.route?.params?.initialFilterData;
  const dispatch = useDispatch();

  const [catList, setCatList] = useState([]);
  const [gender, setGender] = useState('');
  const [Id, setID] = useState('');
  const [radius, setRadius] = useState(temp?.radius ?? 0);

  const maxRadius = global?.userData?.distance || 100;
  const SLIDER_HORIZONTAL_PADDING = 24;
  const LABEL_WIDTH = 44;
  const THUMB_SIZE = 24;

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    socketConnectionCheck();
    categoryListData();

    AppHeader({
      ...props,
      leftIcon: true,
      headerTitle: true,
      Title: translateText('Filter'),
      notificationIcon: false,
      leftImage: imagePath.back,
      leftClick: () => props.navigation.goBack(),
    });
  }, []);

  useEffect(() => {
    if (temp?.radius !== undefined) {
      setRadius(temp.radius);
    }
    if (temp?.category) {
      setGender(temp.category.label);
      setID(temp.category);
    }
  }, [temp]);

  /* -------------------- API -------------------- */

  const categoryListData = () => {
    dispatch(catListApi()).then(res => {
      if (res?.status) {
        const formatted = res.data.map(item => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        setCatList(formatted);
      }
    });
  };

  /* -------------------- ACTIONS -------------------- */

  const applyFilter = () => {
    props?.route?.params?.onFilterList({
      radius,
      category: Id,
    });
    props.navigation.goBack();
  };

  const resetData = () => {
    setRadius(0);
    setGender('');
    setID('');
    props?.route?.params?.onFilterList('');
    props.navigation.goBack();
  };

  /* -------------------- UI -------------------- */
  const getThumbPosition = () => {
    const usableWidth =
      ScreenWidth - SLIDER_HORIZONTAL_PADDING * 2 - THUMB_SIZE;

    const ratio = radius / maxRadius;

    const x = THUMB_SIZE / 2 + usableWidth * ratio;

    return x;
  };
  const thumbX = getThumbPosition();

  const safeLeft = Math.max(
    0,
    Math.min(thumbX - LABEL_WIDTH / 2, ScreenWidth - LABEL_WIDTH),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.rangetext}>{translateText('Radius')}</Text>

      <View
        style={{marginHorizontal: SLIDER_HORIZONTAL_PADDING, marginTop: 20}}>
        {/* Floating Value Label */}
        <View
          style={[
            styles.floatingLabel,
            {
              left: safeLeft,
            },
          ]}>
          <Text style={styles.floatingLabelText}>{radius}</Text>
        </View>

        <Slider
          value={radius}
          minimumValue={0}
          maximumValue={maxRadius}
          step={1}
          minimumTrackTintColor="#458EF0"
          maximumTrackTintColor={Platform.OS === 'ios' ? '#E8F1FF' : '#777c83'}
          thumbTintColor="#458EF0"
          onValueChange={setRadius}
        />

        <View style={styles.priceview}>
          <Text style={styles.pricetext}>0 Miles</Text>
          <Text style={styles.pricetext}>
            {maxRadius} {translateText('Miles')}
          </Text>
        </View>
      </View>

      <CustomDropdown
        value={gender}
        backgroundColor="#F6F6F6"
        data={catList}
        venue={translateText('Select_venue_category')}
        selectedOption={gender}
        pickerTop={10}
        onSubmit={res => {
          setGender(res.label);
          setID(res);
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 24,
          marginTop: 100,
          marginBottom: 23,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={resetData}
          style={styles.cancelTouch}>
          <Text style={[styles.cancelText, {color: '#333333'}]}>
            {translateText('Reset')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={applyFilter}
          style={styles.applyTouch}>
          <Text style={styles.cancelText}>{translateText('Apply')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Filter;
