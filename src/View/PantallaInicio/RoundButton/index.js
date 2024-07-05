import React, { useCallback, useRef } from 'react';
import { Animated, TouchableWithoutFeedback, Image } from 'react-native';

import { styles } from './styles';

export default function RoundButton({ imageSource, size, color, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animatedScale = useCallback(
    (newValue) => {
      Animated.spring(scale, {
        toValue: newValue,
        friction: 4,
        useNativeDriver: true,
      }).start();
    },
    [scale],
  );

  return (
    <TouchableWithoutFeedback
      onPressIn={() => animatedScale(0.8)}
      delayPressIn={0}
      onPressOut={() => {
        animatedScale(1);
        onPress();
      }}
      delayPressOut={110}>
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <Image source={imageSource} style={{ width: size, height: size, tintColor: color }} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
