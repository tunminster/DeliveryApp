import * as React from 'react';
import { AsyncStorage } from "react-native";


export async function storeData(key, message)
{
  try {
    await AsyncStorage.setItem(
      key,
      message
    );
    return "true";
  } catch (error) {
    // Error saving data
    console.error(error.message);
  }
}

export async function retrieveData (key)
{
  try{
    const value = await AsyncStorage.getItem(key);

    if(value !== null){
      return value;
    }
  }
  catch(error){
    console.error(error.message);
  }
}