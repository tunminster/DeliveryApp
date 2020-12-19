import * as React from 'react';
import { AsyncStorage } from "react-native";
import AuthStore from '../config/store/auth';
import Api from '../config/api';
var uuid = require('react-native-uuid');


export async function storeData(key, message)
{
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

export async function retrieveData (key)
{
  try{
    const value = await AsyncStorage.getItem(key);

    if(value !== null){
      return value;
    }
  }
  catch(error){
    console.error(error.message);
  }
}

export async function storeUser(token)
{
    try{
      let guid = uuid.v1();
      const config = {
          headers: { Authorization: 'Bearer ' + token , 'Requested-Id': guid}
      };  
      Api.get('/customer/getcustomer', config).then(res => {
          console.log("api result is " + res);
          AuthStore.setUser(res);
      });
      return true;
    }
    catch(error){
      console.error(error.message);
    }
}