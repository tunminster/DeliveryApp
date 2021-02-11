import React from 'react';
import { TouchableOpacity, Image, View, AsyncStorage } from 'react-native';
import Store from '../config/store';
import Api from '../config/api';
import vars from './vars';
import sharedStyles from './sharedStyles';
import AuthStore from '../config/store/auth';
import { retrieveData } from '../components/AuthKeyStorageComponent';
var uuid = require('react-native-uuid');

export function logout() {
    AuthStore.setIsLogin(false);
    AuthStore.setUser({});
    AsyncStorage.removeItem('login credential');
    AsyncStorage.removeItem('facebook credential');
    AsyncStorage.removeItem('google credential');
    AsyncStorage.removeItem('token');
}

export function post(url, data, success, error) {
    console.log(data);
    var STORAGE_KEY = 'id_token';
    retrieveData(STORAGE_KEY)
        .then((responseData) => {
            let guid = uuid.v1();
            console.log('uuid.....Store', guid)
            const config = {
                headers: { Authorization: 'Bearer ' + responseData, 'Request-Id': guid }
            };
            console.log('url', url, ",,,,", config)
            Api.post(url, data, config)
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
    return vars.host + "/uploads/" + src;
}

export function cacheCart(cart, cartCount) {
    AsyncStorage.setItem('@cart', JSON.stringify(cart));
    AsyncStorage.setItem('@cartCount', cartCount.toString());
}

export function getCachedCart() {
    AsyncStorage.multiGet(['@cart', '@cartCount']).then(data => {
        if (data[0][1]) Store.setCart(JSON.parse(data[0][1]));
        if (data[1][1]) Store.setCartCount(parseInt(data[1][1]));
    });
}

export function getTotalPrice() {
    return Store.cart.map(x => {
        return getDiscountPrice(x) * x.count
    }).reduce((a, b) => a + b, 0)
}

export function getDiscountPrice(x) {
    return x.discount ? x.unitPrice - x.unitPrice * parseFloat(`0.${x.discount}`) : x.unitPrice;
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