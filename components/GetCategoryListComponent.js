import * as React from 'react';
var uuid = require('react-native-uuid');

export async function GetCategoryByParentId(parentId, authKey)
{
  let guid = uuid.v1();
  let response = await fetch("https://delivery-api.harveynetwork.com/api/Category/getAllCategoriesByParentId/" + parentId, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + authKey,
        'X-Shard': 'Da',
        'Request-Id': guid,
      }
    });
    let result = await response.json();
    
    return result;
}