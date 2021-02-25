import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AsyncStorage } from 'react-native';
import vars from '../../utils/vars';
import Store from '../../config/store';
import { wp, hp, normalize, } from '../../helper/responsiveScreen';
import Colors from '../../constants/Colors'
import Slider from '@react-native-community/slider';

class PaymentSuccess extends Component {
    componentDidMount() {
        Store.setCart([]);
        Store.resetCartCount();
        AsyncStorage.multiRemove(['@cart', '@cartCount']);
        setTimeout(() => {
            this.props.navigation.navigate('Home');
        }, 5000);
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: vars.bgColor}}>
                <Text style={{color: 'green', fontSize: 28}}>Payment Successful</Text>
                <Image source={require('../../assets/images/success-icon.png')} style={{width: 45, height: 45, marginTop: 25}} />
            </View>
            // <View style={styles.container}>
            //     <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.closeView} >
            //         <Image source={require('../../assets/images/close_fill_icon.png')}
            //             style={styles.closeIcon} />
            //     </TouchableOpacity>

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

            //         {/* <Slider
            //             style={{ width: 200, height: 50, }}
            //             minimumValue={0}
            //             maximumValue={10}
            //             minimumTrackTintColor='red'
            //             maximumTrackTintColor='green'
            //             value={7}
            //             disabled
            //             thumbImage
                        
                       
            //             // onValueChange={(value)=> this.setState({ slideValue: value}) }
            //             // thumbStyle={styles.thumb}
            //             // trackStyle={styles.track}
            //             step={1}
            //         /> */}
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
        fontSize: normalize(19),
        fontFamily: 'Roboto-Regular',
        color: Colors.black,

        fontWeight: 'bold'
    },
    subTitle: {
        fontSize: normalize(17),
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
    track: {
        height: 18,
        borderRadius: 1,
        backgroundColor: '#d5d8e8',
      },
      thumb: {
        width: 20,
        height: 30,
        borderRadius: 1,
        backgroundColor: '#838486',
      }
});

export default PaymentSuccess;