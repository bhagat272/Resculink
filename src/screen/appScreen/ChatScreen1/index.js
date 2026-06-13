import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  TextInput,
  Dimensions,
  Keyboard,
  DeviceEventEmitter,
  AppState,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import { translateText } from '../../../utils/language';
import UserInfoModal from '../detailScreen/userInfoModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { networkConnection, socketConnectionCheck, socketEmit, socketEvent, socketIsConnected, socketReconnect } from '../../../component/socket';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import ReceiveComponent from './receiveComponent';
import SendComponent from './sendComponent';
var msgData = [];
let appIsBackGround = false
const ChatScreen = (props) => {
  const appState = useRef(AppState.currentState);
    const {item,OtherDetail,providerAllData,userDetail} = props?.route?.params
    ? props?.route?.params
    : false;
    let userId = global?.userData?.id;
    const [chatHistoryData, setChatHistoryData] = useState([]);
    const [first_message_id, set_first_message_id] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // console.log("fjsfjdnfjndf",OtherDetail);
    // console.log("item---->",item);

    // console.log("providerAllData-----",providerAllData);

    // console.log("userDetail000000",userDetail);
    
    
    
    
    const [otherUserId, setOtherUserId] = useState(userDetail?.user_detail?.id?userDetail?.user_detail?.id:item?.provider_detail?.id);

    // console.log("itemotherUserId----->",otherUserId);
    const [message, setMessage] = useState('');
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [shortHeight, setShortHeight] = useState();
    const [showItems,setShowItems] = useState(false)
    const [lastMessageId, setLastMessageId] = useState(0);
    useEffect(() => {
      socketConnectionCheck();
        AppHeader({
            ...props,
            leftIcon: false,
            headerTitle: true,
            Title: translateText('Help_is_on_the_way'),
            leftIcon: true,
            notificationIcon:userDetail?false:true,
            notification: imagePath.infoimg,
            // leftIcon: true,
            heightRightImg: 35,
            widthRightImg: 35,
           
            notificationClick: () => {
                setUserModalVisible(true)
            },
            leftClick: () => {
                props.navigation.goBack();
            },
            leftImage: imagePath.back,
        });
      }, []);


  useEffect(() => {
   
    let ReceiverListener = DeviceEventEmitter.addListener(
      "receive_message",
      async (response) => {
        // console.log("response is ---->",response);
        
        methodReceiveMsg(response?.responseData);
      }
    );


   
   
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidShowListenerHide = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    if (keyboardDidShowListener && keyboardDidShowListener.remove)
      keyboardDidShowListener.remove();

    if (keyboardDidShowListenerHide && keyboardDidShowListenerHide.remove)
      keyboardDidShowListenerHide.remove();

    

    return () => {
      ReceiverListener.remove();
    
    }
  }, []);




  const _keyboardDidShow = e =>
    setShortHeight(Platform.OS == 'android' ? 0 : e.endCoordinates.height);
  const _keyboardDidHide = e => setShortHeight(0);

 



  const getMessageSend = (type, url, thumb_url) => {
  //  console.log('12345');
   
    let userData = global?.userData;
    // console.log("my data ",userData);
    
    let data = {
      user_id: userData?.id,
      other_user_id: otherUserId,
      message: url ?? message,
      Message_type: type,
      thumb_image: thumb_url,
      other_data: ''
    };
    // console.log('data of send -----', data);
    setMessage('');
    socketEmit(socketEvent.send_message, data,res=>{
      if (res) {
        
      }
    });
    // DeviceEventEmitter.emit('msggg');
  };
 

 
  const renderChat = ({ item, index }) => {
   
    return (
      <>
       
          <View key={index} style={styles.view_render}>
           
            {item?.user_id === userId ? (
              <View>{SendComponent(item, props)}</View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={true}
                onPress={() => {
                  props.navigation.navigate('UserInfo', { item: item, from: "chatinbox" });
                }}>
                {ReceiveComponent(item, props)}
              </TouchableOpacity>
            )}
          </View>
        
      </>
    );
  };

  const onScrollPage = () => {
    // console.log("bhjbjbhbnb");
    if (
      !isLoading &&
      first_message_id != 0 &&
      first_message_id != msgData[msgData?.length - 1]?.id
    ) {
      setIsLoading(true);
      methodGetChatThread("before");
    }
  };
  const methodGetChatThread = async (type) => {

    let data = {
      user_id: global?.userData?.id,
      other_user_id: otherUserId,
      last_id: lastMessageId,
      limit: 10,
      type: type,
    };
    // console.log("data----------------------",data)
    socketEmit(socketEvent.get_user_thread, data);

  };
  return (
    <View style={styles.container} >
      <FlatList
          inverted
          data={chatHistoryData}
          renderItem={renderChat}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list_view}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          onEndReached={onScrollPage}
          onEndReachedThreshold={0.2}
          ListFooterComponent={<View>{isLoading && <View style={styles.container_loader}>
            <ActivityIndicator size={"large"} color={Colors.ORANGE} />
          </View>}</View>}
        />
      {/* <KeyboardAwareScrollView style={{ marginBottom: 60 }}> */}
      <View style={{position:"absolute",bottom:20,width:'100%'}}>
  <View style={[styles.footer_view, {marginBottom: shortHeight}]}>
          <TouchableOpacity onPress={() =>{
            //  alert("add")}
            setShowItems(!showItems)}
             }>
            <Image
              // style={styles.camera_pic}
              source={imagePath.addmedia}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View style={styles.textInput_view}>
            <TextInput
              style={styles.textInput_style}
              placeholder={translateText('Write_a_message')}
              multiline
            //   maxLength={500}
              keyboardType={'default'}
              underlineColorAndroid="transparent"
              value={message}
              onChangeText={value => setMessage(value)}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                // alert("send")
                getMessageSend('TEXT');
              }}>
              <Image
                // style={styles.send_pic}
                source={imagePath.btn_send}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
         
        </View> 
{showItems?
        <View style={styles.actionButtonsContainer}>
        <TouchableOpacity onPress={()=>setShowItems(false)} activeOpacity={0.6} style={[styles.actionButton,{backgroundColor:'#57E57B'}]}>
          {/* <Icon name="location-on" size={25} color="#fff" /> */}
          <Image
                // style={styles.send_pic}
                source={imagePath.locationon}
                resizeMode={'contain'}
              />
          <Text style={styles.buttonText}>Send Location</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>setShowItems(false)} activeOpacity={0.6}  style={[styles.actionButton,{backgroundColor:'#FF518E'}]}>
          {/* <Icon name="photo-camera" size={25} color="#fff" /> */}
          <Image
                // style={styles.send_pic}
                source={imagePath.photocamera}
                resizeMode={'contain'}
              />
          <Text style={styles.buttonText}>Send Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>setShowItems(false)} activeOpacity={0.6}  style={[styles.actionButton,{backgroundColor:'#2FC5F7'}]}>
          {/* <Icon name="mic" size={25} color="#fff" /> */}
          <Image
                // style={styles.send_pic}
                source={imagePath.microphone}
                resizeMode={'contain'}
              />
          <Text style={styles.buttonText}>Send Audio</Text>
        </TouchableOpacity>
        </View>:<></>}
     
          </View>
          <UserInfoModal
            visible={userModalVisible}
            proname={providerAllData?.data?.name?providerAllData?.data?.name:providerAllData?.provider_detail?.name}
            user_icon={providerAllData?.data?.profile_picture?IMAGE_URL+providerAllData?.data?.profile_picture:IMAGE_URL+providerAllData?.provider_detail?.profile_picture}
            onCancel={() => {
                setUserModalVisible(false);
            }}
            onConfirm={() => {
                setUserModalVisible(false);
            //   props.navigation.pop(2)
            }}
          />
    </View>
  );
};

export default ChatScreen;
