import DocumentPicker from '@react-native-documents/picker';
import React, { useEffect } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image as ImageCompressor } from 'react-native-compressor';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {
  cleanFiles,
  listFiles,
  showEditor
} from 'react-native-video-trim';
import Colors from '../theme/colors';
import fonts from '../theme/fonts';
import {
  cameraPermissions,
  checkMicroPhonePermission,
  galleryPermissions,
} from './appPermissions';
import { messages } from './permissionMessage';
import { translateText } from '../utils/language';

const compressIfNeeded = async imagePath => {
  try {
    const stats = await RNFS.stat(imagePath);
    const originalSize = Number(stats.size);
    const targetBytes = 3 * 1024 * 1024; // 1 MB
    const originalSizeMB = (originalSize / (1024 * 1024)).toFixed(2);

    console.log(`🖼️ Original size: ${originalSizeMB} MB`);

    // If already under 1 MB, skip compression
    if (originalSize <= targetBytes) {
      console.log('No compression needed (under 1 MB)');
      return imagePath;
    }

    let quality = 0.8;
    let compressedUri = imagePath;
    let compressedSize = originalSize;

    console.log('Compressing image to reach ~1 MB target...');

    // Compress repeatedly until size < 1 MB or quality < 0.2
    while (compressedSize > targetBytes && quality >= 0.2) {
      compressedUri = await ImageCompressor.compress(imagePath, {
        compressionMethod: 'manual',
        quality,
        orientation: 0,
      });

      const compressedStats = await RNFS.stat(compressedUri);
      compressedSize = Number(compressedStats.size);

      console.log(
        `Tried quality=${quality.toFixed(1)}, size=${(
          compressedSize /
          (1024 * 1024)
        ).toFixed(2)} MB`,
      );

      quality -= 0.1; // lower quality gradually
    }

    const finalSizeMB = (compressedSize / (1024 * 1024)).toFixed(2);
    console.log(`✅ Final compressed size: ${finalSizeMB} MB`);
    return compressedUri;
  } catch (err) {
    console.log('Compression error:', err);
    return imagePath; // fallback if anything fails
  }
};
const normalizeOrientation = async (path, width, height) => {
  try {
    const fixed = await ImageResizer.createResizedImage(
      path,
      width,
      height,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {mode: 'contain'},
    );
    console.log('image value =====>', fixed);
    return fixed.uri;
  } catch (e) {
    console.log('normalizeOrientation error:', e);
    return path;
  }
};
const ImageController = props => {
  const {isCircle, mediaType, onSuccess, isDocument} = props.route.params;

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event.name) {
        case 'onShow': {
          break;
        }
        case 'onHide': {
          break;
        }
        case 'onStartTrimming': {
          break;
        }
        case 'onFinishTrimming': {
          if (event && event?.outputPath) {
            let obj = {
              path:
                Platform.OS == 'ios'
                  ? event.outputPath
                  : 'file://' + event.outputPath,
              duration: 30000,
              mime: 'video/mp4',
            };
            onComplete(obj);
          }
          break;
        }
        case 'onCancelTrimming': {
          break;
        }
        case 'onError': {
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onComplete = data => {
    onSuccess(data);
    props.navigation.goBack(null);
  };

  // const onCamera = () => {
  //   cameraPermissions(status => {
  //     if (status) {
  //       if (mediaType == 'video') {
  //         const options = {
  //           mediaType: 'video',
  //           durationLimit: 30,
  //           allowsEditing: true,
  //           videoQuality: 'medium',
  //         };
  //         launchCamera(options, response => {
  //           if (response.didCancel) {
  //             return true;
  //           } else if (response.error) {
  //           } else if (response.customButton) {
  //           } else {
  //             let dic = {
  //               path: response?.assets[0]?.uri,
  //               duration: 30000,
  //               mime: 'video/mp4',
  //             };
  //             onComplete(dic);
  //             return;
  //           }
  //         });
  //       } else {
  //         ImageCropPicker.openCamera({
  //           loadingLabelText: messages.IMAGE_PROCESSING,
  //           mediaType: 'photo',
  //         }).then(response => {
  //           ImageCropPicker.openCropper({
  //             path: response?.path,
  //             // width: response?.width,
  //             // height: response?.height,
  //             freeStyleCropEnabled: true,
  //           })
  //             .then(resCrop => {
  //               onComplete(resCrop);
  //             })
  //             .catch(e => {
  //               if (e.message == 'Cannot find image data') {
  //                 alert('Please select a valid file.');
  //               }
  //             });
  //         });
  //       }
  //     }
  //   });
  // };

  // const onGallery = () => {
  //   listFiles().then(res => {
  //     if (res?.length) {
  //       cleanFiles().then(res => console.log(res));
  //     }
  //   });
  //   galleryPermissions(async status => {
  //     if (status) {
  //       if (mediaType == 'video') {
  //         try {
  //           const result = await launchImageLibrary({
  //             mediaType: 'video',
  //             assetRepresentationMode: 'current',
  //           });
  //           isValidVideo(result?.assets[0]?.uri)
  //             .then(res => console.log('isValidVideo:', res))
  //             .catch(err => {
  //               console.log('err', err);
  //             });

  //           showEditor(result?.assets[0]?.uri || '', {
  //             maxDuration: 30,
  //           })
  //             .then(res => console.log(res))
  //             .catch(e => console.log(e, 1111));
  //           onComplete(result);
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       } else {
  //         ImageCropPicker.openPicker({
  //           mediaType: 'photo',
  //           loadingLabelText: messages.IMAGE_PROCESSING,
  //         }).then(response => {
  //           ImageCropPicker.openCropper({
  //             path: response?.path,
  //             // width: response?.width,
  //             // height: response?.height,
  //             freeStyleCropEnabled: true,
  //           })
  //             .then(resCrop => {
  //               onComplete(resCrop);
  //             })
  //             .catch(e => {
  //               if (e.message == 'Cannot find image data') {
  //                 alert(messages.FILE_ERROR);
  //               }
  //             });
  //         });
  //       }
  //     }
  //   });
  // };

  const onCamera = async () => {
    cameraPermissions(async status => {
      let microPhonePermission =
        mediaType === 'video' ? await checkMicroPhonePermission() : null;

      if (status) {
        if (mediaType === 'video' && microPhonePermission) {
          const options = {
            mediaType: 'video',
            durationLimit: 60,
            allowsEditing: true,
            videoQuality: 'high',
          };
          launchCamera(options, response => {
            if (
              response?.didCancel ||
              response?.errorCode ||
              response?.errorMessage
            ) {
              console.log('User cancelled video picker');
              return;
            } else if (response?.assets) {
              let dic = {
                path: response?.assets[0]?.uri,
                duration: response?.assets[0]?.duration,
              };
              onComplete(dic);
            } else {
              console.log('User cancelled video picker');
            }
          }).catch(e => console.log('e-------', e));
          // } else if (mediaType === 'photo') {
        } else {
          ImageCropPicker.openCamera({
            loadingLabelText: messages.IMAGE_PROCESSING,
            mediaType: 'photo',
            forceJpg: true,
            includeExif: true,
          }).then(async response => {
            try {
              // 👉 Compress before cropping
              // const normalized = await normalizeImageOrientation(response);

              const normalized = await normalizeOrientation(
                response?.path,
                response?.width,
                response?.height,
              );
              console.log('---normalized======---->', normalized);
              const compressedPath = await compressIfNeeded(normalized);
              const cropped = await ImageCropPicker.openCropper({
                width: response?.width,
                height: response?.height,
                path: compressedPath,
                freeStyleCropEnabled: true,
              });

              onComplete(cropped);
            } catch (e) {
              if (e.message === 'Cannot find image data') {
                alert('Please select a valid file.');
              }
            }
          });
        }
      }
    });
  };

  const onGallery = () => {
    listFiles().then(res => {
      if (res?.length) {
        cleanFiles().then(r => console.log(r));
      }
    });

    galleryPermissions(async status => {
      if (status) {
        if (mediaType === 'video') {
          const options = {
            mediaType: 'video',
            assetRepresentationMode: 'current',
          };
          launchImageLibrary(options, result => {
            if (
              result?.didCancel ||
              result?.errorCode ||
              result?.errorMessage
            ) {
              console.log('User cancelled video picker');
              return;
            } else if (result?.assets) {
              isValidFile(
                result?.assets && result?.assets[0]
                  ? result?.assets[0]?.uri
                  : '',
              );
              showEditor(result?.assets[0]?.uri || '', {
                maxDuration: 60,
              });
              let dic = {
                path: result?.assets[0]?.uri,
                duration: result?.assets[0]?.duration,
              };
              onComplete(dic);
            } else {
              console.log('User cancelled video picker');
            }
          });
        } else {
          ImageCropPicker.openPicker({
            mediaType: 'photo',
            loadingLabelText: messages.IMAGE_PROCESSING,
          }).then(async response => {
            try {
              const normalized = await normalizeOrientation(
                response.path,
                response.width,
                response.height,
              );
              const compressedPath = await compressIfNeeded(normalized);
              const cropped = await ImageCropPicker.openCropper({
                width: response?.width,
                height: response?.height,
                path: compressedPath,
                freeStyleCropEnabled: true,
              });

              onComplete(cropped);
            } catch (e) {
              if (e.message === 'Cannot find image data') {
                alert('Please select a valid file.');
              }
            }
          });
        }
      }
    });
  };

  const openDocumentView = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      if (res && res.length > 0) {
        let dic = {};
        dic.path = res[0].uri;
        if (res[0].type == 'application/pdf') {
          dic.type = 'pdf';
        } else if (
          res[0].type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          dic.type = 'docx';
        } else if (res[0].type == 'application/msword') {
          dic.type = 'doc';
        } else if (res[0].type == 'text/csv') {
          dic.type = 'csv';
        } else if (
          res[0].type ==
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          dic.type = 'pptx';
        } else if (res[0].type == 'application/vnd.ms-powerpoint') {
          dic.type = 'ppt';
        } else if (res[0].type == 'application/vnd.ms-excel') {
          dic.type = 'xls';
        } else if (
          res[0].type ==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          dic.type = 'xlsx';
        } else {
          dic.type = 'image';
        }
        onComplete(dic);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={() => {
            onCamera(mediaType);
          }}
          style={styles.cameraView}>
          <Text style={styles.textTitle}>Camera</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          onPress={() => {
            onGallery(mediaType);
          }}
          style={styles.cameraView}>
          <Text style={styles.textTitle}>{translateText("Gallery")}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        {isDocument ? (
          <>
            <TouchableOpacity
              onPress={() => openDocumentView()}
              style={styles.cameraView}>
              <Text style={styles.textTitle}>Document</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </>
        ) : (
          <View />
        )}
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.cameraView}>
          <Text style={styles.textTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ImageController;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  mainView: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#000',
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  cameraView: {
    height: 50, 
    justifyContent: 'center',
    width: '100%',
  },
  textTitle: {
    color: Colors.primary.WHITE,
    fontSize: fonts.SIZE_12,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.primary.WHITE,
    width: '100%',
  },
});
