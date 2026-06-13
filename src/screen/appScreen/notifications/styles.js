import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.WHITE,
    },

    renderItem_View: {
        backgroundColor: Colors.secondary.LIGHT_BLUE,
        marginHorizontal: 25,
        borderRadius: 14,
        borderColor: '#F2F2F2',
        borderWidth: 1,
        alignSelf: 'center',
        width: "90%",
        marginBottom: 10,
        flexDirection: "row",
        // minHeight: 100,
        padding: 10
    },
    textView: {
        // marginLeft: 14,
        // paddingHorizontal:14,
        width: "90%",
        minHeight: 120,
        flexDirection: 'row',
        backgroundColor: "blue"
        // flex: 1
    },
    name_txt: {
        fontSize: fonts.SIZE_14,
        color: Colors.primary.BLACK,
        fontFamily: fonts.Montserrat_SemiBold,

    },
    item_txt: {
        fontSize: fonts.SIZE_14,
        color: Colors.primary.BLACK,
        fontFamily: fonts.Montserrat_Regular,
        marginTop:10,
        // lineHeight: 25,
        // marginRight: 5
    },
    notificationTitle_View: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 1,
        paddingHorizontal: 20
    },
    notificationTitle_text: {
        fontSize: fonts.SIZE_14,
        fontFamily: fonts.Montserrat_Regular,
        color: "#111B34",
        // paddingHorizontal:20
    },
    time_text: {
        fontSize: fonts.SIZE_10,
        fontFamily: fonts.Montserrat_Regular,
        color: "#9397A1",
        paddingHorizontal: 11
    },
});

export default styles;
