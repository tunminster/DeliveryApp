import React, {Component, Fragment} from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import styles from './styles';
import AuthStore from '../../config/store/auth';
import {observer} from 'mobx-react'
import sharedStyles from '../../utils/sharedStyles';
import vars from '../../utils/vars';

class SideNav extends Component{
    render(){
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.li} onPress={() => navigation.navigate('HomeScreen')}>
                    <Text style={styles.txt}>HOME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.li} onPress={() => navigation.navigate('LinksScreen')}>
                    <Text style={styles.txt}>LINKS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.li} onPress={() => navigation.navigate('MenuScreen')}>
                    <Text style={styles.txt}>MENU</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default SideNav;