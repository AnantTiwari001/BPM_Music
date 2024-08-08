/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, TouchableOpacity, ViewStyle} from 'react-native';
import {colorSchemas} from '../constants';
import Loading from './Loading';

export default function UIButton({
  title,
  color = 'primary',
  onPress,
  overrideStyle,
  isLoading = {visible: false, size: 20},
}: {
  title: string;
  color?: keyof typeof colorSchemas;
  onPress?: () => void;
  overrideStyle?: ViewStyle;
  isLoading?: {visible: boolean; size: number};
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
          flexDirection: 'row',
          alignItems: 'center',
        },
        overrideStyle,
      ]}>
      <Text style={{color: 'white'}}>{title}</Text>
      {isLoading.visible && <Loading size={isLoading.size} />}
    </TouchableOpacity>
  );
}
