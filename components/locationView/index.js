import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Modal, ScrollView, } from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import CheckBoxView from '../checkBoxView';
import AuthStore from '../../config/store/auth';
import { add } from 'react-native-reanimated';

class LocationView extends Component {

  render() {
    const { isModalVisible, onLocationCancelPress, onNewAddressPressHandler, addressesId,
      onCurrentLocationPress, onAddressPress, newOrderModelVisible, newStoreName, newOrderCancel, onConfirmPress } = this.props;

    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={isModalVisible}>
        <View style={styles.modelContainer}>
          <View style={styles.modelChildContainer}>

            <TouchableOpacity onPress={() => onLocationCancelPress()} style={styles.closeView} >
              <Image source={require('../../assets/images/close_fill_icon.png')}
                style={styles.closeIcon} />
            </TouchableOpacity>

            <View style={styles.modelHeaderView}>

              <Text style={{ ...styles.modelHeaderTitle, textAlign: 'center' }}>Select Location</Text>
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

            <Modal
              transparent={true}
              animationType={'none'}
              visible={newOrderModelVisible} >
              <View style={styles.modelContainer}>
                <View style={{ backgroundColor: Colors.white, width: wp(70) }}>
                  <Text style={{ ...styles.dialogTitle, marginVertical: hp(1.5), fontWeight: 'bold', alignSelf: 'center' }}>{'Select new address?'}</Text>
                  <Text style={{ ...styles.dialogSubTitle, marginHorizontal: wp(7), color: Colors.gray }}>{'Items currently from '}
                    <Text style={{ ...styles.dialogSubTitle, color: Colors.black }}>{newStoreName}</Text>
                    <Text style={{ ...styles.dialogSubTitle, color: Colors.gray }}>{' will be removed'}</Text></Text>

                  <View style={{ ...styles.modelSeperateLine, marginTop: hp(1.5) }} />

                  <View style={styles.modelConfirmContainer}>
                    <TouchableOpacity style={{ width: wp(35) }} onPress={() => newOrderCancel()}>
                      <Text style={{ ...styles.dialogTitle, textAlign: 'center', }}>{'Cancel'}</Text>
                    </TouchableOpacity>
                    <View style={styles.modelVerticalLine} />
                    <TouchableOpacity style={{ width: wp(35) }} onPress={() => onConfirmPress()}>
                      <Text style={{ ...styles.dialogTitle, textAlign: 'center', }}>{'Confirm'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          </View>
        </View>
      </Modal>

    )
  }
}

export default LocationView;
