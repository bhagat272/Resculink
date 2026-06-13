import {StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor:"white"},
  name: {
    // fontWeight: 'bold',
    color:'black',
    fontSize: 16,
  },
  time: {
    color: '#777',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 15,
  },
  card: {
    // flexDirection: 'row',
    flex:1,
    // width:'100%',
    // padding: 15,
    borderColor:'#f2f2f2',borderWidth:1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default styles;
