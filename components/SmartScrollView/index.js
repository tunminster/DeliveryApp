import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet, Platform, Animated, Keyboard, TextInput, UIManager } from 'react-native';

class SmartScrollView extends Component {
  static defaultProps = {
    disabled: false,
    header: null,
    footer: null,
    centerContent: false,
    alwaysBounceVertical: true,
    showsVerticalScrollIndicator: true,
    floatHeader: true,
    decelerationRate: null,
    applyKeyboardCheck: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    header: PropTypes.node,
    footer: PropTypes.node,
    centerContent: PropTypes.bool,
    alwaysBounceVertical: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.number),
      PropTypes.arrayOf(PropTypes.object),
    ]),
    floatHeader: PropTypes.bool,
    decelerationRate: PropTypes.string,
    applyKeyboardCheck: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      duration: 300,
      keyboardHeight: 0,
      disabled: props.disabled,
    };

    this.scrollY = 0;
    this.topOffset = 0;
    this.height = 0;

    this._keyboardEventsInit();
  }

  componentWillUnmount() {
    this._removeKeyboardEvents();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.disabled !== state.disabled) {
      return {
        disabled: props.disabled,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const props = this.props;
    const state = this.state;
    if (prevState.disabled !== state.disabled) {
      if (state.disabled) {
        this._removeKeyboardEvents();
        this._onKeyboardDown();
      } else {
        this._keyboardEventsInit();
      }
    }
  }

  _keyboardEventsInit = () => {
    this._removeKeyboardEvents();
    if (Platform.OS === 'ios' && this.props.applyKeyboardCheck) {
      this.keyboardAnimated = new Animated.Value(0);
      this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._onKeyboardUp);
      this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._onKeyboardDown);
    } else if (this.props.applyKeyboardCheck) {
      this.keyboardAnimated = new Animated.Value(0);
      this.keyboardWillShowListener = Keyboard.addListener('keyboardDidShow', this._onKeyboardUp);
      this.keyboardWillHideListener = Keyboard.addListener('keyboardDidHide', this._onKeyboardDown);
    }
  };

  _removeKeyboardEvents = () => {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove();
      this.keyboardWillShowListener = null;
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove();
      this.keyboardWillHideListener = null;
    }
  };

  _onKeyboardUp = ({ endCoordinates: { height } }) => {
    if (this.keyboardAnimated) {
      Animated.timing(this.keyboardAnimated, {
        toValue: height,
        duration: this.state.duration * 0.92,
      }).start(() => {
        this.setState({ keyboardHeight: height }, () => {
          this._checkScroll();
        });
      });
    }
  };

  _onKeyboardDown = (evt) => {
    if (this.keyboardAnimated) {
      this.setState({ keyboardHeight: 0 });
      Animated.timing(this.keyboardAnimated, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? this.state.duration : 0,
      }).start();
    }
  };

  _onScrollWrapperLayout = evt => {
    const { y, height } = evt.nativeEvent.layout;
    this.topOffset = y;
    if (height > this.height) {
      this.height = height;
    }
  };

  _onScrollHandler = evt => (this.scrollY = evt.nativeEvent.contentOffset.y);

  _checkScroll = element => {
    const { keyboardHeight: _keyboardHeight } = this.state;
    const { State: TextInputState } = TextInput;

    element = element || TextInputState.currentlyFocusedField();

    if (!element || this._isMeasuring || !_keyboardHeight) {
      return;
    }

    this._isMeasuring = true;

    // measure the element's position
    UIManager.measure(element, (x, y, w, h, pageX, pageY) => {
      const topOffset = this.topOffset;
      const scrollY = this.scrollY;
      const wHeight = this.height;
      const { keyboardHeight } = this.state;

      this._isMeasuring = false;

      if (!keyboardHeight) {
        return;
      }

      // true element position to the wrapper
      const clientY = pageY - topOffset - y;
      const viewportHeight = wHeight - keyboardHeight;
      let yPos = scrollY;

      yPos += clientY;

      yPos -= keyboardHeight * 0.5;

      // check for negative scroll position
      if (yPos <= 0) {
        yPos = 0;
      }

      // check if client it's not visible in viewport
      if (clientY + h > viewportHeight || clientY < scrollY) {
        this._scrollTo(yPos);
      }
    });
  };

  _scrollTo = (y = 0, animated = true) => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ y, x: 0, animated });
    }
  };

  _scrollToEnd = (animated = true) => {
    if (this.scrollView) {
      this.scrollView.scrollToEnd({ animated });
    }
  };

  scrollTo = (...props) => this._scrollTo(...props);

  scrollToEnd = (...props) => this._scrollToEnd(...props);

  hideKeyboard = () => this._onKeyboardDown()

  checkElement = element => this._checkScroll(element)

  renderKeyboardView = () => {
    if (!this.keyboardAnimated) {
      return null;
    }
    const style = {
      height: this.keyboardAnimated,
    };
    return <Animated.View style={style} />;
  };

  render() {
    const {
      style,
      contentContainerStyle,
      children,
      header,
      footer,
      disabled,
      centerContent,
      alwaysBounceVertical,
      showsVerticalScrollIndicator,
      floatHeader,
      decelerationRate,
    } = this.props;
    return (
      <View style={styles.wrapper}>
        {floatHeader && header}
        <View style={styles.wrapper} onLayout={this._onScrollWrapperLayout}>
          <ScrollView
            ref={r => (this.scrollView = r)}
            scrollEnabled={!disabled}
            centerContent={centerContent}
            alwaysBounceVertical={alwaysBounceVertical}
            keyboardShouldPersistTaps="handled"
            decelerationRate={decelerationRate}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            contentContainerStyle={contentContainerStyle}
            scrollEventThrottle={1}
            onScroll={this._onScrollHandler}
            style={style}>
            {!floatHeader && header}
            {children}
          </ScrollView>
        </View>
        {footer}
        {this.renderKeyboardView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  spaceBottom: {
    height: 30,
  },
});

export default SmartScrollView;
