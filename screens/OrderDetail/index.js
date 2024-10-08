import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './styles';
import Button from "../../components/button";
import BackIcon from '../../components/backIcon';
import { wp, hp, normalize } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
import { retrieveData } from '../../components/AuthKeyStorageComponent';
import Api from '../../config/api';
import vars from '../../utils/vars';
import Loading from '../../components/loading';
import Store from "../../config/store";
var uuid = require('react-native-uuid');

class OrderDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            orderDetails: null,
        }
    }

    componentDidMount() {
        const order = this.props.route.params.order;
        this.getOrderDetails(order.id)

    }

    getOrderDetails = (orderId) => {
        var STORAGE_KEY = vars.idToken;

        this.setState({ loading: true })

        retrieveData(STORAGE_KEY)
            .then((data) => {
                let guid = uuid.v1();
                const config = {
                    headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
                };

                console.log('config', config)

                const value = 'orderId=' + orderId + '&timeZone=' + 7
                console.log('value', value)
                Api.get('/Order/GetOrderDetails?' + value, config).then(res => {
                    console.log('GetOrderDetails res...', res);
                    this.setState({ orderDetails: res, loading: false })

                }).catch((error) => {
                    alert('Something went wrong!')
                    console.error(error);
                    this.setState({ loading: false })
                });
            }).catch(err => {
                console.log('err', err)
                this.setState({ loading: false })
            });
    }

    renderBillField = (title = '', amount = 0) => (
        <View style={[styles.bottomChildContainer,{height: hp(5)}]}>
            <Text style={{ ...styles.title, color: Colors.black,fontSize:normalize(16) }}>{title}</Text>
            <Text style={{ ...styles.subTitle, color: Colors.black,fontSize:normalize(16) }}>{`${Store?.remoteConfig?.currency} ${(amount / 100).toFixed(2)}`}</Text>
        </View>
    )

    render() {
        const data = this.props.route.params.order;
        const {orderDetails = {}} = this.state;
        console.log('data...', orderDetails)
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackIcon
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={styles.headerTitle}>{'Order Details'}</Text>
                </View>
                <View style={styles.seperateLine} />

                {this.state.loading ?
                    <Loading /> :

                    <View style={{flex:1}}>

                        <Text style={{ ...styles.title, marginTop: hp(2), alignSelf: 'center', color: Colors.gray }}>{`Order Number`}</Text>
                        <Text style={{ ...styles.subTitle, marginTop: hp(0.5), alignSelf: 'center', color: Colors.black, fontWeight: 'bold' }}>{data.id}</Text>

                        <Text style={{ ...styles.title, marginTop: hp(2), alignSelf: 'center', color: Colors.gray }}>{data.orderType == 1 ? 'Pick Up From' : 'Deliver From'}</Text>
                        <Text style={{ ...styles.subTitle, marginHorizontal: wp(8), marginTop: hp(0.5), textAlign: 'center', color: Colors.black, fontWeight: 'bold' }}>{data.orderType == 1 ? this.state.orderDetails && this.state.orderDetails.storeAddress : data.storeName}</Text>

                        {data.orderType == 2 &&
                            <View>
                                <Text style={{ ...styles.title, marginTop: hp(2), alignSelf: 'center', color: Colors.gray }}>{`Delivered To`}</Text>
                                <Text style={{ ...styles.subTitle, marginHorizontal: wp(8), marginTop: hp(0.5), textAlign: 'center', color: Colors.black, fontWeight: 'bold' }}>{data.deliveryAddress}</Text>
                            </View>
                        }

                        <Text style={{ ...styles.title, marginTop: hp(3), marginBottom: hp(1), marginLeft: wp(5), color: Colors.black, fontWeight: 'bold' }}>{'Items'}</Text>
                        <View style={styles.seperateLine} />

                        <ScrollView style={{ marginBottom: hp(17) }}
                        showsVerticalScrollIndicator={false}>
                            {
                                data.orderItems.map((orderItem, i) =>
                                    <View key={i}>
                                        <View style={styles.orderItemView}>
                                            <Text numberOfLines={1}
                                                style={{ ...styles.subTitle, color: Colors.black, width: wp(73) }}>{`${orderItem.count}  x  ${orderItem.productName}`}</Text>
                                            <Text numberOfLines={1}
                                                style={{ ...styles.subTitle, color: Colors.black, }}>{`${Store?.remoteConfig?.currency} ${((orderItem.productPrice * orderItem.count) / 100).toFixed(2)}`}</Text>
                                        </View>
                                        <View style={styles.seperateLine} />
                                    </View>
                                )}
                            <View style={{flex:1}}>
                            {this.renderBillField(vars.subTotal,orderDetails?.subtotalAmount)}
                            {orderDetails?.taxFees > 0 && this.renderBillField(vars.tax,orderDetails?.taxFees)}
                            {this.renderBillField(vars.deliveryFees,orderDetails?.deliveryFees)}
                            {this.renderBillField(vars.applicationFees,orderDetails?.applicationFees)}
                            </View>
                        </ScrollView>

                        <View style={styles.bottomContainer}>
                            <View style={styles.seperateLine} />
                            <View style={styles.bottomChildContainer}>
                                <Text style={{ ...styles.title, color: Colors.black, fontWeight: 'bold' }}>{'Total'}</Text>
                                <Text style={{ ...styles.subTitle, color: Colors.black }}>{`${Store?.remoteConfig?.currency} ${(data.totalAmount / 100).toFixed(2)}`}</Text>
                            </View>
                            <View style={styles.seperateLine} />
                            <Button
                                onPress={() => this.props.navigation.navigate('Support', { order: data })}
                                title={'Report Problem'}
                                style={styles.btn} />
                        </View>
                    </View>
                }
            </View>
        )
    }
}

export default OrderDetail;
