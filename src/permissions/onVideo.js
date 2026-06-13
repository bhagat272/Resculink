import {cameraPermissions} from './appPermissions';
import ImageCropPicker from 'react-native-image-crop-picker';
import {messages} from './permissionMessage';

export const OpenVideo = async (cb) => {
  ImageCropPicker.openPicker({
    mediaType: "video",
    compressVideoPreset: "MediumQuality",
  })
    .then((response) => {
      let data = { ...response, type: "video" };
      cb(data);
    })
    .catch((e) => {
      if (e.message == "Cannot find image data") {
        alert(messages.FILE_ERROR);
      }
    });
};
export const OpenCameraVideo = async (cb) => {
  ImageCropPicker.openPicker({
    mediaType: "video",
    compressVideoPreset: "MediumQuality",
  })
    .then((response) => {
      let data = { ...response, type: "video" };
      cb(data);
    })
    .catch((e) => {
      if (e.message == "Cannot find image data") {
        alert(messages.FILE_ERROR);
      }
    });
};
