import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', marignBottom: 200},

  viewDescribe: {
    backgroundColor: '#F6F6F6',
    height: 150,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 25,
    textAlignVertical: 'top',
    marginTop: 10,
    // marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // marginTop: 30,

    // marginHorizontal: 20,
  },
  map: {
    height: 200,
    width: '100%',
    marginTop: 20,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // flex: 1,
  },
  view_modal: {
    backgroundColor: Colors.primary.WHITE,
    width: '100%',
    // height:'100%',
    paddingHorizontal: 20,
    // paddingVertical: 40,
    marginTop: 20,
    borderRadius: 35,
  },
  tapToRecord_text: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.secondary.MEDIUM_GREY,
    minWidth: 35,
  },
  pause_icon: {
    width: 35,
    height: 35,
    // marginHorizontal: 10,
    tintColor: '#000',
  },
  redAsterik: {
    color: Colors.secondary.DARK_RED,
    fontSize: 20,
  },
});

export default styles;
