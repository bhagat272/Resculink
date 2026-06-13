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
  const CheckInModal = props => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          props.onCancel(false);
        }}>
          {props.data?
        <View style={styles.modal_container}>
  
          <View style={styles.modal_view1}>
          <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onCancel()}} >

            <Image source={imagePath.cancle} style={{alignSelf:'flex-end',right:10,top:10}} />
            </TouchableOpacity>
            <Image source={imagePath.userlock} style={{alignSelf:'center',marginTop:38}}/>
           
           <Text style={styles.logoutText}>{translateText('Your_request')} {"\n"} {translateText('won’t_be')} {"\n"}  {translateText('approval')}</Text>
          
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onConfirm()}} style={styles.applyTouch}>
              <Text style={styles.cancelText}>{translateText('Confirm')} </Text>
            </TouchableOpacity>
          </View>
        </View>:<></>}
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
  
  export default CheckInModal;
  