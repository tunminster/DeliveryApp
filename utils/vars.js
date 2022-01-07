import {Platform} from 'react-native';
import Store from "../config/store";
import {setBaseURL} from "../config/api";
console.log('[Store]', Store?.remoteConfig)

let host = Store?.remoteConfig?.host || 'https://delivery-api.harveynetwork.com';
let currency = Store?.remoteConfig?.currency || '£';
let paymentCurrencyCode = Store?.remoteConfig?.paymentCurrencyCode || 'GBP';
let androidPayMode = Store?.remoteConfig?.androidPayMode || 'test';
let remoteConfigKey = "us_remote_config"
let merchantId = Store?.remoteConfig?.merchantId || 'merchant.com.deliveryapp.app'
let stripeSecretKey = Store?.remoteConfig?.stripeSecretKey || 'sk_test_51GtEA4ETaaP0kb6b89OocDTzkqdqiWLAT2Ee0D8YOMRKj63XNX85UWSCl8DDDf5jXAtuAY6CXaZumZJF8I6FuLWt00uzrlnRao'
let publishableKey = Store?.remoteConfig?.publishableKey || 'pk_test_51GtEA4ETaaP0kb6bNP6OATyBmPerdnIXrAJyjDP9gfgtSOzoka3hnSWmUNYGDKRsnfMshdneaxcl45za3ow47yx300BNFC7CXr'
let xShard = Store?.remoteConfig?.xShard ? Store?.remoteConfig?.xShard : 'Rauk'
let locationBaseUrl = Store?.remoteConfig?.locationBaseUrl || "https://maps.googleapis.com/maps/api/place/autocomplete/json"
let google_key = Store?.remoteConfig?.google_key || "AIzaSyDIwggD-DXUmXaU462dwrzGpZ75y8VEOP8";
let geoCodeBaseUrl = Store?.remoteConfig?.geoCodeBaseUrl || "https://maps.googleapis.com/maps/api/geocode/json";
export const setRemoteConfig = (data) => {
    setBaseURL(data)
    host = data?.host || 'https://delivery-api.harveynetwork.com';
    currency = data?.currency || '£';
    paymentCurrencyCode = data?.paymentCurrencyCode || 'GBP';
    androidPayMode = data?.androidPayMode || 'test';
    merchantId = data?.merchantId || 'merchant.com.deliveryapp.app'
    stripeSecretKey = data?.stripeSecretKey || 'sk_test_51GtEA4ETaaP0kb6b89OocDTzkqdqiWLAT2Ee0D8YOMRKj63XNX85UWSCl8DDDf5jXAtuAY6CXaZumZJF8I6FuLWt00uzrlnRao'
    publishableKey = data?.publishableKey || 'pk_test_51GtEA4ETaaP0kb6bNP6OATyBmPerdnIXrAJyjDP9gfgtSOzoka3hnSWmUNYGDKRsnfMshdneaxcl45za3ow47yx300BNFC7CXr'
    xShard = data?.xShard ? data?.xShard : 'Rauk'
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
    labelName: 'RagiBull UK',
    remoteConfigKey: "uk_remote_config",
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
    deliveryTips: 'Delivery tips',
    promotionDiscount:'Promotion discount',
    promoCode:'Have a promo code?',
    tax: "Tax",
    subTotal: 'Subtotal',
    notificationRegisterPost: `/api/customer-notification/register`,
    applicationFeesPost: `/api/order/get-application-fees`,
    confirmCouponCodePost: `/api/v1/Stripe/confirm-coupon-code`,
}