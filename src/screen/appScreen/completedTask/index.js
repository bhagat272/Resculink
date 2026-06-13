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
  ActivityIndicator,
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
import { providerSignalHistoryApi } from '../../../appRedux/actions/appSessionAction';
import Colors from '../../../theme/colors';
import NoDataFound from '../../../component/noDataFound';
import { sendToUserReducer } from '../../../appRedux/actions/userSessionAction';
import { PAGE_LOADING_PROVIDER_SIGNAL_HISTORY, PULL_TO_REFRESH_PROVIDER_SIGNAL_HISTORY } from '../../../appRedux/constants/appSessionType';
import moment from 'moment';
import { socketConnectionCheck } from '../../../component/socket';
import { loadingShow } from '../../../appRedux/actions/loadingAction';
const CompletedTask = (props) => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const { provider_history_list_data, providerhistorypageloading, providerhistoryPullToRefresh, providerhistoryLastPage } = useSelector(state => state.appSession);
    // console.log("provider_history_list_data------>",provider_history_list_data);
    

   
    useEffect(() => {
      socketConnectionCheck();
        providerHistoryListData(1)
        dispatch(loadingShow(true));
        AppHeader({
            ...props,
            leftIcon: false,
            headerTitle: true,
            Title: translateText('Completed_tasks'),
            leftIcon: true,
            leftClick: () => {
                props.navigation.goBack();
            },
            leftImage: imagePath.back,
        });
    }, []);
 


  const providerHistoryListData = (page) => {
   
   

    // setLoader(true);
    dispatch(providerSignalHistoryApi(page))
  }


  const methodPullToRefresh = () => {
    if (providerhistoryPullToRefresh || providerhistorypageloading) {
      return;
    }

    dispatch(sendToUserReducer(PULL_TO_REFRESH_PROVIDER_SIGNAL_HISTORY, true));
    setCurrentPage(1);
    providerHistoryListData(1);

  };


  const methodOnEndReached = () => {
    if (providerhistoryLastPage <= currentPage || providerhistorypageloading || providerhistoryPullToRefresh) {
      return;
    }
    dispatch(sendToUserReducer(PAGE_LOADING_PROVIDER_SIGNAL_HISTORY, true));
    setCurrentPage(currentPage + 1);
    providerHistoryListData(currentPage + 1);

  };



//   const noDataFound = () => {
//     return noData ? <NoDataFound NoData="No event found" color={Colors.primary.BLACK} /> : <></>
//   };

  function footerComponent() {
    return providerhistorypageloading ? (
      <View style={{ height: 135 }}>
        <ActivityIndicator size={'large'} color={'#0B6EBC'} />
      </View>
    ) : (
      <View style={{ height: 0 }} />
    );
  }



  const renderItem = ({ item ,index }) => {
    // console.log("item is here ----->",item);
    
    return(
        <View key={index} style={styles.card}>
        <View style={{ flexDirection: 'row',width:'100%'}} >
            {/* <Image source={imagePath.user1} style={[styles.image,{width:'35%'}]} /> */}
            {/* <View style={{marginTop:5}} > */}

            <ImageLoadView
               style={[styles.image]}
                    // resizeMode="conatin"
                    source={item?.user_detail?.profile_picture ? { uri: IMAGE_URL + item?.user_detail?.profile_picture } : imagePath.logo}

                />

            <View style={{width:'70%'}} >
                <Text numberOfLines={2} style={[styles.name,{width:'70%',marginTop:10,fontFamily:fonts.Montserrat_Bold,flexGrow:1,}]}>{item?.user_detail?.name}</Text>
                
                <View style={{flexDirection:'row',marginBottom:5, width:'70%',marginTop:5}}>
            <Image source={imagePath.hands}
            //  style={[styles.image,{height:20,width:20}]}
              />

            <Text numberOfLines={2} style={[styles.name,{width:'70%',fontFamily:fonts.Montserrat_Regular,color:'#777',flexGrow:1,left:10}]}>{item?.assistance_type=="security"?"Security Assistance":"Medical Assistance"}</Text>

            </View>
            <View style={{flexDirection:'row',marginTop:5,width:'70%'}}>
            <Image source={imagePath.calendar}
            //  style={[styles.image,{height:20,width:20}]}
              />

            <Text numberOfLines={2} style={[styles.name,{width:'70%',fontFamily:fonts.Montserrat_Regular,color:'#777',flexGrow:1,left:10}]}>{moment(item?.created_at).format('MM/DD/YYYY')}</Text>

            </View>
            <Text numberOfLines={2} style={[styles.name,{marginTop:5,width:'70%',fontFamily:fonts.Montserrat_Bold}]}>{item?.venue_detail?.venue_name}</Text>


            <View style={{flexDirection:'row',marginTop:5,width:'70%',marginBottom:10}}>


            <Image source={imagePath.locationn}
            //  resizeMode='contain' style={{height:20,width:20}}
              />

            <Text numberOfLines={2} style={[styles.name,{ width:'70%',fontFamily:fonts.Montserrat_Regular,color:'#777',left:10,flexGrow:1,}]}>{item?.venue_detail?.address}</Text>

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
                    data={provider_history_list_data}
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
              refreshing={providerhistoryPullToRefresh}
              onRefresh={methodPullToRefresh}
            />
          }

                    // keyExtractor={item => item.id}
                />
        

</View>
  );
};

export default CompletedTask;
