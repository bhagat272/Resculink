import NetInfo from '@react-native-community/netinfo';
  export const isNetworkAvailable = async () => {
    return await NetInfo.fetch().then(state => {
      return state.isConnected
    }).catch(error => {
      return false
    });
  }