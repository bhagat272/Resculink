import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:Colors.primary.WHITE},
//   container: {flex: 1,backgroundColor:'red'},
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
    borderTopColor:'#EBEBEB',
    borderTopWidth:1,
    paddingHorizontal: 15,
    // paddingBottom: 25,
    paddingTop: 20,
    // flex:1
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    marginLeft: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:20,
    paddingHorizontal:16,
    marginBottom:10

  },
  actionButton: {
    // flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    // padding: 15,
    paddingVertical:10,
    width: '30%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    // marginLeft: 5,
    fontSize: 14,
    marginTop:5
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
    // height:48,
    marginLeft: 10,
    paddingHorizontal: 15,
    maxHeight: 120,
    paddingVertical: Platform.OS == 'ios' ? 12 : 0,
  },
  container_loader: {
    marginVertical: 10
  },
  to_day_txt:{
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.BLACK,
  },
  date_center_view_parent:{
    backgroundColor:'#E6E6E6',
    alignSelf:'center',
    paddingHorizontal:20,
    borderRadius:20,
    height:30,
    alignItems:"center",
    justifyContent:'center',
    marginHorizontal:20,
    marginVertical:10
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
    height:600,width:'100%',
    marginTop:20
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
