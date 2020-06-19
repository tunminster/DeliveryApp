import * as React from 'react';
import { Button, View, StyleSheet} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabNavigator from './BottomTabNavigator';
import {Profile} from '../screens/LoginScreen';
import { MenuScreen} from '../screens/MenuScreen';
import ProductScreen from '../screens/Products';
import Store from '../config/store';
import { Icon } from 'react-native-elements';
import ProfileNavigatorScreens from './profileNavigator';
import Account from '../screens/Account';


const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = 'Home';

// const ProductStack = createStackNavigator();
//   const ProductStackScreen = () => (
//     <ProductStack.Navigator headerMode="none">
//       <ProductStack.Screen name="Menu" component= {MenuScreen} />
//       <ProductStack.Screen name="Products" component={ProductScreen} 
//         options={({navigation, userToken}) => (
//           {headerMode: 'screen'}
//         )}/>
//     </ProductStack.Navigator>
//   );

export default function DrawerNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  

  return (
    <Drawer.Navigator initialRouteName={INITIAL_ROUTE_NAME} 
    
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
       
      />

      <Drawer.Screen name="Menu" component={MenuScreen} />

      {/* <Drawer.Screen
        name="Links"
        component={LinksScreen}
      /> */}

      <Drawer.Screen name="Profile" component={Account} />
      
        
      
      {/* <Drawer.Screen name="Products" component={ProductScreen} /> */}
    </Drawer.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
        return 'Restaurant Name';
    case 'Profile':
        return 'My Profile';
    
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


