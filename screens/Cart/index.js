import React, { Component } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import styles from './styles';
import Button from '../../components/button';
import Store from '../../config/store/index';
import { observer } from 'mobx-react';
import CartItem from './CartItem';
import { getTotalPrice } from '../../utils/helpers';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import BackIcon from '../../components/backIcon';


@observer
class Cart extends Component {


    checkout() {
        this.props.navigation.navigate('PaymentType');
    }

    render() {
        console.log('restaurantData', Store.restaurantData)
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackIcon
                        onPress={() => {
                            this.props.navigation.goBack()
                            this.props.route.params.onGoBack()
                        }} />
                    <Text style={{ ...styles.restaurantTitle, color: Colors.black, marginLeft: wp(5), alignSelf: 'center', fontWeight: 'bold' }}>{'Basket'}</Text>
                </View>
                <View style={{ ...styles.seperateLine, }} />

                <Text style={{ ...styles.restaurantTitle, color: Colors.black, marginLeft: wp(5), marginTop: hp(3) }}>{Store.restaurantData.storeName}</Text>
                <View style={styles.childContainer}>
                    <Image source={require('../../assets/images/location.png')} resizeMode='contain' style={styles.icon} />
                    <Text style={{ ...styles.restaurantSubTitle, marginLeft: wp(3) }}>{Store.restaurantData.addressLine1}</Text>
                </View>
                <View style={styles.childContainer}>
                    <Image source={require('../../assets/images/clock.png')} resizeMode='contain' style={styles.icon} />
                    <Text style={{ ...styles.restaurantSubTitle, marginLeft: wp(3) }}>{'Ready in about 15-20 min'}</Text>
                </View>
                <View style={{ ...styles.seperateLine, marginTop: hp(3) }} />

                <ScrollView style={{ marginBottom: hp(17) }}>
                    {Store.cart.map((item, i) => <CartItem
                        onPress={() => this.forceUpdate()}
                        data={item} key={i} index={i} navigation={this.props.navigation} />)}
                    <View style={styles.bottomChildContainer}>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.gray }}>{'Subtotal'}</Text>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.gray }}>{`£ ${(getTotalPrice() / 100).toFixed(2)}`}</Text>
                    </View>
                </ScrollView>

                <View style={styles.bottomContainer}>
                    <View style={{ ...styles.seperateLine, marginTop: 1 }} />
                    <View style={styles.bottomChildContainer}>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.black }}>{'Order Total'}</Text>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.black }}>{`£ ${(getTotalPrice() / 100).toFixed(2)}`}</Text>
                    </View>
                    <View style={{ ...styles.seperateLine, marginTop: 1 }} />
                    <Button
                        onPress={() => this.checkout()}
                        title={'Go to Checkout'}
                        style={styles.btn} />
                </View>
            </View>
        )
    }
}

export default Cart;