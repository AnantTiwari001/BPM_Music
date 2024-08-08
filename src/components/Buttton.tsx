/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode} from 'react';
import {Text, TouchableOpacity, ViewStyle} from 'react-native';
import {colorSchemas} from '../constants';
import Loading from './Loading';

export default function UIButton({
  children,
  color = 'primary',
  onPress,
  overrideStyle,
}: {
  children: ReactNode;
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
      {children}
    </TouchableOpacity>
  );
}
