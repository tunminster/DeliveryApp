import React, {Component} from 'react';
import {View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import sharedStyles from '../../utils/sharedStyles';
import AuthStore from '../../config/store/auth';
import AddressItem from '../../components/addressItem';
import Button from '../../components/button';
import Store from '../../config/store';
import {getTotalPrice, post} from '../../utils/helpers';
import {observer} from 'mobx-react';

@observer
class PaymentType extends Component{
    state ={
        selectedAddress:0
    };

    prepareCart(){
        const newData ={
            products: [],
            totalPrice: getTotalPrice(),
            shippingAddressId: this.state.selectedAddress
        };
        Store.cart.map(product =>{
            newData.products.push({productId: product.id, count: product.count});
        });
        return newData;
    }

    payment(type){
        if(this.state.selectedAddress){
            const cartData = this.prepareCart();
            switch (type) {
                case 'balance':
                    this.paymentWithBalance(cartData);
                    break;
                case 'card':
                    this.props.navigation.navigate('Payment', {viaCart: cartData});
                    break;
                default:
                    break;
            }
        }else {
            Alert.alert('Warning', 'Choose address', [{text: 'OK'}]);
        }
    }

    paymentWithBalance(cart){
        Alert.alert(
            'Information', `${cart.totalPrice}$ Are you sure you want to pay the amount with the app balance`,
            [
                {text: 'Yes', onPress: () => this.checkoutBalance(cart)},
                {text: 'No'}
            ]
        );
    }

    checkoutBalance(cart) {
        if (AuthStore.user.profile.balance >= cart.totalPrice) {
            post('/order/create', {...cart, type: 'balance'}, res => {
                console.log(res);
                this.props.navigation.navigate('PaymentSuccess');
            }, err => alert('Error'));
        } else
            Alert.alert('Warning', 'You don\'t have enough balance', [{text: 'Ok'}]);
    }

    render(){
        const {selectedAddress} = this.state;
        
        return(
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={sharedStyles.subTitle}>Choose Address</Text>
                    <View style={sharedStyles.section}>
                        {AuthStore.isLogin && AuthStore.user.addresses.map((item, i) =>
                            
                            <AddressItem item={item} key={i} active={selectedAddress === item.id} onPress={() => this.setState({selectedAddress: item.id})} />
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
                        onPress={() => this.payment('card')}
                        style={{margin:15, marginBottom: 5}}
                    />
                </ScrollView>
            </View>
        )
    }
}

export default PaymentType;
