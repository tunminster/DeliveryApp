import * as React from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image,ScrollView } from "react-native";

import { AuthContext } from '../constants/Context';
import { UserInterfaceIdiom } from 'expo-constants';
import {wp ,hp, normalize} from '../helper/responsiveScreen';
import Custominput from '../components/textinput';
import CustomButton from '../components/loginbutton';


export const SignIn = ({navigation}) => {
    const {signIn} = React.useContext(AuthContext);
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setLoading] = React.useState({loading: false});
    
    // doSignIn = async () => {
      
    //   setLoading({loading: true});
    //   signIn(email.email, password.password);
    //   //setLoading({loading: false});
    // };

    const register = () => {
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
     
      if(email.email == null || email.email==''){
        // setEmailError("Enter a valid email.");
        alert("Enter an email.");
      }
      else if(!pattern.test(email.email)){
        alert("Enter a valid email.")
      }
      else if(password.password == null || password.password==''){
        // setPasswordError("Enter a valid password");
        alert("Enter a valid password.")
      }
      
      else if(email.email != null && password.password != null){
       
        signIn(email.email, password.password);
      }
    }

    return(
      <View style={loginstyles.container}>
        <View style={{marginTop:hp(12),justifyContent:'center',alignItems:'center'}}>
        <Image source={require('../assets/images/logo.png')} style={loginstyles.logo}/>
        </View>
       <View style={{justifyContent:'center',alignItems:'center',marginTop:hp(-12)}}>
       
        <Text style={loginstyles.header}>Welcome</Text>
        <Text style={loginstyles.txt}>Enter Your Email address for Sign In. Enjoy your food</Text>
      
                <Custominput
                placeholder="Email Address"
                placeholderTextColor="rgba(0,0,0,0.32)"
                style
                icon={require('../assets/images/mail.png')}
                onChangeText={text => setEmail({email:text})}
                autoCorrect={false}
                />
                
                <Custominput
                  password
                  placeholder="Password"
                  placeholderTextColor="rgba(0,0,0,0.32)"
                  style
                  icon={require('../assets/images/lock.png')}
                  onChangeText={text => setPassword({password:text})}
                  autoCorrect={false}
                />

          <Text style={loginstyles.forgot}>Forgot Password?</Text>

          <CustomButton
          onPress={()=> register()}
          title={'Sign In'}
          />
          
          <Text style={loginstyles.account}>Don't have an account? 
            <TouchableOpacity onPress={() => navigation.push("CreateAccount")}>
            <Text style={loginstyles.signup}> Sign Up</Text>
            </TouchableOpacity>
          </Text>
          
          <Text style={{marginVertical:hp(2),color:'#777777',fontFamily:'Roboto-Regular',fontSize:normalize(14)}}>Or</Text>
          </View>
          <View style={loginstyles.imagecontainer}>
            <View style={loginstyles.view}>
            <TouchableOpacity >
            <Image source={require('../assets/images/google.png')} style={loginstyles.signinImage}/>
            </TouchableOpacity>
            </View>
            <View style={loginstyles.view}>
            <TouchableOpacity >
            <Image source={require('../assets/images/facebook.png')} style={loginstyles.signinImage}/>
            </TouchableOpacity>
            </View>
            <View style={loginstyles.view}>
            <TouchableOpacity >
            <Image source={require('../assets/images/apple.png')} style={loginstyles.signinImage}/>
            </TouchableOpacity>
            </View>
          </View>

          <Image source={require('../assets/images/Background.png')} style={loginstyles.backgroundimg}/>
          
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
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      
      if(email.email == null || email.email==''){
        // setEmailError("Enter a valid email.");
        alert("Enter an email.");
      }
      else if(!pattern.test(email.email)){
          alert("Enter a valid email.")
      }
      else if(password.password == null || password.password == ''){

        // setPasswordError("Enter a valid password");
        alert("Enter a password.")
      }
      else if(confirmPassword.confirmpassword == null || confirmPassword.confirmpassword==''){
        alert("Enter a Confrim password.")
      }
      else if(confirmPassword.confirmpassword != password.password){
        // setPasswordError("confirm password is not match.");
        alert("Password mismatch.");
      }

      else if(email.email != null && password.password != null){
       
        signUp(email.email, password.password, confirmPassword.confirmpassword);
      }
    }


    return (
     
      <View style={loginstyles.container}>
        <View style={{marginTop:hp(14),justifyContent:'center',alignItems:'center'}}>
        <Image source={require('../assets/images/logo.png')} style={loginstyles.logo}/>
        </View>

        <View style={{justifyContent:'center',alignItems:'center',marginTop:hp(-12)}}>
          <Text style={loginstyles.header}>Create Account</Text>
          <Text style={loginstyles.txt}>Enter your Email Address and Password for Sign up.</Text>
      
            <Custominput 
                style
                placeholder="Email Address"
                placeholderTextColor="rgba(0,0,0,0.32)"
                icon={require('../assets/images/mail.png')}
               onChangeText={text => setEmail({email:text})}
               autoCorrect={false}
                />
       
             <Custominput
                  password
                  placeholder="Password"
                  placeholderTextColor="rgba(0,0,0,0.32)"
                  style
                  icon={require('../assets/images/lock.png')}
                  onChangeText={text => setPassword({password:text})}
                  autoCorrect={false}
                />
         
              <Custominput
                  password
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(0,0,0,0.32)"
                  style
                  icon={require('../assets/images/lock.png')}
                  onChangeText={text => setConfirmPassword({confirmpassword:text})}
                  autoCorrect={false}
                />
       
        <CustomButton 
        onPress={()=>register()}
        title={'Sign Up'}
        />
         
          <Text style={loginstyles.account}>Already have an Account?  
            <TouchableOpacity onPress={() => navigation.push("SignIn")}>
            <Text style={loginstyles.signup}> Sign In</Text>
            </TouchableOpacity>
          </Text>
          
          <Text style={{marginVertical:hp(2),color:'#777777',fontFamily:'Roboto-Regular',fontSize:normalize(14)}}>Or</Text>
          </View>
          <View style={loginstyles.imagecontainer}>
            <View style={loginstyles.view}>
            <TouchableOpacity >
            <Image source={require('../assets/images/google.png')} style={loginstyles.signinImage}/>
            </TouchableOpacity>
            </View>
            <View style={loginstyles.view}>
            <TouchableOpacity >
            <Image source={require('../assets/images/facebook.png')} style={loginstyles.signinImage}/>
            </TouchableOpacity>
            </View>
            <View style={loginstyles.view}>
            <TouchableOpacity >
            <Image source={require('../assets/images/apple.png')} style={loginstyles.signinImage}/>
            </TouchableOpacity>
            </View>
          </View>

          <Image source={require('../assets/images/Background.png')} style={loginstyles.backgroundimg}/>
          
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


  const loginstyles=StyleSheet.create({
    logo:{
      resizeMode:'stretch',
    },
    container:{
      // flex:1,
      justifyContent: 'center',
      backgroundColor:'#FFFFFF',
    },
    header:{
      fontSize:normalize(29),
      alignItems:'center',
      fontFamily:'SFProText',
      color:'#000000',
      width:wp(90),
      marginBottom:hp(2),
      marginTop:hp(15)
    },
    txt:{
      fontFamily:'Roboto-Regular',
      fontSize:normalize(15),
      width:wp(90),
      marginBottom:hp(3),
    },
    forgot:{
      fontSize:normalize(14),
      fontFamily:'Roboto-Regular',
      color:'#FE595E',
      alignSelf:'flex-end',
      marginRight:wp(5),
      marginTop:hp(-3),
      marginBottom:hp(3)
    },
    account:{
        fontFamily:'Roboto-Regular',
        fontSize:normalize(14),
        color:'#777777',
        
    },
    signup:{
      fontSize:normalize(14),
      fontFamily:'Roboto-Medium',
      color:'#FE595E',
      top:3,
    },
    imagecontainer:{
      flexGrow:1,
      flexDirection:'row',
      marginBottom:hp(2),
     justifyContent:'space-evenly',
     paddingHorizontal:wp(10)

    },
    signinImage:{
      marginHorizontal:wp(2),
      backgroundColor:'#FFFFFF',
     borderRadius:normalize(50),
     width:hp(5),
     height:hp(5),
    },
    backgroundimg:{
      resizeMode:'stretch',
      width:wp(100),
      height:(183)
    },
    view:{
      backgroundColor:'#FFFFFF',
      paddingVertical:hp(1),
      borderRadius:normalize(50),
      shadowColor:'#000000',
      shadowOffset:{ width: 0, height: 3},
      shadowOpacity: 0.6,
      shadowRadius: 3,  
      elevation: 5
    },
    shadow:{
      shadowColor:'#000000',
      shadowOffset:{ width: 0, height: 3},
      shadowOpacity: 0.6,
      shadowRadius: 3,  
      elevation: 5
    },
  });