import React, {Component} from 'react';
import { View, ScrollView, Alert, Text, TextInput, StyleSheet, AsyncStorage} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import vars from '../../utils/vars';
import {post} from '../../utils/helpers';
import Api from '../../config/api';
import styles from '../../components/button/styles';
import AuthStore from '../../config/store/auth';
import { useForm, Controller } from "react-hook-form";
import {storeData, retrieveData} from '../../components/AuthKeyStorageComponent';
var uuid = require('react-native-uuid');



export default function AddressCreation({navigation}){
    const navigationOptions = ({navigation}) => ({
        headerLeft: <BackIcon navigation={navigation} />
    });

    const {control, handleSubmit, errors } = useForm();
    const onSubmit = data =>{
        console.warn(data);
        const addressDto = {};

        addressDto['customerId'] = AuthStore.user.id;
        addressDto['addressLine'] = data.addressLine;
        addressDto['description'] = '';
        addressDto['city'] = data.city;
        addressDto['postCode'] = data.postCode;
        addressDto['lat'] = '';
        addressDto['lng'] = '';
        addressDto['country'] = data.country;
        addressDto['disabled'] = false;

      
        var STORAGE_KEY = 'id_token';
        retrieveData(STORAGE_KEY)
        .then((data) => {
            let guid = uuid.v1();
            const config = {
                headers: { Authorization: 'Bearer ' + data,'Request-Id': guid}
            };
            
            Api.post('/address/create' , addressDto, config).then(res => {
                console.log(res);
                navigation.navigate('PaymentType');
            }, err => console.error(err));
        });
    }

    return (
        <View style={{flex:1, backgroundColor: vars.bgColor, padding:15}}>
            <Text style={styleSheets.text}>AddressLine:</Text>
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                <TextInput
                    style={styleSheets.input}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                />
                )}
                name="addressLine"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.addressLine && <Text style={styleSheets.text_error}>AddressLine is required.</Text>}

            <Text style={styleSheets.text}>City:</Text>        
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                <TextInput
                    style={styleSheets.input}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                />
                )}
                name="city"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.city && <Text style={styleSheets.text_error}>City is required.</Text>}

            <Text style={styleSheets.text}>Postal code/Postcode:</Text>        
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                <TextInput
                    style={styleSheets.input}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                />
                )}
                name="postCode"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.postCode && <Text style={styleSheets.text_error}>Postcode is required.</Text>}

            <Text style={styleSheets.text}>Country:</Text>        
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                <TextInput
                    style={styleSheets.input}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                />
                )}
                name="country"
                rules={{ required: true }}
                defaultValue=""
            />
            {errors.country && <Text style={styleSheets.text_error}>Country is required.</Text>}

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        

        </View>
    );

    
}

const styleSheets = StyleSheet.create({
    text: {
        alignItems: 'center',
        color: '#0e101c',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        marginLeft:12,
        marginBottom: 5
      },
    text_error:{
        alignItems: 'center',
        color: '#ec5990',
        fontSize: 14,
        fontWeight: '600',
        marginLeft:12,
        marginBottom: 5
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
      },
});

// class AddressCreation extends Component{

//     static navigationOptions = ({navigation}) => ({
//         headerLeft: <BackIcon navigation={navigation} />
//     });

//     state = {
//         customerId: AuthStore.user.id,
//         addressLine: '',
//         description: '',
//         city: '',
//         postCode: '',
//         lat:'',
//         lng:'',
//         country:'',
//         disabled: false,
//         addressDto: {}
//     }

//     constructor(){
//         const {addressLine, description, city, postCode, country} = useForm();
//     }

    

//     handleAddressLine = (event) => {
//         const addressLine = event.target.value
//         this.setState({addressLine: addressLine})
//     }

//     onSubmit = (data) => {
//         console.warn(data);
//     }


//     submit(){
        
//         alert(this.state.addressLine);

//         this.state.addressDto = {
//             customerId: this.state.customerId,
//             addressLine: this.state.addressLine,
//             description: this.state.description,
//             city: this.state.city,
//             postCode: this.state.postCode,
//             lat: this.state.lat,
//             lng: this.state.lng,
//             country: this.state.country,
//             disabled: this.state.disabled
//         }

//         const {addressDto} = this.state;

//         console.warn(addressDto);
//         post('/address/create', addressDto, res => {
//             console.log(res);
//             this.props.navigation.navigate('AddressDetail');
//         }, err => alert('Error in address creation.'));

//     }



//     render(){

//         return (
//             <View style={{flex:1, backgroundColor: vars.bgColor, padding:15}}>
//                 <Text>FirstName</Text>
//                 <Controller
//                     control={control}
//                     render={({ onChange, onBlur, value }) => (
//                     <TextInput
//                         style={styles.input}
//                         onBlur={onBlur}
//                         onChangeText={value => onChange(value)}
//                         value={value}
//                     />
//                     )}
//                     name="firstName"
//                     rules={{ required: true }}
//                     defaultValue=""
//                 />
//                 {errors.firstName && <Text>This is required.</Text>}

//                 <Button title="Submit" onPress={handleSubmit(onSubmit)} />
//                 {/* <Text>Address line</Text>
//                 <Input style={styles.Input}
//                  value={this.state.addressLine} 
//                  onChange={addressLine => this.setState({addressLine})}
//                   />
//                 <Text>{this.state.addressLine}</Text>

//                 <Text>Description</Text>
//                 <Input style={styles.Input}
//                  value={this.state.description} 
//                  //onChange={description => this.setState({description})}
//                   />

//                 <Text>City</Text>
//                 <Input style={styles.Input}
//                  value={this.state.city} 
//                  //onChange={city => this.setState({city})}
//                   />

//                 <Text>Postcode</Text>
//                 <Input style={styles.Input}
//                  value={this.state.postCode} 
//                  //onChange={postCode => this.setState({postCode})}
//                   />

//                 <Text>Country</Text>
//                 <Input style={styles.Input}
//                  value={this.state.country} 
//                  //onChange={country => this.setState({country})}
//                   />      

//                 <Button 
//                     onPress={() => {this.submit()}}
//                     title={'Confirm'}
//                     style={{marginTop: 15}}
//                 /> */}

//             </View>
//         )
//     }
// }

// export default AddressCreation;