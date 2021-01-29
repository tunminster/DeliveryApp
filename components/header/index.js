import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import HeaderRight from './right';
import styles from './styles';

class Header extends Component {
    render() {
        const { title } = this.props;

        return (
            <View style={styles.header}>
                <View style={styles.headerChild}>
                    <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
                    <View style={styles.seperateLine} />
                </View>
                <Image source={require('../../assets/images/location.png')} style={styles.icon} />
            </View>
        )
    }
}

export default Header;