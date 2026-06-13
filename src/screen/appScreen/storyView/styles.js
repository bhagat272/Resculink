import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1},
  header_View: {
    flexDirection: 'row',
    // marginTop: 51,
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
  audio_view: {
    justifyContent: "center",
    // flexDirection:'row',
   flex:1,alignItems:'center'
    // backgroundColor:'red'
  },
  play_image: {
    height: 45,
     
    width: 45,
    // left:10
  },
  touch_play: {
    // position: "absolute",
    // bottom:2,
    alignSelf: "center",
    marginTop:5
  },
  back_icon: {width: 18, height: 18, tintColor: Colors.primary.WHITE},
});

export default styles;
