import React, {Component} from 'react';
import { Icon } from 'react-native-elements';
import { NavigationContainer,DrawerActions  } from '@react-navigation/native';



class HeaderLeft extends Component{
    render(){
        return (
            <Icon style={styles.menuIcon} name='menu' size={42} color='white'
                onPress={()=> {this.props.navigation.dispatch(DrawerActions.openDrawer())}}
                />
        )
    }
}

export default HeaderLeft;