import vars from '../../utils/vars';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'

export default {
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp(6),
        marginVertical: hp(2)
    },
    title: {
        fontFamily: vars.bold,
        fontSize: 24,
        color: vars.txtColor,
        flex: 1,
        marginLeft: 9
    },
    close: {
        width: 25, height: 25,
        marginLeft: 15
    },
    headerChild: {
        flex: 1,
        alignSelf: 'center'
    },
    icon: {
        width: wp(5),
        height: hp(4),
        marginLeft: wp(2),
        alignSelf: 'center'
    },
    headerTitle: {
        fontSize: normalize(14),
        fontFamily: 'Roboto-Regular',
        color: Colors.gray,
        alignItems: 'center',
        marginVertical: hp(1)
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
}