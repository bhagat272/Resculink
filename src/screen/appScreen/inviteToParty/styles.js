import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:'white'},
  
  searchHere_View: {
    // width: "90%",
    // flex:1,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    // shadowColor: "#00000027",
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 0.51,
    // shadowRadius: 13.16,
    // elevation: 20,
    marginHorizontal:20,
    // alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 15,
    marginVertical: 10,
  },
  

  textInputStyle: {
    flex: 1, 
    // margin:15,
    paddingHorizontal:15,
    // backgroundColor:'red',
    color: Colors.primary.BLACK,
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  

  search_icon: {
    width: 21,
    height: 21,
    marginHorizontal: 15,
  },
  name: {
    // fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: '#777',
  },
  image: {
    width: 100,
    height: 100,
    // borderRadius: 25,
    marginRight: 15,
  },
  imageview:{ flex: 1, left: 20, marginTop: 20 },
  nameview:{ width: 100, height: 100, borderRadius: 10, backgroundColor: '#0B6EBC', justifyContent: 'center', alignItems: 'center' },
  flatlistmainview: { flexDirection: 'row', flex: 1, alignItems: "center", justifyContent: 'center' },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 100,
    flex: 1,
    width: "90%",
    alignSelf: "center"
  },
  back_icon: {width: 18, height: 18, tintColor: Colors.primary.WHITE},
});

export default styles;
