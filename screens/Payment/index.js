import React, { Component } from 'react';
import { View, ScrollView, Alert, AsyncStorage, Text } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import Button from '../../components/button';
import BackIcon from '../../components/backIcon';
import Input from '../../components/input';
import { post } from '../../utils/helpers';
import AuthStore from '../../config/store/auth';
import sharedStyles from '../../utils/sharedStyles';
import { PaymentMethodComponent } from '../../components/PaymentMethodComponent'
import Loading from '../../components/loading';

class Payment extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: <BackIcon navigation={navigation} />
    });

    state = {
        cardData: {},
        disabled: true,
        amount: '',
        viaCart: this.props.route.params.viaCart,
        orderDto: {},
        loading: false,
    };

    componentDidMount() {
        console.log(this.props.route.params.viaCart);
    }

    sendRequest() {
        console.log("sendRequest : " + JSON.stringify(this.state.viaCart));
        console.log("card details:" + JSON.stringify(this.state.cardData));
        if (this.state.viaCart)
            this.payment();
        else
            this.addBalance();
    }

    // addBalance() {
    //     alert('added balanced.');
    //     post('/user/updateBalance', {balance: this.state.amount}, res => {
    //         console.log(res);
    //         AsyncStorage.setItem('user', JSON.stringify(res.user));
    //         AuthStore.setUser(res.user);
    //         Alert.alert('Payment Success', 'Balance added: ' + this.state.amount + '$', [{text: 'Ok', onPress: ()=>this.props.navigation.goBack()}]);
    //     }, err => Alert.alert('Error', err.response.data, [{text: 'Ok'}]));
    // }

    payment() {

        var strExpiryDate = this.state.cardData.values.expiry.toString().split('/');

        var strExpiryMonth = strExpiryDate[0];
        var strExpiryYear = String(new Date().getFullYear()).substr(0, 2) + strExpiryDate[1];


        var totalprice = this.state.viaCart.totalPrice.toFixed(2);
        var strCard = String(this.state.cardData.values.number).replace(/\s/g, '');

        // this.state.orderDto = {
        //     cardHolderName: "Test Holder name",
        //     cardNumber: strCard,
        //     cvc: this.state.cardData.values.cvc,
        //     expiryMonth: strExpiryMonth,
        //     expiryYear: strExpiryYear,
        //     totalAmount: totalprice,
        //     customerId: AuthStore.user.id,
        //     shippingAddressId: this.state.viaCart.shippingAddressId,
        //     saveCard: true,
        //     orderItems: this.state.viaCart.products
        // }

        //const {viaCart} = this.state;
        // const { orderDto } = this.state;
        // console.log('orderDto', orderDto)
        // post('/order/create', orderDto, res => {
        //     console.log(res);
        //     this.props.navigation.navigate('PaymentSuccess');
        // }, err => alert('Error in Payment.'));

        const data = "type=card" + "&card[number]=" + strCard + "&card[exp_month]=" + strExpiryMonth
            + "&card[exp_year]=" + strExpiryYear + "&card[cvc]=" + this.state.cardData.values.cvc

        this.setState({ loading: true })

        PaymentMethodComponent(data)
            .then((responseJson) => {
                console.log('payment method responseJson', responseJson)

                const data = {
                    stripePaymentIntentId: this.state.viaCart.stripePaymentIntentId,
                    stripePaymentMethodId: responseJson.id,
                    stripeFingerPrint: responseJson.card.fingerprint
                }

                post('/v1/Stripe/Payment/CapturePayment', data, res => {
                    console.log('CapturePayment res', res);
                    this.setState({ loading: false })
                    this.props.navigation.navigate('PaymentSuccess');
                }, err => {
                    console.log('err..', err)
                    this.setState({ loading: false })
                });
            }).catch((error) => {
                console.error(error);
                this.setState({ loading: false })
            });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                {this.state.loading ? <Loading /> :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <CreditCardInput onChange={cardData => this.setState({ cardData })} />
                        <View style={{ margin: 15 }}>
                            {this.state.viaCart ?
                                <Text>

                                </Text>
                                :
                                <Input
                                    label={'Amount($)'}
                                    value={this.state.amount}
                                    onChange={amount => this.setState({ amount })}
                                    type={'numeric'}
                                />
                            }
                            <Button
                                onPress={() => this.sendRequest()}
                                title={'Confirm'}
                                style={{ marginTop: 15 }}
                            />


                        </View>
                    </ScrollView>
                }
            </View>
        )
    }

}

export default Payment;