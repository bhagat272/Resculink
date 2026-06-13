
import ImageCropPicker from "react-native-image-crop-picker";
import { galleryPermissions } from "./appPermissions";
import { messages } from "./permissionMessage";


export const OpenGallery = (isCircle, mediaType, cb) => {
  
  galleryPermissions(async(status) => {
    if (status) {
      if (mediaType == "video") {
        ImageCropPicker.openPicker({
          mediaType: "video",
          loadingLabelText: messages.IMAGE_PROCESSING,
        })
          .then((response) => {
            cb(response);
          })
          .catch((e) => {
            if (e.message == "Cannot find image data") {
              alert(messages.FILE_ERROR);
            }
          });
      } else {
        ImageCropPicker.openPicker({
          mediaType: "photo",
          loadingLabelText: messages.IMAGE_PROCESSING,
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
                alert(messages.FILE_ERROR);
              }
            });
        });
      }
    }
  });
};

