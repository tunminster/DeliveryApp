import * as React from 'react';
import { AsyncStorage } from 'react-native';
import AuthStore from '../config/store/auth';
import Api from '../config/api';
var uuid = require('react-native-uuid');


export async function storeData(key, message) {
  try {
    await AsyncStorage.setItem(
      key,
      message
    );

    AuthStore.setIsLogin(true);

    return "true";
  } catch (error) {
    // Error saving data
    console.error(error.message);
  }
}

export async function retrieveData(key) {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return value;
    }
  }
  catch (error) {
    console.error(error.message);
  }
}

export async function storeUser(token) {
  try {
    let guid = uuid.v1();
    const config = {
      headers: { Authorization: 'Bearer ' + token, 'Request-Id': guid }
    };
    console.log('config!', config)
    Api.get('/customer/getcustomer', config).then(res => {
      console.log("api result is " + JSON.stringify(res));
      AuthStore.setUser(res);
    }).catch((error) => {
      console.error('error..', error);
    });
    return true;
  }
  catch (error) {
    console.log('error', error);
  }
}