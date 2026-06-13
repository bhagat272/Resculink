import {SOCKET_URL} from '../appRedux/apis/commonValue';
import {DeviceEventEmitter} from 'react-native';
import io from 'socket.io-client';
import { DEVICE_INFO, getDeviceUniqueId, socketInstance } from '../utils/helper';

const socketEvent = {
  send_message: 'send_message',
  getConversationList: 'getConversationList',
  getchats: 'getchats',
  user_block_unblock: 'user_block_unblock',
  read_message: 'read-message',
  accept_request:'accept_request',
  resolved_listner:'resolved_listner',
  party_left:'party_left',
  send_party_group_message:'send_party_group_message',
  canceled_listner:'canceled_listner',
  send_group_message:'send_group_message',
  receive_party_group_message:'receive_party_group_message',
  receive_group_message:'receive_group_message',
  get_group_chats:'get_group_chats',
  get_party_group_chats:'get_party_group_chats',
  become_admin:'become_admin'
  
  
};

const socketConnectionCheck = () => {
  if (socketInstance?.socket) {
    socketInstance?.socket?.connect();
    DeviceEventEmitter.emit('connection', true);
  } else {
    socketInit();
  }
};
const socketInit = async () => {
  let uniqueId = await getDeviceUniqueId();

  socketInstance.socket = io(SOCKET_URL, {
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 3000,
    transports: ['websocket'],
    allowUpgrades: false,
    autoConnect: true,
    pingTimeout: 30000,
    query: {
      user_id: global?.userData?.id,
      device_type: DEVICE_INFO.device_type,
      device_unique_id: uniqueId,
      device_token: DEVICE_INFO.device_token,
    },
  });

  socketInstance.socket.on('connect', data => {
    console.log('========> socket connection')
    DeviceEventEmitter.emit('connection', true);
  });

  socketInstance.socket.on('disconnect', data => {
    if (!socketInstance?.isCustomDisconnect) {
      socketInstance.socket.connect();
    }
  });
  socketInstance.socket.on('connect_error', error => {
  });
  

  
  socketInstance.socket.on('error', data => {
  });

  socketInstance.socket.on('receive_message', response => {
    DeviceEventEmitter.emit('receive_message', response);
  });
  socketInstance.socket.on('become_admin', response => {
    DeviceEventEmitter.emit('become_admin', response);
  });

  

  socketInstance.socket.on('party_left', response => {
    DeviceEventEmitter.emit('party_left', response);
  });

  

  socketInstance.socket.on('receive_party_group_message', response => {
    
    DeviceEventEmitter.emit('receive_party_group_message', response);
  });


  
  
  socketInstance.socket.on('get_party_group_chats', response => {
    DeviceEventEmitter.emit('get_party_group_chats', response);
  });

  

  socketInstance.socket.on('send_group_message', response => {
    DeviceEventEmitter.emit('send_group_message', response);
  });

  socketInstance.socket.on('receive_group_message', response => {
    DeviceEventEmitter.emit('receive_group_message', response);
  });

  


  


  socketInstance.socket.on('accept_request_listener', response => {
    DeviceEventEmitter.emit('accept_request_listener', response);
  });

  socketInstance.socket.on('user_blocked', response => {
    DeviceEventEmitter.emit('user_blocked', response);
  });

  socketInstance.socket.on('resolved_listner', response => {
    DeviceEventEmitter.emit('resolved_listner', response);
  });

  socketInstance.socket.on('canceled_listner', response => {
    DeviceEventEmitter.emit('canceled_listner', response);
  });
  
};

const socketReconnect = () => {
  if (socketInstance.socket && !socketInstance.socket?.connected) {
    socketInstance.socket.connect();
  }
};

const socketCustomDisconnect = () => {
  socketInstance.isCustomDisconnect = true;
  socketInstance.socket.disconnect();
};

const socketCustomLogoutDisconnect = () => {
  socketInstance.isCustomDisconnect = true;
  socketInstance.socket.disconnect();
  socketInstance.socket = null;
};
const socketIsConnected = () => {
  return socketInstance.socket?.connected;
};

const socketEmit = (name, request, cb) => {
  socketIsConnected()
  socketInstance?.socket?.emit(name, request, cb);
};

export {
  socketEvent,
  socketIsConnected,
  socketConnectionCheck,
  socketEmit,
  socketReconnect,
  socketCustomDisconnect,
  socketCustomLogoutDisconnect,
};