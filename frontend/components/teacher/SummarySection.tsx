import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import EngagementGraph from '@/components/teacher/EngagementGraph';

interface SummarySectionProps {
  isSmallScreen: boolean;
  isVerySmallScreen: boolean;
  metrics: {
    id: string;
    value: string;
    label: string;
  }[];
}

const SummarySection = ({ isSmallScreen, isVerySmallScreen, metrics }: SummarySectionProps) => {
  return (
    <Animated.View entering={FadeInUp.delay(200)} className="bg-white p-5 rounded-3xl shadow-lg mb-6">
      <Text className="text-lg font-psemibold text-gray-900 mb-6">Summary</Text>

      <View className={`${isSmallScreen ? 'flex-col' : 'flex-row'} items-center ${isSmallScreen ? 'space-y-6' : 'space-x-10'} justify-center mb-6`}>
        <EngagementGraph isSmallScreen={undefined} isVerySmallScreen={undefined} />
        <View className="items-center">
          <Text className="text-4xl font-bold text-gray-900">72</Text>
          <Text className="text-base text-gray-600 mt-1">Questions Posted</Text>
        </View>
      </View>

      <View className="border-t border-gray-100 pt-4">
        <View className="flex-row justify-between">
          {metrics.map((metric, index) => (
            <Animated.View
              key={metric.id}
              entering={FadeInDown.delay(100 * (index + 1))}
              className="flex-1 items-center"
            >
              <View className="bg-[#f1f3fc] px-0 py-3 rounded-xl shadow-sm w-20 mx-3">
                <Text className="text-center text-xl font-bold text-gray-900">{metric.value}</Text>
                <Text className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-center text-gray-600 mt-1`}>
                  {metric.label}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default SummarySection;