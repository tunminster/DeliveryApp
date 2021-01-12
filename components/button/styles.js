import vars from "../../utils/vars";
import { wp } from '../../helper/responsiveScreen';

export default {
    btn: {
        height: 45,
        backgroundColor: vars.baseColor,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    title: {
        color: vars.whiteColor,
        fontFamily: vars.bold,
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 19
    },
    image: {
        tintColor: vars.isIos && vars.whiteColor,
        marginRight: wp(2),
        alignSelf: 'center',
        width: vars.isIos ? wp(4) : wp(5),
        height: wp(5)
    }
}