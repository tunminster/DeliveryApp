import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Platform, UIManager, LayoutAnimation, Text} from 'react-native';

// import withPreventDoubleClick from '../utils/withPreventDoubleClick';
import Colors from '../constants/Colors';
import {wp} from '../helper/responsiveScreen';
import styles from "../screens/Cart/styles";
// const TouchableRippleEx = withPreventDoubleClick(TouchableOpacity);
const SwitchButton = props => {
    const {btndisabled} = props;
  const [toggle, setToggle] = useState(props?.status || false);

  useEffect(()=>{
      if (Platform.OS === 'android') {
          if (UIManager.setLayoutAnimationEnabledExperimental) {
              UIManager.setLayoutAnimationEnabledExperimental(true);
          }
      }
  },[])

  useEffect(() => {
      LayoutAnimation.configureNext(
          LayoutAnimation.create(
              200,
              LayoutAnimation.Types.linear,
              LayoutAnimation.Properties.scaleXY
          )
      );
    setToggle(props.status);
  }, [props]);

let style=  toggle ? {right:wp(0.7)} : {left:wp(0.7)};
  return (
      <View style={{flexDirection:"row",alignItems:'center',justifyContent:'space-between'}}>
          <View style={{justifyContent: 'center', alignItems: 'center',flexDirection:'row'}}>
              <TouchableOpacity
                  disabled={!!btndisabled}
                  onPress={() => {
                      setToggle(!toggle);
                      props.onChange &&
                      props.onChange(!toggle, props.id, {
                          [props.body]: !toggle,
                      });
                  }}
                  activeOpacity={1}
                  style={{
                      justifyContent: 'center',
                      alignItems: !toggle ? 'flex-start' : 'flex-end',
                      borderRadius: wp(20),

                      height: wp(9),
                      marginRight:wp(2),
                      backgroundColor: toggle ? Colors.tabIconSelected : Colors.gray,
                  }}>
                      <View
                          style={{
                              ...style,
                              position:'absolute',
                              right:wp(.5),
                              height: wp(7.6),
                              width: wp(7.6),
                              backgroundColor: Colors.white,
                              borderRadius: wp(10),
                              shadowColor: '#00000029',
                              shadowOffset: {width: 1, height: 2},
                              shadowOpacity: 1,
                              shadowRadius: 2
                          }}
                      />
                  <Text style={[styles.restaurantTitle,{color:Colors.white,marginLeft:wp(toggle ? 3 : 10),marginRight:wp(toggle ? 10: 3)}]}>{toggle ? 'Delivery': 'Collection'}</Text>
              </TouchableOpacity>

          </View>
      </View>

  );
};

export default SwitchButton;
