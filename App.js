import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Button } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import useLinking from './navigation/useLinking';
import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen';

import { Icon } from 'react-native-elements';


const Stack = createStackNavigator();


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

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
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            {/* <Stack.Screen name="Root" component={BottomTabNavigator} /> */}
            <Stack.Screen name="Home" component={HomeScreen, BottomTabNavigator, DrawerNavigator} 
              //  options={{
              //   title: 'Restaurant Name',
              //   headerStyle: {
              //     backgroundColor: '#f4511e',
              //   },
              //   headerTintColor: '#fff',
              //   headerTitleStyle: {
              //     fontWeight: 'bold',
              //   },
              //   headerRight: () => (
                 
              //     <Icon style={styles.menuIcon} name='menu' size={42} color='white'
              //     onPress={()=> navigation.openDrawer()}
              //     />
              //   ),
              // }}

              options={({ navigation, route }) => ({
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
                  onPress={()=> navigation.opneDrawer()}
                  />
                ),
              })}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </View>
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


