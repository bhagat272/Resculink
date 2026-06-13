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
  const VisiblityModal = props => {
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
          <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onCancel()}} >

            <Image source={imagePath.cancle} style={{alignSelf:'flex-end',right:10,top:10}} />
            </TouchableOpacity>
           <Text style={{fontFamily:fonts.Montserrat_SemiBold,fontSize:fonts.SIZE_22,textAlign:'center',marginTop:20,color:'#333333'}} >{translateText('Visibility')}</Text>
           <TouchableOpacity onPress={()=>{
            props.onOff()
           }} >
           <Image source={props.onoff}  resizeMode="contain"style={{alignSelf:'center',marginTop:38}}/>
           </TouchableOpacity>
           <Text style={styles.logoutText}>
            
            {/* Your request is in progress.  You {"\n"} won’t be able to check in until {"\n"} approval is completed. */}
            When toggled ON, only your friends can see you online and invite you to party mode.
            </Text>
            
           {/* <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:24,marginTop:35,marginBottom:23}}>
           <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onCancel()}} style={styles.cancelTouch}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity> */}
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onConfirm()}} style={styles.applyTouch}>
              <Text style={styles.cancelText}>{translateText('Next')}</Text>
            </TouchableOpacity>

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
      color:"#787878",
      textAlign:"center",
      marginTop:32,
      lineHeight:24,
      paddingHorizontal:20
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
    cancelText:{
      fontFamily:fonts.Montserrat_Medium,
      fontSize:fonts.SIZE_16,
      color:Colors.primary.WHITE
    }
   
  });
  
  export default VisiblityModal;
  