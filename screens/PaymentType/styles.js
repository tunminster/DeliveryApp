import vars from "../../utils/vars";
import Colors from '../../constants/Colors'
import { wp, hp, normalize, isX } from '../../helper/responsiveScreen'

export default {
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
    },
    btnContainer: {
        height: 130,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnImg: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: vars.baseColor,
        borderRadius: 35
    },
    btnIcon: {
        fontFamily: vars.bold,
        color: vars.txtColor,
        fontSize: 35,
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
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
    icon: {
        width: wp(6),
        height: wp(6),
    },
    title: {
        fontSize: normalize(18),
        fontFamily: 'Roboto-Regular',
    },
    downIcon: {
        width: wp(4),
        height: wp(4),
        marginRight: wp(1)
    },
    dropDownView: {
        height: hp(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: wp(2),
        marginVertical: hp(2),
        marginHorizontal: wp(5),
        borderRadius: wp(2),
        borderColor: Colors.border,
        borderWidth: 1,
        backgroundColor: Colors.white
    },
    dropDownItem: {
        width: wp(90),
        position: 'absolute',
        zIndex: 2,
        marginTop: isX ? hp(14.5) : hp(15.6),
        backgroundColor: Colors.white,
        marginHorizontal: wp(5),
        borderBottomLeftRadius: wp(2),
        borderBottomRightRadius: wp(2),
        borderColor: Colors.border,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    mapContainer: {
        borderRadius: wp(1),
        borderColor: Colors.border,
        borderWidth: 1,
        height: hp(40),
        width: wp(90),
        marginLeft: wp(5),
        marginBottom: hp(2),
        alignItems: 'center',
    },
    mapView: {
        flex: 1,
        width: wp(89),
        alignSelf: 'center'
    },
}