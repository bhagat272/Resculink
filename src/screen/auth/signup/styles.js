import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import font from '../../../theme/fonts';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },
  // logo: {
  //     height: 74,
  //     width: 231,
  //     alignSelf: 'center',
  //     marginTop: 40
  //     },
  loginText: {
    fontSize: fonts.SIZE_28,
    color: '#111B34',
    marginTop: 15,
    // paddingHorizontal:25,
    alignSelf: 'center',
    fontFamily: fonts.Montserrat_SemiBold,
  },
  loginText1: {
    // fontSize:fonts.SIZE_28,
    // color:Colors.primary.WHITE,
    // marginTop:40,
    // paddingHorizontal:20
    textDecorationLine: 'underline',
    color: '#0B6EBC',
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  Enter: {
    fontSize: fonts.SIZE_14,
    color: '#7E868C',
    marginTop: 11,
    textAlign: 'center',
    paddingHorizontal: 25,
    fontFamily: fonts.Montserrat_Regular,
  },
  rememberView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  rememberText: {
    color: 'white',
    flex: 1,
    marginLeft: 10,
    // fontFamily: fonts.Montserrat_Light,
    fontSize: fonts.SIZE_14,
  },
  forgotText: {
    color: 'white',
    // fontFamily: fonts.Montserrat_Light,
    textDecorationLine: 'underline',
    fontSize: fonts.SIZE_14,
  },
  linearGradient: {
    // height: 21,
    backgroundColor: 'red',
    padding: 5,
    // paddingHorizontal: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // flexDirection:'row',
    // flexWrap:'wrap',
    width: 325,
    marginTop: 65,
    height: 56,

    // marginLeft: 15,
  },
  kmText: {
    // fontFamily: fonts.JosefinSans_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    // alignSelf:'center',
    // textAlign:'center'
  },
  accountView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 25,
    alignSelf: 'center',
  },
  accountText: {
    color: '#3B4750',
    fontSize: fonts.SIZE_14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: fonts.Montserrat_Regular,
  },
  singupText: {
    fontSize: fonts.SIZE_14,
    // fontFamily: fonts.Montserrat_SemiBold,
    // color: Colors.secondary.MEDIUM_SPRING,
  },
  agreeText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_11,
    color: '#111B34',
    marginLeft: 10,
  },
  tcText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_11,
    color: '#111B34',
    textDecorationLine: 'underline',
  },
  andText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_11,
    color: '#111B34',
  },
  policyText: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_11,
    color: '#111B34',
    textDecorationLine: 'underline',
  },
  agreeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
    // flexWrap:'wrap',
    marginTop: 10,
  },
  switchText: {
    color: '#111B34',
    fontSize: fonts.SIZE_14,
    fontFamily: font.Montserrat_Regular,
  },
  switchView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 26,
    marginBottom: Platform.OS == 'ios' ? 0 : 20,
  },

  kmText: {
    // fontFamily: fonts.JosefinSans_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    // alignSelf:'center',
    // textAlign:'center'
  },
});

export default styles;
