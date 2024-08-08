/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, View} from 'react-native';

export default function Loading({size}: {size: number}) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    // <Animated.View style={[{flex: 1, backgroundColor: 'red'}, {}]}>
    <Animated.Image
      source={require('../assets/spinner.png')}
      style={[
        {
          borderRadius: 200,
          borderColor: 'gray',
          height: size,
          width: size,
        },
        {transform: [{rotate: spin}]},
      ]}
    />
    // </Animated.View>
  );
}
