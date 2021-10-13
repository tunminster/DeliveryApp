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
                      width: wp(14),
                      height: wp(8),
                      marginRight:wp(2),
                      backgroundColor: toggle ? Colors.tabIconSelected : Colors.gray,
                  }}>
                  <View
                      style={{
                          height: wp(7),
                          width: wp(7),
                          margin: 1.5,
                          backgroundColor: Colors.white,
                          borderRadius: wp(10),
                          shadowColor: '#00000029',
                          shadowOffset: {width: 1, height: 2},
                          shadowOpacity: 1,
                          shadowRadius: 2
                      }}
                  />
              </TouchableOpacity>
              <Text style={styles.restaurantTitle}>{  toggle ? 'Pick up order at' : 'Deliver to'}</Text>
          </View>
      </View>

  );
};

export default SwitchButton;
