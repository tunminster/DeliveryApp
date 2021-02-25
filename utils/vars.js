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
    currency: '£',
    paymentCurrencyCode: 'GBP',
    androidPayMode: 'test',
    labelName: 'RagiBull UK', 
    merchantId: 'merchant.com.deliveryapp.app',  
    stripeSecretKey: 'sk_test_51GtEA4ETaaP0kb6b89OocDTzkqdqiWLAT2Ee0D8YOMRKj63XNX85UWSCl8DDDf5jXAtuAY6CXaZumZJF8I6FuLWt00uzrlnRao',
    publishableKey: 'pk_test_51GtEA4ETaaP0kb6bNP6OATyBmPerdnIXrAJyjDP9gfgtSOzoka3hnSWmUNYGDKRsnfMshdneaxcl45za3ow47yx300BNFC7CXr',
    xShard: 'Da',
    locationBaseUrl: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    google_key: "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8",
    geoCodeBaseUrl: "https://maps.googleapis.com/maps/api/geocode/json",
}