import * as React from 'react';
var uuid = require('react-native-uuid');
import vars from '../utils/vars';

export async function RequestEmailOTP(email){
    return new Promise(async (resolve,reject)=>{
        try {
            let guid = uuid.v1();
            console.log('uuid.....signup', guid)
            let response = await fetch("https://delivery-api.harveynetwork.com/api/Auth/request-email-otp", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Shard': vars.xShard,
                    'Request-Id': guid,
                },
                body: JSON.stringify({
                    email: email
                })
            });
            let result = await response.json();
            resolve(result)

        } catch (err){
            reject(err)
        }
    })

}