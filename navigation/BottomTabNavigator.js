import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SearchScreen from '../screens/SearchScreen'
import MoreScreen from '../screens/MoreScreen'
import TabBarText from '../components/TabBarText';
import Orders from '../screens/Orders'


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator() {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  // navigation.setOptions({ headerTitle: null });

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
        component={SearchScreen}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="Search" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="search" />,
        }}
      />
      <BottomTab.Screen
        name="Order"
        component={Orders}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="Orders" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="list-circle-outline" />,
        }}
      />
      <BottomTab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel:({ focused }) => <TabBarText focused={focused} name="More" />,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ellipsis-horizontal-circle" />,
        }}
      />
    </BottomTab.Navigator>

  );
}
