import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from "react-native";

import { AuthContext } from '../constants/Context';
var uuid = require('react-native-uuid');

export async function AuthRequestLogin(email, password){
    //const [result, setResult] = React.useState(null);
    let guid = uuid.v1();
    console.log('uuid.....login', guid)
    let response = await fetch("https://delivery-api.harveynetwork.com/api/auth/login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Shard': 'Da',
        'Requested-Id': guid, 
      },
      body: JSON.stringify({
        userName: email,
        password: password,
      })
    });
  
    let result = await response.json();
  
    return (result);
  
  };