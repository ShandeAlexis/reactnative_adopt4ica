import React from 'react';
import { View, Image } from 'react-native';
import RoundButton from '../RoundButton';
import { COLORS } from '../utils/constants';
import { styles } from './styles';

// Assume you have imported your images appropriately
const starImage = require('./icons/rechazo.png');
const commentsImage = require('./icons/comentar.png');
const heartImage = require('./icons/corazon.png');

export default function Footer({ handleChoice }) {
  return (
    <View style={styles.container}>
      <RoundButton
        imageSource={starImage}
        size={50}
        onPress={() => handleChoice(-1)}
      />
      <RoundButton
        imageSource={commentsImage}
        size={43}
        color={COLORS.favorite}
        onPress={() => handleChoice(0)}
      />
      <RoundButton
        imageSource={heartImage}
        size={50}
        onPress={() => handleChoice(1)}
      />
    </View>
  );
}
