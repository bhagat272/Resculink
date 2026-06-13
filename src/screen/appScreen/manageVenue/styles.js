import { Dimensions, StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header_View: {
    flexDirection: 'row',
    // marginTop: 51,
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  renderItem_Touch: {
    width: Dimensions.get('window').width * 0.44,
    minHeight: 130,// Dimensions.get('window').width * 0.33,
    backgroundColor: '#0B6EBC',
    borderRadius: 20,
    marginHorizontal: 7,
    // marginBottom:30,
    marginVertical: 10,
  },
  modal_container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0000009e',
  },
  modal_view1: {
    backgroundColor:Colors.primary.WHITE,
    borderRadius:16,
    marginHorizontal:20
  },
  logoutText:{
    fontFamily:fonts.Montserrat_SemiBold,
    fontSize:fonts.SIZE_18,
    color:"#3B4750",
    textAlign:"center",
    marginTop:32,
    lineHeight:24
  },
  cancelTouch:{
    backgroundColor:Colors.secondary.GREY_CHATEAU,
    height:44,
    flex:1,
    borderRadius:12,
    justifyContent:"center",
    alignItems:"center",
    marginRight:5
  },
  applyTouch:{
  backgroundColor:'#0B6EBC',
    height:44,
    width:150,
  //   flex:1,
  marginHorizontal:20,
    borderRadius:12,
    justifyContent:"center",
    alignItems:"center",
    alignSelf:'center',
    marginTop:30,marginBottom:24
  //   marginLeft:5
  },
   card: {
    // flexDirection: 'row',
    // flex:1,
    // width:'100%',
    // padding: 15,
    marginHorizontal:20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginTop:20,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    // borderRadius: 25,
    borderRadius: 10,
    marginRight: 15,
  },
  name: {
    fontFamily:fonts.Montserrat_Bold,
    fontSize: 16,
  },
  time: {
    color: '#777',
  },
  cancelText:{
    fontFamily:fonts.Montserrat_Medium,
    fontSize:fonts.SIZE_16,
    color:Colors.primary.WHITE
  },
  shop_img: {
    width: Dimensions.get('window').width * 0.44,
    height: Dimensions.get('window').width * 0.21,
    // borderRadius: 10,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    // alignSelf:'center',
    // marginTop:20
  },
  shopName_text: {
    fontSize: fonts.SIZE_15,
    fontFamily: fonts.Montserrat_SemiBold,
    color: Colors.primary.WHITE,
    marginTop: 10,
    flex: 1,
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    lineHeight: 23
  },
  postedAgo_text: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Montserrat_SemiBold,
    color: Colors.primary.WHITE,
  },
  flat_img: {
    // flex:1,
    height: '100%',
    width: '100%'
  },
  back_icon: { width: 18, height: 18, tintColor: Colors.primary.WHITE },
});

export default styles;
