import React, {Component} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import sharedStyles from '../../utils/sharedStyles';
import styles from './styles';
import moment from 'moment';
import Button from "../../components/button";
import ProductCard from '../../components/productCard';
import vars from '../../utils/vars';

class OrderDetail extends Component {
    render() {
        const data = this.props.route.params.order;
        return (
            <View style={styles.container}>

                <ScrollView showsVerticalScroll={false}>
                    <View style={styles.padding}>
                        <Text style={sharedStyles.txt}>Order Id: <Text style={styles.bold}>{data.id}</Text></Text>
                        <Text style={sharedStyles.txt}>Shipping Status: <Text style={styles.bold}>{data.orderStatus}</Text></Text>
                        <Text style={sharedStyles.txt}>Order Time: <Text style={styles.bold}>{moment(data.dateCreated).format('YYYY/MM/DD')}</Text></Text>
                    </View>
                    <View style={[sharedStyles.section, styles.section]}>
                        <Text style={sharedStyles.subTitle}>Products</Text>
                        <View style={styles.divider} />
                        {
                            data.orderItems.map((orderItem, i) => 
                                <View style={styles.card} key={i}>
                                    <Image source={{uri: orderItem.productImageUrl}} style={styles.img} />
                                    <View style={{flex: 1}}>
                                        <Text style={sharedStyles.txt}>{orderItem.productName}</Text>
                                        <Text style={sharedStyles.txt}>Quantity: <Text style={styles.bold}>{orderItem.count}</Text></Text>
                                        <Text style={sharedStyles.txt}>Price: <Text style={styles.bold}>{vars.currency + orderItem.productPrice.toFixed(2)} </Text></Text>
                                        
                                    </View>

                                </View>
                            )
                        }
                        <Text style={[sharedStyles.txt, {margin: 5, marginLeft: 10}]}>Total Price: {data.totalAmount.toFixed(2)}</Text>
                    </View>
                </ScrollView>

                <Button 
                    title={'Report a Problem'} 
                    onPress={() => this.props.navigation.navigate('Support', {order: data})} />

            </View>
        )

    }
}

export default OrderDetail;
