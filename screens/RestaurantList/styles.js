import vars from '../../utils/vars';
import { Platform } from 'react-native';
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
        padding: wp(3)
    },
    headerTitle: {
        fontSize: normalize(20),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        marginLeft: wp(5),
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    restaurantContainer: {
        backgroundColor: Colors.white,
        borderRadius: wp(2),
        padding: wp(2.5),
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: wp(1),
        elevation: 2,
        width: wp(90),
        marginBottom: hp(2),
        marginLeft: 1
    },
    restaurantImage: {
        width: '100%',
        height: Platform.OS == 'ios' ? hp(24) : hp(28),
        borderRadius: wp(2)
    },
    restaurantTitle: {
        fontSize: normalize(18),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        fontWeight: '400',
        alignItems: 'center',
        marginTop: hp(1.5)
    },
    restaurantSubTitle: {
        fontSize: normalize(15),
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        alignItems: 'center',
        marginTop: hp(0.5),
        color: Colors.gray
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
    flatelistContainer: {
        paddingTop: hp(2),
        alignSelf: 'center',
        paddingRight: 1
    },
    txtNoResult: {
        marginTop: hp(1),
        fontFamily: 'Roboto-Regular',
        fontSize: normalize(18),
        alignSelf: 'center',
        color: '#777777',
      },
}