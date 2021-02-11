import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View, Modal } from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import Button from '../../components/button';

class MenuDetailView extends Component {

    render() {
        const { menuDetailVisible, onMenuDetailCancelPress, menuDetaildata, menuDetailCount,
            onUpdateCountPress, onAddBasketPress } = this.props;
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={menuDetailVisible} >
                <View style={styles.modelContainer}>
                    <View style={styles.modelChildContainer}>
                        <TouchableOpacity onPress={() => onMenuDetailCancelPress()}
                            style={styles.modalCancelView} >
                            <Image source={require('../../assets/images/close-icon.png')}
                                style={styles.modelIcon} />
                        </TouchableOpacity>

                        <View style={{ flex: 1, marginHorizontal: wp(4), justifyContent: 'space-between', marginBottom: hp(9) }} showsVerticalScrollIndicator={false}>
                            <View>
                                <Image
                                    source={{ uri: menuDetaildata.productImageUrl }}
                                    resizeMode='cover'
                                    style={styles.modalRestaurantImage} />

                                <View style={{ flexDirection: 'row', marginVertical: hp(1), justifyContent: 'space-between' }}>
                                    <Text style={{ ...styles.restaurantTitle, fontWeight: 'bold' }}>
                                        {menuDetaildata.productName}</Text>
                                    <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, marginRight: wp(2), fontWeight: '700' }}>
                                        {`£ ${(menuDetaildata.unitPrice / 100).toFixed(2)}`}</Text>
                                </View>
                                <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{menuDetaildata.description}</Text>
                            </View>

                            <View style={styles.btnCountContainer}>
                                <TouchableOpacity onPress={() => menuDetailCount > 1 && onUpdateCountPress(-1)} >
                                    <Image source={require('../../assets/images/minus_icon.png')}
                                        style={styles.modelPlusIcon} />
                                </TouchableOpacity>
                                <Text style={styles.modelCountText}>{menuDetailCount}</Text>
                                <TouchableOpacity onPress={() => onUpdateCountPress(1)}>
                                    <Image source={require('../../assets/images/plus_icon.png')}
                                        style={styles.modelPlusIcon} />
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={styles.btnContainer}>
                            <View style={{ ...styles.modelSeperateLine, marginBottom: hp(1) }} />
                            <Button
                                onPress={() => onAddBasketPress(menuDetaildata)}
                                title={'Add to Basket'}
                                style={styles.btn}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

        )
    }
}

export default MenuDetailView;
