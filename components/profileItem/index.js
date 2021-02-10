import React, { Component } from 'react';
import { AppRegistry, Text, Image, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Colors from '../../constants/Colors'
import { wp, hp, normalize } from '../../helper/responsiveScreen'


class ProfileItem extends Component {

    render() {
        const { title, onPress, image } = this.props;
        return (
            <TouchableOpacity style={styles.rowContainer} onPress={() => onPress()}>
                <View style={{ flexDirection: 'row', width: wp(85) }}>
                    {image &&
                        <Image source={image} resizeMode='contain' style={styles.image} />}
                    <Text numberOfLines={1} style={styles.title}>{title}</Text>
                </View>
                <Image source={require('../../assets/images/right_arrow.png')} style={styles.rightIcon} />
            </TouchableOpacity>
        )
    }
}

export default ProfileItem;
