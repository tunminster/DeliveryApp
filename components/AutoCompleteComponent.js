import * as React from 'react';
import vars from '../utils/vars';

export async function AutoCompleteComponent(body)
{
  let response = await fetch(`${vars.locationBaseUrl}?input=${body.location}&components=country:us&key=${vars.google_key}`, {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });
    let result = await response.json();
    
    return result;
}