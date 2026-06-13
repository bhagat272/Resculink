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
    width: "90%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },


  textInputStyle: {
    flex: 1,
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
    color:'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: 'white',
    paddingHorizontal:10
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginRight: 15,
  },
  card: {
    backgroundColor: '#0B6EBC',
    borderRadius: 20,
    marginBottom: 15,
    minHeight: 100,
    marginTop:20,
    width: "90%",
    alignSelf: "center"
  },
  back_icon: { width: 18, height: 18, tintColor: Colors.primary.WHITE },

});

export default styles;
