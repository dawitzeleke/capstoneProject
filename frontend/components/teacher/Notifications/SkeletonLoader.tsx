import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const NUM_PLACEHOLDERS = 5;

const SkeletonLoader: React.FC = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmer]);

  // Interpolate shimmer to opacity range
  const opacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  return (
    <View className="p-4">
      {Array.from({ length: NUM_PLACEHOLDERS }).map((_, idx) => (
        <Animated.View
          key={idx}
          className="flex-row items-center mb-4"
          style={{ opacity }}
        >
          <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
          <View className="flex-1">
            <View className="w-1/2 h-2.5 bg-gray-300 rounded mb-1.5" />
            <View className="w-4/5 h-2.5 bg-gray-300 rounded" />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

export default SkeletonLoader;