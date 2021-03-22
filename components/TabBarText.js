import * as React from 'react';
import { Text } from 'react-native';
import Colors from '../constants/Colors';
import { wp, hp, normalize, isiPAD } from '../helper/responsiveScreen';


export default function TabBarIcon(props) {
  return (
    <Text
      style={{
        fontSize: normalize(13),
        marginVertical: hp(0.2),
        marginLeft: isiPAD ? wp(3):0,
        color: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault,
      }}>
      {props.name}
    </Text>
  );
}
