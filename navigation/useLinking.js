import { useLinking } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const prefix = Linking.makeUrl('/');

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: [prefix],
    config: {
      Root: {
        path: 'root',
        screens: {
          Home: 'home',
          Links: 'links',
          Settings: 'settings',
        },
      },
    },
  });
}
