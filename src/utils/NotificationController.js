import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
// import { alert } from './alertController';

const NotificationController = props => {
  PushNotification.configure({
    onNotification: notification => {
      // console.log(
      //   'global.notificationData ------',
      //   JSON.stringify(notification),
      // );
      if (notification) {
        //   global.navRef.navigate('NotificationsDetail')
        props?.onClick(notification);
        // notificationNavigate(notification);
      }
    },
  });

  useEffect(() => {
    //   var date = new Date();
    //   const unsubscribe = messaging().onMessage(async remoteMessage => {
    //     // console.log('remoteMessage------>Notification controller', remoteMessage.data);
    //     let value=remoteMessage?.data?.extras?JSON.parse(remoteMessage?.data?.extras):''
    //     console.log("value------",value);
    //     console.log("global.notification_other_userI---",global.notification_other_userId,value?.other_user_id);

    //     // console.log("global.notification_group_id====>>", global.notification_group_id !=value?.responseData?.group_id)
    //     console.log("global.notification_group_id====>>", global.notification_group_id)
    //     if(global.notification_other_userId!=value?.user_id){
    //       PushNotification.createChannel(
    //       {
    //         channelId: 'channel-id', // (required)
    //         channelName: 'My channel', // (required)
    //         channelDescription: 'A channel to categorize your notifications', // (optional) default: undefined.
    //         playSound: false, // (optional) default: true
    //         soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    //         importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    //         vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    //       },
    //       created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    //     );

    //     PushNotification.localNotification({
    //       channelId: 'channel-id',
    //       message: remoteMessage?.notification?.body,
    //       title: remoteMessage?.notification?.title,
    //       userInfo:remoteMessage?.data

    //       // bigPictureUrl: remoteMessage.notification.android.imageUrl,
    //       // smallIcon: remoteMessage.notification.android.imageUrl,
    //       // date: new Date(new Date().getTime() + 5000),

    //     });
    //     }

    //   });
    //   return unsubscribe;
    // }, []);

    // return null;

    var date = new Date();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const sendType = remoteMessage?.data?.type;

      // console.log('remoteMessage------>Notification controller', remoteMessage);
      PushNotification.createChannel(
        {
          channelId: 'channel-id', // (required)
          channelName: 'My channel', // (required)
          channelDescription: 'A channel to categorize your notifications', // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: 'default', // (optional) See soundName parameter of localNotification function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        // created =>
        //  console.log(createChannel returned '${created}')
        // (optional) callback returns whether the channel was created, false means it already existed.
      );

      PushNotification.localNotification({
        channelId: 'channel-id',
        message: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
        userInfo: remoteMessage?.data,

        // bigPictureUrl: remoteMessage.notification.android.imageUrl,
        // smallIcon: remoteMessage.notification.android.imageUrl,
        // date: new Date(new Date().getTime() + 5000),
      });
    });
    return unsubscribe;
  }, []);

  return null;
};

export default NotificationController;
