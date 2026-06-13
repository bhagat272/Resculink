import {Platform, StyleSheet} from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewDescribe: {
    backgroundColor: '#F6F6F6',
    height: 150,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 25,
    textAlignVertical: 'top',
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  footer_view: {
    backgroundColor: Colors.primary.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#EBEBEB',
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 10,
    marginLeft: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    width: '30%',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    marginTop: 5,
  },
  camera_pic: {
    height: 18,
    width: 18,
  },
  textInput_view: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 15,
    maxHeight: 120,
    paddingVertical: Platform.OS == 'ios' ? 12 : 0,
  },
  container_loader: {
    marginVertical: 10,
  },
  to_day_txt: {
    fontFamily: fonts.Montserrat_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.BLACK,
  },
  date_center_view_parent: {
    backgroundColor: '#E6E6E6',
    alignSelf: 'center',
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textInput_style: {
    flex: 1,
    marginHorizontal: 10,
    minHeight: 40,
  },
  send_pic: {
    height: 40,
    width: 40,
  },
  map: {
    height: 600,
    width: '100%',
    marginTop: 20,
  },
  view_modal: {
    backgroundColor: Colors.primary.WHITE,
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 35,
  },
  tapToRecord_text: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Regular,
    color: 'black',
    minWidth: 35,
  },
  pause_icon: {
    width: 30,
    height: 30,
    tintColor: '#000',
  },
});

export default styles;
