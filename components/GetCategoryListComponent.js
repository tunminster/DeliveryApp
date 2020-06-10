import * as React from 'react';

export async function GetCategoryByParentId(parentId, authKey)
{
  
  let response = await fetch("https://delivery-api.harveynetwork.com/api/Category/getAllCategoriesByParentId/" + parentId, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + authKey
      }
    });
    let result = await response.json();
    
    return result;
}