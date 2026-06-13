import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Modal,
  Keyboard,
  Platform,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import { addVenueApi, deletevenueApi, setAppSessionReducer, uniquecodeApi, venuehistoryApi } from '../../../appRedux/actions/appSessionAction';
import { useDispatch, useSelector } from 'react-redux';
import NoDataFound from '../../../component/noDataFound';
import { confirm } from '../../../utils/alertController';
import { translateText } from '../../../utils/language';
import { AppButton } from '../../../component';
import AppInput from '../../../component/commonTextInputs';
import { showToastMessage } from '../../../utils/Toast';
import { CLEAR_HISTORY_LIST_DATA } from '../../../appRedux/constants/appSessionType';
import { socketConnectionCheck } from '../../../component/socket';
import fonts from '../../../theme/fonts';
const ManageVenue = (props) => {
  const dispatch = useDispatch();
  const { historyListData } = useSelector(state => state.appSession);
  const [noData, setNoData] = useState(false)
  const [codeDetail,setCodeDetail] = useState(false)
  const [refreshing, setRefresing] = useState(false)
  const [showModal,setShowModal] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [showDetail,setShowDetail] = useState(false)
  const [venueData,setVenueData] = useState('')
  const [profileFormData, setProfileFormData] = useState({
    unique_code:'',
     
  });
  useEffect(() => {
    socketConnectionCheck();
    methodHistoryData();
    AppHeader({
      ...props,
      leftIcon: false,
      headerTitle: true,
      Title: translateText('Manage_venues'),
      leftIcon: true,
      leftClick: () => {
        props.navigation.goBack();
      },
      leftImage: imagePath.back,
    });

    return () => {
   
      dispatch(setAppSessionReducer(CLEAR_HISTORY_LIST_DATA, []))
    }
  }, []);
  const methodHistoryData = () => {
    dispatch(venuehistoryApi()).then((res) => {
      if (res && Array.isArray(res) && res?.length > 0) {
        setNoData(false)
      } else {
        setNoData(true)
      }
    });
  };

  const noDataFound = () => {
    return noData ? <NoDataFound NoData={translateText('No_venue_found')}/> : <></>
  };

  const methodPullToRefresh = () => {
    dispatch(venuehistoryApi()).then((res) => {
      if (res && Array.isArray(res) && res?.length > 0) {
        setNoData(false)
      } else {
        setNoData(true)
      }
    });
  };


  const methodProfileRequest = (key, value) => {
       
    
    let dic = { ...profileFormData };
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = '';
    }
    setProfileFormData(dic);
  };

  const sendRequest = async () => {
        
  //  console.log("here");
   
   if(profileFormData.unique_code=="") {
      showToastMessage("Please enter unique code");
      return;
    }

    Keyboard.dismiss();
    // let dic = { ...profileFormData, };
    // delete dic.validators;

    const data ={
      venue_id:venueData?.id?venueData?.id:null
    }
   
    // newFormData.append('venue_id', venueData?.id);

    // console.log("newFormData------->",data);
    
    
    
    // return
    dispatch(addVenueApi(data)).then((res) => {

      // console.log("res---->",res);
      profileFormData.unique_code="";
      if(res){
      setShowModal(false);
      setShowDetail(false);
      setCodeDetail(false);
      setVenueData("");
      setIsEmailValid(false)
      methodHistoryData();
      }
      else{
        setShowModal(false);
      setShowDetail(false);
      setCodeDetail(false);
      setVenueData("");
      setIsEmailValid(false)
      methodHistoryData();
      }
      
    });
  
};

  const uniquecodeData = (unique_code)=>{
    // console.log("unique_code====>",unique_code);


   
    const data = {
      unique_code:unique_code
    }
    // console.log("data--->",data);

    
    dispatch(uniquecodeApi(data)).then(res => {
      // console.log("res---->",res?.data);

      if(res){
        setShowDetail(true)
        setCodeDetail(true)
        setVenueData(res?.data)
        // setVenueIdd(res?.unique_code)
      }
      else{
        setShowDetail(false)
        setCodeDetail(false)
        setVenueData("")
      }
      
    });

  }

  const addVenueModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}>
       <View style={styles.modal_container}>
  
  <View style={styles.modal_view1}>
  <TouchableOpacity activeOpacity={0.8} onPress={()=>{
     profileFormData.unique_code="";
    setShowModal(false);
    setShowDetail(false);
    setCodeDetail(false);
    setVenueData("");
    setIsEmailValid(false)
   
    }} >

    <Image source={imagePath.cancle} style={{alignSelf:'flex-end',right:10,top:10}} />
    </TouchableOpacity>
    {/* <Image source={imagePath.userlock} style={{alignSelf:'center',marginTop:38}}/> */}
   
   <Text style={styles.logoutText}>{translateText('add_venue')}</Text>
   <AppInput
                     placeholder={translateText('Enter_link')}
                    // keyboardType={'default'}
                    maxLength={30}
                    marginBottom={10}
                    keyboardType={'numeric'}
                    returnKeyType={'done'}
                    leftIcon={imagePath.businessNameImage}
                    rightIcon={isEmailValid ? imagePath.check1 : ""}
                    onPressEye={() => {
                      // setEyeTwo(!eyeTwo);
                      // dispatch(uniquecodeApi());

                      // uniquecodeData(profileFormData.unique_code)


                  }}
                  onBlur={() => {
                    if (profileFormData.unique_code) {
                      setIsEmailValid(true)
                    } else {
                      setIsEmailValid(false)
                      uniquecodeData(profileFormData.unique_code)
                    }
                  }}
                    value={profileFormData.unique_code}
                   
                    onChangeText={val => {
                          methodProfileRequest('unique_code', val);
                      }}
                      // isErrorMsg={profileFormData.validators.name.error}
                      setFocus={() => {
             
                        if (profileFormData.unique_code?.length ) {
                         
                          setCodeDetail(true)
                          uniquecodeData(profileFormData.unique_code)
                          setIsEmailValid(true)
                        } else {
                          setIsEmailValid(false)
                        }
                        // passwordRef.current?.focus();
                      }}

                />
                {codeDetail && showDetail ?
<View style={styles.card}>
            {/* <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }} >
              
            

                <ImageLoadView
                        source={
                          venueData?.venue_picture ? { uri: IMAGE_URL+ venueData?.venue_picture } : imagePath.profileImage1
                        }
                        resizeMode={'cover'}
                        style={styles.image}
                    />
                <View>
                    <Text style={styles.name}>{venueData?.venue_name}</Text>
                    <View style={{flexDirection:'row',marginTop:10}}>


<Image source={imagePath.locationn} resizeMode='contain' style={{height:20,width:20}} />

<Text umberOfLines={2} style={[styles.time,{left:10,flexGrow:1}]}>{venueData?.address}</Text>

</View>                   
                </View>
            </View> */}
 <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }} >
              <ImageLoadView
                resizeMode="cover"
                source={
                  venueData?.venue_picture ? { uri: IMAGE_URL+ venueData?.venue_picture } : imagePath.profileImage1
                }
                style={[styles.image, { width: 100, height: 100, borderRadius: 10 }]} />
              <View style={{ width: '70%' }} >
                <Text style={[styles.name, { width: '70%', fontFamily: fonts.Montserrat_Bold }]}>{venueData?.venue_name}</Text>
                <View style={{ flexDirection: 'row', width: '70%', marginTop: 10, alignItems: 'center' }}>
                  <Image source={imagePath.locationn} />
                  <Text numberOfLines={2} style={[styles.name, { fontFamily: fonts.Montserrat_Regular, color: '#777', left: 10 }]}>{venueData?.address}</Text>
                </View>
              </View>


            </View>

            {/* <View style={{  justifyContent: 'center', alignItems: 'center' }}>
            </View> */}
            
        </View>
        
        
        
        :<></>}
        {codeDetail && showDetail ?
        <TouchableOpacity activeOpacity={0.8} onPress={()=>{sendRequest()}} style={styles.applyTouch}>
      <Text style={styles.cancelText}>{translateText('Send_Request')} </Text>
    </TouchableOpacity>
     :<></>} 
    

   {/* </View> */}
  </View>
</View>
      </Modal>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={[styles.renderItem_Touch,]}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => {
          props.navigation.navigate("ViewImage", {
            itemData: {
              media_url: item?.venue_detail?.venue_picture,
            }
          })
        }}>

          <ImageLoadView
            source={{
              uri: IMAGE_URL + item?.venue_detail?.venue_picture,
            }}
            style={styles.shop_img}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          confirm('Do you want to delete this venue?', res => {
            if (res == false) {
              return;
            } else if (res == true) {
              const data = {
                venue_id: item?.venue_id
              }
              dispatch(deletevenueApi(data)).then((res) => {
                if (res) {
                  methodHistoryData();
                }
              })
            }
          });
        }} activeOpacity={0.6} style={{ position: 'absolute', right: 10, top: 10, height: 30, width: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 30 / 2 }}>
          <Image source={imagePath.deletered} /></TouchableOpacity>
        <Text numberOfLines={3} style={[styles.shopName_text]}>{item?.venue_detail?.venue_name}</Text>
      </View>

    );
  };

  return (
    <SafeAreaView style={styles.container} >
      {/* {historyListData?.length? */}
     
      <FlatList
        data={historyListData}
        renderItem={renderItem}
        numColumns={2}
        key={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyExtractor={(item, index) => index?.toString()}
        style={{flex: 1,paddingHorizontal:15 }}
        ListEmptyComponent={noDataFound()}
        // ListFooterComponent={<View />}
        // ListFooterComponentStyle={{ marginBottom: 15 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={methodPullToRefresh}
          />
        }
      />
      {/* :<></>} */}
      
      {/* {!historyListData?.length? */}
<AppButton
                    bttTitle={translateText('add_venue')}
                    //  marginBottom={10}
                     marginTop={20}
                    color={"white"}
                    // isLoading={loaderShow}
                    marginBottom={Platform.OS=="android"?20:0}
                    borderRadius={10}
                    backgroundColor={'#0B6EBC'}
                    onPress={() => {
                      setShowModal(true)
                        // props.navigation.navigate("Login")
                        // // loginUser()
                        // createProfile()
                       
                    }}
                />
                {/* :<></>} */}
 {addVenueModal()}

    </SafeAreaView>
  );
};

export default ManageVenue;
