import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import Button from "../../components/button";
import { BackIcon, Input } from '../../components';
import { wp, hp, normalize } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
import { retrieveData, storeUser } from '../../components/AuthKeyStorageComponent';
import Api from '../../config/api';
import vars from '../../utils/vars';
import AuthStore from '../../config/store/auth';
import FullScreenLoader from "../../components/fullScreenLoader"

var uuid = require('react-native-uuid');

class MyDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            isEdit: false,
            firstName: '',
            lastName: '',
            contactNumber: ''
        }
    }

    componentDidMount() {
        if (Object.entries(AuthStore.user).length != 0) {
            this.setState({
                firstName: AuthStore.user.firstName,
                lastName: AuthStore.user.lastName,
                contactNumber: AuthStore.user.contactNumber
            })
        }
        // this.getOrderDetails()
    }

    updateCustomer = () => {
        const { isEdit, firstName, lastName, contactNumber } = this.state;
        var STORAGE_KEY = vars.idToken;


        if (isEdit) {
            this.setState({ loading: true })

            retrieveData(STORAGE_KEY)
                .then((token) => {
                    let guid = uuid.v1();
                    const config = {
                        headers: { Authorization: 'Bearer ' + token, 'Request-Id': guid }
                    };

                    console.log('config', config)

                    const data = {
                        customerId: AuthStore.user.id,
                        firstName: firstName,
                        lastName: lastName,
                        contactNumber: contactNumber
                    }
                    console.log('data..', data)

                    Api.put('/Customer/Update-Customer', data, config).then(res => {
                        console.log('Update-Customer res...', res);

                        storeUser(token).then((data) => {
                            this.setState({ loading: false, isEdit: !isEdit })
                            alert('Successfully Updated!');
                        });

                    }).catch((error) => {
                        alert('Something went wrong!')
                        console.error(error);
                        this.setState({ loading: false })
                    });
                }).catch(err => {
                    console.log('err', err)
                    this.setState({ loading: false })
                });
        } else {
            this.setState({ isEdit: !isEdit })
        }
    }

    render() {
        const { isEdit, firstName, lastName, contactNumber, loading } = this.state;
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <BackIcon
                            onPress={() => this.props.navigation.goBack()} />
                        <Text style={styles.headerTitle}>{'My Details'}</Text>
                    </View>

                    <TouchableOpacity style={styles.editView}
                        onPress={() => this.updateCustomer()}>
                        <Text style={{ ...styles.title, color: Colors.tabIconSelected }}>{isEdit ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.seperateLine} />

                <ScrollView showsVerticalScrollIndicator={false}
                    style={styles.scrollView}>
                    <Input
                        value={firstName}
                        onChangeText={text => this.setState({ firstName: text })}
                        label={'First Name'}
                        editable={isEdit ? true : false}
                        style={{ marginBottom: hp(1.5) }}
                    />

                    <Input
                        value={lastName}
                        onChangeText={text => this.setState({ lastName: text })}
                        label={'Last Name'}
                        editable={isEdit ? true : false}
                        style={{ marginBottom: hp(1.5) }}
                    />

                    <Input
                        value={contactNumber}
                        onChangeText={text => this.setState({ contactNumber: text })}
                        label={'Phone Number'}
                        keyboardType={'phone-pad'}
                        editable={isEdit ? true : false}
                        style={{ marginBottom: hp(1.5) }}
                    />

                </ScrollView>

                <FullScreenLoader
                    loading={loading} />

            </View>
        )
    }
}

export default MyDetails;
