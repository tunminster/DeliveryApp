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
  modalCancelView: {
    padding: wp(1),
    marginLeft: wp(-3),
    marginTop: wp(-3),
  },
  modelIcon: {
    width: wp(5),
    height: wp(5),
    alignSelf: 'center',
  },
  modalRestaurantImage: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: hp(1),
    height: Platform.OS == 'ios' ? hp(24) : hp(28),
    borderRadius: wp(2)
  },
  restaurantTitle: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    fontWeight: '400',
    alignItems: 'center',
  },
  restaurantSubTitle: {
    fontSize: normalize(15),
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    alignItems: 'center',
    marginTop: hp(0.5)
  },
  modelSeperateLine: {
    backgroundColor: Colors.border,
    height: wp(0.2),
  }, 
  btnCountContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: wp(1),
    borderColor: Colors.gray,
    marginBottom: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(2.5),
    marginHorizontal: wp(1)
  },
  modelPlusIcon: {
    width: wp(6),
    height: wp(6),
    alignSelf: 'center',
  },
  modelCountText: {
    fontSize: normalize(18),
    fontFamily: 'Roboto-Regular',
    alignItems: 'center',
    marginHorizontal: wp(7),
    alignSelf: 'center',
    color: Colors.gray,
    fontWeight: '700'
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
    marginBottom: hp(1),
    backgroundColor: Colors.tabIconSelected
  },
}