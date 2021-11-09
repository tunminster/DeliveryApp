import {observable, action, toJS} from 'mobx';
import {cacheCart} from '../../utils/helpers';
import remoteConfig from "@react-native-firebase/remote-config";

class Store {
    @observable productCategories = [];
    @observable currentRoute = '';
    @observable cart = [];
    @observable cartCount = 0;
    @observable popularProducts = [];
    @observable allProducts = [];
    @observable addBasket = [];
    @observable restaurantData = null
    @observable deliverAddress = null
    @observable isDelivery = true;
    @observable remoteConfig = {
        "host": "https://delivery-api.harveynetwork.com",
        "currency": "$",
        "paymentCurrencyCode": "USD",
        "androidPayMode": "test",
        "merchantId": "merchant.com.deliveryapp.app",
        "stripeSecretKey": "sk_test_51IOWfdGQlL3ftoEbbRRjQeLXKBEWRX9ZBtZmkeCQ5mbGoh3lbx6QbqfbLpUQeRryDMgVYHkySPnxjAVnxuqQNRxf00oM1u3Gtg",
        "publishableKey": "pk_test_51IOWfdGQlL3ftoEbeRWvgmjcQP0nVIyq3ne8nzukYDIfIXJ68YxszvJk3BCOWHvEVCXfwYWwGtMsX2Y2lHRE6JGi00g39JUUSb",
        "xShard": "Raus",
        "locationBaseUrl": "https://maps.googleapis.com/maps/api/place/autocomplete/json",
        "google_key": "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8",
        "geoCodeBaseUrl": "https://maps.googleapis.com/maps/api/geocode/json"
    };
    @observable applicationFees = {
        platformFee: 0,
        deliveryFee: 0,
        taxFees: 0,
        totalAmount: 0,
        subTotal:0
    };

    @action setCurrentRoute(route) {
        this.currentRoute = route;
    }

    @action addToCart(data) {
        let existData = this.cart.find(x => x.id === data.id);
        if (existData) {
            // existData.count += 1;
        } else {
            data.count = 1;
            this.cart.push(data);
        }
        this.setCartCount(1);
        cacheCart(this.cart, this.cartCount);
    }

    @action removeFromCart(index) {
        this.setCartCount(-this.cart[index].count);
        this.cart.splice(index, 1);
        cacheCart(this.cart, this.cartCount);
    }

    @action setCart(data) {
        this.cart = data;
    }

    @action setCartCount(count) {
        this.cartCount += count;
    }

    @action updateCardItem(i, val) {
        this.cart[i].count += val;
        this.setCartCount(val);
    }

    @action resetCartCount() {
        this.cartCount = 0;
    }

    @action setPopularProducts(data) {
        this.popularProducts = data;
    }

    @action setProductCategories(data) {
        this.productCategories = data;
    }

    @action setAllProducts(data) {
        this.allProducts = data;
    }

    @action setDelivery(data) {
        this.isDelivery = data;
    }

    @action setApplicationFee(data) {
        this.applicationFees = {
            platformFee: data?.platformFee || 0,
            deliveryFee: data?.deliveryFee || 0,
            taxFee: data?.taxFee || 0,
            totalAmount:data?.totalAmount || 0,
            subTotal:data?.subTotal || 0
        };
    }

    @action setRemoteConfig(data) {
        this.remoteConfig = {
            ...this.remoteConfig,
            host : data?.host || 'https://delivery-api.harveynetwork.com',
            currency : data?.currency || '$',
            paymentCurrencyCode : data?.paymentCurrencyCode || 'USD',
            androidPayMode : data?.androidPayMode || 'test',
            merchantId : data?.merchantId || 'merchant.com.deliveryapp.app',
            stripeSecretKey : data?.stripeSecretKey || 'sk_test_51IOWfdGQlL3ftoEbbRRjQeLXKBEWRX9ZBtZmkeCQ5mbGoh3lbx6QbqfbLpUQeRryDMgVYHkySPnxjAVnxuqQNRxf00oM1u3Gtg',
            publishableKey : data?.publishableKey || 'pk_test_51IOWfdGQlL3ftoEbeRWvgmjcQP0nVIyq3ne8nzukYDIfIXJ68YxszvJk3BCOWHvEVCXfwYWwGtMsX2Y2lHRE6JGi00g39JUUSb',
            xShard : data?.xShard ? data?.xShard : 'Raus',
            locationBaseUrl : data?.locationBaseUrl || "https://maps.googleapis.com/maps/api/place/autocomplete/json",
            google_key : data?.google_key || "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8",
            geoCodeBaseUrl : data?.geoCodeBaseUrl || "https://maps.googleapis.com/maps/api/geocode/json"
        };
    }

}

export default new Store();