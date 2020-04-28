import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Button, Alert } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer,DrawerActions  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import useLinking from './navigation/useLinking';
import HomeScreen from './screens/HomeScreen';
import HelloScreen from './screens/HomeScreen';

import { Icon } from 'react-native-elements';
import { SignIn, CreateAccount, Splash, LoginRequest } from './screens/LoginScreen';
import { AuthRequestLogin } from './components/AuthLoginComponent';
import { AuthContext } from './constants/Context';

const Stack = createStackNavigator();
state={
  email:"",
  password:""
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const [isLoading, setIsLoading] = React.useState(true);  
  const [userToken, setUserToken] = React.useState(null);
  const authContext = React.useMemo(() => {
    return{
      signIn: (email, password) => {
       
      setIsLoading(false);

      AuthRequestLogin(email, password)
        .then( (data) =>{
          
          const result = JSON.parse(data);
          

          setUserToken(result.auth_token);
          
        }).catch((error) => {
          console.error(error);
          setUserToken(null);
        });
   
      },
      signUp: () => {
        setIsLoading(false);
        //setUserToken("asdf");
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null);
      }
    }
  }, []);

  
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
    setTimeout(() => {
      setIsLoading(false);
    },1000)

  }, []);

  if(isLoading) {
    return <Splash />;
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      
      <AuthContext.Provider value={authContext}>
          <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
            {/* <Stack.Navigator 
            
            screenOptions={({navigation}) =>(
              {
                title: 'Restaurant Name',
                headerStyle: {
                backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerRight: () => (
                  
                  <Icon style={styles.menuIcon} name='menu' size={42} color='white'
                  onPress={()=> {navigation.dispatch(DrawerActions.openDrawer())}}
                  />
                )
              }
            )}>
              
              <Stack.Screen name="Root" component={  DrawerNavigator} />
            

            </Stack.Navigator> */}
            <RootStackScreen userToken={userToken} state={state} />
          </NavigationContainer>
        </View>
      </AuthContext.Provider>
      
    );
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuIcon:{
    paddingRight:5
  },
});

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="SignIn" component= {SignIn} options={{title: "Sign In"}} />
    <AuthStack.Screen name="CreateAccount" component={CreateAccount} 
      options={{title: "Create Account"}} />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken}) => (
  <RootStack.Navigator>
     {
       userToken ?(
        <RootStack.Screen name="App" component={DrawerNavigator} 
          options={({navigation}) => (
            {
              title: 'Restaurant Name',
              headerStyle: {
              backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                  <Icon style={styles.menuIcon} name='menu' size={42} color='white'
                    onPress={()=> {navigation.dispatch(DrawerActions.openDrawer())}}
                    />
              )
            }
          )}
         />
       ) : (
        <RootStack.Screen name="Auth" component= {AuthStackScreen} 
        options={({navigation}) => (
          {
            title: 'Restaurant Name',
            headerStyle: {
            backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            
          }
        )}
        />
       )
     }
     
     
  </RootStack.Navigator>
);


