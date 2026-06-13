import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
  ImageBackground,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles";
import imagePath from "../../../theme/imagePath";
import AppHeader from "../../../navigation/appHeader";
import Colors from "../../../theme/colors";
import { AppButton, KeyboardScroll } from "../../../component";
import fonts from "../../../theme/fonts";
import { useDispatch, useSelector } from "react-redux";
import { WelcomeApi } from "../../../appRedux/actions/userSessionAction";

const WelcomeTwo = (props) => {
  const dispatch = useDispatch();
  const [content,setContent] = useState("")
  useEffect(() => {
    AppHeader({
      ...props,
      leftClick: () => {
        //   if (!loaderShow) {
        //     props.navigation.goBack();
        //   }
      },
      headerTitle: true,
      heightLeftImg: 40,
      widthLeftImg: 40,
      Title: true,
      titleColor: "white",
      Title: "Welcome to",
    });



  }, []);
 useEffect(() => {
  dispatch(WelcomeApi()).then(res=>{
    setContent(res)
    // console.log("res is ",res);
  });
  }, []);


  return (
    <ImageBackground source={imagePath.backgroundimg} style={{ flex: 1 }} >
      <SafeAreaView style={styles.container}>
        <KeyboardScroll>
          <Image source={imagePath.plan} style={{ alignSelf: 'center', marginTop: Platform.OS == "ios" ? 70 : 100 }} />
          <Image source={imagePath.logo} style={{ alignSelf: 'center', marginTop: 40 }} resizeMode="cover" />

          <Text style={{ paddingHorizontal: 30, textAlign: 'center', marginTop: 30, color: 'white', fontFamily: fonts.Montserrat_Regular, fontSize: fonts.SIZE_16 }} >
          {content}
            </Text>


        </KeyboardScroll>
        <View style={{ position: 'absolute', bottom: 20, width: '100%' }}>
          <AppButton
            bttTitle="Next"
            // marginTop={77}
            color={"white"}
            // isLoading={loaderShow}
            borderRadius={10}
            backgroundColor={"#108DEF"}
            onPress={() => {
              // props.navigation.navigate("Login")
              // // loginUser()
              // createProfile()
              props.navigation.reset({
                index: 1,
                routes: [{ name: 'BottomTab' }],
                // routes: [{ name: 'SelectCardType' }],
              });
            }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WelcomeTwo;
