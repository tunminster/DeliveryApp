import * as React from 'react';
var uuid = require('react-native-uuid');
import vars from '../utils/vars';
import Store from "../config/store";

export async function VerifyEmailOTP(data = {}){
    return new Promise(async (resolve,reject)=>{
        try {
            let guid = uuid.v1();
            console.log('uuid.....signup', guid)
            let response = await fetch(`${Store?.remoteConfig?.host}/api/Auth/verify-email-otp`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Shard': Store?.remoteConfig?.xShard,
                    'Request-Id': guid,
                },
                body: JSON.stringify(data)
            });
            if(response.status === 200 || response.status === 400){
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