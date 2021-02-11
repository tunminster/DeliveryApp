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
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    marginLeft: wp(3),
    marginTop: hp(0.5),
    padding: wp(2)
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
  modalMenuTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
    marginBottom: hp(1),
    alignItems: 'center'
  },
  modelSeperateLine: {
    backgroundColor: Colors.border,
    height: wp(0.2),
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