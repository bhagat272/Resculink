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
  const MemberModal = props => {
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
          <TouchableOpacity  activeOpacity={0.8} onPress={()=>{props.oncross()}}  >
           <Image source={imagePath.blueclose} style={{position:'absolute',right:10,top:10}}/>
           </TouchableOpacity>
           <Text style={styles.logoutText}>If you leave Party Mode, you won’t be able to rejoin unless the host sends you a new invite. Are you sure you want to proceed?</Text>
            
          
            {/* <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onMedical()}} style={[styles.applyTouch,{marginTop:20}]}>
              <Text style={styles.cancelText}>Medical</Text>
            </TouchableOpacity> */}
             <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onSecurity()}} style={[styles.applyTouch,{backgroundColor:'#0B6EBC',marginTop:20,marginBottom:20}]}>
              <Text style={styles.cancelText}>Leave Group</Text>
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
      marginTop:40,
      lineHeight:24,
      paddingHorizontal:20
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
    backgroundColor:'#FF518E',
      height:44,
      width:250,
    //   flex:1,
    // marginHorizontal:20,
        paddingHorizontal:40,
      borderRadius:12,
      justifyContent:"center",
      alignItems:"center",
      alignSelf:'center',
    //   marginTop:20,
    //   marginBottom:29
    //   marginLeft:5
    },
    cancelText:{
      fontFamily:fonts.Montserrat_Medium,
      fontSize:fonts.SIZE_16,
      color:Colors.primary.WHITE
    }
   
  });
  
  export default MemberModal;
  