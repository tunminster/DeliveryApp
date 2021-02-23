import vars from '../../utils/vars';
import Colors from '../../constants/Colors'
import { wp, hp, normalize } from '../../helper/responsiveScreen'

export default {
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
    },
    header: {
        flexDirection: 'row',
        padding: wp(3),
        justifyContent: 'space-between'
    },
    restaurantTitle: {
        fontSize: normalize(20),
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        alignItems: 'center',
    },
    restaurantSubTitle: {
        fontSize: normalize(16),
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        alignSelf: 'center',
        color: Colors.gray
    },
    icon: {
        width: wp(6),
        height: wp(6),
    },
    childContainer: {
        flexDirection: 'row',
        marginLeft: wp(5),
        marginTop: hp(1.5)
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
    cartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp(1),
        marginLeft: wp(1)
    },
    cartIcon: {
        width: wp(5),
        height: wp(5),
        alignSelf: 'center',
    },
    btn: {
        height: hp(7),
        marginHorizontal: wp(5),
        marginVertical: hp(1.5),
        backgroundColor: Colors.btnColor
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
        marginHorizontal: wp(3),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    editIcon:{
        width: wp(6),
        height: wp(6),
        tintColor: Colors.btnColor
    }
}