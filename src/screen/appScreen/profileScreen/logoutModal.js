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
import { translateText } from '../../../utils/language';
  const LogoutModal = props => {
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
           
           <Text style={styles.logoutText}>{translateText('Are_you_sure')}{"\n"}{translateText('logout_account')}</Text>
            
           <View style={{flexDirection:"row",alignItems:"center",marginHorizontal:24,marginTop:35,marginBottom:23}}>
           <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onCancel()}} style={styles.cancelTouch}>
              <Text style={styles.cancelText}>{translateText('Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onConfirm()}} style={styles.applyTouch}>
              <Text style={styles.cancelText}>{translateText('Confirm')}</Text>
            </TouchableOpacity>

           </View>
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
      color:Colors.primary.BLACK,
      textAlign:"center",
      marginTop:37,
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
      flex:1,
      borderRadius:12,
      justifyContent:"center",
      alignItems:"center",
      marginLeft:5
    },
    cancelText:{
      fontFamily:fonts.Montserrat_Medium,
      fontSize:fonts.SIZE_16,
      color:Colors.primary.WHITE
    }
   
  });
  
  export default LogoutModal;
  