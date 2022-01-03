import React, { Component } from 'react';
import { View, ScrollView, Alert, AsyncStorage, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import Button from '../../components/button';
import BackIcon from '../../components/backIcon';
import {getTotalPrice, post} from '../../utils/helpers';
import { PaymentMethodComponent } from '../../components/PaymentMethodComponent'
import Loading from '../../components/loading';
import { wp, hp, normalize, } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
import vars from "../../utils/vars";
import Store from '../../config/store/index';
class Payment extends Component {

    state = {
        cardData: null,
        disabled: true,
        amount: '',
        viaCart: this.props.route.params.viaCart,
        orderDto: {},
        loading: false,
        orderType: this.props.route.params.orderType
    };

    componentDidMount() {
        console.log(this.props.route.params.viaCart);
    }

    sendRequest() {
        console.log("sendRequest : " + JSON.stringify(this.state.viaCart));
        console.log("card details:" + JSON.stringify(this.state.cardData));
        if (this.state.viaCart) {
            if (this.state.cardData) {
                this.payment();
            } else {
                alert('Please Enter Card Data')
            }
        } else {
            this.addBalance();
        }
    }

    payment() {

        var strExpiryDate = this.state.cardData.values.expiry.toString().split('/');
        var strExpiryMonth = strExpiryDate[0];
        var strExpiryYear = String(new Date().getFullYear()).substr(0, 2) + strExpiryDate[1];
        var totalprice = this.state.viaCart.totalPrice.toFixed(2);
        var strCard = String(this.state.cardData.values.number).replace(/\s/g, '');

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
                    console.log('CapturePayment res', res, ".......", res.orderId);
                    this.setState({ loading: false })
                    this.props.navigation.navigate('PaymentSuccess', { orderId: res.orderId, orderType: this.state.orderType });
                }, err => {
                    console.log('err..', err)
                    this.setState({ loading: false })
                });
            }).catch((error) => {
                console.error(error);
                this.setState({ loading: false })
            });
    }

    renderBillField = (title = '', amount = 0) => (
        <View style={[styles.bottomChildContainer,{height: hp(5)}]}>
            <Text style={{ ...styles.title, color: Colors.black,fontSize:normalize(16) }}>{title}</Text>
            <Text style={{ ...styles.subTitle, color: Colors.black,fontSize:normalize(16) }}>{`${Store?.remoteConfig?.currency} ${(amount / 100).toFixed(2)}`}</Text>
        </View>
    )

    render() {
        const applicationFees = Store.applicationFees
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackIcon
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={styles.headerTitle}>{'Payment'}</Text>
                </View>
                <View style={styles.seperateLine} />
                {this.state.loading ?
                    <Loading /> :
                    <TouchableWithoutFeedback
                        onPress={() => Keyboard.dismiss()}>
                        <View style={styles.childContainer}>
                            <CreditCardInput onChange={cardData => this.setState({ cardData })} />
                            <View style={{flex:1}}>
                                {this.renderBillField(vars.subTotal,applicationFees.subTotal)}
                                {applicationFees?.taxFee > 0 && this.renderBillField(vars.tax,applicationFees?.taxFee)}
                                {applicationFees?.deliveryFee > 0 && this.renderBillField(vars.deliveryFees,applicationFees?.deliveryFee)}
                                {this.renderBillField(vars.applicationFees,applicationFees?.platformFee)}
                                {this.renderBillField('Total Amount',applicationFees?.totalAmount)}
                            </View>
                            <Button
                                onPress={() => this.sendRequest()}
                                title={'Confirm'}
                                style={styles.btn}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
    },
    header: {
        flexDirection: 'row',
        padding: wp(3)
    },
    headerTitle: {
        fontSize: normalize(20),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        marginLeft: wp(5),
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
    childContainer: {
        marginTop: hp(2),
        flex: 1,
        justifyContent: 'space-between'
    },
    btn: {
        margin: wp(6),
        backgroundColor: Colors.tabIconSelected
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: hp(17),
        width: '100%'
    },
    bottomChildContainer: {
        flexDirection: 'row',
        height: hp(6),
        marginHorizontal: wp(3),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
});

export default Payment;