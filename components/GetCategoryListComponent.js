import * as React from 'react';

export async function GetCategoryByParentId(parentId, authKey)
{
  
  let response = await fetch("https://delivery-api.harveynetwork.com/api/Category/getAllCategoriesByParentId/" + parentId, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0MTJAZ21haWwuY29tIiwianRpIjoiNzI2ZmFiZmYtMDk0Zi00NDVjLWFjMmItYjBjMTgyOGZkZDY5IiwiaWF0IjoxNTg4ODkxMDA0LCJyb2wiOiJhcGlfYWNjZXNzIiwiaWQiOiI1MmQxY2JhMC1jZTA1LTRmZjItYTkzZS04YjRmMWVjZTlmMmUiLCJuYmYiOjE1ODg4OTEwMDQsImV4cCI6MTYyMDQyNzAwNCwiaXNzIjoid2ViQXBpIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwLyJ9.79dmhGMJFgEJJBJOHmGezgFJElbs_8jeermlg4nG-0E'
      }
    });
    let result = await response.json();
    
    return result;
}