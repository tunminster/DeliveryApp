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
        height: hp(7),
        justifyContent: 'space-between'
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
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    scrollView: {
        marginHorizontal: wp(5),
        marginTop: hp(2),
    },
    editView: {
        paddingHorizontal: wp(2),
        paddingVertical: wp(1),
        alignSelf: 'center'
    }
}