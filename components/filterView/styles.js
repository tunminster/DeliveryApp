import { wp, hp, normalize } from '../../helper/responsiveScreen'
import { Platform } from 'react-native';
import Colors from '../../constants/Colors'

export default {
  modelContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  modelChildContainer: {
    backgroundColor: Colors.white,
    height: hp(90),
    width: wp(90),
    // paddingBottom: hp(2.5),
    // borderRadius: wp(5)
  },
  modelHeaderView: {
    flexDirection: 'row',
    padding: wp(2)
  },
  modelIcon: {
    width: wp(5),
    height: wp(5),
    alignSelf: 'center',
  },
  modelHeaderTitle: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    alignItems: 'center',
    marginLeft: wp(2),
    marginVertical:wp(2)
  },
  clearView: {
    position: 'absolute',
    right: 0,
    marginRight: wp(2),
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical:wp(2)
  },
  btnClear: {
    marginHorizontal: wp(5),
    height: hp(4.5),
  },
  modelSeperateLine: {
    backgroundColor: Colors.border,
    height: wp(0.2),
  },
  modelSection: {
    height: 'auto',
    backgroundColor: Colors.white,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0,
    height: hp(8),
    width: '100%'
  },
  btn: {
    height: hp(6),
    marginHorizontal: wp(5),
    marginBottom: hp(1)
  },
}