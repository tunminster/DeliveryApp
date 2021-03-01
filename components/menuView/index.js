import React, { Component } from 'react';
import {
    Text, Image, TouchableOpacity, View, Modal, TouchableWithoutFeedback,
    ScrollView, UIManager, LayoutAnimation, ImageBackground
} from 'react-native';
import styles from './styles';
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Store from '../../config/store';
import BasketView from '../../components/basketView';
import Colors from '../../constants/Colors'
import moment from 'moment';

class MenuView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expandeIndex: -1,
            isStoreOpeningHours: false
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true); // USed for collaps animation
        }
    }

    toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (this.state.expandeIndex == index) {
            this.setState({ expandeIndex: -1 })
        } else {
            this.setState({ expandeIndex: index })
        }
    }

    render() {
        const { expandeIndex, isStoreOpeningHours } = this.state;
        const { menuModelVisible, onCancelPress, menuData, onMenuPress, onBasketViewPress, getTotalPrice,
            newOrderModelVisible, newStoreName, newOrderCancel, onConfirmPress, storeOpeningHours } = this.props;
        console.log('storeOpeningHours', storeOpeningHours)

        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={menuModelVisible} >
                <View style={styles.modelContainer}>
                    <View style={styles.modelChildContainer}>
                        <ScrollView style={{ flex: 1, marginBottom: Store.cart.length != 0 ? hp(8.5) : hp(0) }} showsVerticalScrollIndicator={false}>
                            <View style={{ paddingHorizontal: wp(4), marginTop: hp(0.7) }}>
                                <ImageBackground
                                    source={{ uri: menuData.imageUri }}
                                    resizeMode='cover'
                                    style={styles.modalRestaurantImage}
                                    imageStyle={{ borderRadius: wp(2) }} >

                                    <TouchableOpacity onPress={() => onCancelPress()}
                                        style={styles.modalCancelView} >
                                        <Image source={require('../../assets/images/close_fill_icon.png')}
                                            style={{
                                                width: wp(7.5),
                                                height: wp(7.5),
                                            }} />
                                    </TouchableOpacity>

                                </ImageBackground>
                            </View>

                            <View style={{ paddingHorizontal: wp(4), }}>
                                {menuData.storeType != null &&
                                    <Text style={{ ...styles.restaurantSubTitle, color: Colors.orange }}>{menuData.storeType}</Text>
                                }
                                <Text style={{ ...styles.restaurantTitle, marginTop: hp(0.5) }}>{menuData.storeName}</Text>
                                <TouchableWithoutFeedback onPress={() => storeOpeningHours && this.setState({ isStoreOpeningHours: !isStoreOpeningHours })}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, }}>{menuData.addressLine1}</Text>
                                        {storeOpeningHours && <Image source={isStoreOpeningHours ? require('../../assets/images/down_arrow.png') : require('../../assets/images/right_arrow.png')} style={styles.modelIcon} />}
                                    </View>
                                </TouchableWithoutFeedback>

                                {isStoreOpeningHours &&
                                    <View>
                                        <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{`Date : ${moment().format('DD/MM/YYYY')}`}</Text>
                                        <Text style={{ ...styles.restaurantSubTitle, color: Colors.black }}>{`Opening Hours`}</Text>
                                        {storeOpeningHours && storeOpeningHours.map((item, index) =>
                                            <View key={index} style={{ flexDirection: 'row' }}>
                                                <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, width: wp(10) }}>{`${moment().day(parseInt(item.dayOfWeek)).format("ddd")}`}</Text>
                                                <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{`:   ${item.open == '00:00' ? 'Closed' : item.open + ' - ' + item.close}`}</Text>
                                            </View>
                                        )}
                                    </View>
                                }

                                {menuData.storeCategoriesList && menuData.storeCategoriesList.map((item, index) =>
                                    <View key={index}>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.toggleExpand(index)}>
                                            <View style={styles.modalMenuTitle}>
                                                <Text style={{ ...styles.restaurantTitle, }}>{item.categoryName}</Text>
                                                <Image source={expandeIndex == index ? require('../../assets/images/down_arrow.png')
                                                    : require('../../assets/images/right_arrow.png')} style={styles.modelIcon} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <View style={styles.modelSeperateLine} />
                                        {expandeIndex == index &&
                                            item.products && item.products.map((item, index) =>
                                                <View key={index}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1, marginTop: hp(1) }}
                                                        onPress={() => onMenuPress(item)}>
                                                        <View style={{ flexDirection: 'column', flex: 0.7 }}>
                                                            <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, fontWeight: 'bold' }}>{item.productName}</Text>
                                                            <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{item.description}</Text>
                                                            <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray, fontWeight: '700' }}>{`£ ${(item.unitPrice / 100).toFixed(2)}`}</Text>
                                                        </View>

                                                        <Image
                                                            source={{ uri: item.productImageUrl }}
                                                            resizeMode='cover'
                                                            style={{ flex: 0.3, marginLeft: wp(2), height: hp(10), alignSelf: 'center' }} />
                                                    </TouchableOpacity>
                                                    <View style={{ ...styles.modelSeperateLine, marginTop: hp(0.5) }} />
                                                </View>
                                            )
                                        }
                                    </View>

                                )}
                            </View>

                        </ScrollView>

                        {Store.cart.length != 0 &&
                            <BasketView
                                onPress={() => onBasketViewPress()}
                                style={{ marginBottom: hp(1) }}
                                count={Store.cart.length}
                                amount={`£ ${(getTotalPrice / 100).toFixed(2)}`} />
                        }

                        <Modal
                            transparent={true}
                            animationType={'none'}
                            visible={newOrderModelVisible} >
                            <View style={styles.modelContainer}>
                                <View style={{ backgroundColor: Colors.white, width: wp(70) }}>
                                    <Text style={{ ...styles.restaurantTitle, marginVertical: hp(1.5), fontWeight: 'bold', alignSelf: 'center' }}>{'Start new order?'}</Text>
                                    <Text style={{ ...styles.restaurantSubTitle, marginHorizontal: wp(7), color: Colors.gray }}>{'Items currently from '}
                                        <Text style={{ ...styles.restaurantSubTitle, color: Colors.black }}>{newStoreName}</Text>
                                        <Text style={{ ...styles.restaurantSubTitle, color: Colors.gray }}>{' will be removed'}</Text></Text>

                                    <View style={{ ...styles.modelSeperateLine, marginTop: hp(1.5) }} />

                                    <View style={styles.modelConfirmContainer}>
                                        <TouchableOpacity style={{ width: wp(35) }} onPress={() => newOrderCancel()}>
                                            <Text style={{ ...styles.restaurantTitle, textAlign: 'center', }}>{'Cancel'}</Text>
                                        </TouchableOpacity>
                                        <View style={styles.modelVerticalLine} />
                                        <TouchableOpacity style={{ width: wp(35) }} onPress={() => onConfirmPress()}>
                                            <Text style={{ ...styles.restaurantTitle, textAlign: 'center', }}>{'Confirm'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </Modal>

        )
    }
}

export default MenuView;
