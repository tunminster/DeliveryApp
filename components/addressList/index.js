import React, {Component} from 'react';
import {AppRegistry, Text, Image, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Colors from '../../constants/Colors'
// import Navigation from '../../utils/navigationService';

class AddressList extends Component {
    
    render(){
        const {title, active, onPress, image} = this.props;
        return (
            <TouchableOpacity style={styles.container} onPress={() => onPress()}>
                <Image source={image} tintColor={Colors.gray} style={styles.icon} />
                <Text style={styles.title}>{title}</Text>
                <Image source={active ? require('../../assets/images/check.png') : require('../../assets/images/uncheck.png')} tintColor={active ? Colors.green : Colors.gray} style={styles.checkIcon} />
              </TouchableOpacity>
        )
    }
}

export default AddressList;
