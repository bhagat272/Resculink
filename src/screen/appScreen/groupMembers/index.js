import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    Image,
    Text,
    SafeAreaView,
    TextInput,
    FlatList,
    Platform,
} from 'react-native';
// import imagePath from '../../../theme/imagePath';
import styles from './styles';
import AppHeader from '../../../navigation/appHeader';
import imagePath from '../../../theme/imagePath';
import ImageLoadView from '../../../utils/imageLoadView';
import { IMAGE_URL } from '../../../appRedux/apis/commonValue';
import Colors from '../../../theme/colors';
import { translateText } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { loadingShow } from '../../../appRedux/actions/loadingAction';
import { employeeListApi } from '../../../appRedux/actions/appSessionAction';
import fonts from '../../../theme/fonts';
let searchTimer = null;
import NoDataFound from '../../../component/noDataFound';
import { socketConnectionCheck } from '../../../component/socket';
const GroupMembers = (props) => {
    const dispatch = useDispatch();
    const [placeHide, setPlaceHide] = useState(false);
    const [text, setText] = useState('');
    const [noData, setNoData] = useState(false)
    const {type,item} = props?.route?.params
    ? props?.route?.params
    : false;
    const { employeeListData} = useSelector(state => state.appSession);
    useEffect(() => {
        socketConnectionCheck();
        
        AppHeader({
            ...props,
            leftIcon: false,
            headerTitle: true,
            Title: translateText('Group_member'),
            leftIcon: true,
            notificationIcon: false,
            heightRightImg: 35,
            widthRightImg: 35,
            notification: imagePath.Groupuser,
            leftClick: () => {
                props.navigation.goBack();
            },
            notificationClick: () => {
            },
            leftImage: imagePath.back,
        });
    }, []);



    useEffect(() => {
        dispatch(loadingShow(true));
        const data = {
          venue_id: item,
          search:text
        };
        dispatch(employeeListApi(data)).then(res => {

            if (res && Array.isArray(res) && res?.length > 0) {
                setNoData(false)
                dispatch(loadingShow(false));
              } else {
                setNoData(true)
                dispatch(loadingShow(false));
              }
        });
       
      }, []);
      




  
    const renderItemAcept = ({ item ,index}) => {
      
        

        return(
            <View key={index} style={styles.card}>
            <View style={{ flexDirection: 'row', flex:1, alignItems: 'center' }} >
              {item?.profile_picture?
                <ImageLoadView
    source={{ uri: IMAGE_URL + item?.profile_picture }}
    resizeMode="cover"
    style={styles.image} 
  />:<Image source={imagePath.logo} style={styles.image} />}

                <View style={{width:'60%',paddingVertical:10}} >
                    <Text numberOfLines={2} style={styles.name}>{item?.name}</Text>
                    <Text numberOfLines={3}  style={styles.time}>{item?.address}</Text>
                   
                </View>
            </View>
           
        </View>
        )
    }
       
        
    const noDataFound = () => {
        return noData ? <NoDataFound NoData={translateText('No_data_found')}/> : <></>
      };

    return (
        <View style={styles.container} >

            <View style={styles.searchHere_View}>
                <Image
                    source={imagePath.search}
                    style={styles.search_icon}
                    resizeMode="contain"
                />
                <TextInput style={styles.textInputStyle}
                    placeholder={translateText('Search')}
                    placeholderTextColor={Colors.secondary.GREY_CHATEAU}
                    
                    value={text}
                    onChangeText={text => {
                        if (text.trim() == '') {
                            setPlaceHide(false);
                        } else {
                            setPlaceHide(true);
                        }
                        setText(text);
                          if (text.trim() == '') {
                            setPlaceHide(false);
                          } else {
                            setPlaceHide(true);
                          }
                          setText(text);
                          if (searchTimer) {
                            clearTimeout(searchTimer);
                          }
                          searchTimer = setTimeout(() => {
                            const data = {
                                venue_id: item,
                                search:text
                              };
                            dispatch(employeeListApi(data));
                          }, 1000);
                    }}
                    
                />
                
                {placeHide ? (
                    <TouchableOpacity onPress={() => {
                        setPlaceHide(false);
                        setText('');
                        const data = {
                            venue_id: item,
                            search:''
                          };
                        dispatch(employeeListApi(data));
                    }}>
                        <Image
                            source={imagePath.cancle}
                            style={{ right: -10 }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                ) : (
                    <></>
                )}
            </View>


                {employeeListData?.length>0?
                <FlatList style={{flex:1, paddingHorizontal: 20, marginTop: 10}}
                    data={employeeListData}
                    renderItem={renderItemAcept}
                    contentContainerStyle={{flexGrow:1}}
                    keyExtractor={(item, index) => index.toString()}
                />:
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={styles.name}>No member found</Text>
                    </View>}

        </View>
    );
};

export default GroupMembers;
