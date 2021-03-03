import {Platform} from 'react-native';

export default {
    host: 'https://delivery-api.harveynetwork.com',
    baseColor: '#34495E',
    bgColor: '#ECF0F1',
    isIos: Platform.OS === 'ios',
    //bold: 'Roboto',
    txtColor: '#333',
    blackColor: '#000000',
    whiteColor: '#ffffff',
    idToken: 'id_token',
    currency: '$',
    paymentCurrencyCode: 'USD',
    androidPayMode: 'test',
    labelName: 'RagiBull', 
    merchantId: 'merchant.com.deliveryapp.app',  
    stripeSecretKey: 'sk_test_51IOWfdGQlL3ftoEbbRRjQeLXKBEWRX9ZBtZmkeCQ5mbGoh3lbx6QbqfbLpUQeRryDMgVYHkySPnxjAVnxuqQNRxf00oM1u3Gtg',
    publishableKey: 'pk_test_51IOWfdGQlL3ftoEbeRWvgmjcQP0nVIyq3ne8nzukYDIfIXJ68YxszvJk3BCOWHvEVCXfwYWwGtMsX2Y2lHRE6JGi00g39JUUSb',
    xShard: 'Da',
    locationBaseUrl: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    google_key: "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8",
    geoCodeBaseUrl: "https://maps.googleapis.com/maps/api/geocode/json",
}