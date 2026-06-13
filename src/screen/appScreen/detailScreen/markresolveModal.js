import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Image,
  } from 'react-native';
  import React from 'react';
  import Colors from '../../../theme/colors';
  import fonts from '../../../theme/fonts';
import imagePath from '../../../theme/imagePath';
import { translateText } from '../../../utils/language';
  const MarkResolveModal = props => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          props.onCancel(false);
        }}>
        <View style={styles.modal_container}>
  
          <View style={styles.modal_view1}>
          
           
           {/* <Text style={styles.logoutText}>Are you sure you {"\n"} want to cancel?</Text> */}
            
          
            {/* <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onCancel()}} style={[styles.applyTouch,{marginTop:20}]}>
              <Text style={styles.cancelText}>Don't Cancel</Text>
            </TouchableOpacity> */}
            
              <Text style={styles.cancelText}>Your issue has been resolved</Text>
         

            <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onConfirm()}} style={styles.applyTouch}>
              <Text style={[styles.cancelText,{marginTop:0,color:'white'}]}>{translateText('OK')}</Text>
            </TouchableOpacity>
           {/* <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:24,marginTop:35,marginBottom:23}}>
           

           {/* </View> */}
          </View>
        </View>
      </Modal>
    );
  };
  const styles = StyleSheet.create({
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
      fontFamily:fonts.Montserrat_Medium,
      fontSize:fonts.SIZE_16,
      color:"#3B4750",
      textAlign:"center",
      marginTop:32,
      lineHeight:24
    },
    cancelTouch:{
      backgroundColor:"red",
    //   height:44,
      flex:1,
      borderRadius:12,
      justifyContent:"center",
      alignItems:"center",
      marginRight:5
    },
    applyTouch:{
        backgroundColor:'#0B6EBC',
      height:44,
      width:250,
    //   flex:1,
    // marginHorizontal:20,
        // paddingHorizontal:40,
      borderRadius:12,
      justifyContent:"center",
      alignItems:"center",
      alignSelf:'center',
      marginTop:20,
      marginBottom:29
    //   marginLeft:5
    },
    cancelText:{
      fontFamily:fonts.Montserrat_Medium,
      fontSize:fonts.SIZE_16,
      color:Colors.primary.BLACK,
      marginTop:20,
      textAlign:'center'
    }
    // applyTouch:{
    //     backgroundColor:'#0B6EBC',
    //   height:44,
    //   flex:1,
    //   borderRadius:12,
    //   justifyContent:"center",
    //   alignItems:"center",
    //   marginLeft:5
    // },
   
  });
  
  export default MarkResolveModal;
  