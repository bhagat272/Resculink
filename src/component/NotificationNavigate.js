export const NAVIGATE_ACTION = {
    ADMIN_NOTIFICATION: "ADMIN_NOTIFICATION",
    Favourite_NOTIFICATION: "Favourite_NOTIFICATION",
    Follow_NOTIFICATION: "Follow_NOTIFICATION",
    unfollow_NOTIFICATION: "unfollow_NOTIFICATION",
    Like_NOTIFICATION: "Like_NOTIFICATION",

    CHAT_MESSAGE: "CHAT_MESSAGE",
    CHAT_SCREEN: "CHAT_SCREEN",
    CHAT: "CHAT",
    GROUP_CHAT: "GROUP_CHAT",
    CALL_NOTIFICATION: "CALL_NOTIFICATION"
}

export const notificationNavigate = (props, str) => {
   
    switch (props?.type) {  
        case NAVIGATE_ACTION.CHAT_SCREEN:
            if (global.chatToUser) {
                global.navRef.goBack()
            }
            setTimeout(() => {
                global.navRef.navigate({
                    name: "ChatScreen", navigation: global.navRef,
                    params: {
                        item:props,
                        from:"inbox"
                    }
                })
            }, 200);
            return;
        case NAVIGATE_ACTION.GROUP_CHAT:
            if (global.chatToUser) {
                global.navRef.goBack()
            }
            setTimeout(() => {
                global.navRef.navigate({
                    name: "GroupChat", navigation: global.navRef,
                    params: {
                      otherDetail: props,
                      from:"hope"
                    }
                })
            }, 200);
            return;
        default:
            return;
    }

}

