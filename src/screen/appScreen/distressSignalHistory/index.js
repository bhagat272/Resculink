import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import fonts from '../../../theme/fonts';
import { translateText } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { userSignalHistoryApi } from '../../../appRedux/actions/appSessionAction';
import { sendToUserReducer } from '../../../appRedux/actions/userSessionAction';
import { PAGE_LOADING_USER_SIGNAL_HISTORY, PULL_TO_REFRESH_USER_SIGNAL_HISTORY } from '../../../appRedux/constants/appSessionType';
import Colors from '../../../theme/colors';
import { getTimeDifference } from '../../../utils/helper';
import moment from 'moment';
import { socketConnectionCheck } from '../../../component/socket';
import { loadingShow } from '../../../appRedux/actions/loadingAction';
const DistressSignalHistory = (props) => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const { user_history_list_data, userhistorypageloading, userhistoryPullToRefresh, userhistoryLastPage } = useSelector(state => state.appSession);
    // console.log("user_history_list_data------>",user_history_list_data);
    useEffect(() => {
      dispatch(loadingShow(true));
      socketConnectionCheck();
        userHistoryListData(1)
        AppHeader({
            ...props,
            leftIcon: false,
            headerTitle: true,
            Title: translateText('Distress_signal_history'),
            leftIcon: true,
            leftClick: () => {
                props.navigation.goBack();
            },
            leftImage: imagePath.back,
        });
    }, []);

    const userHistoryListData = (page) => {
   
   

   
        dispatch(userSignalHistoryApi(page)).then(res => {
       
          //  dispatch(loadingShow(false));
          
          if (res && Array.isArray(res) && res?.length > 0) {
            // setNoData(false);
            dispatch(loadingShow(false));
          } else {
            // setNoData(true);
            dispatch(loadingShow(false));
          }
        });
      }
    
  
      
      const methodPullToRefresh = () => {
        if ( userhistoryPullToRefresh || userhistorypageloading) {
          return;
        }
    
        dispatch(sendToUserReducer(PULL_TO_REFRESH_USER_SIGNAL_HISTORY, true));
        setCurrentPage(1);
        userHistoryListData(1);
    
      };
    
    
      const methodOnEndReached = () => {
        if ( userhistoryLastPage <= currentPage ||  userhistorypageloading || userhistoryPullToRefresh) {
          return;
        }
        dispatch(sendToUserReducer(PAGE_LOADING_USER_SIGNAL_HISTORY, true));
        setCurrentPage(currentPage + 1);
        userHistoryListData(currentPage + 1);
    
      };
    
    
    
    //   const noDataFound = () => {
    //     return noData ? <NoDataFound NoData="No event found" color={Colors.primary.BLACK} /> : <></>
    //   };
    
      function footerComponent() {
        return userhistorypageloading ? (
          <View style={{ height: 135 }}>
            <ActivityIndicator size={'large'} color={'#0B6EBC'} />
          </View>
        ) : (
          <View style={{ height: 0 }} />
        );
      }





  const renderItem = ({ item ,index}) => {
    // console.log("here is item",item);
    
    return(
        <View key={index} style={styles.card}>
        <View style={{ flexDirection: 'row',width:'100%'}} >
            {/* <Image source={imagePath.user1} style={[styles.image,{width:'35%'}]} /> */}


            <ImageLoadView
               style={[styles.image]}
                    // resizeMode="conatin"
                    source={item?.venue_detail?.venue_picture ? { uri: IMAGE_URL + item?.venue_detail?.venue_picture } : imagePath.logo}

                />

            {/* <View style={{marginTop:5}} > */}
            <View style={{width:'70%',marginTop:5}} >
            <Text style={[styles.name,{width:'70%',fontFamily:fonts.Montserrat_Bold}]}>{item?.venue_detail?.venue_name}</Text>
                
            <View style={{flexDirection:'row',width:'70%',marginTop:5}}>
            <Image source={imagePath.locationn} 
            // resizeMode='contain' style={[styles.image,{height:20,width:20}]} 
            />

            <Text numberOfLines={2} style={[styles.name,{fontFamily:fonts.Montserrat_Regular,color:'#777',left:10}]}>{item?.venue_detail?.address}</Text>

            </View>
                <View style={{flexDirection:'row',marginTop:5,width:'70%'}}>
            <Image source={imagePath.hands}  
            //  style={[styles.image,{height:20,width:20}]} 
             />

            <Text numberOfLines={2} style={[styles.name,{fontFamily:fonts.Montserrat_Regular,color:'#777',flexGrow:1,left:10}]}>{item?.assistance_type=="security"?"Security Assistance":"Medical Assistance"}</Text>

            </View>
            <View style={{flexDirection:'row',width:'70%',marginTop:5,}}>
            <Image source={imagePath.calendar} 
            //  style={[styles.image,{height:20,width:20}]}
             />

            <Text numberOfLines={2} style={[styles.name,{fontFamily:fonts.Montserrat_Regular,color:'#777',flexGrow:1,left:10}]}>{moment(item?.created_at).format('MM/DD/YYYY')}</Text>

            </View>
            
            </View>
            
                
            {/* </View> */}
            
        </View>
        
        <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
        </View>
    </View>
    )
}
   
    
  return (
    <View style={styles.container} >
    
      
    <FlatList style={{flex:1, paddingHorizontal: 20, marginTop: 20}}
                    data={user_history_list_data}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    onEndReached={methodOnEndReached}
                    // ListEmptyComponent={noDataFound()}
                    contentContainerStyle={{flexGrow:1}}
                    ListFooterComponent={footerComponent()}
                    ListEmptyComponent={<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{ fontSize: fonts.SIZE_13,
                            fontFamily: fonts.Montserrat_Bold,
                            color: Colors.primary.BLACK,
                            marginTop:0}}>No data found</Text>
                  
                            </View>}
                    // ListFooterComponent={footerComponent()}
                    refreshControl={
                      <RefreshControl
                        refreshing={userhistoryPullToRefresh}
                        onRefresh={methodPullToRefresh}
                      />
                    }
                    // keyExtractor={item => item.id}
                />
        

</View>
  );
};

export default DistressSignalHistory;


// DistressSignalHistory;
