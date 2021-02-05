import React, { Component } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import AuthStore from '../../config/store/auth';
import sharedStyles from '../../utils/sharedStyles';
import AddressItem from '../../components/addressItem';
import { observer } from 'mobx-react';
import vars from '../../utils/vars';
import { logout } from '../../utils/helpers';
import { CommonActions } from '@react-navigation/native';


@observer
class Account extends Component {


    render() {
        const { username } = AuthStore.user;
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.head}>
                        <Image source={require('../../assets/images/avatar.png')} style={sharedStyles.avatar} />
                        <Text style={styles.name}>{username && username}</Text>
                    </View>

                    <View style={sharedStyles.section}>
                        <TouchableOpacity style={sharedStyles.li} onPress={() => navigate('ProfileEdit')}>
                            <Text style={sharedStyles.txt}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={sharedStyles.li} onPress={() => navigate('ChangePassword')}>
                            <Text style={sharedStyles.txt}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={sharedStyles.li} onPress={() => navigate('Orders')}>
                            <Text style={sharedStyles.txt}>Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={sharedStyles.li} onPress={() => {
                            logout(),
                             this.props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        { name: 'SignIn' }
                                    ],
                                })
                            );
                        }}>
                            <Text style={sharedStyles.txt}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={sharedStyles.subTitle}>Addresses</Text>
                    <View style={sharedStyles.section}>
                        {Object.entries(AuthStore.user).length != 0 && AuthStore.user.addresses.map((item, i) => <AddressItem item={item} key={i} notTransparent={true} navigation={this.props.navigation} />)}
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btnImg} onPress={() => this.props.navigation.navigate('CreateAddress')} >
                                <Text style={styles.btnIcon}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
}

export default Account;