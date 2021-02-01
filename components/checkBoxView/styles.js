import vars from "../../utils/vars";
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'

export default {
    container:{
        flexDirection: 'row',
        padding: wp(4)
    },
    icon: {
        width: wp(4),
        height: wp(4),
        alignSelf: 'center',
        tintColor: Colors.black,
        marginRight: wp(5)
      },
      checkIcon: {
        width: wp(5),
        height: wp(5),
        position: 'absolute',
        right: 0,
        alignSelf: 'center',
        marginHorizontal: wp(3)
      },
      title: {
        width: wp(65),
        fontSize: normalize(16),
        fontFamily: 'Roboto-Regular',
        color: Colors.gray,
        alignSelf: 'center',
      },
}