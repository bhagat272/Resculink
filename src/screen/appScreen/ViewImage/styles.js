import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:'white'},
  header_View: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  postedAgo_text: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Montserrat_SemiBold,
    color: Colors.primary.WHITE,
  },
  flat_img:{
    // flex:1,
    height:'100%',
    width:'100%'
  },
  back_icon: {width: 18, height: 18, tintColor: Colors.primary.WHITE},
});

export default styles;
