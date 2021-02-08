import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'

export default {
  basketContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: wp(5),
    right: wp(5),
    bottom: 0,
    // marginBottom: hp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: Colors.tabIconSelected,
    borderRadius: wp(2),
  },
  basketCount: {
    backgroundColor: '#FF7D81',
    borderRadius: wp(1),
    marginLeft: wp(2),
    alignItems: 'center'
  },
  basketTitle: {
    fontFamily: 'Roboto-Regular',
    color: Colors.white,
    alignItems: 'center',
  },
}