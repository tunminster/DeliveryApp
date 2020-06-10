import React from 'react';
import {AsyncStorage, TouchableOpacity, Image, View} from 'react-native';
import Store from '../config/store';
import Api from '../config/api';
import vars from './vars';
import sharedStyles from './sharedStyles';

export function searchFilter(data, filterTxt) {
    if (filterTxt !== '')
        return data.filter(x => x.title.toUpperCase().match(filterTxt.toUpperCase()));
    else return data;
}

export function fixImgPath(src) {
    return vars.host + "/uploads/" + src;
}

export function cacheCart(cart, cartCount){
    AsyncStorage.setItem('@cart', JSON.stringify(cart));
    AsyncStorage.setItem('@cartCount', cartCount.toString());
}

export function getCachedCart(){
    AsyncStorage.multiGet(['@cart', '@cartCount']).then(data => {
        if (data[0][1]) Store.setCart(JSON.parse(data[0][1]));
        if (data[1][1]) Store.setCartCount(parseInt(data[1][1]));
    });
}

export function getTotalPrice(){
    return Store.cart.map(x =>{
        return getDiscountPrice(x) * x.count
    }).reduce((a,b) => a + b, 0)
}

export function getDiscountPrice(x){
    return x.discount ? x.unitPrice - x.unitPrice * parseFloat(`0.${x.discount}`) : x.unitPrice;
}