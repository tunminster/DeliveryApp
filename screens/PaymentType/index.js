import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Platform } from 'react-native';
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
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import vars from '../../utils/vars';

@observer
class PaymentType extends Component {
    state = {
        selectedAddress: 0,
        details: {},
        stripePaymentIntentId: '',
        loading: false,
    };

    async componentDidMount() {
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
            const { selectedAddress } = this.state;
            if (selectedAddress) {
                const data = {
                    customerId: AuthStore.user.id,
                    orderItems: [],
                    shippingAddressId: selectedAddress,
                    discount: 0
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

            } else {
                Alert.alert('Warning', 'Choose address', [{ text: 'OK' }]);
            }

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
                        {currencyCode: vars.paymentCurrencyCode } : this.androidItems(), 
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

    render() {
        const { selectedAddress, loading } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={sharedStyles.subTitle}>Choose Address</Text>
                    <View style={sharedStyles.section}>
                        {AuthStore.isLogin && AuthStore.user.addresses.map((item, i) =>

                            <AddressItem item={item} key={i} active={selectedAddress === item.id} onPress={() => this.setState({ selectedAddress: item.id })} />
                        )}
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btnImg} onPress={() => this.props.navigation.navigate('CreateAddress')}>
                                <Text style={styles.btnIcon}>+</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Text style={sharedStyles.subTitle}>Choose Payment Type</Text>
                    {/* <Button 
                        title={'App Balance'}
                        onPress={() => this.payment('balance')}
                        style={{margin:15, marginBottom: 5}}
                    /> */}
                    <Button
                        title={'Credit Card'}
                        onPress={() => this.createPaymentIntent('card')}
                        style={{ margin: 15, marginBottom: 5, borderRadius:5 }}
                    />

                    <Button
                        title={'Pay'}
                        onPress={() => this.createPaymentIntent('pay')}
                        image = {vars.isIos ? require('../../assets/images/apple.png') :require('../../assets/images/google.png')}
                        style={{ margin: 15, marginBottom: 10, backgroundColor: vars.blackColor, borderRadius:5 }}
                    />

                    {loading ? <Loading /> : null}
                </ScrollView>
            </View>
        )
    }
}

export default PaymentType;
