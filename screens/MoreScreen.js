import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { wp, hp, normalize } from '../helper/responsiveScreen'
import Colors from '../constants/Colors'
import ProfileItem from '../components/profileItem';
import AuthStore from '../config/store/auth';
import { logout } from '../utils/helpers';
import { CommonActions } from '@react-navigation/native';

class MoreScreen extends Component {

  render() {
    const { username } = AuthStore.user;
    const { navigation } = this.props;
    console.log('AuthStore.user', AuthStore.user)
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.headerTitle}>{'My Profile'}</Text>
          <View style={styles.seperateLine} />

          <ProfileItem
            title={'My Details'}
            image={require('../assets/images/user.png')}
            onPress={() => console.log('press')}
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
            onPress={() => console.log('press')}
          />
          <View style={styles.seperateLine} />
        </View>

        <View>
          <View style={styles.seperateLine} />
          <ProfileItem
            title={'LogOut'}
            onPress={() =>  {
              logout(),
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
