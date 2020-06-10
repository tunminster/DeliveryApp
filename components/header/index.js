import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import HeaderRight from './right';
import styles from './styles';

class Header extends Component {
    render() {
       const {title, left, right, close} = this.props;

        return (
            <View style={styles.header}>
                <View style={{flex: 1}}>
                    {left ?
                        <TouchableOpacity onPress={() => close()}>
                            <Image source={require('../../assets/images/close-icon.png')} style={styles.close} />
                        </TouchableOpacity>
                        :
                        <HeaderLeft navigation={this.props.navigation} />
                    }
                </View>
                <Text style={styles.title}>{title ? title : 'MaiThai'}</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    {right ?
                        <View />
                        :
                        <HeaderRight navigation={this.props.navigation} />
                    }
                </View>
            </View>
        )
    }
}

export default Header;