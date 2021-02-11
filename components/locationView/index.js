import React, { Component } from 'react';
import {Text, Image, TouchableOpacity, View, Modal,ScrollView,} from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import CheckBoxView from '../checkBoxView';
import AuthStore from '../../config/store/auth';

class LocationView extends Component {

    render() {
        const { isModalVisible, onLocationCancelPress, onNewAddressPressHandler, addressesId,
        onCurrentLocationPress, onAddressPress} = this.props;
        return (
            <Modal
              transparent={true}
              animationType={'none'}
              visible={isModalVisible}>
              <View style={styles.modelContainer}>
                <View style={styles.modelChildContainer}>
                  <View style={styles.modelHeaderView}>
                    <TouchableOpacity onPress={() => onLocationCancelPress()} style={{ alignSelf: 'center', padding: wp(2) }} >
                      <Image source={require('../../assets/images/close-icon.png')} style={{
                        ...styles.modelIcon,
                        tintColor: Colors.black
                      }} />
                    </TouchableOpacity>
                    <Text style={styles.modelHeaderTitle}>Select Location</Text>
                  </View>
                  <View style={styles.modelSeperateLine} />

                  <TouchableOpacity style={styles.modelAddView} onPress={() => onNewAddressPressHandler()}>
                    <Image source={require('../../assets/images/add.png')} style={styles.modelAddIcon} />
                    <Text style={styles.modelNewAddress}>New Adddress</Text>
                  </TouchableOpacity>

                  <View style={styles.modelSeperateLine} />

                  <CheckBoxView
                    active={addressesId === 0}
                    image={require('../../assets/images/navigation.png')}
                    title={'Current Location'}
                    onPress={() => onCurrentLocationPress()}
                  />

                  <View style={styles.modelSeperateLine} />

                  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.modelSection}>
                      {Object.entries(AuthStore.user).length != 0 && AuthStore.isLogin && AuthStore.user.addresses.slice(0).reverse().map((item, i) =>
                        <View key={i}>
                          <CheckBoxView
                            active={addressesId === item.id}
                            image={require('../../assets/images/location_outline.png')}
                            title={item.addressLine}
                            onPress={() => onAddressPress(item)}
                          />
                          <View style={styles.modelSeperateLine} />
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>

        )
    }
}

export default LocationView;
