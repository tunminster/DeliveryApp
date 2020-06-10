import React, {Component} from 'react';
import { TouchableOpacity, Image} from 'react-native';

class BackIcon extends Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image source={require('../../assets/images/back-icon.png')} style={{width: 30, resizeMode: 'contain', marginLeft: 15, height: 30}} />
            </TouchableOpacity>
        )
    }
}

export default BackIcon;