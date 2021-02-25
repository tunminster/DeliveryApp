import { wp, hp, normalize, } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
export default {
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: wp(3),
        height: hp(7)
    },
    headerTitle: {
        fontSize: normalize(20),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        marginLeft: wp(5),
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
    title: {
        fontSize: normalize(18),
        fontFamily: 'Roboto-Regular',
    },
    subTitle: {
        fontSize: normalize(16),
        fontFamily: 'Roboto-Regular',
    },
    orderItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        marginVertical: hp(1.5)
    },
    btn: {
        height: hp(7),
        backgroundColor: Colors.tabIconSelected,
        marginTop: hp(4)
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: hp(17),
        width: '100%'
    },
    bottomChildContainer: {
        flexDirection: 'row',
        height: hp(6),
        marginHorizontal: wp(5),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
}