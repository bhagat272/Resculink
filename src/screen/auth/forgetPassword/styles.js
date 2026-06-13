import { Platform, StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import font from "../../../theme/fonts";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // backgroundColor: Colors.primary.WHITE,
    },
    logo: {
        height: 74, 
        width: 231, 
        alignSelf: 'center', 
        marginTop: 40
        },
        loginText:{
            fontSize:fonts.SIZE_28,
            color:"#111B34",
            marginTop:10,
            // paddingHorizontal:25,
            fontFamily:font.Montserrat_SemiBold
        },
        Enter:{
            fontSize:fonts.SIZE_14,
            color:"#7E868C",
            marginTop:11,
            textAlign:"center",
            // paddingHorizontal:25,
            fontFamily:font.Montserrat_Regular
        },
        rememberView: {
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            marginTop: 10,
          },
          rememberText: {
            color: "white",
            flex: 1,
            marginLeft: 10,
            // fontFamily: fonts.Montserrat_Light,
            fontSize: fonts.SIZE_14,
          },
          forgotText: {
            color: "white",
            // fontFamily: fonts.Montserrat_Light,
            textDecorationLine:'underline',
            fontSize: fonts.SIZE_14,
          },
          linearGradient: {
            // height: 21,
            backgroundColor:'red',
            padding:5,
            // paddingHorizontal: 8,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            alignSelf:'center',
            // flexDirection:'row',
            // flexWrap:'wrap',
            width:325,
            marginTop:100,
            height:56
    
            // marginLeft: 15,
          },
          kmText: {
            // fontFamily: fonts.JosefinSans_Regular,
            fontSize: fonts.SIZE_16,
            color: Colors.primary.BLACK,
            // alignSelf:'center',
            // textAlign:'center'
          },
          accountView: {
            flexDirection: "row",
            alignItems: "center",
            // marginBottom: 25,
            alignSelf: "center",
          },
          accountText: {
            color: Colors.primary.WHITE,
            fontSize: fonts.SIZE_14,
            textAlign:'center',
            // marginTop:20
            // fontFamily: fonts.Montserrat_Bold,
          },
          singupText: {
            fontSize: fonts.SIZE_14,
            // fontFamily: fonts.Montserrat_SemiBold,
            // color: Colors.secondary.MEDIUM_SPRING,
          },
   
});

export default styles;
