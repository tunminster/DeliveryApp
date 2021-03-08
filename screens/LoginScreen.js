import * as React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Dimensions } from "react-native";
import { AuthContext } from '../constants/Context';
import { UserInterfaceIdiom } from 'expo-constants';
import { wp, hp, normalize, isX, isIOS } from '../helper/responsiveScreen';
import Custominput from '../components/textinput';
import CustomButton from '../components/loginbutton';
import vars from '../utils/vars';
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import Loading from '../components/loading';
import Colors from '../constants/Colors'
import SmartScrollView from '../components/SmartScrollView'
import { appleAuth } from '@invertase/react-native-apple-authentication';

export const SignIn = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  const { googleSignIn } = React.useContext(AuthContext);
  const { facebookSignIn } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const facebookLogIn = async () => {

    try {
      LoginManager.logOut()
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        function (result) {
          if (result.isCancelled) {
            console.log("Login cancelled");
          } else {
            console.log(
              'Facebook Login ===> Permissions ' +
              result.grantedPermissions.toString(),
              result,
            )
            AccessToken.getCurrentAccessToken().then(
              data => {
                console.log('data', data)
                facebookSignIn(data.accessToken);
              },
            )
          }
        },
        function (error) {
          console.log('Facebook Login ===> Error... ' + error)
        },
      )

    } catch (e) {
      console.log("error", e);
    }
  }

  const signInWithGoogle = async () => {
    try {
      GoogleSignin.configure({
        webClientId: '337543803569-5032h18ejdp4a2bj7hum75plie488trk.apps.googleusercontent.com',
        iosClientId: '337543803569-ka132imsm02isjpjfcd6mdjam8o0agam.apps.googleusercontent.com',
        offlineAccess: false,
      })

      await GoogleSignin.signOut()
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      googleSignIn(userInfo.idToken)
      console.log('userInfo', userInfo)
    } catch (e) {
      console.log("error", e);
    }
  }

  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse)


    } catch (e) {
      console.log("error", e);
    }
  }

  const dologin = () => {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    if (email.email == null || email.email == '') {
      // setEmailError("Enter a valid email.");
      alert("Enter an email.");
    }
    else if (!pattern.test(email.email)) {
      alert("Enter a valid email.")
    }

    else if (password.password == null || password.password == '') {
      // setPasswordError("Enter a valid password");
      alert("Enter a valid password.")
    }


    else if (email.email != null && password.password != null) {
      signIn(email.email, password.password);
    }
  }

  return (
    <SmartScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={loginstyles.container}
      applyKeyboardCheck={Platform.OS == 'ios' ? true : false}
      disabled={false}
      alwaysBounceVertical={false} >
      <View style={{ marginVertical: hp(4), alignItems: 'center' }}>
        <Image source={require('../assets/images/logo.png')} style={loginstyles.logo} />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', }}>

        <Custominput
          placeholder="Email Address"
          placeholderTextColor="rgba(0,0,0,0.32)"
          style
          icon={require('../assets/images/mail.png')}
          onChangeText={text => setEmail({ email: text })}
          autoCorrect={false}
        />

        <Custominput
          password
          placeholder="Password"
          placeholderTextColor="rgba(0,0,0,0.32)"
          style
          icon={require('../assets/images/lock.png')}
          onChangeText={text => setPassword({ password: text })}
          autoCorrect={false}
        />

        <Text style={loginstyles.forgot}>Forgot Password?</Text>

        <CustomButton
          onPress={() => dologin()}
          title={'Sign In'}
        />

        <Text style={loginstyles.account}>Don't have an account?
          <TouchableOpacity onPress={() => navigation.push("CreateAccount")}>

            <Text style={loginstyles.signup}> Sign Up</Text>
          </TouchableOpacity>
        </Text>

        <Text style={{ marginVertical: hp(2), color: '#777777', fontFamily: 'Roboto-Regular', fontSize: normalize(14) }}>Or</Text>
      </View>

      <View style={loginstyles.imagecontainer}>

        <View style={loginstyles.view}>
          <TouchableOpacity onPress={() => signInWithGoogle()}>
            <Image source={require('../assets/images/google.png')} style={loginstyles.signinImage} />
          </TouchableOpacity>
        </View>

        <View style={loginstyles.view}>
          <TouchableOpacity onPress={() => facebookLogIn()}>
            <Image source={require('../assets/images/facebook.png')} style={loginstyles.signinImage} />
          </TouchableOpacity>
        </View>

        {isIOS &&
          <View style={loginstyles.view}>
            <TouchableOpacity onPress={() => onAppleButtonPress()}>
              <Image source={require('../assets/images/apple.png')} resizeMode='contain' style={loginstyles.signinImage} />
            </TouchableOpacity>
          </View>
        }
      </View>

      <Image source={require('../assets/images/Background.png')} resizeMode='stretch' style={isX ? loginstyles.backgroundimg1 : loginstyles.backgroundimg} />
    </SmartScrollView>
  );
};

export const CreateAccount = ({ navigation }) => {
  const { signUp } = React.useContext(AuthContext);
  const { googleSignIn } = React.useContext(AuthContext);
  const { facebookSignIn } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const facebookLogIn = async () => {
    try {
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        function (result) {
          if (result.isCancelled) {
            console.log("Login cancelled");
          } else {
            console.log(
              'Facebook Login ===> Permissions ' +
              result.grantedPermissions.toString(),
              result,
            )
            AccessToken.getCurrentAccessToken().then(
              data => {
                console.log('data', data)
                facebookSignIn(data.accessToken);
              },
            )
          }
        },
        function (error) {
          console.log('Facebook Login ===> Error... ' + error)
        },
      )
    } catch (e) {
      console.log("error", e);
    }
  }

  const signInWithGoogle = async () => {
    try {
      GoogleSignin.configure({
        webClientId: '337543803569-5032h18ejdp4a2bj7hum75plie488trk.apps.googleusercontent.com',
        iosClientId: '337543803569-ka132imsm02isjpjfcd6mdjam8o0agam.apps.googleusercontent.com',
        offlineAccess: false,
      })

      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      googleSignIn(userInfo.idToken)
      console.log('userInfo', userInfo)
    } catch (e) {
      console.log("error", e);
    }
  }

  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse)


    } catch (e) {
      console.log("error", e);
    }
  }

  const register = () => {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    if (email.email == null || email.email == '') {
      // setEmailError("Enter a valid email.");
      alert("Enter an email.");
    }
    else if (!pattern.test(email.email)) {
      alert("Enter a valid email.")
    }
    else if (password.password == null || password.password == '') {

      // setPasswordError("Enter a valid password");
      alert("Enter a password.")
    }
    else if (confirmPassword.confirmpassword == null || confirmPassword.confirmpassword == '') {
      alert("Enter a Confrim password.")
    }
    else if (confirmPassword.confirmpassword != password.password) {
      // setPasswordError("confirm password is not match.");
      alert("Password mismatch.");
    }

    else if (email.email != null && password.password != null) {
      signUp(email.email, password.password, confirmPassword.confirmpassword);
    }
  }

  return (
    <SmartScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={loginstyles.container}
      applyKeyboardCheck={Platform.OS == 'ios' ? true : false}
      disabled={false}
      alwaysBounceVertical={false} >
      <View style={{ marginVertical: hp(4), alignItems: 'center' }}>
        <Image source={require('../assets/images/logo.png')} style={loginstyles.logo} />
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>

        <Custominput
          style
          placeholder="Email Address"
          placeholderTextColor="rgba(0,0,0,0.32)"
          icon={require('../assets/images/mail.png')}
          onChangeText={text => setEmail({ email: text })}
          autoCorrect={false}
        />

        <Custominput
          password
          placeholder="Password"
          placeholderTextColor="rgba(0,0,0,0.32)"
          style
          icon={require('../assets/images/lock.png')}
          onChangeText={text => setPassword({ password: text })}
          autoCorrect={false}
        />

        <Custominput
          password
          placeholder="Confirm Password"
          placeholderTextColor="rgba(0,0,0,0.32)"
          style
          icon={require('../assets/images/lock.png')}
          onChangeText={text => setConfirmPassword({ confirmpassword: text })}
          autoCorrect={false}
        />

        <CustomButton
          onPress={() => register()}
          title={'Sign Up'}
        />

        <Text style={loginstyles.account}>Already have an Account?
            <TouchableOpacity onPress={() => navigation.push("SignIn")}>

            <Text style={loginstyles.signup}> Sign In</Text>
          </TouchableOpacity>
        </Text>

        <Text style={{ marginVertical: hp(2), color: '#777777', fontFamily: 'Roboto-Regular', fontSize: normalize(14) }}>Or</Text>
      </View>

      <View style={loginstyles.imagecontainer}>

        <View style={loginstyles.view}>
          <TouchableOpacity onPress={() => signInWithGoogle()}>
            <Image source={require('../assets/images/google.png')} style={loginstyles.signinImage} />
          </TouchableOpacity>
        </View>

        <View style={loginstyles.view}>
          <TouchableOpacity onPress={() => facebookLogIn()}>
            <Image source={require('../assets/images/facebook.png')} style={loginstyles.signinImage} />
          </TouchableOpacity>
        </View>

        {isIOS &&
          <View style={loginstyles.view}>
            <TouchableOpacity onPress={() => onAppleButtonPress()}>
              <Image source={require('../assets/images/apple.png')} resizeMode='contain' style={loginstyles.signinImage} />
            </TouchableOpacity>
          </View>
        }
      </View>

      <Image source={require('../assets/images/Background.png')} resizeMode='stretch' style={isX ? loginstyles.backgroundimg1 : loginstyles.backgroundimg} />

    </SmartScrollView>
  );
};

export const Splash = () => (
  <ScreenContainer>
    {/* <Text>Loading...</Text> */}
    <Loading />
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
  logo: {
    resizeMode: 'stretch',
    width: wp(30),
    height: wp(30)
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS == 'ios' ? hp(4) : hp(0),
    minHeight: Dimensions.get('window').height - hp(4)
  },
  header: {
    fontSize: normalize(29),
    alignItems: 'center',
    fontFamily: 'SFProText',
    color: vars.blackColor,
    width: wp(90),
    marginBottom: hp(2),
    marginTop: hp(12)
  },
  txt: {
    fontFamily: 'Roboto-Regular',
    fontSize: normalize(15),
    width: wp(90),
    marginBottom: hp(3),
  },
  forgot: {
    fontSize: normalize(14),
    fontFamily: 'Roboto-Regular',
    color: '#FE595E',
    alignSelf: 'flex-end',
    marginRight: wp(5),
    marginTop: hp(-2),
    marginBottom: hp(3)
  },
  account: {
    fontFamily: 'Roboto-Regular',
    fontSize: normalize(14),
    color: '#777777',

  },
  signup: {
    fontSize: normalize(14),
    fontFamily: 'Roboto-Medium',
    color: '#FE595E',
    top: 3,
  },
  imagecontainer: {
    flexDirection: 'row',
    marginBottom: hp(2),
    justifyContent: 'space-evenly',
    paddingHorizontal: wp(10)

  },
  signinImage: {
    marginHorizontal: wp(2),
    backgroundColor: vars.whiteColor,
    borderRadius: normalize(50),
    width: hp(5),
    height: hp(5),
  },
  backgroundimg: {
    width: wp(100),
    height: hp(22),
  },
  backgroundimg1: {
    width: wp(100),
    height: hp(22),
    position: 'absolute',
    bottom: 0
  },
  view: {
    backgroundColor: vars.whiteColor,
    paddingVertical: hp(1),
    borderRadius: normalize(50),
    shadowColor: vars.blackColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 5
  },
  shadow: {
    shadowColor: vars.blackColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 5
  },
});