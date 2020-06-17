import React, {Component} from 'react';
import { View, ScrollView, Alert} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import MapView, {Marker} from 'react-native-maps';
import vars from '../../utils/vars';
import {post} from '../../utils/helpers';

class AddressDetail extends Component{
    state ={
        city: '',
        description: '',
        addressLine: '',
        postCode: '',
        lat: '',
        lng: '',
        country: '',
        loading: true,
    };

    componentDidMount(){
        const addressData = this.props.route.params.addressData;
        console.log("Address data is : " + JSON.stringify(addressData));
        this.setState({...addressData, loading: false});
    }

    _delete(){
        const {id} = this.props.route.params.addressData;
        
        alert('Warning', 'Are you sure for delete this address', [{text: 'Yes', onPress: () =>{
            post('/user/deleteAddress', {addressId: id}, res => {
                console.log("delete address" + res);
                this.props.navigation.goBack();
            });
        }}, {text: 'No'}]);
    }

    render(){
        const {lat, lng} = this.state;
        const {addressLine, postCode} = this.state;
        return (
            <View style={{flex:1, backgroundColor: vars.bgColor, padding:15}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Input 
                        label={addressLine}
                        value={addressLine}
                        onChange={addressLine => this.setState({addressLine})}
                        containerStyle={{paddingBottom:5}}
                        editable={false}
                    />

                    <Input 
                        label={postCode}
                        value={postCode}
                        onChange={postcode => this.setState({postcode})}
                        multiline
                        editable={false}
                    />
                    <View style={{marginBottom:10}} />
                    <MapView
                        region={{
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        style={{height: 250}}
                    >
                        <Marker 
                            coordinate={{latitude: lat, longitude: lng}}
                            title={this.state.addressLine}
                        />
                    </MapView>

                    <Button 
                        title={'Delete'}
                        onPress={() => this._delete()}
                        style={{backgroundColor: '#d63f2f', marginTop: 20}}
                    />
                    
                </ScrollView>
            </View>
        )
    }

}
export default AddressDetail;