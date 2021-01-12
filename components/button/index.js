import React, { Component } from 'react';
import { TouchableOpacity, ActivityIndicator, Text, View, Image } from 'react-native';
import styles from "./styles";
import sharedStyles from "../../utils/sharedStyles";

class Button extends Component {
    render() {
        const { title, onPress, loading, style, txtStyle, image } = this.props;
        return (
            <TouchableOpacity onPress={() => onPress()} style={[styles.btn, sharedStyles.shadow, style]} disabled={loading}>
                {!loading ?
                    <View style={{ flexDirection: 'row' }}>
                        {image &&
                            <Image source={image} style={styles.image} />}
                        <Text style={[styles.title, txtStyle]}>{title}</Text>
                    </View>
                    :
                    <ActivityIndicator color={'#fff'} size={'large'} />
                }
            </TouchableOpacity>
        )
    }
}

export default Button;