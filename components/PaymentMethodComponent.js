import * as React from 'react';
import vars from '../utils/vars';
import Store from "../config/store";

export async function PaymentMethodComponent(data) {

  let response = await fetch("https://api.stripe.com/v1/payment_methods", {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + Store?.remoteConfig?.stripeSecretKey
    },
    body:data
  });

  let result = await response.json();

  return result;
}