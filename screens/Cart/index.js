import React, {Component} from 'react';
import {View, ScrollView, Image, Text, Alert} from 'react-native';
import styles from './styles';
import Button from '../../components/button';
import sharedStyles from "../../utils/sharedStyles";
import Store from '../../config/store/index';
import {observer} from 'mobx-react';
import Card from './card';
import AuthStore from '../../config/store/auth';
import {getTotalPrice} from '../../utils/helpers';

@observer
class Cart extends Component {
    
    checkout(){
        if(AuthStore.isLogin)
            this.props.navigation.navigate('PaymentType');
        else
            Alert.alert('Warning', 'You must login');
    }

    render(){        
        return (
            <View style={styles.container}>
                {Store.cart.length > 0 ? 
                    <React.Fragment>
                        <ScrollView>
                            <View style={[sharedStyles.section]}>
                                {Store.cart.map((item, i) => <Card data={item} key={i} index={i} navigation={this.props.navigation} />)}
                            </View>
                        </ScrollView>
                        <Button 
                            title={`Checkout - £${(getTotalPrice() / 100).toFixed(2)}`} 
                            onPress={() => this.checkout()}
                        />
                    </React.Fragment>
                    
                    :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{marginBottom: -20}} />
                        <Image source={require('../../assets/images/empty-cart.png')} style={{width: 130, resizeMode: 'contain'}} />
                        <Text style={[styles.txt, {marginTop: 15, fontSize: 19}]}>Your Shopping Cart is Empty</Text>
                    </View>    
                }
            </View>
        )

        
    }
}

export default Cart;