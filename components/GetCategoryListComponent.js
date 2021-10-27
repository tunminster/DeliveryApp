import * as React from 'react';
var uuid = require('react-native-uuid');
import vars from '../utils/vars';
import Store from "../config/store";

export async function GetCategoryByParentId(parentId, authKey)
{
  let guid = uuid.v1();
  let response = await fetch(`${Store?.remoteConfig?.host}/api/Category/getAllCategoriesByParentId/` + parentId, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + authKey,
        'X-Shard': Store?.remoteConfig?.xShard,
        'Request-Id': guid,
      }
    });
    let result = await response.json();
    
    return result;
}