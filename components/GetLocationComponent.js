import * as React from 'react';
import vars from '../utils/vars';

export async function GetLocationComponent(body, lat, lng) {
  let data;  

  if(lat != '') {
    data = lat + ',' + lng;
  } else {
    data = body.location
  }
  console.log('data', data)

  let response = await fetch(`${vars.geoCodeBaseUrl}?address=${data}&key=${vars.google_key}`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });
  let result = await response.json();

  return result;
}