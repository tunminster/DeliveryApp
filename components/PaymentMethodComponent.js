import * as React from 'react';

export async function PaymentMethodComponent(data) {

  const stripeKey = "sk_test_51GtEA4ETaaP0kb6b89OocDTzkqdqiWLAT2Ee0D8YOMRKj63XNX85UWSCl8DDDf5jXAtuAY6CXaZumZJF8I6FuLWt00uzrlnRao";

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