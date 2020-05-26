import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from "react-native";
import { AuthContext } from '../constants/Context';
import {storeData, retrieveData} from '../components/AuthKeyStorageComponent';
import { GetCategoryByParentId } from '../components/GetCategoryListComponent'

export const MenuScreen = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);
    var STORAGE_KEY = 'id_token';

    // storeData(STORAGE_KEY, "Hello Saved")
    // .then((data) =>{
    //   const result = JSON.stringify(data);
    //   alert (result);
    // });
    alert("api call started.");
    retrieveData(STORAGE_KEY)
    .then((data) => {
     
      GetCategoryByParentId(0, data)
      .then((result) => {
        alert("The result is " + result);
      });
      

    });
    

    // ToDo top categories menu
    return (
      <ScreenContainer>
        <Text>Menu Screen </Text>
        <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
        <Button title="Sign Out" onPress={() => signOut()} />
      </ScreenContainer>
    );
  };  


  




  const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
      borderRadius: 5
    }
  });


  const loginstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#003f5c',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header:{
      fontSize:35,
      color:"#fb5b5a",
      marginBottom:40
    },
    logo:{
      fontWeight:"bold",
      fontSize:50,
      color:"#fb5b5a",
      marginBottom:40
    },
    inputView:{
      width:"80%",
      backgroundColor:"#465881",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
    inputText:{
      height:50,
      color:"white"
    },
    forgot:{
      color:"white",
      fontSize:11
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#fb5b5a",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    },
    loginText:{
      color:"white"
    },
    loginError:{
      color: "red",
      marginBottom:10
    }
  });