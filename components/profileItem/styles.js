import vars from "../../utils/vars";
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'

export default {
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(2),
    marginHorizontal: wp(5),
    alignItems: 'center'
  },
  image: {
    width: wp(6),
    height: wp(6),
    alignSelf: 'center',
    marginRight: wp(3),
    tintColor: Colors.btnColor
  },
  title:{
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    alignItems: 'center',
  },
  rightIcon: {
    width: wp(4),
    height: wp(4),
    alignSelf: 'center',
    tintColor: Colors.btnColor,
    marginLeft:wp(1)
  }
}