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
        tintColor: Colors.black
      },
      checkIcon: {
        width: wp(5),
        height: wp(5),
        alignSelf: 'center',
        marginLeft: wp(1)
      },
      title: {
        width: wp(65),
        fontSize: normalize(16),
        fontFamily: 'Roboto-Regular',
        color: Colors.gray,
        alignSelf: 'center',
        marginLeft: wp(5)
      },
}