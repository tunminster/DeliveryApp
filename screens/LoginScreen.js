
import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from "react-native";

import { AuthContext } from '../constants/Context';

export const SignIn = ({navigation}) => {
    const {signIn} = React.useContext(AuthContext);
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    return(
        
            <View style={loginstyles.container}>
                <Text style={loginstyles.logo}>My Restaurant</Text>
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
                  onPress={() => signIn()}
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

export const CreateAccount = () => {
    const { signUp} = React.useContext(AuthContext);

    return (
        <ScreenContainer>
            <Text> Create Account Screen</Text>
            <Button title="Sign Up" onPress={ () => signUp()} />
        </ScreenContainer>
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
    }
  });