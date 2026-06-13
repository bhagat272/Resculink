import { Platform, StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import font from "../../../theme/fonts";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.primary.WHITE,
    },

    tabs: {
        padding: 2,
        borderWidth: 1,
        borderColor: '#EDEDED', 
        borderRadius: 10,
        flexDirection: 'row',
        width:'88%',
      },
      activeTab: {
        flex: 1,
        padding: 10,
        backgroundColor: '#0066CC',
        
        borderRadius: 10,
        alignItems: 'center',
      },

      inactiveTab: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      activeText:{
        color: '#fff',
        fontFamily:font.Montserrat_SemiBold,
        fontSize:font.SIZE_12,
      },
      tabImage: {
        width: 40, 
        height: 40, 
      },
      tabButtons: {
        flexDirection: 'row',
        flex: 1,
      },
      inactiveText:{
        color: '#3B4750',
        fontFamily:font.Montserrat_SemiBold,
        fontSize:font.SIZE_12,
      },
      tabText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      card: {
        flexDirection: 'row',
        alignItems:'center',
        width:'100%',
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginBottom: 10,
      },
      image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
      },
      name: {
        fontFamily:font.Montserrat_Medium,
        fontSize: 16,
      },
      time: {
        color: '#777',
      },
  
   
});

export default styles;
