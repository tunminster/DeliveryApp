import {Platform} from 'react-native';
import Store from "../config/store";
import {setBaseURL} from "../config/api";
console.log('[Store]', Store?.remoteConfig)

let host = Store?.remoteConfig?.host || 'https://delivery-api.harveynetwork.com';
let currency = Store?.remoteConfig?.currency || '$';
let paymentCurrencyCode = Store?.remoteConfig?.paymentCurrencyCode || 'USD';
let androidPayMode = Store?.remoteConfig?.androidPayMode || 'test';
let remoteConfigKey = "us_remote_config"
let merchantId = Store?.remoteConfig?.merchantId || 'merchant.com.deliveryapp.app'
let stripeSecretKey = Store?.remoteConfig?.stripeSecretKey || 'sk_test_51IOWfdGQlL3ftoEbbRRjQeLXKBEWRX9ZBtZmkeCQ5mbGoh3lbx6QbqfbLpUQeRryDMgVYHkySPnxjAVnxuqQNRxf00oM1u3Gtg'
let publishableKey = Store?.remoteConfig?.publishableKey || 'pk_test_51IOWfdGQlL3ftoEbeRWvgmjcQP0nVIyq3ne8nzukYDIfIXJ68YxszvJk3BCOWHvEVCXfwYWwGtMsX2Y2lHRE6JGi00g39JUUSb'
let xShard = Store?.remoteConfig?.xShard ? Store?.remoteConfig?.xShard : 'Raus'
let locationBaseUrl = Store?.remoteConfig?.locationBaseUrl || "https://maps.googleapis.com/maps/api/place/autocomplete/json"
let google_key = Store?.remoteConfig?.google_key || "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8";
let geoCodeBaseUrl = Store?.remoteConfig?.geoCodeBaseUrl || "https://maps.googleapis.com/maps/api/geocode/json";
export const setRemoteConfig = (data) => {
    setBaseURL(data)
    host = data?.host || 'https://delivery-api.harveynetwork.com';
    currency = data?.currency || '$';
    paymentCurrencyCode = data?.paymentCurrencyCode || 'USD';
    androidPayMode = data?.androidPayMode || 'test';
    merchantId = data?.merchantId || 'merchant.com.deliveryapp.app'
    stripeSecretKey = data?.stripeSecretKey || 'sk_test_51IOWfdGQlL3ftoEbbRRjQeLXKBEWRX9ZBtZmkeCQ5mbGoh3lbx6QbqfbLpUQeRryDMgVYHkySPnxjAVnxuqQNRxf00oM1u3Gtg'
    publishableKey = data?.publishableKey || 'pk_test_51IOWfdGQlL3ftoEbeRWvgmjcQP0nVIyq3ne8nzukYDIfIXJ68YxszvJk3BCOWHvEVCXfwYWwGtMsX2Y2lHRE6JGi00g39JUUSb'
    xShard = data?.xShard ? data?.xShard : 'Raus'
    locationBaseUrl = data?.locationBaseUrl || "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    google_key = data?.google_key || "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8";
    geoCodeBaseUrl = data?.geoCodeBaseUrl || "https://maps.googleapis.com/maps/api/geocode/json";
}

export const getRemoteConfig = (key = '') => {
    let a = Store?.remoteConfig[key]
    return a;
}

export default {
    host: host,
    baseColor: '#34495E',
    bgColor: '#ECF0F1',
    isIos: Platform.OS === 'ios',
    //bold: 'Roboto',
    txtColor: '#333',
    blackColor: '#000000',
    whiteColor: '#ffffff',
    idToken: 'id_token',
    currency: currency,
    paymentCurrencyCode: paymentCurrencyCode,
    androidPayMode: androidPayMode,
    labelName: 'RagiBull',
    remoteConfigKey: "us_remote_config",
    merchantId: merchantId,
    stripeSecretKey: stripeSecretKey,
    publishableKey: publishableKey,
    xShard: xShard,
    locationBaseUrl: locationBaseUrl,
    google_key: google_key,
    geoCodeBaseUrl: geoCodeBaseUrl,
    appleIdMessage: 'You must share your email address to login with the apple Id',
    forgotScreenTitle: 'Forgot Password',
    forgotScreenCaption: 'Please enter your Information below in order to login to you Account',
    otpScreenCaption: 'Enter the 6 digit code sent to your registered Email address.',
    otpScreenTitle: 'OTP Verification',
    resetPasswordScreenCaption: 'Enter your new password atleast 6 digit long.',
    resetPasswordScreenTitle: 'Reset Password',
    applicationFees: 'Application fees',
    deliveryFees: "Delivery fees",
    tax: "Tax",
    subTotal: 'Subtotal',
    notificationRegisterPost: `${host}/api/customer-notification/register`,
    applicationFeesPost: `${host}/api/order/get-application-fees`
}