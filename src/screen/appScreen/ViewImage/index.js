import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import { socketConnectionCheck } from '../../../component/socket';
const ViewImage = (props) => {
  const {itemData} = props?.route?.params?props?.route?.params:false;


  useEffect(() => {
    socketConnectionCheck();
    AppHeader({
      ...props,
      leftClick: () => {
        props.navigation.goBack();
      },
      leftIcon: true,
      leftImage:imagePath.back,
      showTitle: true,
      tintColor: "white",
      Title: "",
      titleColor: "black",
    });
  }, []);

  return (
    <View style={styles.container} >
        <ImageLoadView
          source={itemData?.media_url ? {
            uri: itemData?.isLocalData?itemData.media_url:IMAGE_URL + itemData.media_url,
          } : imagePath.user_icon}
          resizeMode="contain"
          style={styles.flat_img}
        />
</View>
  );
};

export default ViewImage;
