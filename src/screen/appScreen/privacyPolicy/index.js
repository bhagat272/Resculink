import React, {useEffect, useState} from 'react';
import {Text, Image, ImageBackground, View, Dimensions, ActivityIndicator, } from 'react-native';
import imagePath from '../../../theme/imagePath';
import AppHeader from '../../../navigation/appHeader';
import styles from './styles';
// import {
//   ABOUT_US,
//   PRIVACY_POLICY,
//   TERMS_AND_CON,
// } from '../../../appRedux/apis/commonValue';
import { WebView } from "react-native-webview";
import { ABOUT_US, PRIVACY_POLICY, TERMS_AND_CON } from '../../../appRedux/apis/endpoints';
import { PRIVACY_POLICY_URL } from '../../../appRedux/apis/commonValue';
import { socketConnectionCheck } from '../../../component/socket';

const PrivacyPolicy = props => {
  // console.log("PRIVACY_POLICY_URL+PRIVACY_POLICY",PRIVACY_POLICY_URL+PRIVACY_POLICY);
  // console.log("PRIVACY_POLICY_URL+ TERMS_AND_CON",PRIVACY_POLICY_URL+ TERMS_AND_CON);
  let title = props?.route?.params?.title;
  const [load, setLoad] = useState(true);

  useEffect(() => {
    socketConnectionCheck();
    AppHeader({
        ...props,
        leftIcon: false,
        headerTitle: true,
        Title: title,
        leftIcon: true,
        leftClick: () => {
            props.navigation.goBack();
        },
        leftImage: imagePath.back,
    });
  }, []);

  return (
    <ImageBackground
      source={imagePath.bg_one}
      style={styles.container}
      resizeMode="cover">
      <View  style={{
          flex: 1,
        }}>
      <WebView
        style={{
          flex: 1,
        //   marginTop: 110,
        }}
        source={{
          uri:
            title == 'About Us'
              ? PRIVACY_POLICY_URL+ABOUT_US
              : title == 'Privacy Policy'
              ? PRIVACY_POLICY_URL+PRIVACY_POLICY
              :PRIVACY_POLICY_URL+ TERMS_AND_CON,
        }}
        onLoadStart={() => setLoad(true)}
        onLoad={() => setLoad(false)}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        automaticallyAdjustContentInsets={false}
        domStorageEnabled={true}
        scrollEnabled
        scalesPageToFit={true}
        // zoomable={true}
        contentMode={'mobile'}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        containerStyle={{padding: 0}}
        startInLoadingState={false}
      />
      </View>
      {load == true ? (
        <View
          style={{
            position: 'absolute',
            top: Dimensions.get('screen').height * 0.5,
            left: Dimensions.get('screen').width * 0.45,
          }}>
          <ActivityIndicator size="large" color={'#3C86C9'} animating={load} />
        </View>
      ) : null}
    </ImageBackground>
  );
};

export default PrivacyPolicy;
