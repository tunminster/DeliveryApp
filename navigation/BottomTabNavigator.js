import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import HelloScreen from '../screens/HelloScreen'
import TabBarText from '../components/TabBarText';


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="Home" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />,
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={LinksScreen}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="Search" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="search" />,
        }}
      />
      <BottomTab.Screen
        name="Orders"
        component={LinksScreen}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="Orders" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ellipsis-horizontal-circle" />,
        }}
      />
      <BottomTab.Screen
        name="More"
        component={LinksScreen}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="More" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ellipsis-horizontal-circle" />,
        }}
      />
    </BottomTab.Navigator>



  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Restaurant test';
    case 'Search':
      return 'Links to learn more';
  }
}
