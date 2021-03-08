import React, { Component } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import styles from './styles';
import Button from '../../components/button';
import Store from '../../config/store/index';
import { observer } from 'mobx-react';
import { upperCase, getTotalPrice } from '../../utils/helpers'
import { wp, hp, normalize } from '../../helper/responsiveScreen'
import Colors from '../../constants/Colors'
import BackIcon from '../../components/backIcon';
import { retrieveData } from '../../components/AuthKeyStorageComponent';
import Api from '../../config/api';
import Loading from '../../components/loading';
import BasketView from '../../components/basketView';
import MenuView from '../../components/menuView'
import FullScreenLoader from "../../components/fullScreenLoader"
import MenuDetailView from "../../components/menuDetailView"
import moment from 'moment';
import vars from '../../utils/vars';

var STORAGE_KEY = 'id_token';
var uuid = require('react-native-uuid');
let guid = uuid.v1();

class RestaurantList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            latitude: '',
            longitude: '',
            storeType: '',
            restaurantData: [],
            page: 1,
            onEndReachedCalledDuringMomentum: true,
            isRestaurantLoading: false,
            fottorLoading: false,
            isMenuLoading: false,
            menuModelVisible: false,
            menuData: [],
            newOrderModelVisible: false,
            newStoreName: '',
            menuDetailVisible: false,
            menuDetaildata: null,
            menuDetailIndex: -1,
            menuDetailCount: 0,
            storeOpeningHours: null
        }
    }

    componentDidMount() {
        const { storeType, latitude, longitude } = this.props.route.params;
        this.setState({ storeType: storeType, latitude: latitude, longitude: longitude }, () => { this.getRestaurant() })
    }

    getRestaurant() {
        const { latitude, longitude, page, storeType } = this.state
        console.log('location', latitude, longitude)
        if (page == 1) {
            this.setState({ isRestaurantLoading: true, fottorLoading: false })
        }

        retrieveData(STORAGE_KEY)
            .then((data) => {
                const config = {
                    headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
                };

                const value = 'storetype=' + storeType + '&latitude=' + latitude +
                    '&longitude=' + longitude + '&page=' + page + '&pagesize=' + 20

                console.log('value', value)

                Api.get('/V1/Store/Stores-Search-By-Store-Type?' + value, config).then(res => {
                    console.log('restaurant res...', res);
                    if (res.length != 0) {
                        this.setState({
                            restaurantData: [...this.state.restaurantData, ...res],
                            isRestaurantLoading: false
                        })
                    } else {
                        this.setState({ fottorLoading: false, isRestaurantLoading: false, onEndReachedCalledDuringMomentum: true })
                    }
                }).catch(err => {
                    this.setState({ isRestaurantLoading: false })
                    console.log("Error ", err);
                });
            }).catch(err => {
                console.log('err', err)
                this.setState({ isRestaurantLoading: false })
            });
    }

    getMenu(storeId) {
        this.setState({ isMenuLoading: true })
        retrieveData(STORAGE_KEY)
            .then((data) => {
                const config = {
                    headers: { Authorization: 'Bearer ' + data, 'Request-Id': guid }
                };

                console.log('config', config)
                Api.get('V1/Store/Store-Details?storeId=' + storeId, config).then(res => {
                    console.log('Store details res', JSON.stringify(res));
                    this.setState({ isMenuLoading: false, menuModelVisible: true, menuData: res })
                }).catch(err => {
                    console.log("Error ", err);
                    this.setState({ isMenuLoading: false })
                });
            }).catch(err => {
                this.setState({ isMenuLoading: false })
            });
    }

    renderRestaurant = (item, index) => {
        let isClosed;
        if (item.item.storeOpeningHours.find(x => x.dayOfWeek == moment().isoWeekday()).open == "00:00") {
            isClosed = true
        } else {
            isClosed = false
        }

        return (
            <TouchableOpacity
                style={styles.restaurantContainer}
                onPress={() => {
                    isClosed ? null :
                        this.getMenu(item.item.storeId)
                    this.setState({ storeOpeningHours: item.item.storeOpeningHours })

                }}>
                <ImageBackground
                    source={{ uri: item.item.imageUri }}
                    resizeMode='cover'
                    imageStyle={{ borderRadius: wp(2) }}
                    style={styles.restaurantImage} >
                    {isClosed &&
                        <View style={styles.restaurantImageView}>
                            <Text style={{ ...styles.restaurantTitle, color: Colors.white }}>{'Closed'}</Text>
                        </View>
                    }
                </ImageBackground>
                <Text style={styles.restaurantTitle}>{item.item.storeName}</Text>
                {item.item.storeType != null &&
                    <Text style={styles.restaurantSubTitle}>{item.item.storeType}</Text>
                }
                <Text style={styles.restaurantSubTitle}>{` ${item.item.distance.toFixed(2)} miles away`}</Text>
            </TouchableOpacity>
        )
    }

    onMenuPress = (value) => {

        if (Store.cart.length != 0) {
            let existData = Store.cart.find(x => x.storeId === value.storeId);
            if (existData) {
                Store.addToCart(value)
                Store.cart.map((item, i) => {
                    if (value.id == item.id) {
                        this.setState({
                            menuModelVisible: false,
                            menuDetailVisible: true,
                            menuDetaildata: item,
                            menuDetailIndex: i,
                            menuDetailCount: item.count
                        })
                    }
                })
            } else {
                if (Store.restaurantData) {
                    this.setState({ newOrderModelVisible: true, newStoreName: Store.restaurantData.storeType })
                }
            }
        } else {
            Store.addToCart(value)
            Store.cart.map((item, i) => {
                if (value.id == item.id) {
                    this.setState({
                        menuModelVisible: false,
                        menuDetailVisible: true,
                        menuDetaildata: item,
                        menuDetailIndex: i,
                        menuDetailCount: item.count
                    })
                }
            })
        }
    }

    basketRefresh = () => {
        this.forceUpdate()
    }

    onBasketViewPress = () => {
        this.setState({ menuModelVisible: false })
        // this.props.navigation.navigate('Cart')
        this.props.navigation.navigate('Cart', { onGoBack: () => this.basketRefresh() });
    }

    onConfirmPress = () => {
        this.setState({ newOrderModelVisible: false })
        Store.setCart([]);
        Store.resetCartCount();
    }

    onMenuDetailCancelPress = () => {
        let existData = Store.addBasket.find(x => x.id === this.state.menuDetaildata.id);
        if (!existData) {
            Store.removeFromCart(this.state.menuDetailIndex)
        }
        this.setState({ menuModelVisible: true, menuDetailVisible: false })
    }

    onUpdateCountPress = (value) => {
        Store.updateCardItem(this.state.menuDetailIndex, value)
        Store.cart.map((item, i) => {
            if (this.state.menuDetaildata.id == item.id) {
                this.setState({ menuDetailCount: item.count })
            }
        })
    }

    onAddBasketPress = (menuDetaildata) => {
        let restaurantData = this.state.restaurantData.find(x => x.storeId === menuDetaildata.storeId)
        this.setState({ menuModelVisible: true, menuDetailVisible: false })
        Store.addBasket.push(menuDetaildata)
        Store.restaurantData = restaurantData
    }

    render() {
        const { page, storeType, isRestaurantLoading, restaurantData, onEndReachedCalledDuringMomentum,
            fottorLoading, menuData, isMenuLoading, menuModelVisible, newOrderModelVisible, newStoreName,
            menuDetaildata, menuDetailVisible, menuDetailCount, storeOpeningHours } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <BackIcon onPress={() => this.props.navigation.goBack()} />
                    <Text style={styles.headerTitle}>{upperCase(storeType)}</Text>
                </View>

                <View style={styles.seperateLine} />

                {isRestaurantLoading
                    ? <Loading /> :
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={restaurantData}
                        renderItem={(item, index) => this.renderRestaurant(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.flatelistContainer}

                        ListFooterComponent={
                            fottorLoading &&
                            <View style={{ padding: wp(5) }}>
                                <ActivityIndicator
                                    size={"large"}
                                    color={Colors.light_text_color}
                                    animating={true}
                                />
                            </View>
                        }

                        ListEmptyComponent={
                            !fottorLoading ?
                                <Text style={styles.txtNoResult}>{'No results found'}</Text> : null
                        }
                        onMomentumScrollBegin={() => this.setState({ onEndReachedCalledDuringMomentum: false })}
                        onEndReached={() => {
                            if (!onEndReachedCalledDuringMomentum) {
                                console.log("response onEndReached")
                                this.setState({ page: page + 1, fottorLoading: true, onEndReachedCalledDuringMomentum: false }, () => {
                                    this.getRestaurant();
                                })
                            }
                        }}
                        onEndReachedThreshold={0.1}
                    />
                }

                <FullScreenLoader
                    loading={isMenuLoading} />

                <MenuView
                    menuModelVisible={menuModelVisible}
                    onCancelPress={() => this.setState({ menuModelVisible: false })}
                    menuData={menuData}
                    storeOpeningHours={storeOpeningHours}
                    onMenuPress={(item) => this.onMenuPress(item)}
                    onBasketViewPress={() => this.onBasketViewPress()}
                    getTotalPrice={getTotalPrice()}
                    newOrderModelVisible={newOrderModelVisible}
                    newStoreName={newStoreName}
                    newOrderCancel={() => this.setState({ newOrderModelVisible: false })}
                    onConfirmPress={() => this.onConfirmPress()}
                />

                {menuDetaildata != null &&
                    <MenuDetailView
                        menuDetailVisible={menuDetailVisible}
                        onMenuDetailCancelPress={() => this.onMenuDetailCancelPress()}
                        menuDetaildata={menuDetaildata}
                        menuDetailCount={menuDetailCount}
                        onUpdateCountPress={(value) => this.onUpdateCountPress(value)}
                        onAddBasketPress={(data) => this.onAddBasketPress(data)}
                    />

                }

                {Store.cart.length != 0 &&
                    <BasketView
                        onPress={() => this.onBasketViewPress()}
                        style={{ marginBottom: hp(3) }}
                        count={Store.cart.length}
                        amount={`${vars.currency} ${(getTotalPrice() / 100).toFixed(2)}`} />
                }
            </View>
        )
    }
}

export default RestaurantList;