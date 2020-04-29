import * as React from 'react';

export async function CreateAccountComponent(email,password,confirmpassword){
    let response = await fetch("https://delivery-api.harveynetwork.com/api/user/register", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        confirmpassword:confirmpassword,
      })
    });

    let result = await response.json();

    return result;
}