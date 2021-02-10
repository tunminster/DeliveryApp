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
    tintColor: Colors.gray
  },
  title:{
    fontSize: normalize(20),
    fontFamily: 'Roboto-Regular',
    color: Colors.gray,
    fontWeight: '500',
    alignItems: 'center',
  },
  rightIcon: {
    width: wp(4),
    height: wp(4),
    alignSelf: 'center',
    
    marginLeft:wp(1)
  }
}