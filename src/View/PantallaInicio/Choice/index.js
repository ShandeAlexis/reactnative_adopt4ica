import React from 'react';
import {Text, View} from 'react-native';

import {styles} from './styles';
import {COLORS} from '../utils/constants';

export default function Choice({type}) {
  const color = COLORS[type];
  return (
    <View style={[styles.container, {borderColor: color}]}>
      <Text style={[styles.text, {color}]}>{type}</Text>
    </View>
  );
}
