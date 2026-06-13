import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // backgroundColor: Colors.primary.WHITE,
    },
  CreateProfile_IconView: {
    alignItems: 'center',
    marginTop:20,
    alignSelf: 'center',
  },
    serachBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    flex: 1,
    marginLeft: 10,
    marginRight:10,
    borderWidth: 1,
    fontWeight: 'bold',
  },

  location_text: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_Regular,
    color: Colors.primary.BLACK,
    flex: 1,
    left:5,
    marginHorizontal:10
  },
  svg_gps_icon: {width: 22, height: 22},
  location_Touch: {
    // borderWidth:1,
    // borderColor:Colors.secondary.PLATINUM,
    // height: 85,
    minHeight:56,
    // paddingVertical:15,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    // marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    // justifyContent: 'space-between',
    marginTop: 11,
    marginBottom: 10,
  },
  CreateProfile_Icon: {width: 114, height: 114,borderRadius:114/2},
  // addPhotoText:{
  //   fontFamily:fonts.Montserrat_Regular,
  //   fontSize:fonts.SIZE_12,
  //   color:"#0B6EBC"
  // },
  // uploadIcon_Touch:{
  //   flexDirection:"row",
  //   alignItems:"center",
  //   borderColor:"#0B6EBC",
  //   borderWidth:1,
  //   borderRadius:8,
  //   height:32,
  //   paddingHorizontal:12,
  //   marginTop:15
  // },
  addPhotoText:{
    fontFamily:fonts.Montserrat_Regular,
    fontSize:fonts.SIZE_12,
    color:"#111B34"
  },
  uploadIcon_Touch:{
    flexDirection:"row",
    alignItems:"center",
    borderColor:"#D1D5D8",
    borderWidth:1,
    borderRadius:8,
    height:32,
    paddingHorizontal:12,
    marginTop:15
  },
  upload_icon:{
    height:12,
    width:12,
    marginRight:5
  },
  bioView:{
    height:150,
    borderRadius:16,
    // borderColor:Colors.secondary.PLATINUM,
    // borderWidth:1,
    backgroundColor:'white',
    marginHorizontal:20,
    marginBottom:20,
    marginTop:15,
     flex:1  ,
     paddingHorizontal:17,
     paddingTop:12
  },
  bioTextInput:{
    flex:1,
    textAlignVertical:"top",
    fontFamily:fonts.Montserrat_Regular,
    fontSize:fonts.SIZE_16,
    color:'black'

   
  }
});

export default styles;
