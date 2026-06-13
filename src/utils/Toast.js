import { showMessage, hideMessage } from 'react-native-flash-message';
import Colors from '../theme/colors';
 
export  function showToastMessage(message, type = 'danger') {
    showMessage({
      message: message,
      type: type  ,
      // backgroundColor:type=="success"?"#25c879":Colors.LAPIS_BLUE//'danger', 'success', 'info','warning'
    });
  }

  