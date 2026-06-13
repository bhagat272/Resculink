import React from "react";
import { Alert, Platform } from "react-native";
import { AppConstant } from "../constants/appconstant";

const permissionConfirm = (alertMessage, cb) => {
  Alert.alert(
    AppConstant.appName,
    alertMessage,
    Platform.OS == "ios"
      ? [
          {
            text: "CONTINUE",
            onPress: () => {
              if (cb) cb(false);
            },
            style: "cancel",
          },
        ]
      : [
          {
            text: "CONTINUE",
            onPress: () => {
              if (cb) cb(false);
            },
            style: "cancel",
          },
          {
            text: "SETTINGS",
            onPress: () => {
              if (cb) cb(true);
            },
          },
        ],
    { cancelable: false }
  );
  // 
};

const alert = (alertMessage, cb) => {
  Alert.alert(
    AppConstant.appName,
    alertMessage,
    [
      {
        text: "OK",
        onPress: () => {
          if (cb) cb(true);
        },
      },
    ],
    { cancelable: false }
  );
};
const confirm = (alertMessage, cb) => {
  Alert.alert(
    AppConstant.appName,
    alertMessage,
    [
      {
        text: "Yes",
        onPress: () => {
          if (cb) cb(true);
        },
      },
      {
        text: "No",
        onPress: () => {
          if (cb) cb(false);
        },
        style: "cancel",
      },
    ],
    { cancelable: false }
  );
};
const cameraAlert=(alertMessage, Camera, Gallery, Cancel, cb) =>{
  Alert.alert(
    AppConstant.appName,
    alertMessage,
    [
      {
        text: Cancel,
        onPress: () => {
        return
        },
        style: "cancel",
      },
      {
        text: Camera,
        onPress: () => {
          cb(Camera);
        },
      },
      {
        text: Gallery,
        onPress: () => {
          cb(Gallery);
        },
      },
     
    ],
    { cancelable: false }
  );
}

export { permissionConfirm, alert, confirm,cameraAlert };
