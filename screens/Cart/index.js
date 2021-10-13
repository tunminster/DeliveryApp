import React, { Component } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import Button from '../../components/button';
import Store from '../../config/store/index';
import { observer } from 'mobx-react';
import CartItem from './CartItem';
import { getTotalPrice } from '../../utils/helpers';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import BackIcon from '../../components/backIcon';
import SwitchButton from '../../components/SwitchButton';
import vars from '../../utils/vars';

@observer
class Cart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isEdit: false,
            isDeliver:false
        }
    }

    checkout() {
        if (Store.cart.length != 0) {
            this.props.navigation.navigate('PaymentType',{isDeliver:this.state.isDeliver});
        } else {
            alert("Please add item")
        }
    }
    renderBillField = (title = '', amount = 0) => (
        <View style={[styles.bottomChildContainer,{height: hp(5)}]}>
            <Text style={{ ...styles.title, color: Colors.black,fontSize:normalize(16) }}>{title}</Text>
            <Text style={{ ...styles.subTitle, color: Colors.black,fontSize:normalize(16) }}>{`${vars.currency} ${(amount / 100).toFixed(2)}`}</Text>
        </View>
    )

    render() {
        const { isEdit } = this.state;

        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <BackIcon
                            onPress={() => {
                                if(isEdit) {
                                    this.setState({isEdit: false})
                                } else{
                                this.props.navigation.goBack()
                                this.props.route.params.onGoBack()
                                }
                            }} />
                        <Text style={{ ...styles.restaurantTitle, color: Colors.black, marginLeft: wp(5), alignSelf: 'center', fontWeight: 'bold' }}>{'Basket'}</Text>
                    </View>
                    <TouchableOpacity style={{ paddingHorizontal: wp(2), paddingVertical: wp(1), alignSelf: 'center' }}
                    onPress = {() => this.setState({isEdit: !isEdit})}>
                        <Image source={require('../../assets/images/edit.png')} resizeMode='contain' style={styles.editIcon} />
                        {/* <Text style={{ ...styles.restaurantTitle, color: Colors.black, fontWeight: 'bold' }}>{'Edit'}</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={styles.seperateLine} />
                <View style={{marginVertical:wp(2),marginHorizontal:wp(5)}}>
                    <SwitchButton status={this.state.isDeliver} onChange={(value)=>{
                        this.setState({isDeliver:value})
                    }}   />
                </View>

                <Text style={{ ...styles.restaurantTitle, color: Colors.black, marginLeft: wp(5), marginTop: hp(1) }}>{Store.restaurantData.storeName}</Text>
                <View style={styles.childContainer}>
                    <Image source={require('../../assets/images/location.png')} resizeMode='contain' style={styles.icon} />
                    <Text style={{ ...styles.restaurantSubTitle, marginLeft: wp(3) }}>{Store.restaurantData.addressLine1}</Text>
                </View>
                <View style={styles.childContainer}>
                    <Image source={require('../../assets/images/clock.png')} resizeMode='contain' style={styles.icon} />
                    <Text style={{ ...styles.restaurantSubTitle, marginLeft: wp(3) }}>{'Ready in about 15-20 min'}</Text>
                </View>
                <View style={{ ...styles.seperateLine, marginTop: hp(3) }} />

                <ScrollView style={{ marginBottom: hp(17) }}>
                    {Store.cart.map((item, i) =>
                        <CartItem
                            onPress={() => this.forceUpdate()}
                            isEdit ={this.state.isEdit}
                            data={item} key={i} index={i} navigation={this.props.navigation} />)}
                    <View style={styles.bottomChildContainer}>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.gray }}>{'Subtotal'}</Text>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.gray }}>{`${vars.currency} ${(getTotalPrice() / 100).toFixed(2)}`}</Text>
                    </View>
                    <View style={{flex:1}}>
                        {/*{this.renderBillField(vars.subTotal,orderDetails?.subtotalAmount)}*/}
                        {/*{orderDetails?.taxFees > 0 && this.renderBillField(vars.tax,orderDetails?.taxFees)}*/}
                        {/*{this.renderBillField(vars.deliveryFees,orderDetails?.deliveryFees)}*/}
                        {/*{this.renderBillField(vars.applicationFees,orderDetails?.applicationFees)}*/}
                    </View>
                </ScrollView>

                <View style={styles.bottomContainer}>
                    <View style={{ ...styles.seperateLine, marginTop: 1 }} />
                    <View style={styles.bottomChildContainer}>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.black }}>{'Order Total'}</Text>
                        <Text style={{ ...styles.restaurantTitle, color: Colors.black }}>{`${vars.currency} ${(getTotalPrice() / 100).toFixed(2)}`}</Text>
                    </View>
                    <View style={{ ...styles.seperateLine, marginTop: 1 }} />

                    <Button
                        onPress={() => this.checkout()}
                        title={'Go to Checkout'}
                        style={styles.btn} />
                </View>
            </View>
        )
    }
}

export default Cart;