import React, { Component } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import styles from './styles';
import { BackIcon, Button, Input } from "../../components";
import { post } from "../../utils/helpers";
import { Dropdown } from 'react-native-material-dropdown-v2';
import moment from 'moment';
import PhoneInput from 'react-native-phone-input';

class Support extends Component {

    state = {
        subject: '',
        message: '',
        reportcategory: '',
        categories: [{ value: 'Payment' }, { value: 'Order' }, { value: 'Bug problem' }, { value: 'Feedback' }]
    };

    componentDidMount() {
        this.setState({
            pickerData: this.phone.getPickerData()
        })
    }

    _send() {

        var contactnumber = this.phone.getValue();
        const { id, orderStatus, dateCreated } = this.props.route.params.order;

        this.state.message += `
        Order id: ${id}
        Shipping status: ${orderStatus}
        Order time: ${moment(dateCreated).format('YYYY/MM/DD')}`;

        const { subject, message, reportcategory } = this.state;

        if (this.phone.isValidNumber()) {

            if (subject && message && reportcategory) {
                post('/reportorder/create', { subject, contactnumber, reportcategory, message }, res => {
                    console.log(res);
                    Alert.alert('Successful', 'Your support request has been created', [{
                        text: 'Ok', onPress: () => this.props.navigation.navigate('Home')
                    }]);
                });
            } else {
                Alert.alert('Warning', 'Please fill in all fields', [{ text: 'Ok' }]);
            }
        } else {
            Alert.alert('Warning', 'Please enter valid telephone number', [{ text: 'Ok' }]);

        }
    }



    selectCountry(country) {
        this.phone.selectCountry(country.iso2);

        this.setState({ cca2: country.cca2 })
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackIcon
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={styles.headerTitle}>{'Report Problem'}</Text>
                </View>
                <View style={styles.seperateLine} />

                <ScrollView showsVerticalScrollIndicator={false}
                    style={styles.ScrollView}>
                    {/* <Text style={[sharedStyles.txt, {fontSize: 20}]}>Support</Text> */}
                    <Input
                        value={this.state.subject}
                        onChange={subject => this.setState({ subject })}
                        // style={styles.inputText}
                        label={'Subject'} />

                    <Text style={styles.txtContactNumber}>Contact Number</Text>
                    <PhoneInput
                        ref={(ref) => {
                            this.phone = ref;
                        }}
                        onPressFlag={this.onPressFlag}
                        initialCountry='us'
                        autoFormat="true"
                    />

                    <Dropdown
                        label='Choose category'
                        data={this.state.categories}
                        value={this.state.reportcategory}
                        onChangeText={(value, index, data) => this.setState({ reportcategory: value })} />
                    <Input
                        value={this.state.message}
                        onChange={message => this.setState({ message })}
                        label={'Message'}
                    />

                </ScrollView>
                <Button
                    title={'Send'}
                    onPress={() => this._send()}
                    style={styles.btn}
                />
            </View>
        )
    }
}

export default Support;