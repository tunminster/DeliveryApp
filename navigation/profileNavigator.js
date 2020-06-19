import React from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import Account from '../screens/Account';
import AddressDetail from '../screens/AddressDetail';
import vars from '../utils/vars';

const ProfileStack = createStackNavigator();
const ProfileNavigatorScreens = () => (
    <ProfileStack.Navigator headerMode="screen">
        <ProfileStack.Screen name="Profile" component={Account} options={({navigation}) => (
            { 
                headerMode: 'none',
                title: ''
            }
        )}/>   

        {/* <ProfileStack.Screen name="AddressDetail" 
          component={AddressDetail}
          options={({navigation}) => (
            {
                headerMode: 'screen',
                title: 'Address Detail',
                headerStyle: {
                  backgroundColor: '#f4511e'
                },
                headerTintColor: '#fff',
                headerTitle: ''
            }
          )}
        /> */}

    </ProfileStack.Navigator>
);

export default ProfileNavigatorScreens;