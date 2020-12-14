import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Button, Alert, TouchableOpacity, Image, Text} from 'react-native';
// import { SplashScreen } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer,DrawerActions  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import useLinking from './navigation/useLinking';
import { Icon } from 'react-native-elements';
import { SignIn, CreateAccount, Splash } from './screens/LoginScreen';
import { AuthRequestLogin } from './components/AuthLoginComponent';
import { CreateAccountComponent } from './components/CreateAccountComponent';
import { AuthContext } from './constants/Context';
import {storeData, retrieveData, storeUser} from './components/AuthKeyStorageComponent';
import Store from './config/store';
import vars from './utils/vars';
import ProductScreen from './screens/Products';
import PaymentType from './screens/PaymentType';
import Cart from './screens/Cart';
import Loading from './components/loading';
import AddressDetail from './screens/AddressDetail';
import Payment from './screens/Payment';
import PaymentSuccess from './screens/PaymentSuccess';
import ProfileNavigatorScreens from './navigation/profileNavigator';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
import Support from './screens/Support';

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
  
        loginRequest(email, password);
       
      },
      signUp: (email, password,confirmpassword) => {
        

        CreateAccountComponent(email, password, confirmpassword)
          .then( (data) => {
            const result = JSON.stringify(data);
            if (result.toUpperCase() == '"Account created"'.toUpperCase()){
             
              loginRequest(email, password);

            }
            else{
              Alert.alert("Please try to create account again.");
            }
            
          });

      },
      signOut: () => {
        
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

  function loginRequest(email, password){
    var STORAGE_KEY = 'id_token';
    AuthRequestLogin(email, password)
        .then( (data) =>{
          //Alert.alert("received call");
          const result = JSON.parse(data);
          setUserToken(result.auth_token);

          
          //store token
          storeData(STORAGE_KEY, result.auth_token)
            .then((data) =>{
              const result = JSON.stringify(data);
              
            });
          
          //store user  
          storeUser(result.auth_token).then((data) => {
              console.log("user stored " + data);
            });

            setIsLoading(false);  

        }).catch((error) => {
          console.error(error);
          setUserToken(null);
        });
  };

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

const PageStack = createStackNavigator();
const PageScreen = () => (
  <PageStack.Navigator headerMode="screen"
    >
      <PageStack.Screen name="Page" component={DrawerNavigator}  
      options={({navigation, userToken}) => (
            {
              title: 'Restaurant Name',
              headerStyle: {
              backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerLeft: () => (
                  <Icon style={styles.menuIcon} name='menu' size={42} color='white'
                    onPress={()=> {navigation.dispatch(DrawerActions.openDrawer())}}
                    />
              ),
              headerRight: () => (
                <TouchableOpacity style={{paddingRight: 15, position: 'relative'}} onPress={() => navigation.navigate('Cart')} >
                  <Image source={require('./assets/images/cart-icon-white.png')} style={{width: 29, height: 32, resizeMode: 'contain'}} />
                  <View style={{width: 20, height: 20, borderRadius: 10, position: 'absolute', backgroundColor: '#fff', bottom: -7, right: 7, justifyContent: 'center'}}>
                      <Text style={{color: '#000', textAlign: 'center', fontSize: 10}}>{Store.cartCount}</Text>
                  </View>
              </TouchableOpacity>
              )
              

              
            }
          )} />
      <PageStack.Screen name="Products" component={ProductScreen} options={({navigation, userToken}) => (
            {
              headerMode: 'screen',
              title: 'Product Details',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff'
            }
          )} />   

       <PageStack.Screen name="Cart" 
          component={Cart} 
          options={({navigation}) =>(
            {
              headerMode: 'screen',
              title: 'Checkout',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff'
            }

          )}
        />   

        <PageStack.Screen name="PaymentType" 
          component={PaymentType} 
          options={({navigation}) => (
            {
              headerMode: 'screen',
              title: 'PaymentType',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff',
              headerBackTitle: 'Back'
            }
          )}
        />

        <PageStack.Screen name="Payment" 
          component={Payment}
          options={({navigation}) => (
            {
              headerMode: 'screen',
              title: 'Payment',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff',
              headerBackTitle: 'Back'
            }
          )}  
        />

        <PageStack.Screen name="PaymentSuccess" 
                  component={PaymentSuccess}
                  options={({navigation}) => (
                    {
                      headerMode: 'screen',
                      title: 'Payment Success',
                      headerStyle: {
                        backgroundColor: '#f4511e'
                      },
                      headerTintColor: '#fff',
                      headerBackTitle: 'Back'
                    }
                  )}  
                />


        <PageStack.Screen name="MyProfile" component={ProfileNavigatorScreens} />

        <PageStack.Screen name="AddressDetail" 
          component={AddressDetail}
          options={({navigation}) => (
            {
              headerMode: 'screen',
              title: 'Address Detail',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff',
              headerBackTitle: ''
            }
          )}
        />

        <PageStack.Screen name="Orders" component={Orders} 
          options={({navigation}) => (
            {
              headerMode: 'screen',
              title: 'Orders',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff',
              headerBackTitle: ''
            }
          )}
        />

        <PageStack.Screen name="OrderDetail" component={OrderDetail} 
          options={({navigation}) => (
            {
              headerMode: 'screen',
              title: 'OrderDetail',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff',
              headerBackTitle: ''
            }
          )}
        />

      <PageStack.Screen name="Support" component={Support} 
          options={({navigation}) => (
            {
              headerMode: 'screen',
              title: 'Report Problem',
              headerStyle: {
                backgroundColor: '#f4511e'
              },
              headerTintColor: '#fff',
              headerBackTitle: ''
            }
          )}
        />


  </PageStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ userToken}) => (
  <RootStack.Navigator>
     {
       userToken ?(
        <RootStack.Screen name="App" component={PageScreen} 
         options={({navigation}) => (
           {headerShown: false}
         )}
        
          // options={({navigation, userToken}) => (
          //   {
          //     title: 'Restaurant Name',
          //     headerStyle: {
          //     backgroundColor: '#f4511e',
          //     },
          //     headerTintColor: '#fff',
          //     headerTitleStyle: {
          //       fontWeight: 'bold',
          //     },
          //     headerLeft: () => (
          //         <Icon style={styles.menuIcon} name='menu' size={42} color='white'
          //           onPress={()=> {navigation.dispatch(DrawerActions.openDrawer())}}
          //           />
          //     ),
          //     headerRight: () => (
          //       <TouchableOpacity style={{paddingRight: 15, position: 'relative'}} onPress={() => this.props.navigation.navigate('Cart')} >
          //         <Image source={require('./assets/images/cart-icon-white.png')} style={{width: 29, height: 32, resizeMode: 'contain'}} />
          //         <View style={{width: 20, height: 20, borderRadius: 10, position: 'absolute', backgroundColor: '#fff', bottom: -7, right: 7, justifyContent: 'center'}}>
          //             <Text style={{color: '#000', textAlign: 'center', fontSize: 10}}>{Store.cartCount}</Text>
          //         </View>
          //     </TouchableOpacity>
          //     )

              
          //   }
          // )}
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


