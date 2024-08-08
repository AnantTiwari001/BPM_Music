/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, ViewStyle} from 'react-native';
import {colorSchemas} from '../constants';

export default function UIButton({
  title,
  color = 'primary',
  onPress,
  overrideStyle,
}: {
  title: string;
  color?: keyof typeof colorSchemas;
  onPress?: () => void;
  overrideStyle?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: colorSchemas[color],
          padding: 12,
          paddingHorizontal: 20,
          alignSelf: 'flex-start',
          borderRadius: 13,
        },
        overrideStyle,
      ]}>
      <Text style={{color: 'white'}}>{title}</Text>
    </TouchableOpacity>
  );
}
