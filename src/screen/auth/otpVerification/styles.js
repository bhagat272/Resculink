import {Dimensions, Platform, StyleSheet} from 'react-native';
import fonts from '../../../theme/fonts';
import Colors from '../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },
  bg_img: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 90,
    flex: 1,
  },
  logo_view: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  logo_img: {
    alignSelf: 'center',
    marginTop: 80,
  },

  // safeAreaConrainer: {flex: 1, paddingHorizontal: 38},
  // logo_img: {
  //   marginTop: 50,
  //   height: 125,
  //   width: '45%',
  // },

  // logo_img: {
  //   height: 82,
  //   width: 82,
  // },
  // logo_view: {
  //   alignSelf: 'center',
  //   width: 82,
  //   height: 82,
  // },
  dataView: {
    marginTop: -14,
    backgroundColor: Colors.primary.WHITE,
    flex: 1,
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
  },

  otpVerificationStyle: {
    color: Colors.secondary.MIRAGE,
    fontSize: fonts.SIZE_24,
    fontFamily: fonts.Montserrat_SemiBold,
    textAlign: 'center',
    marginTop: 20,
  },
  otpInstructionStyle: {
    marginTop: 7,
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_Medium,
    color: Colors.secondary.GUNSMOKE,
    textAlign: 'center',
    lineHeight: 22,
    // marginHorizontal:20
  },
  // OTP: {
  //   marginTop: 44,
  //   fontSize: fonts.SIZE_14,
  //   fontFamily: fonts.Montserrat_Medium,
  //   color: Colors.secondary.DAVY_GREY,
  // },
  // otpInput: {
  //   width: 39,
  //   borderBottomLeftRadius: 7,
  //   borderBottomRightRadius: 7,
  //   borderTopRightRadius: 7,
  //   borderTopLeftRadius: 7,
  //   padding: 0,
  //   color: Colors.primary.BLACK,
  // },
  // input_box: {
  //   width: 49,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   fontSize: fonts.SIZE_24,
  //   fontFamily: fonts.Montserrat_SemiBold,
  //   textAlign: 'center',
  //   borderRadius: 8,
  //   height: 54,
  //   color: Colors.secondary.NIGHT,
  //   borderColor: Colors.secondary.PLATINUM,
  //   borderBottomWidth: 1,
  // },
  view_otp: {
    marginTop: 37,
    alignSelf: 'center',
    paddingHorizontal: 5,
  },
  // otpInput: {
  //   width: Dimensions.get('window').width / 9,

  //   // borderRadius:16,
  //   // borderBottomLeftRadius: 7,
  //   // borderBottomRightRadius: 7,
  //   // borderTopRightRadius: 7,
  //   // borderTopLeftRadius: 7,
  //   padding: 0,
  // },
  input_box: {
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.secondary.MIRAGE,
    // borderWidth: 1,
    // borderColor: Colors.secondary.TORY_BLUE,
    width: 49,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    fontSize: 24,
    textAlign: 'center',
    borderRadius: 16,
    height: 70,
  },
  contDownText: {
    // height: 47,
    fontSize: fonts.SIZE_12,
    fontFamily: fonts.Montserrat_Medium,
    color: '#0E1121',
    // paddingTop: 15,
    textAlign: 'center',
    marginTop: 48,
  },
  notReceiveTxt: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.secondary.NIGHT,
    marginTop: 79,
    alignSelf: 'center',
  },
  resend: {
    fontFamily: fonts.Montserrat_Bold,
    color: Colors.primary.BLACK,
  },
  coded_send_view: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 48,
    // marginBottom:15,
  },
  sec_text: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: fonts.SIZE_14,
    color: '#111B34',
    textDecorationLine: 'underline',
  },
  // Resend_text: {
  //   fontFamily: fonts.Montserrat_SemiBold,
  //   fontSize: fonts.SIZE_14,
  //   color: Colors.secondary.SMALT,
  // },
  button_view: {
    marginTop: '60%',
    marginBottom: 20,
    // flex:0.7
  },
  pasteButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  pasteButtonText: {
    fontSize: 14,
    color: '#0B6EBC',
    fontWeight: '500',
  },
  // otpInput: {
  //   width: 48,
  //   height: 48,
  //   borderWidth: 1,
  //   borderColor: '#0B6EBC',
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#FFFFFF',
  // },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: 'red',
  },

  otpBox: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#0B6EBC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  otpText: {
    fontSize: fonts.SIZE_16,
    fontWeight: '400',
    color: Colors.primary.BLACK,
    fontFamily: fonts.Montserrat_Regular,
  },

  hiddenInput: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.01,
    fontSize: 18,
    backgroundColor: 'red',
  },
  otpInput: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F4F4F4',
    borderColor: '#F4F4F4',
    color: Colors.primary.BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fonts.SIZE_24,
    textAlign: 'center',
    marginHorizontal: 4,
  },

  otpInputFocused: {
    borderWidth: 1,
    borderColor: '#0B6EBC',
  },
  otpInputFilled: {
    backgroundColor: '#F2F2F2F2',
  },
});

export default styles;
