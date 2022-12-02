import * as React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    View,
    Button,
    Alert,
    TouchableOpacity,
    Image,
} from 'react-native';

import { firebase } from '@react-native-firebase/perf';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {Ionicons} from '@expo/vector-icons';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import DefaultRemoteConfig from './utils/defaultRemoteConfig'
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native'
import {SignIn, CreateAccount, Splash} from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OtpVerificationScreen from './screens/OtpVerificationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import {
    AuthRequestLogin,
    AuthRequestGoogleLogin,
    AuthRequestFBLogin,
    AuthRequestAppleLogin
} from './components/AuthLoginComponent';

import {CreateAccountComponent} from './components/CreateAccountComponent';
import {RequestPasswordOTP} from './components/RequestPasswordOTP';
import {VerifyOTP} from './components/VerifyOTPPassoword';
import {AuthContext} from './constants/Context';
import {storeData, retrieveData, storeUser} from './components/AuthKeyStorageComponent';
import Store from './config/store';
import ProductScreen from './screens/Products';
import PaymentType from './screens/PaymentType';
import Cart from './screens/Cart';
import Loading from './components/loading';
import AddressDetail from './screens/AddressDetail';
import AddressCreation from './screens/AddressCreation';
import Payment from './screens/Payment';
import PaymentSuccess from './screens/PaymentSuccess';
import ProfileNavigatorScreens from './navigation/profileNavigator';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
import Support from './screens/Support';
import RestaurantList from './screens/RestaurantList';
import MyDetails from './screens/MyDetails';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';
import {RequestEmailOTP} from "./components/RequestEmailOTP";
import {VerifyEmailOTP} from "./components/VerifyEmailOTP";
import {setRemoteConfig} from "./utils/vars";
const Stack = createStackNavigator();
state = {
    email: "",
    password: ""
}

export default function App(props) {
    const [isLoadingComplete, setLoadingComplete] = React.useState(false);
    const [initialNavigationState, setInitialNavigationState] = React.useState();
    const containerRef = React.useRef();
    const {getInitialState} = useLinking(containerRef);

    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState(null);

    const authContext = React.useMemo(() => {
        return {
            signIn: (email, password) => {
                loginRequest(email, password);
            },
            signUp: (email, password, confirmpassword) => {
                setIsLoading(true);
                CreateAccountComponent(email, password, confirmpassword)
                    .then((data) => {
                        const result = JSON.stringify(data);
                        if (result.toUpperCase() == '"Account created"'.toUpperCase()) {
                            loginRequest(email, password);
                        } else {
                            setIsLoading(false);
                            if(JSON.parse(result)?.DuplicateUserName && JSON.parse(result)?.DuplicateUserName[0] !== ""){
                                Alert.alert(JSON.parse(result)?.DuplicateUserName[0]);
                            } else {
                                Alert.alert("Please try to create account again.");
                            }
                        }
                    }).catch((error) => {
                    setIsLoading(false);
                    console.log('error', error)
                });

            },
            ForgotPasswordOTP: (email) => {
                return new Promise((resolve, reject) => {
                    RequestPasswordOTP(email)
                        .then((data) => {
                            resolve(data);
                        }).catch((error) => {
                        reject(error)
                        console.log('error', error)
                    });
                })

            },
            RequestEmailOTP: (email) => {
                return new Promise((resolve, reject) => {
                    RequestEmailOTP(email)
                        .then((data) => {
                            resolve(data);
                        }).catch((error) => {
                        reject(error)
                        console.log('error', error)
                    });
                })

            },
            VerifyOTPResetPassword: (data = {}) => {
                return new Promise((resolve, reject) => {
                    VerifyOTP(data)
                        .then((data) => {
                            resolve(data);
                        }).catch((error) => {
                        reject(error)
                        console.log('error', error)
                    });
                })

            },
            VerifyEmailOTP: (data = {}) => {
                return new Promise((resolve, reject) => {
                    VerifyEmailOTP(data)
                        .then((data) => {
                            resolve(data);
                        }).catch((error) => {
                        reject(error)
                        console.log('error', error)
                    });
                })

            },
            signOut: () => {
                setUserToken(null);
            },
            googleSignIn: (token) => {
                googleSignInRequest(token);
            },
            facebookSignIn: (token) => {
                facebookSignInRequest(token);
            },
            appleSignIn: (data) => {
                appleSignInRequest(data);
            },
        }
    }, []);

        const remote = async () => {
            new Promise(async (resolve,reject)=>{
                try {
                    await remoteConfig().setConfigSettings({
                        minimumFetchIntervalMillis: 300,
                    });
                    remoteConfig()
                        .setDefaults({
                            'us_remote_config': JSON.stringify(DefaultRemoteConfig),
                        }).then(() => remoteConfig().fetch(300).then(() => remoteConfig().fetchAndActivate()
                        .then(async (fetchedRemotely) => {
                            if (fetchedRemotely) {
                                let config = await remoteConfig().getAll();
                                console.log('[config]',config)
                                let config1 = config['us_remote_config']
                                //let config1 = config['da_remote_config']
                                console.log('[config]',config1)
                                setRemoteConfig(JSON.parse(config1._value));
                                await AsyncStorage.setItem('us_remote_config',config1._value);
                                //await AsyncStorage.setItem('da_remote_config',config1._value);
                                Store.setRemoteConfig(config1._value ? JSON.parse(config1._value) : {})
                                resolve()
                            } else {
                                AsyncStorage.getItem('us_remote_config').then((conf)=>{
                                    console.log('[config]',JSON.parse(conf))
                                    if(conf !== null){
                                        setRemoteConfig(JSON.parse(conf));
                                        Store.setRemoteConfig(JSON.parse(conf))
                                    }
                                });
                                resolve()
                            }
                        })));
                } catch (err){
                    alert('cache')
                }

            })
        }
    // Load any resources or data that we need prior to rendering the app
    React.useEffect(async () => {
        await firebase.perf().setPerformanceCollectionEnabled(true);
        await remote();
        messaging().onMessage(async (remoteMessage) => {
            console.log("[Notification]", remoteMessage);
            //setTimeout(()=>containerRef?.current?.navigate('PaymentSuccess', { orderId: "rauk-189660406", orderType: 2 }),1000)
            //store.dispatch(callSetOrderShow(0));
        });
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("[Notification]", remoteMessage);
            // setTimeout(() => containerRef?.current?.navigate('PaymentSuccess', {
            //     orderId: "rauk-189660406",
            //     orderType: 2
            // }), 1000)
            store.dispatch(callSetOrderShow(0));
        });
        messaging().onNotificationOpenedApp(remoteMessage => {
            // setTimeout(() => containerRef?.current?.navigate('PaymentSuccess', {
            //     orderId: "rauk-189660406",
            //     orderType: 2
            // }), 3000)
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    // setTimeout(() => containerRef?.current?.navigate('PaymentSuccess', {
                    //     orderId: "rauk-189660406",
                    //     orderType: 2
                    // }), 3000)
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                }
            });

        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHide();
                //await SplashScreen.preventAutoHideAsync();
                // Load our initial navigation state
                setInitialNavigationState(await getInitialState());

                // Load fonts
                await Font.loadAsync({
                    ...Ionicons.font,
                    'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
                    'SFProText': require('./assets/fonts/FontsFree-Net-SFProText-Semibold.ttf'),
                    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
                    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
                    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
                });

                let loginCredential = await AsyncStorage.getItem('login credential');
                let facebookCredential = await AsyncStorage.getItem('facebook credential');
                let googleCredential = await AsyncStorage.getItem('google credential');
                let appleCredential = await AsyncStorage.getItem('apple credential');
                console.log('google credential', googleCredential)
                if (loginCredential != null) {
                    let parsed = JSON.parse(loginCredential);
                    loginRequest(parsed.email, parsed.password);
                } else if (facebookCredential != null) {
                    facebookSignInRequest(facebookCredential);
                } else if (googleCredential != null) {
                    googleSignInRequest(googleCredential);
                } else if (appleCredential != null) {
                    let parsed = JSON.parse(appleCredential);
                    appleSignInRequest(parsed);
                } else {
                    setIsLoading(false)
                }


            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setLoadingComplete(true);
                await SplashScreen.hideAsync();
            }
        }

        await loadResourcesAndDataAsync();
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 1000)

    }, []);

    function loginRequest(email, password) {
        var STORAGE_KEY = 'id_token';
        setIsLoading(true);
        AuthRequestLogin(email, password)
            .then((data) => {
                //Alert.alert("received call");
                if (data.login_failure) {
                    Alert.alert(data.login_failure[0]);
                    setUserToken(null);
                } else {
                    const result = JSON.parse(data);
                    setUserToken(result.auth_token);

                    //store token
                    storeData(STORAGE_KEY, result.auth_token)
                        .then((data) => {
                            const result = JSON.stringify(data);
                        });

                    //store user
                    storeUser(result.auth_token).then((data) => {
                        console.log("user stored " + data);
                    });
                    let obj = {
                        email: email,
                        password: password
                    }
                    AsyncStorage.setItem('login credential', JSON.stringify(obj));
                }

                setIsLoading(false);

            }).catch((error) => {
            console.log('error.', error)
            if (error == 'TypeError: Network request failed') {
                alert('Please check your internet connection and try again.');
            }
            setIsLoading(false);
            setUserToken(null);
        });
    };

    function googleSignInRequest(token) {
        var STORAGE_KEY = 'id_token';
        setIsLoading(true);
        AuthRequestGoogleLogin(token)
            .then((data) => {
                console.log('google response', data)
                const result = JSON.parse(data);
                setUserToken(result.auth_token);

                //store token
                storeData(STORAGE_KEY, result.auth_token)
                    .then((data) => {
                        const result = JSON.stringify(data);

                    });


                //store user
                storeUser(result.auth_token).then((data) => {
                    console.log("user stored " + data);
                });
                AsyncStorage.setItem('google credential', token);

                setIsLoading(false);

            }).catch((error) => {
            if (error == 'TypeError: Network request failed') {
                alert('Please check your internet connection and try again.');
            }
            setIsLoading(false);
            setUserToken(null);
        });
    };

    function facebookSignInRequest(token) {
        var STORAGE_KEY = 'id_token';
        setIsLoading(true);
        AuthRequestFBLogin(token)
            .then((data) => {
                const result = JSON.parse(data);
                setUserToken(result.auth_token);

                //store token
                storeData(STORAGE_KEY, result.auth_token)
                    .then((data) => {
                        const result = JSON.stringify(data);

                    });

                storeUser(result.auth_token).then((data) => {
                    console.log("user stored " + data);
                });

                AsyncStorage.setItem('facebook credential', token);

                setIsLoading(false);

            }).catch((error) => {
            if (error == 'TypeError: Network request failed') {
                alert('Please check your internet connection and try again.');
            }
            setIsLoading(false);
            setUserToken(null);
        });
    };

    function appleSignInRequest(dataObject) {
        var STORAGE_KEY = 'id_token';
        setIsLoading(true);
        AuthRequestAppleLogin(dataObject)
            .then((data) => {
                const result = JSON.parse(data);
                setUserToken(result.auth_token);

                //store token
                storeData(STORAGE_KEY, result.auth_token)
                    .then((data) => {
                        const result = JSON.stringify(data);

                    });

                storeUser(result.auth_token).then((data) => {
                    console.log("user stored " + data);
                });

                AsyncStorage.setItem('apple credential', JSON.stringify(dataObject));

                setIsLoading(false);

            }).catch((error) => {
            console.log('error', error)
            if (error == 'TypeError: Network request failed') {
                alert('Please check your internet connection and try again.');
            }
            setIsLoading(false);
            setUserToken(null);
        });
    };

    if (isLoading) {
        return <Splash/>;
    }

    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return null;
    } else {
        return (

            <AuthContext.Provider value={authContext}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                    <NavigationContainer ref={containerRef} initialState={initialNavigationState}>

                        <RootStackScreen userToken={userToken} state={state}/>
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
    menuIcon: {
        paddingRight: 5
    },
});

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
    <AuthStack.Navigator headerMode="none">
        <AuthStack.Screen name="SignIn" component={SignIn} options={{title: "Sign In"}}/>
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{title: "Forgot Password"}}/>
        <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{title: "Forgot Password"}}/>
        <AuthStack.Screen name="OtpVerification" component={OtpVerificationScreen}
                          options={{title: "OTP Verification"}}/>
        <AuthStack.Screen name="CreateAccount" component={CreateAccount}
                          options={{title: "Create Account"}}/>
    </AuthStack.Navigator>
);

const PageStack = createStackNavigator();
const PageScreen = () => (
    <PageStack.Navigator headerMode="screen"
    >
        <PageStack.Screen name="Page" component={BottomTabNavigator}
                          options={{headerShown: false}}
        />
        <PageStack.Screen name="Products" component={ProductScreen} options={({navigation, userToken}) => (
            {
                headerMode: 'screen',
                title: 'Product Details',
                headerStyle: {
                    backgroundColor: '#f4511e'
                },
                headerTintColor: '#fff'
            }
        )}/>

        <PageStack.Screen name="Cart"
                          component={Cart}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }

                          )}
        />

        <PageStack.Screen name="PaymentType"
                          component={PaymentType}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

        <PageStack.Screen name="Payment"
                          component={Payment}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

        <PageStack.Screen name="PaymentSuccess"
                          component={PaymentSuccess}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />


        <PageStack.Screen name="MyProfile" component={ProfileNavigatorScreens}/>

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

        <PageStack.Screen name="CreateAddress"
                          component={AddressCreation}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                                  // headerMode: 'screen',
                                  // title: 'Address Creation',
                                  // headerStyle: {
                                  //   backgroundColor: '#f4511e'
                                  // },
                                  // headerTintColor: '#fff',
                                  // headerBackTitle: ''
                              }
                          )}
        />

        <PageStack.Screen name="Orders" component={Orders}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

        <PageStack.Screen name="OrderDetail" component={OrderDetail}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

        <PageStack.Screen name="Support" component={Support}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

        <PageStack.Screen name="MyDetails" component={MyDetails}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

        <PageStack.Screen name="SignIn" component={SignIn}
                          options={{headerShown: false}}
        />
        <PageStack.Screen name="ForgotPassword" component={ForgotPasswordScreen}
                          options={{title: "Forgot Password", headerShown: false}}/>
        <PageStack.Screen name="ResetPassword" component={ResetPasswordScreen}
                          options={{title: "Forgot Password", headerShown: false}}/>
        <PageStack.Screen name="OtpVerification" component={OtpVerificationScreen}
                          options={{title: "OTP Verification", headerShown: false}}/>

        <PageStack.Screen name="CreateAccount" component={CreateAccount}
                          options={{headerShown: false}}/>

        <PageStack.Screen name="RestaurantList"
                          component={RestaurantList}
                          options={({navigation}) => (
                              {
                                  headerShown: false
                              }
                          )}
        />

    </PageStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({userToken}) => (
    <RootStack.Navigator>
        {
            userToken ? (
                <RootStack.Screen name="App" component={PageScreen}
                                  options={({navigation}) => (
                                      {headerShown: false}
                                  )}
                />
            ) : (
                <RootStack.Screen name="Auth" component={AuthStackScreen}
                                  options={({navigation}) => ({headerShown: false}
                                  )}
                />
            )
        }


    </RootStack.Navigator>
);