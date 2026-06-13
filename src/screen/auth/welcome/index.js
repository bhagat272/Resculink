import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  Image,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles";
import imagePath from "../../../theme/imagePath";
import fonts from "../../../theme/fonts";

import { AppButton } from "../../../component";
import { kUserType } from "../../../appRedux/apis/commonValue";
import { setData } from "../../../appRedux/apis/keyChain";
import { setUserType } from "../../../utils/helper";
import { translateText } from "../../../utils/language";
const Welcome = (props) => {
// console.log("global.user_type",global.user_type);
const selectUserType = type => {
  // console.log('type-->>', type);
  setUserType(type);
};
  const [show,setShow] = useState(false)
  useEffect(() => {
    // Set a timeout to change the visibility after 2 seconds
    const timeout = setTimeout(() => {
      setShow(true)
    }, 1000);

    // Cleanup function to clear the timeout when component unmounts or when it re-renders
    return () => clearTimeout(timeout);
  }, []); 
  return (
      <ImageBackground  source={imagePath.spl} style={styles.container}>

      <SafeAreaView style={styles.container}>
      
   
   
    <View style={{paddingVertical:40,width:'100%',position:'absolute',bottom:0}}>
      <AppButton
       bttTitle={translateText('register_as_user')}

       
      //  marginTop={20}
       color={"#0B6EBC"}
       onPress={()=>{
        selectUserType('user');
        setData(kUserType, 'user');
          props.navigation.navigate("Login")
       }}
       />

<AppButton
      //  bttTitle="Register as Provider"
      bttTitle={translateText('register_as_provider')}
       marginTop={20}
      //  borderWidth={1}

       color={"white"}
       backgroundColor={"#1BCC4A"}
       onPress={()=>{
       
        selectUserType('provider');
        setData(kUserType, 'provider');
          props.navigation.navigate("Login")
          }
       }
       />
    </View>


    </SafeAreaView>


    </ImageBackground>
  );
};

export default Welcome;
