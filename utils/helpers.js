import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Store from '../config/store';
import Api from '../config/api';
import vars from './vars';
import sharedStyles from './sharedStyles';
import AuthStore from '../config/store/auth';
import { retrieveData } from '../components/AuthKeyStorageComponent';
var uuid = require('react-native-uuid');
import messaging from '@react-native-firebase/messaging';
export function logout() {
    AuthStore.setIsLogin(false);
    AuthStore.setUser({});
    messaging().deleteToken().then(r => {
        console.log(r)
    });
    AsyncStorage.removeItem('login credential');
    AsyncStorage.removeItem('fcmToken');
    AsyncStorage.removeItem('facebook credential');
    AsyncStorage.removeItem('google credential');
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('apple credential');
    Store.setCart([]);
    Store.resetCartCount();
    AsyncStorage.multiRemove(['@cart', '@cartCount']);
    Store.restaurantData = null
    Store.deliverAddress = null
}

export function post(url, data, success, error) {
    console.log(data);
    var STORAGE_KEY = 'id_token';
    retrieveData(STORAGE_KEY)
        .then((responseData) => {
            let guid = uuid.v1();
            console.log('uuid.....Store', guid)
            const config = {
                headers: { Authorization: 'Bearer ' + responseData, 'Request-Id': guid,'X-Shard': Store?.remoteConfig?.xShard }
            };
            console.log('url', url, ",,,,", config, 'body', data);
            Api.post(url, data, config)
                .then(res => success(res))
                .catch(err => {
                    error && error(err);
                    console.log(err);
                });
        });
}

export function put(url, data, success, error) {
    console.log(data);
    var STORAGE_KEY = 'id_token';
    retrieveData(STORAGE_KEY)
        .then((responseData) => {
            let guid = uuid.v1();
            console.log('uuid.....Store', guid)
            const config = {
                headers: { Authorization: 'Bearer ' + responseData, 'Request-Id': guid,'X-Shard': Store?.remoteConfig?.xShard }
            };
            console.log('url', url, ",,,,", config)
            Api.put(url, data, config)
                .then(res => success(res))
                .catch(err => {
                    error && error(err);
                    console.log(err);
                });
        });
}

export function get(url, success, error) {
    const u = url + '/' + AuthStore.user.id;
    Api.get(u)
        .then(res => success(res))
        .catch(err => {
            error && error(err);
            console.log(err);
        });
}

export function searchFilter(data, filterTxt) {
    if (filterTxt !== '')
        return data.filter(x => x.title.toUpperCase().match(filterTxt.toUpperCase()));
    else return data;
}

export function fixImgPath(src) {
    return Store?.remoteConfig?.host + "/uploads/" + src;
}



export function cacheCart(cart, cartCount) {
    updateCartAmount();
    AsyncStorage.setItem('@cart', JSON.stringify(cart));
    AsyncStorage.setItem('@cartCount', cartCount.toString());
}
export function updateCartAmount() {
    let subTotal = getTotalPrice(true)
    const {restaurantData = {}, deliverAddress = {},isDelivery = true, promotion, applicationFees} = Store;
    let body = {
        "subTotal": subTotal,
        "orderType": isDelivery ? 2 : 1,
        "customerId": deliverAddress?.customerId?.toString(),
        "storeId": restaurantData?.storeId,
        "customerLatitude": deliverAddress?.lat,
        "customerLongitude": deliverAddress?.lng,
        "storeLatitude": restaurantData?.location?.latitude || 0,
        "storeLongitude": restaurantData?.location?.longitude || 0,
        "deliveryTips": (applicationFees.deliveryTip || 0),
        "promoCode":promotion?.promoCode || null
    }
    if(subTotal > 0 && Object.values(restaurantData || {}).length > 0){
        post(`${Store?.remoteConfig?.host}${vars.applicationFeesPost}`,body,(res)=>{
            Store.setApplicationFee({...res,subTotal})
        })
    }
}

export function getCachedCart() {
    AsyncStorage.multiGet(['@cart', '@cartCount']).then(data => {
        if (data[0][1]) Store.setCart(JSON.parse(data[0][1]));
        if (data[1][1]) Store.setCartCount(parseInt(data[1][1]));
    });
}

export function getTotalPrice( isSubTotal = false) {
    let totalAmount = 0;
    let applicationFees = Store.applicationFees;
    let isDeliver = Store.isDelivery;
    let subTotal = Store.cart.map(x => {
        let additionalPrice = getAdditionalPrice(x);
        return (getDiscountPrice(x) + additionalPrice) * x.count
    }).reduce((a, b) => a + b, 0);
    totalAmount = isDeliver ? (applicationFees.deliveryFee + subTotal + applicationFees.platformFee + applicationFees.taxFees) : (applicationFees.subTotal + applicationFees.platformFee + applicationFees.taxFees)
   let a = isSubTotal ? subTotal : totalAmount;
    console.log(isSubTotal,'[isSubtotal]',a)
    return a
}

export function getDiscountPrice(x) {
    return x.discount ? x.unitPrice - x.unitPrice * parseFloat(`0.${x.discount}`) : x.unitPrice;
}
export function getAdditionalPrice(product){
    if(product.productMeatOptions.length>0){
        let meatItems = product.productMeatOptions;
        let price = 0;
        meatItems.forEach(element => {
            
            element.productMeatOptionValues.forEach(element2 =>{
                if(element2.selected){
                    if(element2?.additionalPrice){
                    price = price + element2?.additionalPrice || 0
                    }else{
                        price = price + 0;
                    }
                }
            })
            console.log(price);
            
       });
       return parseFloat(price);
    }else{
        return 0;
    }
}
export function lowerCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toLowerCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

export function upperCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}