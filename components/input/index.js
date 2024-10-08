import React, { Component } from 'react';
import { View, TextInput, Animated } from 'react-native';
import vars from '../../utils/vars';
import { wp, hp, normalize, isX } from '../../helper/responsiveScreen';


export default class Input extends Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, style, ...props } = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      // color: this._animatedIsFocused.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: ['#aaa', '#000'],
      // }),
    };
    return (
      <View style={{ ...style, paddingTop: hp(1) }}>
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={{ height: isX ? hp(5) : hp(7), fontSize: normalize(16), color: '#000', borderBottomWidth: 1, borderBottomColor: '#555' }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}


