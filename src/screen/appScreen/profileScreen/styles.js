import { Platform, StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import font from "../../../theme/fonts";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.WHITE,
    },
    profileText: {
        fontFamily: font.Montserrat_SemiBold,
        fontSize: font.SIZE_18,
        color: Colors.secondary.LIMED_SPRUCE,
        marginLeft: 20
    },
    profileImage: {
        height: 114,
        width: 114,
        borderRadius: 100,
        alignSelf: "center",
        alignItems:'center',
        // marginTop: 28
    },
    profile_IconView: {
        width: 114,
        height: 114,
        alignSelf: "center",
        justifyContent:'center',
        alignItems: 'center',
      },
    userName: {
        fontFamily: fonts.Montserrat_SemiBold,
        fontSize: fonts.SIZE_60,
        color: Colors.primary.BLACK,
       
      },
      firstLeter:{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'black',
        alignSelf:'center',
        width: 114,
        height: 114,
        borderRadius: 100,
      },
    userName: {
        fontFamily: fonts.Montserrat_SemiBold,
        fontSize: fonts.SIZE_20,
        color: Colors.secondary.LIMED_SPRUCE,
        textAlign: "center",
        marginTop: 10
    },
    emailText: {
        fontFamily: fonts.Montserrat_Regular,
        fontSize: fonts.SIZE_14,
        color: Colors.secondary.STORM_DUST,
        textAlign: "center",
        marginTop: 9
    },
    userDataView: {
        marginHorizontal: 20
    },
    weddingPlanerName: {
        backgroundColor: Colors.secondary.DARK_SKY_BLUE,
        height: 70,
        marginHorizontal: 20,
        paddingHorizontal:10,
        borderRadius: 16,
        marginTop: 18,
        flexDirection: "row",
        alignItems: "center"

    },
    editProfileImage: {
        height: 12,
        width: 12
    },
    editProfileText: {
        fontFamily: fonts.Montserrat_Regular,
        color: Colors.secondary.MIRAGE,
        fontSize: fonts.SIZE_12,
        marginLeft: 5
    },
    editProfileTouch: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: 11,
        borderColor: Colors.secondary.IRON,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 9
    },
    weddingPlanLogo: {
        height: 52,
        width: 52,
        borderRadius: 100,

    },
    plannerName: {
        fontFamily: fonts.Montserrat_SemiBold,
        fontSize: fonts.SIZE_16,
        color: Colors.primary.WHITE,
    },
    plannerAddress: {
        fontFamily: fonts.Montserrat_Regular,
        fontSize: fonts.SIZE_10,
        color: Colors.primary.WHITE,
        marginTop: 6
    },
    editWeddingImage: {
        height: 24,
        width: 24,
    },
    editWeddingImageTouch: {
        marginRight: 8,
        marginTop: -25
    },
    accountText:{
        fontFamily:font.Montserrat_SemiBold,
        fontSize:fonts.SIZE_16,
        color:Colors.secondary.MIRAGE,
        marginLeft:20,
        marginTop:24
    },
    accountView:{
        // borderColor:Colors.secondary.PORCELAIN,
        // borderWidth:1,
        marginHorizontal:20,
        borderRadius:16,
        paddingHorizontal:11,
        marginTop:12,
    },
    settingsView:{
        // borderColor:Colors.secondary.PORCELAIN,
        // borderWidth:1,
        marginHorizontal:20,
        borderRadius:16,
        paddingHorizontal:11,
        marginTop:12,
        marginBottom:16
    },
    overallRatingImage:{
        height:28,
        width:28
    },
    nextImage:{
        height:18,
        width:18,
        tintColor:Colors.secondary.MOUNTAIN_MIST
    },
    toggleImage:{
height:24,
width:42
    },
    overallTouch:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:11
    },
    notification:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:11,
        marginBottom:14
    },
    overallText:{
        fontFamily:fonts.Montserrat_Medium,
        fontSize:fonts.SIZE_16,
        color:Colors.secondary.MIRAGE,
        flex:1,
        marginLeft:14
    },
    lineView:{
        // backgroundColor:Colors.secondary.PORCELAIN,
        // height:1,
        marginLeft:45,
        marginTop:12
    },
    settingText:{
        fontFamily:fonts.Montserrat_SemiBold,
        fontSize:fonts.SIZE_16,
        color:Colors.secondary.MIRAGE,
        marginLeft:20,
        marginTop:27
    }
 
});

export default styles;
