import React, { Component } from 'react';
import { AppRegistry, Text, Image, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Colors from '../../constants/Colors'
// import Navigation from '../../utils/navigationService';

class CheckBoxView extends Component {

    render() {
        const { title, active, onPress, image, isCheckBox, container } = this.props;
        return (
            <TouchableOpacity style={{...styles.container, ...container}} onPress={() => onPress()}>
                {image != '' &&
                    <Image source={image} tintColor={Colors.gray} style={styles.icon} />
                }
                <Text style={styles.title}>{title}</Text>
                <Image source={active ?
                    isCheckBox ? require('../../assets/images/check_icon.png') : require('../../assets/images/radio_btn.png') :
                    isCheckBox ? require('../../assets/images/uncheck_icon.png') : require('../../assets/images/radio_btn_empty.png')}
                    tintColor={active ? Colors.green : Colors.gray} style={styles.checkIcon} />
            </TouchableOpacity>
        )
    }
}

export default CheckBoxView;
