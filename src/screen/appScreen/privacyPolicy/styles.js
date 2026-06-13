import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1},
  logo_icon: {
    width: 170,
    height: 70,
    alignSelf: 'center',
    marginTop: 110,
    marginBottom: 38,
  },
  dummy_text: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.primary.WHITE,
    marginHorizontal: 30,
  },
});

export default styles;
