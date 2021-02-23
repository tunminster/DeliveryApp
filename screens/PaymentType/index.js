import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Platform, Image, TouchableWithoutFeedback } from 'react-native';
import styles from './styles';
import sharedStyles from '../../utils/sharedStyles';
import AuthStore from '../../config/store/auth';
import AddressItem from '../../components/addressItem';
import Button from '../../components/button';
import Store from '../../config/store';
import { getTotalPrice, post } from '../../utils/helpers';
import { observer } from 'mobx-react';
import { PaymentMethodComponent } from '../../components/PaymentMethodComponent'
import Loading from '../../components/loading';
import FullScreenLoader from '../../components/fullScreenLoader';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import vars from '../../utils/vars';
import BackIcon from '../../components/backIcon';
import { wp, hp, normalize, } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const dropDownList = [
    {
        title: 'Pick up order at',
    },
    {
        title: 'Deliver to',
    },
]

@observer
class PaymentType extends Component {
    state = {
        selectedAddress: 0,
        details: {},
        stripePaymentIntentId: '',
        loading: false,
        lat: 0.0,
        lng: 0.0,
        latDelta: 0.1,
        lngDelta: 0.1,
        dropdownVisible: false,
        dropdownValue: 'Pick up order at',
        deliverAddress: this.props.route.params.deliverAddress
    };

    async componentDidMount() {
        console.log('store...', this.state.deliverAddress)
        if (this.state.dropdownValue == 'Pick up order at') {
            this.setState({ lat: Store.restaurantData.location.latitude, lng: Store.restaurantData.location.longitude })
        }
        try {
            await Stripe.setOptionsAsync({
                publishableKey: vars.publishableKey,
                androidPayMode: vars.androidPayMode,
                merchantId: vars.merchantId,
            });
        } catch (error) {
            console.log('error', error)
        }
    }

    prepareCart(stripePaymentIntentId) {
        const newData = {
            products: [],
            totalPrice: getTotalPrice(),
            shippingAddressId: this.state.selectedAddress,
            stripePaymentIntentId: stripePaymentIntentId
        };
        Store.cart.map(product => {
            newData.products.push({ productId: product.id, count: product.count });
        });
        return newData;
    }

    paymentWithBalance(cart) {
        Alert.alert(
            'Information', `${cart.totalPrice}$ Are you sure you want to pay the amount with the app balance`,
            [
                { text: 'Yes', onPress: () => this.checkoutBalance(cart) },
                { text: 'No' }
            ]
        );
    }

    checkoutBalance(cart) {
        if (AuthStore.user.profile.balance >= cart.totalPrice) {
            post('/order/create', { ...cart, type: 'balance' }, res => {
                console.log(res);
                this.props.navigation.navigate('PaymentSuccess');
            }, err => alert('Error'));
        } else
            Alert.alert('Warning', 'You don\'t have enough balance', [{ text: 'Ok' }]);
    }

    createPaymentIntent(type) {
        try {
            const { selectedAddress, dropdownValue } = this.state;
            // if (selectedAddress) {
                const data = {
                    customerId: AuthStore.user.id,
                    orderItems: [],
                    shippingAddressId: selectedAddress,
                    discount: 0,
                    orderType: dropdownValue == 'Pick up order at' ? 1 : 2
                }

                Store.cart.map(product => {
                    data.orderItems.push({ productId: product.id, count: product.count });
                });

                this.setState({ loading: true })

                post('/Order/Payment/CreatePaymentIntent', data, res => {
                    console.log('CreatePaymentIntent res', res);

                    this.setState({
                        stripePaymentIntentId: res.stripePaymentIntentId, loading: false
                    })

                    const cartData = this.prepareCart(res.stripePaymentIntentId);
                    switch (type) {
                        case 'balance':
                            this.paymentWithBalance(cartData);
                            break;
                        case 'card':
                            this.props.navigation.navigate('Payment', { viaCart: cartData });
                            break;
                        case 'pay':
                            this.makePayment()
                            break;
                        default:
                            break;
                    }

                }, err => {
                    this.setState({ loading: false })
                    console.error(err);
                });

            // } else {
            //     Alert.alert('Warning', 'Choose address', [{ text: 'OK' }]);
            // }

        } catch (error) {
            console.error(error.message);
        }
    }

    iosItems() {
        const data = []
        Store.cart.map(product => {
            data.push({
                label: product.productName,
                amount: (product.unitPrice / 100 * product.count).toFixed(2)
            })
        });
        data.push({
            label: vars.labelName,
            amount: (getTotalPrice() / 100).toFixed(2)
        })
        return data;
    }

    androidItems() {
        const data = {
            total_price: (getTotalPrice() / 100).toFixed(2),
            currency_code: vars.paymentCurrencyCode,
            line_items: []
        }

        Store.cart.map(product => {
            data.line_items.push({
                currency_code: vars.paymentCurrencyCode,
                description: product.productName,
                total_price: JSON.stringify((product.unitPrice / 100 * product.count).toFixed(2)),
                unit_price: JSON.stringify((product.unitPrice / 100).toFixed(2)),
                quantity: JSON.stringify(product.count)
            })
        });
        return data;
    }

    async makePayment() {
        try {
            await Stripe.canMakeNativePayPaymentsAsync().then(async (canMakePayment) => {
                if (canMakePayment) {
                    console.log('iosItems', this.iosItems())
                    await Stripe.paymentRequestWithNativePayAsync(vars.isIos ?
                        { currencyCode: vars.paymentCurrencyCode } : this.androidItems(),
                        vars.isIos ? this.iosItems() : '')
                        .then(paymentResponse => {
                            console.log('paymentResponse', JSON.stringify(paymentResponse))
                            this.paymentMethod(paymentResponse.tokenId)
                        })
                } else {
                    Alert.alert('Warning', 'Can not Make Payment', [{ text: 'OK' }]);
                }
            })

        } catch (error) {
            console.error(error.message);
        }
    }

    paymentMethod(paymentToken) {
        const data = "type=card" + "&card[token]=" + paymentToken

        PaymentMethodComponent(data)
            .then(async (responseJson) => {
                console.log('payment method response', responseJson)

                const data = {
                    stripePaymentIntentId: this.state.stripePaymentIntentId,
                    stripePaymentMethodId: responseJson.id,
                    stripeFingerPrint: responseJson.card.fingerprint
                }

                post('/v1/Stripe/Payment/CapturePayment', data, res => {
                    console.log('CapturePayment response', res);
                    (async () => {
                        await Stripe.completeNativePayRequestAsync();
                        this.props.navigation.navigate('PaymentSuccess');
                    })();
                }, err => {
                    console.log('err', err)
                });

            }).catch((error) => {
                console.error(error);
            });
    }

    onDropdownPress = (item) => {
        const { deliverAddress, dropdownVisible } = this.state;
        this.setState({ dropdownVisible: !dropdownVisible, dropdownValue: item.title })
        if (item.title == 'Pick up order at') {
            this.setState({ lat: Store.restaurantData.location.latitude, lng: Store.restaurantData.location.longitude, selectedAddress: 0 })
        } else {
            this.setState({ lat: deliverAddress.lat, lng: deliverAddress.lng, selectedAddress: deliverAddress.id })
        }
    }

    render() {
        const { selectedAddress, loading, lat, lng, latDelta, lngDelta, dropdownVisible, dropdownValue,
            deliverAddress } = this.state;
        return (
            <View style={styles.container}>

                <View>
                    <View style={styles.header}>
                        <BackIcon
                            onPress={() => this.props.navigation.goBack()} />
                        <Text style={styles.headerTitle}>{'Payment'}</Text>
                    </View>
                    <View style={styles.seperateLine} />

                    <TouchableWithoutFeedback onPress={() => this.setState({ dropdownVisible: !dropdownVisible })}>
                        <View style={styles.dropDownView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={require('../../assets/images/clock.png')}
                                    resizeMode='contain' style={styles.icon} />
                                <Text style={{ ...styles.title, marginLeft: wp(3), color: Colors.black, }}>{dropdownValue}</Text>
                            </View>
                            <Image source={dropdownVisible ? require('../../assets/images/up_arrow.png') : require('../../assets/images/down_arrow.png')} style={styles.downIcon} />
                        </View>
                    </TouchableWithoutFeedback>

                    {dropdownVisible &&
                        <View style={styles.dropDownItem}>
                            {dropDownList.map((item, index) =>
                                <TouchableWithoutFeedback key={index}
                                    onPress={() => this.onDropdownPress(item)} >
                                    <View>
                                        <View style={styles.seperateLine} />
                                        <Text style={{ ...styles.title, paddingVertical: hp(0.7), marginLeft: wp(3), color: Colors.black, }}>{item.title}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                    }

                    <View style={styles.mapContainer}>
                        <MapView
                            ref={r => this.mapRef = r}
                            style={styles.mapView}
                            region={{
                                latitude: lat,
                                longitude: lng,
                                latitudeDelta: latDelta,
                                longitudeDelta: lngDelta,
                            }}
                            showsUserLocation={true}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: lat,
                                    longitude: lng,
                                }}
                                draggable
                                draggable={true}
                            />
                        </MapView>
                    </View>

                    <View style={styles.seperateLine} />
                    <View style={{ flexDirection: 'row', paddingVertical: hp(1.5) }}>
                        <View style={{ width: wp(15), alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons
                                name={'home'}
                                size={wp(8)}
                                color={Colors.btnColor} />
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {dropdownValue == 'Pick up order at' &&
                                <Text style={{ ...styles.title, color: Colors.gray, fontWeight: 'bold', alignSelf: 'flex-start' }}>{Store.restaurantData.storeName}</Text>
                            }
                            <Text style={{ ...styles.title, color: Colors.gray, width:wp(80) }}>{
                                dropdownValue == 'Pick up order at' ? `${Store.restaurantData.addressLine1}, ${Store.restaurantData.postalCode}`
                                    : `${deliverAddress.addressLine}, ${deliverAddress.postCode}`}</Text>
                        </View>

                    </View>
                    <View style={styles.seperateLine} />

                </View>

                <View>
                    <Button
                        title={'Credit Card'}
                        onPress={() => this.createPaymentIntent('card')}
                        style={styles.btnCreditCard}
                    />

                    <Button
                        title={'Pay'}
                        onPress={() => this.createPaymentIntent('pay')}
                        image={vars.isIos ? require('../../assets/images/apple.png') : require('../../assets/images/google.png')}
                        style={styles.btnPay}
                    />
                </View>

                <FullScreenLoader
                    loading={loading} />
            </View>
        )
    }
}

export default PaymentType;
