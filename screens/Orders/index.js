import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native'; 
import styles from './styles';
import Api from '../../config/api';
import AuthStore from '../../config/store/auth';
import sharedStyles from '../../utils/sharedStyles';
import moment from 'moment';
import vars from '../../utils/vars';
import {retrieveData} from '../../components/AuthKeyStorageComponent';


class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount(){
        var STORAGE_KEY = vars.idToken;

        retrieveData(STORAGE_KEY)
        .then((data) => {
            const config = {
                headers: { Authorization: 'Bearer ' + data}
            };
    
            Api.get('/order/getByUserId/' + AuthStore.user.id, config).then(res => {
                console.log(res);
                this.setState({ loading: false, orders: res ? res : []});
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>

                {this.state.orders.length > 0 ? 
                
                    <FlatList 
                        data={this.state.orders} 
                        renderItem={({item, index}) =>
                            <TouchableOpacity style={styles.card} onPress={() => this.props.navigation.navigate('OrderDetail', {order: item})}>
                                <View style={[styles.row, {marginBottom: 10}]}>
                                    <Text style={sharedStyles.txt}>Status: {item.orderStatus}</Text>
                                    <Text style={sharedStyles.txt}>{moment(item.dateCreated).format('YYYY-MM-DD')}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={sharedStyles.txt}>Product count: {item.orderItems.length} </Text>
                                    <Text style={sharedStyles.txt}>Total price:  { vars.currency + item.totalAmount.toFixed(2)}</Text>
                                </View>

                            </TouchableOpacity>
                        }  
                        keyExtractor={(item, index) => index.toString()} 
                    />
                    :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={[sharedStyles.txt, {fontSize: 20}]}>You have no orders</Text>
                    </View>
                }
            </View>
        )
    }
}

export default Orders;