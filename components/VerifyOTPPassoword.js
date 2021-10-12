import * as React from 'react';
var uuid = require('react-native-uuid');
import vars from '../utils/vars';

export async function VerifyOTP(data = {}){
    return new Promise(async (resolve,reject)=>{
        try {
            let guid = uuid.v1();
            console.log('uuid.....signup', guid)
            let response = await fetch("https://delivery-api.harveynetwork.com/api/Auth/verify-reset-password", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Shard': vars.xShard,
                    'Request-Id': guid,
                },
                body: JSON.stringify(data)
            });

            if(response.status === 200){
                let result = await response.json();
                resolve(result)
            } else {
                reject({errors:"Something went wrong please try again"})
            }
        } catch (err){
            reject(err)
        }
    })

}