import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';
import { AsyncStorage } from 'react-native';
import vars from '../../utils/vars';
import Store from '../../config/store';
import { wp, hp, normalize, } from '../../helper/responsiveScreen';
import { retrieveData } from '../../components/AuthKeyStorageComponent';
import Colors from '../../constants/Colors'
import Api from '../../config/api';

var uuid = require('react-native-uuid');

class PaymentSuccess extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         progressStatus: 0,
    //         isAddress: false,
    //         loading: false
    //     }
    // }

    // anim = new Animated.Value(0);

    componentDidMount() {
        // this.onAnimate();
        // this.getOrderDetails()
        Store.setCart([]);
        Store.resetCartCount();
        AsyncStorage.multiRemove(['@cart', '@cartCount']);
        setTimeout(() => {
            this.props.navigation.navigate('Home');
        }, 5000);
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
                const value = 'orderId=' + 'da-833704898' + '&timeZone=3'
                console.log('value', value)

                Api.get('/Order/GetOrderDetails?' + value, config).then(res => {
                    console.log('GetOrderDetails res', JSON.stringify(res));

                }).catch((error) => {
                    console.error(error);
                    this.setState({ loading: false })
                });
            }).catch(err => {
                console.log('err', err)
                this.setState({ loading: false })
            });
    }

    // onAnimate = () => {
    //     this.anim.addListener(({ value }) => {
    //         this.setState({ progressStatus: parseInt(value, 10) });
    //     });
    //     Animated.timing(this.anim, {
    //         toValue: 100,
    //         duration: 180000,
    //     }).start();
    // }

    render() {
        // const { progressStatus, isAddress } = this.state;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: vars.bgColor}}>
                <Text style={{color: 'green', fontSize: 28}}>Payment Successful</Text>
                <Image source={require('../../assets/images/success-icon.png')} style={{width: 45, height: 45, marginTop: 25}} />
            </View>
            // <View style={styles.container}>
            //     <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={styles.closeView} >
            //         <Image source={require('../../assets/images/close_fill_icon.png')}
            //             style={styles.closeIcon} />
            //     </TouchableOpacity>

            //     <View style={{
            //         marginHorizontal: wp(4), marginBottom: hp(3), borderWidth: wp(0.2),
            //         borderColor: Colors.gray, paddingVertical: hp(1.5), paddingHorizontal: wp(3)
            //     }}>
            //         <Text style={{ ...styles.subTitle, color: Colors.gray }}>{`Estimated arrival`}</Text>
            //         <Text style={{ ...styles.title, marginTop: hp(1) }}>{'12:50 - 13:05'}</Text>
            //         <View style={styles.progressContainer}>
            //             <Animated.View
            //                 style={[
            //                     styles.inner, { width: progressStatus + "%" },
            //                 ]} />
            //         </View>

            //         <TouchableWithoutFeedback
            //             onPress={() => this.setState({ isAddress: !isAddress })}>
            //             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            //                 <Text numberOfLines={1} style={{ ...styles.title, width: wp(80) }}>
            //                     {'Mai Thai is preparing your order'}</Text>
            //                 <Image source={isAddress ?
            //                     require('../../assets/images/down_arrow.png') :
            //                     require('../../assets/images/right_arrow.png')} style={styles.rightIcon} />
            //             </View>
            //         </TouchableWithoutFeedback>

            //         {isAddress &&
            //             <Text style={{ ...styles.subTitle, color: Colors.gray, marginVertical: hp(1) }}>{`75 Broadway, London, SW19 1QE`}</Text>
            //         }

            //     </View>

            //     <View style={styles.seperateLine} />
            //     <Text style={{ ...styles.title, marginVertical: hp(1.5), marginLeft: wp(5), }}>{'Deliver to :'}</Text>
            //     <View style={styles.seperateLine} />

            //     <View style={styles.childContainer}>
            //         <Image source={require('../../assets/images/location.png')} resizeMode='contain' style={styles.icon} />
            //         <Text numberOfLines={1} style={{ ...styles.subTitle, marginLeft: wp(3), width: wp(80), color: Colors.gray, alignSelf: 'center' }}>{'Queen Road 137B SW19 1QW'}</Text>
            //     </View>
            //     <View style={styles.seperateLine} />

            //     <Text style={{ ...styles.title, marginLeft: wp(5), marginTop: hp(3), marginBottom: hp(1.5) }}>{'Order details'}</Text>
            //     <View style={styles.seperateLine} />
            //     <View style={styles.orderDetailsContainer}>
            //         <Image
            //             source={''}
            //             resizeMode='cover'
            //             style={styles.image} />

            //         <View style={styles.orderDetailsChildContainer}>
            //             <Text numberOfLines={1}
            //                 style={{ ...styles.subTitle, color: Colors.black, fontWeight: 'bold' }}>{'Mai Thai'}</Text>
            //             <Text style={{ ...styles.subTitle, color: Colors.gray, marginTop: hp(0.5) }}>{`Order #4093`}</Text>
            //         </View>
            //     </View>
            //     <View style={styles.seperateLine} />

            //     <ScrollView style={{ marginBottom: hp(7) }}>
            //         <View>
            //             <View style={styles.orderItemView}>
            //                 <Text numberOfLines={1}
            //                     style={{ ...styles.subTitle, color: Colors.black, width: wp(73) }}>{`1 x Prawn Cracker`}</Text>
            //                 <Text numberOfLines={1}
            //                     style={{ ...styles.subTitle, color: Colors.black, }}>{`£ 3.50`}</Text>
            //             </View>
            //             <View style={styles.seperateLine} />
            //         </View>
            //     </ScrollView>

            //     <View style={styles.bottomContainer}>
            //         <View style={styles.seperateLine} />
            //         <View style={styles.bottomChildContainer}>
            //             <Text style={{ ...styles.title, }}>{`Total - £ 3.50`}</Text>
            //         </View>
            //     </View>
            // </View>

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