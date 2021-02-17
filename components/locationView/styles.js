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
  modelSeperateLine: {
    backgroundColor: Colors.border,
    height: wp(0.2),
  },
  modelSection: {
    height: 'auto',
    backgroundColor: Colors.white,
  },
  modelAddView: {
    flexDirection: 'row',
    padding: wp(4)
  },
  modelNewAddress: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    alignItems: 'center',
    marginLeft: wp(4)
  },
  modelAddIcon: {
    width: wp(6),
    height: wp(6),
    alignSelf: 'center',
  },
  dialogTitle: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    fontWeight: '400',
    alignItems: 'center',
  },
  dialogSubTitle: {
    fontSize: normalize(15),
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    alignItems: 'center',
    marginTop: hp(0.5)
  },
  modelConfirmContainer: {
    width: wp(70),
    flexDirection: 'row',
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center'
  },
  modelVerticalLine: {
    width: 1,
    backgroundColor: Colors.border,
    height: hp(6)
  },
}