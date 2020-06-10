import React, {Component} from 'react';
import {TouchableOpacity, ActivityIndicator, Text} from 'react-native';
import styles from "./styles";
import sharedStyles from "../../utils/sharedStyles";

class Button extends Component {
    render() {
        const {title, onPress, loading, style, txtStyle} = this.props;
        return (
            <TouchableOpacity onPress={() => onPress()} style={[styles.btn, sharedStyles.shadow, style]} disabled={loading}>
                {!loading ?
                    <Text style={[styles.title, txtStyle]}>{title}</Text>
                    :
                    <ActivityIndicator color={'#fff'} size={'large'} />
                }
            </TouchableOpacity>
        )
    }
}

export default Button;