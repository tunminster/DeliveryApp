import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from "react-native";

import { AuthContext } from '../constants/Context';

export async function AuthRequestLogin(email, password){
    //const [result, setResult] = React.useState(null);
    let response = await fetch("https://delivery-api.harveynetwork.com/api/auth/login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password: password,
      })
    });
  
    let result = await response.json();
  
    return (result);
  
   
    // fetch("https://delivery-api.harveynetwork.com/api/auth/login", {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     username: email,
    //     password: password,
    //   })
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   Alert.alert("succeded from function");
    //   Alert.alert("result" + responseJson);
  
    //   //setResult(responseJson);
      
    //   return "yes";
      
    // })
    // .catch((error) => {
    //   Alert.alert("error ocurred");
    //   console.error(error);
    //   return "error";
    // });
  };