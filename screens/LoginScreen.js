
import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from "react-native";

import { AuthContext } from '../constants/Context';
import { UserInterfaceIdiom } from 'expo-constants';

export const SignIn = ({navigation}) => {
    const {signIn} = React.useContext(AuthContext);
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    return(
        
            <View style={loginstyles.container}>
                <Text style={loginstyles.header}>Login</Text>
                <View style={loginstyles.inputView}>
                   <TextInput 
                      style={loginstyles.inputText}
                      placeholder="Email..."
                      placeholderTextColor="#003f5c"
                      onChangeText={text => setEmail({email:text})}
                      />
                </View>
                <View style={loginstyles.inputView} >
                  <TextInput  
                    secureTextEntry
                    style={loginstyles.inputText}
                    placeholder="Password..." 
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPassword({password:text})}/>
                </View>
                <TouchableOpacity>
                  <Text style={loginstyles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={loginstyles.loginBtn} 
                  onPress={() => signIn(email.email, password.password)}
                  >
                  <Text style={loginstyles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.push("CreateAccount")}
                  >
                  <Text style={loginstyles.loginText}>Signup</Text>
                </TouchableOpacity>

            </View>
            
    );

};

export const CreateAccount = ({navigation}) => {
    const { signUp} = React.useContext(AuthContext);
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [confirmPassword,setConfirmPassword] = React.useState("");
    const [emailError,setEmailError] = React.useState("");
    const [passwordError,setPasswordError] = React.useState("");

    const register = () => {
      
      if(email.email == null){
        setEmailError("Enter a valid email.");
      }

      if(password.password == null){
        setPasswordError("Enter a valid password");
      }
      else if(confirmPassword.confirmPassword != password.password){
        setPasswordError("confirm password is not match.");
      }

      if(email.email != null && password.password != null){
        Alert.alert("Enter the signup.");
        signUp(email.email, password.password);
      }
    }


    return (
      <View style={loginstyles.container}>
          <Text style={loginstyles.header}>Create Account</Text>
          <Text style={loginstyles.loginError}>{emailError}</Text>
          <Text style={loginstyles.loginError}>{passwordError}</Text>
          <View style={loginstyles.inputView}>
            <TextInput 
                style={loginstyles.inputText}
                placeholder="Email..."
                placeholderTextColor="#003f5c"
                onChangeText={text => setEmail({email:text})}
                />
            
          </View>
          <View style={loginstyles.inputView} >
            <TextInput  
              secureTextEntry
              style={loginstyles.inputText}
              placeholder="Password..." 
              placeholderTextColor="#003f5c"
              error={passwordError}
              onChangeText={text => setPassword({password:text})}/>
          </View>
          <View style={loginstyles.inputView} >
            <TextInput  
              secureTextEntry
              style={loginstyles.inputText}
              placeholder="Confirm Password..." 
              placeholderTextColor="#003f5c"
              onChangeText={text => setConfirmPassword({confirmpassword:text})}/>
          </View>
          
          <TouchableOpacity style={loginstyles.loginBtn} 
            onPress={() => register()}
            >
            <Text style={loginstyles.loginText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.push("SignIn")}
            >
            <Text style={loginstyles.loginText}>SignIn</Text>
          </TouchableOpacity>
         

      </View>
        
    );

    
};




export const Splash = () => (
    <ScreenContainer>
      <Text>Loading...</Text>
    </ScreenContainer>
  );


  export const Profile = ({ navigation }) => {
    const { signOut } = React.useContext(AuthContext);
  
    return (
      <ScreenContainer>
        <Text>Profile Screen</Text>
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