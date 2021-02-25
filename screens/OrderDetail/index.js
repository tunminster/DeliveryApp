import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './styles';
import Button from "../../components/button";
import BackIcon from '../../components/backIcon';
import { wp, hp, normalize } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'

class OrderDetail extends Component {
    
    render() {
        const data = this.props.route.params.order;
        console.log('data...', data)
        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <BackIcon
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={styles.headerTitle}>{'Order Details'}</Text>
                </View>
                <View style={styles.seperateLine} />

                <Text style={{ ...styles.title, marginTop: hp(2), alignSelf: 'center', color: Colors.gray }}>{`Order Number`}</Text>
                <Text style={{ ...styles.subTitle, marginTop: hp(0.5), alignSelf: 'center', color: Colors.black, fontWeight: 'bold' }}>{data.id}</Text>

                <Text style={{ ...styles.title, marginTop: hp(2), alignSelf: 'center', color: Colors.gray }}>{`Deliver From / Pick Up From `}</Text>
                <Text style={{ ...styles.subTitle, marginTop: hp(0.5), textAlign: 'center', color: Colors.black, fontWeight: 'bold' }}>{data.storeName}</Text>

                <Text style={{ ...styles.title, marginTop: hp(2), alignSelf: 'center', color: Colors.gray }}>{`Delivered To`}</Text>
                <Text style={{ ...styles.subTitle, marginHorizontal: wp(8), marginTop: hp(0.5), textAlign: 'center', color: Colors.black, fontWeight: 'bold' }}>{'Broadway Road, 137, SW19 1QW'}</Text>

                <Text style={{ ...styles.title, marginTop: hp(3), marginBottom: hp(1), marginLeft: wp(5), color: Colors.black, fontWeight: 'bold' }}>{'Items'}</Text>
                <View style={styles.seperateLine} />

                <ScrollView style={{ marginBottom: hp(17) }}>
                    {
                        data.orderItems.map((orderItem, i) =>
                            <View key={i}>
                                <View style={styles.orderItemView}>
                                    <Text numberOfLines={1}
                                        style={{ ...styles.subTitle, color: Colors.black, width: wp(73) }}>{`${orderItem.count}  x  ${orderItem.productName}`}</Text>
                                    <Text numberOfLines={1}
                                        style={{ ...styles.subTitle, color: Colors.black, }}>{`£ ${((orderItem.productPrice * orderItem.count) / 100).toFixed(2)}`}</Text>
                                </View>
                                <View style={styles.seperateLine} />
                            </View>
                        )}
                </ScrollView>

                <View style={styles.bottomContainer}>
                    <View style={styles.seperateLine} />
                    <View style={styles.bottomChildContainer}>
                        <Text style={{ ...styles.title, color: Colors.black, fontWeight: 'bold' }}>{'Total'}</Text>
                        <Text style={{ ...styles.subTitle, color: Colors.black }}>{`£ ${(data.totalAmount / 100).toFixed(2)}`}</Text>
                    </View>
                    <View style={styles.seperateLine} />
                    <Button
                        onPress={() => this.props.navigation.navigate('Support', { order: data })}
                        title={'Report Problem'}
                        style={styles.btn} />
                </View>
            </View>
        )
    }
}

export default OrderDetail;
