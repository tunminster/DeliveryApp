import React, {Component} from 'react';
import {View, AsyncStorage, Text, Image} from 'react-native';
import vars from '../../utils/vars';
import Store from '../../config/store';

class PaymentSuccess extends Component {
    componentDidMount(){
        Store.setCart([]);
        Store.resetCartCount();
        AsyncStorage.multiRemove(['@cart', '@cartCount']);
        setTimeout(() => {
            this.props.navigation.navigate('Home');
        }, 5000);
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: vars.bgColor}}>
                <Text style={{color: 'green', fontSize: 28}}>Payment Successful</Text>
                <Image source={require('../../assets/images/success-icon.png')} style={{width: 45, height: 45, marginTop: 25}} />
            </View>
        );
    }
}

export default PaymentSuccess;