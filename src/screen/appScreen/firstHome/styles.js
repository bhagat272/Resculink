import { Platform, StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import font from "../../../theme/fonts";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },
  searchHere_View: {
    width: "87%",
    // flex:1,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    // shadowColor: "#00000027",
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 0.51,
    // shadowRadius: 13.16,
    // elevation: 20,
    // alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 15,
    marginVertical: 10,
  },


  textInputStyle: {
    flex: 1,
    // width:"90%",
    // backgroundColor:'red',
    color: Colors.primary.BLACK,
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_SemiBold,
  },


  search_icon: {
    width: 21,
    height: 21,
    marginHorizontal: 20,
  },

  name: {
    // fontWeight: 'bold',
    color:'black',
    fontSize: 14,
  },
  time: {
    color: '#777',
  },
  image: {
    // width: 50,
    // height: 50,
    // borderRadius: 25,
    marginRight: 15,
  },
  card: {
    // flexDirection: 'row',
    // flex:1,
    // width:'100%',
    // padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 100,
    flex: 1,
    width: "90%",
    alignSelf: "center"
  },
  back_icon: { width: 18, height: 18, tintColor: Colors.primary.WHITE },

});

export default styles;
