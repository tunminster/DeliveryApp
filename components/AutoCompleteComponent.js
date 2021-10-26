import * as React from 'react';
import vars from '../utils/vars';
import Store from "../config/store";

export async function AutoCompleteComponent(body)
{
  let response = await fetch(`${Store?.remoteConfig?.locationBaseUrl}?input=${body.location}&components=country:us&key=${Store?.remoteConfig?.google_key}`, {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
      }),
    });
    let result = await response.json();
    
    return result;
}