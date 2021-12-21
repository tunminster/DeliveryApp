import * as React from 'react';
var uuid = require('react-native-uuid');
import vars from '../utils/vars';
import Store from "../config/store";

export async function CreateAccountComponent(email,password,confirmpassword){
  let guid = uuid.v1();
  console.log('uuid.....signup', guid)
    let response = await fetch(`${Store?.remoteConfig?.host}/api/user/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Shard': Store?.remoteConfig?.xShard,
        'Request-Id': guid,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        confirmPassword:confirmpassword,
      })
    });

    let result = await response.json();

    return result;
}