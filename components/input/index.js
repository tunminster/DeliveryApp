import React, {Component} from 'react';
import {View} from 'react-native';
import { TextField} from 'react-native-material-textfield';
import vars from '../../utils/vars';

class Input extends Component{
    render() {
        const {value, label, onChange, password, containerStyle, multiline, capitalize, editable, style, white} = this.props;
        return (
            <View style={containerStyle}>
                <TextField
                    label={label}
                    value={value}
                    onChangeText={txt => onChange(txt)}
                    baseColor={white ? '#fff' : vars.baseColor}
                    secureTextEntry={password}
                    tintColor={white ? '#fff' : vars.baseColor}
                    multiline={multiline}
                    lineWidth={1}
                    autoCapitalize={capitalize}
                    editable={editable}
                    inputContainerStyle={style}
                    textColor={white && '#fff'}
                />
            </View> 
        )
    }
}

export default Input;