import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', marignBottom: 200},

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
