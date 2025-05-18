// File: src/components/teacher/Profile/DashboardSummary.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import EngagementGraph from './EngagementGraph';
import { TeacherStats } from '@/types/teacherTypes';

interface DashboardSummaryProps {
  isSmallScreen: boolean;
  isVerySmallScreen: boolean;
  stats?: TeacherStats | null;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  isSmallScreen,
  isVerySmallScreen,
  stats,
}) => {
  // Mock data structure matching backend schema
  const mockStats: TeacherStats = {
    totalViews: 10000,
    totalShares: 1000,
    engagementLast7Days: [20, 45, 28, 80, 99, 43, 50],
    engagementLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const safeStats = stats || mockStats;

  return (
    <Animated.View
      entering={FadeInUp.delay(200)}
      className="bg-white p-5 mt-4 rounded-3xl shadow-lg mb-6"
    >
      <Text className="text-lg font-psemibold text-gray-900 mb-4">
        Your Dashboard Summary
      </Text>

      <View className="flex-row justify-between mb-6">
        <View className="items-center space-y-1">
          <Ionicons name="eye-outline" size={28} color="#4F46E5" />
          <Text className="text-sm text-gray-600">Views</Text>
          <Text className="text-base font-pbold text-gray-800">
            {safeStats.totalViews.toLocaleString()}
          </Text>
        </View>

        <View className="items-center space-y-1">
          <Ionicons name="share-social-outline" size={28} color="#4F46E5" />
          <Text className="text-sm text-gray-600">Shares</Text>
          <Text className="text-base font-pbold text-gray-800">
            {safeStats.totalShares.toLocaleString()}
          </Text>
        </View>
      </View>

      <EngagementGraph 
        data={{
          labels: safeStats.engagementLabels,
          values: safeStats.engagementLast7Days
        }}
        isSmallScreen={isSmallScreen}
        isVerySmallScreen={isVerySmallScreen}
      />
    </Animated.View>
  );
};

export default DashboardSummary;