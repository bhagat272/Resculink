import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:'white'},
  
  viewDescribe: {
    backgroundColor: "#F6F6F6",
    height: 150,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 25,
    textAlignVertical: 'top',
    marginTop:10,
    // marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // marginTop: 30,

    // marginHorizontal: 20,
  },
  footer_view: {
    backgroundColor: Colors.primary.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    // paddingBottom: 25,
    paddingTop: 20,
  },
  camera_pic: {
    height: 18,
    width: 18,
  },
  textInput_view: {
    borderWidth: 1,
    borderRadius:8,
    borderColor: "#EBEBEB",
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height:48,
    marginLeft: 10,
    paddingHorizontal: 15,
    maxHeight: 120,
    paddingVertical: Platform.OS == 'ios' ? 8 : 2,
  },
  textInput_style: {
    flex: 1,
    marginHorizontal: 10,
  },
  send_pic: {
    height: 40,
    width: 40,
  },
  map: {
    height:"100%",
    
    width:'100%',
    // marginTop:20 
   
  },
  view_modal: {
    backgroundColor: Colors.primary.WHITE,
    width: '100%',
    // height:'100%',
    paddingHorizontal: 20,
    // paddingVertical: 40,
    marginTop:20,
    borderRadius: 35,
  },
  tapToRecord_text: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.secondary.MEDIUM_GREY,
    minWidth: 35
  },
  pause_icon: {
    width: 30,
    height: 30,
    // marginHorizontal: 10,
    tintColor: '#000',
  },
});

export default styles;
