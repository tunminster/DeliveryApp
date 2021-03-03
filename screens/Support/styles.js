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
    txtContactNumber: {
        marginVertical: hp(2.5),
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'Roboto-Regular',
        // alignItems: 'center',
        // justifyContent: 'flex-start'
    },
    btn: {
        backgroundColor: Colors.tabIconSelected,
        margin: wp(5)
    },
    ScrollView: {
        marginHorizontal: wp(5),
        marginTop: hp(1)
    }
}