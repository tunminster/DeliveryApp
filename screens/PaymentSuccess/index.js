import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';
import { AsyncStorage } from 'react-native';
import vars from '../../utils/vars';
import Store from '../../config/store';
import { wp, hp, normalize, } from '../../helper/responsiveScreen';
import { retrieveData } from '../../components/AuthKeyStorageComponent';
import Colors from '../../constants/Colors'
import Api from '../../config/api';
import Loading from '../../components/loading';
import moment from 'moment';

var uuid = require('react-native-uuid');

class PaymentSuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progressStatus: 0,
            isAddress: false,
            loading: false,
            orderDetails: null,
            orderType: this.props.route.params.orderType
        }
    }

    anim = new Animated.Value(0);

    componentDidMount() {
        this.getOrderDetails()
        Store.setCart([]);
        Store.resetCartCount();
        AsyncStorage.multiRemove(['@cart', '@cartCount']);
        // setTimeout(() => {
        //     this.props.navigation.navigate('Home');
        // }, 5000);
    }

    getOrderDetails = () => {
        var STORAGE_KEY = vars.idToken;

        this.setState({ loading: true })

        retrieveData(STORAGE_KEY)
            .then((data) => {
                let guid = uuid.v1();
                const config = {
                    headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
                };

                console.log('config', config)
                const storeOpeningHoursData = Store.restaurantData.storeOpeningHours.find(x => x.dayOfWeek == moment().isoWeekday())
                let timeZone
                if (storeOpeningHoursData.timeZone == null) {
                    timeZone = 7
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'E') {
                    timeZone = 1
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'C') {
                    timeZone = 2
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'M') {
                    timeZone = 3
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'P') {
                    timeZone = 4
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'A') {
                    timeZone = 5
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'H') {
                    timeZone = 6
                } else if (storeOpeningHoursData.timeZone.charAt(0) == 'G') {
                    timeZone = 7
                }
                const value = 'orderId=' + this.props.route.params.orderId + '&timeZone=' + timeZone
                // const value = 'orderId=' + 'da-148263851' + '&timeZone=' + 7
                console.log('value', value)

                Api.get('/Order/GetOrderDetails?' + value, config).then(res => {
                    console.log('GetOrderDetails res', res);
                    this.setState({ orderDetails: res, loading: false })

                    var estimatedCookingTime = res.estimatedCookingTime
                    var startTime = moment(estimatedCookingTime.split(' - ')[0], "HH:mm");
                    var endTime = moment(estimatedCookingTime.split(' - ')[1], "HH:mm");
                    var duration = moment.duration(endTime.diff(startTime));
                    this.onAnimate(parseInt(duration.asMilliseconds()) % 3600000);
                    console.log('value', parseInt(duration.asMilliseconds()) % 3600000)

                    Store.restaurantData = null

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

    onAnimate = (duration) => {
        this.anim.addListener(({ value }) => {
            this.setState({ progressStatus: parseInt(value, 10) });
        });
        Animated.timing(this.anim, {
            toValue: 100,
            duration: duration,
        }).start();
    }

    render() {
        const { progressStatus, isAddress, orderDetails, loading, orderType } = this.state;

        return (
            // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: vars.bgColor}}>
            //     <Text style={{color: 'green', fontSize: 28}}>Payment Successful</Text>
            //     <Image source={require('../../assets/images/success-icon.png')} style={{width: 45, height: 45, marginTop: 25}} />
            // </View>
            loading ?
                <Loading /> :
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={styles.closeView} >
                        <Image source={require('../../assets/images/close_fill_icon.png')}
                            style={styles.closeIcon} />
                    </TouchableOpacity>

                    {orderDetails &&
                        <View style={{ flex: 1 }}>

                            <View style={{
                                marginHorizontal: wp(4), marginBottom: hp(3), borderWidth: wp(0.2),
                                borderColor: Colors.gray, paddingVertical: hp(1.5), paddingHorizontal: wp(3)
                            }}>
                                <Text style={{ ...styles.subTitle, color: Colors.gray }}>{orderType == 1 ? 'Estimated ready to pick up' : 'Estimated arrival'}</Text>
                                <Text style={{ ...styles.title, marginTop: hp(1) }}>{orderDetails.estimatedCookingTime}</Text>
                                <View style={styles.progressContainer}>
                                    <Animated.View
                                        style={[
                                            styles.inner, { width: progressStatus + "%" },
                                        ]} />
                                </View>

                                <TouchableWithoutFeedback
                                    onPress={() => this.setState({ isAddress: !isAddress })}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...styles.title, width: wp(80) }}>
                                            {`${orderDetails.storeName} is preparing your order`}</Text>
                                        <Image source={isAddress ?
                                            require('../../assets/images/down_arrow.png') :
                                            require('../../assets/images/right_arrow.png')} style={styles.rightIcon} />
                                    </View>
                                </TouchableWithoutFeedback>

                                {isAddress &&
                                    <Text style={{ ...styles.subTitle, color: Colors.gray, marginVertical: hp(1) }}>{orderDetails.storeAddress}</Text>
                                }

                            </View>

                            <View style={styles.seperateLine} />
                            <Text style={{ ...styles.title, marginVertical: hp(1.5), marginLeft: wp(5), }}>{orderType == 1 ? 'Pick up location:' : 'Deliver to :'}</Text>
                            <View style={styles.seperateLine} />

                            <View style={styles.childContainer}>
                                <Image source={require('../../assets/images/location.png')} resizeMode='contain' style={styles.icon} />
                                <Text style={{ ...styles.subTitle, marginLeft: wp(3), width: wp(80), color: Colors.gray, alignSelf: 'center' }}>{orderType == 1 ? orderDetails.storeAddress : orderDetails.deliveryAddress}</Text>
                            </View>
                            <View style={styles.seperateLine} />

                            <Text style={{ ...styles.title, marginLeft: wp(5), marginTop: hp(3), marginBottom: hp(1.5) }}>{'Order details'}</Text>
                            <View style={styles.seperateLine} />
                            <View style={styles.orderDetailsContainer}>
                                <Image
                                    source={{ uri: orderDetails.imageUri }}
                                    resizeMode='cover'
                                    style={styles.image} />

                                <View style={styles.orderDetailsChildContainer}>
                                    <Text numberOfLines={1}
                                        style={{ ...styles.subTitle, color: Colors.black, fontWeight: 'bold' }}>{orderDetails.storeName}</Text>
                                    <Text style={{ ...styles.subTitle, color: Colors.gray, marginTop: hp(0.5) }}>{`Order #${orderDetails.orderId}`}</Text>
                                </View>
                            </View>
                            <View style={styles.seperateLine} />

                            <ScrollView style={{ marginBottom: hp(7) }} 
                            showsVerticalScrollIndicator={false}>
                                {orderDetails.orderItems && orderDetails.orderItems.map((item, index) =>
                                    <View key={index}>
                                        <View style={styles.orderItemView}>
                                            <Text numberOfLines={1}
                                                style={{ ...styles.subTitle, color: Colors.black, width: wp(73) }}>{`${item.count}  x  ${item.productName}`}</Text>
                                            <Text numberOfLines={1}
                                                style={{ ...styles.subTitle, color: Colors.black, }}>{`${vars.currency} ${((item.productPrice * item.count) / 100).toFixed(2)}`}</Text>
                                        </View>
                                        <View style={styles.seperateLine} />
                                    </View>
                                )}

                            </ScrollView>

                            <View style={styles.bottomContainer}>
                                <View style={styles.seperateLine} />
                                <View style={styles.bottomChildContainer}>
                                    <Text style={{ ...styles.title, }}>{`Total - ${vars.currency} ${(orderDetails.totalAmount / 100).toFixed(2)}`}</Text>
                                </View>
                            </View>
                        </View>
                    }
                </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
    },
    closeView: {
        padding: wp(2),
        width: wp(12),
        marginBottom: hp(1)
    },
    closeIcon: {
        width: wp(7),
        height: wp(7),
    },
    seperateLine: {
        backgroundColor: Colors.border,
        height: wp(0.2),
    },
    title: {
        fontSize: normalize(18),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        fontWeight: 'bold'
    },
    subTitle: {
        fontSize: normalize(16),
        fontFamily: 'Roboto-Regular',
    },
    childContainer: {
        flexDirection: 'row',
        marginLeft: wp(5),
        marginVertical: hp(1.5),
        alignItems:'center'
    },
    icon: {
        width: wp(6),
        height: wp(6),
    },
    image: {
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7),
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.gray
    },
    orderDetailsContainer: {
        flexDirection: 'row',
        marginLeft: wp(5),
        marginVertical: hp(1.5)
    },
    orderDetailsChildContainer: {
        marginLeft: wp(5),
        width: wp(80),
        alignContent: 'center',
        justifyContent: 'center'
    },
    orderItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(5),
        marginVertical: hp(1.5)
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        height: hp(7),
        width: wp(100),
    },
    bottomChildContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(7)
    },
    progressContainer: {
        height: hp(1),
        borderRadius: 10,
        justifyContent: "center",
        backgroundColor: Colors.gray,
        marginTop: hp(1),
        marginBottom: hp(2)
    },
    inner: {
        width: "100%",
        height: hp(1),
        borderRadius: 10,
        backgroundColor: Colors.tabIconSelected,
    },
    rightIcon: {
        width: wp(4),
        height: wp(4),
        alignSelf: 'center',
    },
});

export default PaymentSuccess;