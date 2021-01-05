import React, {Component} from 'react';
import {AppRegistry, Text, Image, TouchableOpacity, View} from 'react-native';
import styles from './styles';
// import Navigation from '../../utils/navigationService';

class AddressItem extends Component {
    
    static navigationOptions = ({navigation}) => ({
        title: "Address"
    });

    render(){
        const {item, active, onPress, notTransparent} = this.props;
        return (
            <View style={{opacity: active || notTransparent ? 1 : 0.5}}>
                <TouchableOpacity 
                    style={styles.item} 
                    onPress={() => onPress ? onPress() : this.props.navigation.navigate('AddressDetail', {addressData: item})}
                    >
                        {active ? <Image source={require('../../assets/images/checkmark.png')} style={styles.check} /> : null }
                        <Text style={styles.title}>{item.addressLine}</Text>
                        <Text style={styles.description} numberOfLines={2}>{item.city} , {item.postCode}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default AddressItem;
