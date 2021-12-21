import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Store from '../../config/store';
import { observer } from 'mobx-react'
import { wp, hp, normalize } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
import vars from '../../utils/vars';

@observer
class CartItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menuDetailCount: props.data.count,
        }
    }

    onUpdateCountPress = (index, data, value) => {
        const { onPress } = this.props;
        onPress()
        Store.updateCardItem(index, value)
        Store.cart.map((item, i) => {
            if (data.id == item.id) {
                this.setState({ menuDetailCount: item.count })
            }
        })
    }

    render() {
        const { index, data, onPress, isEdit } = this.props;
        const { menuDetailCount } = this.state;
        return (
            <View>
                <View style={styles.cartContainer}>
                    <View style={{ flexDirection: 'row', }}>
                        {isEdit ?
                            <TouchableOpacity
                                style={{ padding: wp(2), }}
                                onPress={() => {
                                    Store.removeFromCart(index)
                                    onPress()
                                }}>
                                <Image source={require('../../assets/images/close_fill_icon.png')}
                                    style={{ ...styles.cartIcon,  }} />
                            </TouchableOpacity>
                            :
                            <View style={{ flexDirection: 'row', }}>
                                <TouchableOpacity
                                    style={{ padding: wp(2), }}
                                    onPress={() => menuDetailCount > 1 && this.onUpdateCountPress(index, data, -1)}>
                                    <Image source={require('../../assets/images/minus_icon.png')}
                                        style={styles.cartIcon} />
                                </TouchableOpacity>
                                <Text style={{
                                    ...styles.restaurantSubTitle,
                                    fontWeight: '700',
                                    marginHorizontal: wp(1)
                                }}>{menuDetailCount}</Text>
                                <TouchableOpacity
                                    style={{ padding: wp(2) }}
                                    onPress={() => this.onUpdateCountPress(index, data, 1)}>
                                    <Image source={require('../../assets/images/plus_icon.png')}
                                        style={styles.cartIcon} />
                                </TouchableOpacity>
                            </View>
                        }

                        <Text numberOfLines={1} style={{
                            ...styles.restaurantSubTitle,
                            fontWeight: '700',
                            marginLeft: wp(2),
                            width: wp(55),
                        }}>{data.productName}</Text>

                    </View>
                    <Text style={{
                        ...styles.restaurantSubTitle,
                        marginRight: wp(3)
                    }}>{`${Store?.remoteConfig?.currency} ${((data.unitPrice * menuDetailCount) / 100).toFixed(2)}`}</Text>

                </View>
                <View style={styles.seperateLine} />
            </View>
        )
    }
}

export default CartItem;
