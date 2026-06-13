import { Platform, StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: Colors.primary.WHITE,
    },
    logoIcon: {
      alignSelf: 'center',
      marginTop:Platform.OS=="ios"?80:110,
    },
    reset_text: {
      fontSize: fonts.SIZE_24,
      fontFamily: fonts.Montserrat_SemiBold,
      color: "#111B34",
      marginTop:10,
      textAlign: 'center',
    },
    resetInstruction_text: {
      fontSize: fonts.SIZE_14,
      fontFamily: fonts.Montserrat_Regular,
      color: "#7E868C",
      textAlign: 'center',
      marginTop: 11,
    },
  });

export default styles;