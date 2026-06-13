import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import font from '../../../theme/fonts';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },
  rangetext: {
    fontFamily: fonts.Montserrat_SemiBold,
    fontSize: fonts.SIZE_16,
    color: '#111B34',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  markerStyle: {
    marginTop: 4,
    backgroundColor: '#458EF0',
    height: 20,
    width: 20,
    borderRadius: 30,
    // borderWidth: 1.5,
    // borderColor: '#269C84',
  },

  textBoxView: {
    // position: 'absolute',
    // borderWidth: 1,
    // borderColor: '#111B34',
    // paddingVertical: 5,
    justifyContent: 'center',
    // paddingHorizontal: 10,
    // borderRadius: 30/2,
    width: 60,
    // height:30,
    flexDirection: 'row',
    alignSelf: 'center',

    top: -25,
    marginHorizontal: 25,
  },
  textBoxViewyear: {
    // position: 'absolute',
    borderWidth: 1,
    borderColor: '#111B34',
    paddingVertical: 5,
    justifyContent: 'center',
    // paddingHorizontal: 10,
    borderRadius: 50,
    width: 70,
    flexDirection: 'row',
    alignSelf: 'center',
    // top: 35,
    marginRight: 25,
  },

  pricetext: {
    color: '#3B4750',
    fontFamily: fonts.Montserrat_Medium,
    fontSize: fonts.SIZE_16,
  },
  priceview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  cancelTouch: {
    backgroundColor: Colors.secondary.GREY_CHATEAU,
    height: 44,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  applyTouch: {
    backgroundColor: '#0B6EBC',
    height: 44,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelText: {
    fontFamily: fonts.Montserrat_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
  floatingLabel: {
    position: 'absolute',
    top: -35,
    width: 44,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  floatingLabelText: {
    color: Colors.primary.BLACK,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: font.Montserrat_Regular,
  },
});

export default styles;
