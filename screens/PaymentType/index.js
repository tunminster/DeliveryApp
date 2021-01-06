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
import { PaymentRequest } from 'react-native-payments';
import { PaymentMethodComponent } from '../../components/PaymentMethodComponent'
import Loading from '../../components/loading';

const METHOD_DATA_IOS = [
    {
        supportedMethods: ['apple-pay'],
        data: {
            merchantIdentifier: 'merchant.com.deliveryapp.app1',
            supportedNetworks: ['visa', 'mastercard', 'amex'],
            countryCode: 'US',
            currencyCode: 'USD',
        }
    },
];

const METHOD_DATA_ANDROID = [{
    supportedMethods: ['android-pay'],
    data: {
        supportedNetworks: ['visa', 'mastercard', 'amex'],
        currencyCode: 'USD',
        environment: 'TEST',
        paymentMethodTokenizationParameters: {
            tokenizationType: 'GATEWAY_TOKEN',
            parameters: {
                gateway: 'stripe',
                publicKey: 'pk_test_51GtEA4ETaaP0kb6bNP6OATyBmPerdnIXrAJyjDP9gfgtSOzoka3hnSWmUNYGDKRsnfMshdneaxcl45za3ow47yx300BNFC7CXr',
            },
        }
    }
}];

@observer
class PaymentType extends Component {
    state = {
        selectedAddress: 0,
        details: {},
        stripePaymentIntentId: '',
        loading: false,
    };

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

    // payment(type) {
    //     if (this.state.selectedAddress) {
    //         const cartData = this.prepareCart();
    //         switch (type) {
    //             case 'balance':
    //                 this.paymentWithBalance(cartData);
    //                 break;
    //             case 'card':
    //                 this.props.navigation.navigate('Payment', { viaCart: cartData });
    //                 break;
    //             default:
    //                 break;
    //         }
    //     } else {
    //         Alert.alert('Warning', 'Choose address', [{ text: 'OK' }]);
    //     }
    // }

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

                    const detail = {
                        id: res.stripePaymentIntentId,
                        displayItems: [],
                        total: {
                            label: 'Delivery',
                            amount: { currency: 'USD', value: getTotalPrice() }
                        }
                    }

                    Store.cart.map(product => {
                        detail.displayItems.push({
                            label: product.productName,
                            amount: { currency: "USD", value: (product.unitPrice * product.count) }
                        })
                    });
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
                            this.makePayment(detail)
                            break;
                        default:
                            break;
                    }

                }, err => {
                    this.setState({ loading: false })
                });

            } else {
                Alert.alert('Warning', 'Choose address', [{ text: 'OK' }]);
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    makePayment(detail) {
        try {
            const paymentRequest = new PaymentRequest(Platform.OS == 'android' ? METHOD_DATA_ANDROID : METHOD_DATA_IOS, detail);

            paymentRequest.canMakePayments().then((canMakePayment) => {
                if (canMakePayment) {
                    console.log('Can Make Payment')

                    paymentRequest.show()
                        .then(paymentResponse => {
                            // Your payment processing code goes here
                            const { paymentToken, } = paymentResponse.details;

                            console.log('paymentResponse', JSON.stringify(paymentResponse))
                            console.log('paymentToken', paymentToken)

                            this.paymentMethod(paymentToken, paymentResponse)
                        });
                }
                else {
                    console.log('Can not Make Payment')
                }
            })

        } catch (error) {
            console.error(error.message);
        }
    }

    paymentMethod(paymentToken, paymentResponse) {

        const data = "type=card" + "&card[token]=" + paymentToken

        PaymentMethodComponent(data)
            .then((responseJson) => {
                console.log('payment method responseJson', responseJson)

                const data = {
                    stripePaymentIntentId: this.state.stripePaymentIntentId,
                    stripePaymentMethodId: responseJson.id,
                    stripeFingerPrint: responseJson.card.fingerprint
                }

                post('/v1/Stripe/Payment/CapturePayment', data, res => {
                    console.log('CapturePayment res', res);
                    this.props.navigation.navigate('PaymentSuccess');
                }, err => {
                    console.log('err..', err)
                });

                paymentResponse.complete('success');
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
                        style={{ margin: 15, marginBottom: 5 }}
                    />

                    <Button
                        title={Platform.OS == 'android' ? 'Google Pay' : 'Apple Pay'}
                        onPress={() => this.createPaymentIntent('pay')}
                        style={{ margin: 15, marginBottom: 10 }}
                    />

                    {loading ? <Loading /> : null}
                </ScrollView>
            </View>
        )
    }
}

export default PaymentType;
