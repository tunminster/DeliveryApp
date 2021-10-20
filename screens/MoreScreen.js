import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { wp, hp, normalize } from '../helper/responsiveScreen'
import Colors from '../constants/Colors'
import ProfileItem from '../components/profileItem';
import AuthStore from '../config/store/auth';
import { logout } from '../utils/helpers';
import { CommonActions } from '@react-navigation/native';
import LocationView from "../components/locationView"
import Geolocation from '@react-native-community/geolocation'

class MoreScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      addressesId: 0,
      curLatitude: '',
      curLongitude: '',
    }
  }

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.callLocation()
    })
  }

  componentWillUnmount() {
    this.focusListener();
  }

  callLocation() {
    console.log('callLocation Called')

    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        console.log(
          'Location....',
          position.coords.latitude + ' ' + position.coords.longitude,
        )
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }
        this.setState({
          curLatitude: region.latitude,
          curLongitude: region.longitude
        })
      },
      error => {
        console.log('Error...', JSON.stringify(error))
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 5000 },
    )

  }

  refresh() {
    this.setState({ isModalVisible: true });
    setTimeout(() => {
      this.forceUpdate()
    }, 1000)
  }

  onNewAddressPressHandler = () => {
    const { curLatitude, curLongitude } = this.state
    this.setState({ isModalVisible: false })
    this.props.navigation.navigate('CreateAddress', {
      onGoBack: () => this.refresh(),
      curLatitude: curLatitude,
      curLongitude: curLongitude
    })
  }

  onCurrentLocationPress = () => {
    this.setState({
      isModalVisible: false,
      addressesId: 0
    }, () => {
      this.callLocation()
    })
  }

  onAddressPress = (item) => {
    this.setState({
      isModalVisible: false,
      addressesId: item.id,
    })
  }

  render() {
    const { username } = AuthStore.user;
    const { navigation } = this.props;
    const { isModalVisible, addressesId } = this.state;
    
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerTitle}>{'My Profile'}</Text>
          <View style={styles.seperateLine} />

          <ProfileItem
            title={'My Details'}
            image={require('../assets/images/user.png')}
            onPress={() => navigation.navigate('MyDetails')}
          />
          <View style={styles.seperateLine} />

          <ProfileItem
            title={'My Orders'}
            image={require('../assets/images/order.png')}
            onPress={() => navigation.navigate('Orders')}
          />
          <View style={styles.seperateLine} />

          <ProfileItem
            title={'Saved addresses'}
            image={require('../assets/images/location.png')}
            onPress={() =>this.setState({ isModalVisible: true })}
          />
          <View style={styles.seperateLine} />

        </View>

        <LocationView
          isModalVisible={isModalVisible}
          onLocationCancelPress={() => this.setState({ isModalVisible: false })}
          onNewAddressPressHandler={() => this.onNewAddressPressHandler()}
          addressesId={addressesId}
          onCurrentLocationPress={() => this.onCurrentLocationPress()}
          onAddressPress={(item) => this.onAddressPress(item)}
          newOrderModelVisible={false}
          newStoreName={''}
          newOrderCancel={() => console.log('cancel')}
          onConfirmPress={() => console.log('confirm')}
        />

        <View>
          <View style={styles.seperateLine} />
          <ProfileItem
            title={'LogOut'}
            onPress={() => {
              logout();
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      { name: 'SignIn' }
                    ],
                  })
                );
            }}
          />
          <View style={styles.seperateLine} />
          <ProfileItem
            title={`Logged in as ${username}`}
            onPress={() => console.log('press')}
          />
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontFamily: 'Roboto-Regular',
    color: Colors.black, margin: wp(4), alignSelf: 'center', fontWeight: 'bold'
  },
  seperateLine: {
    backgroundColor: Colors.border,
    height: wp(0.2),
  },
});

export default MoreScreen;
