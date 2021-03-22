import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { wp, hp, normalize, isiPAD } from '../helper/responsiveScreen';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: isiPAD ? 0 : -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
