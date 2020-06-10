import React from 'react';
import { createDrawerNavigator, createStackNavigator} from 'react-navigation';
import {HomeScreen, LinksScreen, LoginScreen, MenuScreen, ProductScreen } from '../components';
import vars from '../utils/vars';
import { Header, HeaderLeft, headerRight} from '../components/header';
import HeaderRight from '../components/header/right';

const routes = createStackNavigator({
    HomeScreen: {screen: HomeScreen},
    LinksScreen: {screen: LinksScreen},
    MenuScreen: {screen: MenuScreen},
    ProductScreen: {screen: ProductScreen} 
}, {
    navigationOptions: ({navigation}) => ({
        title: 'Restaurant Name',
        headerStyle: {
        backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
        headerLeft: <HeaderLeft navigation={navigation} />,
        headerRight: <HeaderRight navigation={navigation} />

    })
});

const appDrawerNavigator = createDrawerNavigator({
    app: {screen: routes}
}, {
    contentComponent: props => <SideNav {...props} />
});

export default appDrawerNavigator;