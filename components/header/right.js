import React, {Component} from 'react';
import {TouchableOpacity, Image, View, Text} from 'react-native';
import Store from '../../config/store';


class HeaderRight extends Component {
    

    render(){
        return (
                <TouchableOpacity style={{paddingRight: 15, position: 'relative'}} onPress={() => this.props.navigation.navigate('Cart')} >
                    <Image source={require('../../assets/images/cart-icon-white.png')} style={{width: 29, height: 32, resizeMode: 'contain'}} />
                    <View style={{width: 20, height: 20, borderRadius: 10, position: 'absolute', backgroundColor: '#fff', bottom: -7, right: 7, justifyContent: 'center'}}>
                        <Text style={{color: '#000', textAlign: 'center', fontSize: 10}}>{Store.cartCount}</Text>
                    </View>
              </TouchableOpacity>
        )
    }
}

export default HeaderRight;