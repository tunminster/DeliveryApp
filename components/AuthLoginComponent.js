import * as React from 'react';
import vars from '../utils/vars';

import { AuthContext } from '../constants/Context';
var uuid = require('react-native-uuid');

export async function AuthRequestLogin(email, password) {
  //const [result, setResult] = React.useState(null);
  let guid = uuid.v1();
  console.log('uuid.....login', guid)
  let response = await fetch("https://delivery-api.harveynetwork.com/api/auth/login", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Shard': vars.xShard,
      'Request-Id': guid,
    },
    body: JSON.stringify({
      userName: email,
      password: password,
    })
  });

  console.log('login response...', response)
  let result = await response.json();
  console.log('login response', result, response)

  return (result);

};

export async function AuthRequestFBLogin(token) {
  let guid = uuid.v1();
  let response = await fetch("https://delivery-api.harveynetwork.com/api/auth/account/login/facebook", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Shard': vars.xShard,
      'Request-Id': guid,
    },
    body: JSON.stringify({
      facebookToken: token,
      provider: 'facebook',
    })
  });

  let result = await response.json();
  return (result);
};

export async function AuthRequestGoogleLogin(token) {
  let guid = uuid.v1();
  let response = await fetch("https://delivery-api.harveynetwork.com/api/auth/account/login/google", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Shard': vars.xShard,
      'Request-Id': guid,
    },
    body: JSON.stringify({
      idToken: token,
      provider: 'google',
    })
  });

  let result = await response.json();
  return (result);
};