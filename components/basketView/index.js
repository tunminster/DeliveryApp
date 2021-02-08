import React, { Component } from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'

class basketView extends Component {

    render() {
        const { count, amount, style, onPress } = this.props;
        return (
            <TouchableOpacity style={{ ...styles.basketContainer, ...style }} onPress={() => onPress()}>
                <Text style={{ ...styles.basketTitle, fontSize: normalize(18) }}>View Basket</Text>
                <View style={styles.basketCount}>
                    <Text style={{ ...styles.basketTitle, fontSize: normalize(15), marginHorizontal: wp(2), marginVertical: hp(0.3) }}>{count}</Text>
                </View>
                <Text style={{ ...styles.basketTitle, position: 'absolute', right: 0, alignSelf: 'center', marginRight: wp(4), fontSize: normalize(19) }}>{amount}</Text>
            </TouchableOpacity>
        )
    }
}

export default basketView;
