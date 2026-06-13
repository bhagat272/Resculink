import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:'white'},
  
  searchHere_View: {
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    marginHorizontal:20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  

  textInputStyle: {
    flex: 0.9, 
    color: Colors.primary.BLACK,
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Montserrat_SemiBold,
  },
  
  search_icon: {
    width: 21,
    height: 21,
    marginHorizontal: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: '#777',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  card: {
    flex:1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15, 
  },
  back_icon: {width: 18, height: 18, tintColor: Colors.primary.WHITE},
});

export default styles;
