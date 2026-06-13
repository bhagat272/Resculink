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
import ImageLoadView from '../../../utils/imageLoadView';
  const UserInfoModal = props => {
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
          
           
           <Text style={styles.logoutText}>Employee Info</Text>
            <ImageLoadView source={{uri:props.user_icon}}  style={{alignSelf:'center',marginTop:10,height:100,width:100,borderRadius:100/2}} />
            <Text style={[styles.logoutText,{fontSize:fonts.SIZE_16,marginTop:10}]}>{props?.proname}</Text>

            <TouchableOpacity activeOpacity={0.8} onPress={()=>{props.onCancel()}} style={[styles.applyTouch,{marginTop:20,marginBottom:40}]}>
              <Text style={styles.cancelText}>Close</Text>
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
      fontFamily:fonts.Montserrat_SemiBold,
      fontSize:fonts.SIZE_22,
      color:"#333333",
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
    backgroundColor:'#BCBCBC',
      height:44,
    //   width:250,
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
      color:"#333333"
    }
   
  });
  
  export default UserInfoModal;
  