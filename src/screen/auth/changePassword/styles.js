import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary.WHITE,
    },
    resetInstruction_text: {
        fontFamily: fonts.Montserrat_Medium,
        fontSize: fonts.SIZE_14,
        color: Colors.secondary.GUNSMOKE,
        textAlign: "center",
        lineHeight: 22
    },
    imageLogo: {
        alignSelf: "center",
        marginTop:20
        // height: 86,
        // width: 86
    }
});

export default styles;