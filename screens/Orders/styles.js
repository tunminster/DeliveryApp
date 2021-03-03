import vars from '../../utils/vars';
import { Dimensions } from 'react-native';
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
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: normalize(18),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        marginLeft: wp(5),
        marginVertical: hp(2),
        fontWeight: 'bold'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp(1),
        marginHorizontal: wp(5),
        alignItems: 'center'
    },
    rightIcon: {
        width: wp(5),
        height: wp(5),
        alignSelf: 'center',
        marginLeft: wp(1),
        tintColor: Colors.tabIconSelected
    },
    image: {
        width: wp(16),
        height: wp(16),
        borderRadius: wp(8),
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.gray
    },
    subTitle: {
        fontSize: normalize(17),
        fontFamily: 'Roboto-Regular',
        marginBottom: hp(0.5)
    },
}