import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { wp, hp, normalize } from '../../helper/responsiveScreen'


export default class Custominput extends Component {
    render() {
        const { placeholder, password, placeholderTextColor, error, icon, onChangeText, autoCorrect, value,style = {} } = this.props;
        return (
            <View style={[styles.inputView,style]}>
                {icon && <Image source={icon} style={styles.icon} />}
                <TextInput
                    secureTextEntry={password}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    style={{ ...styles.inputText, width: icon ? wp(75) : wp(84),...style }}
                    onChangeText={onChangeText}
                    autoCorrect={autoCorrect}
                    value={value}
                    autoCapitalize='none'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputView: {
        flexDirection: 'row',
        width: wp(90),
        backgroundColor: "#EEECEC",
        borderRadius: normalize(4),
        marginBottom: hp(3),
        padding: wp(1.5),
        borderColor: '#D9D9D9',
        borderWidth: wp(0.2),
    },
    inputText: {
        fontSize: normalize(15),
        fontFamily: 'Roboto-Regular',
        marginLeft: wp(2),
        padding: wp(2)
    },
    icon: {
        resizeMode: 'contain',
        width: wp(6),
        height: hp(3.5),
        marginLeft: wp(1),
        alignSelf: 'center'
    }
})