import React, {Component} from 'react';
import { TouchableOpacity, Image} from 'react-native';
import { wp, hp, normalize } from '../../helper/responsiveScreen'

class BackIcon extends Component {
    
    render() {
        const { onPress, tintColor } = this.props;
        return (
            <TouchableOpacity style = {{alignSelf:'center', padding: wp(2)}} onPress={() => onPress()}>
                <Image  tintColor={tintColor} source={require('../../assets/images/back-icon.png')} resizeMode='contain'  style={{width: wp(5), height: wp(5), tintColor:tintColor}} />
            </TouchableOpacity>
        )
    }
}

export default BackIcon;