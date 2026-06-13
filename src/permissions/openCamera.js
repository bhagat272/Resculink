

import { cameraPermissions } from "./appPermissions";
import ImageCropPicker from "react-native-image-crop-picker";
import { messages } from "./permissionMessage";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { DEVICE_INFO } from "../utils/helper";

export const OpenCamera = (isCircle, mediaType, cb) => {
  cameraPermissions((status) => {
    if (status) {
      if (mediaType == "video") {
        const options = {
          mediaType: "video",
          durationLimit: 30,
          allowsEditing: true,
          videoQuality: "medium",
        };
        launchCamera(options, (response) => {
          if (response.didCancel) {
            console.warn("User cancelled video picker");
            return true;
          } else if (response.error) {
            console.warn("ImagePicker Error: ", response.error);
          } else if (response.customButton) {
            console.warn("User tapped custom button: ", response.customButton);
          } else {
            let dic = {}
            dic.path=response?.assets[0]?.uri,
            dic.duration=response?.assets[0]?.duration
            cb(dic);
            return;
          }
        });
      } else {
        ImageCropPicker.openCamera({
          loadingLabelText: messages.IMAGE_PROCESSING,
          mediaType: "photo",
        }).then((response) => {
          ImageCropPicker.openCropper({
            path: response?.path,
            width: response?.width,
            height: response?.height,
            freeStyleCropEnabled: true,
          })
            .then((resCrop) => {
              cb(resCrop);
            })
            .catch((e) => {
              if (e.message == "Cannot find image data") {
                alert("Please select a valid file.");
              }
            });
        });
      }
    }
  });
};

