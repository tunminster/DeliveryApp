import * as React from 'react';

export async function PaymentMethodComponent(data) {

  const stripeKey = "sk_test_4eC39HqLyjWDarjtT1zdp7dc";

  let response = await fetch("https://api.stripe.com/v1/payment_methods", {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + stripeKey
    },
    body:data
  });

  let result = await response.json();

  return result;
}