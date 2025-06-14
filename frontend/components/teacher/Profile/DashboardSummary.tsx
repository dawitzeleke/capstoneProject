import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import EngagementGraph from './EngagementGraph';
import { TeacherStats } from '@/types/teacherTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/rootReducer';

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
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const isDark = currentTheme === 'dark';

  // Mock data structure matching backend schema
  const mockStats: TeacherStats = {
    totalViews: 10000,
    totalLikes: 1000,
    engagementLast7Days: [20, 45, 28, 80, 99, 43, 50],
    engagementLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const safeStats = stats || mockStats;

  // Ensure engagement data is valid
  const engagementData = {
    labels: safeStats.engagementLabels?.length === 7 
      ? safeStats.engagementLabels 
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: safeStats.engagementLast7Days?.length === 7 
      ? safeStats.engagementLast7Days.map(val => Math.max(0, Math.min(100, val || 0)))
      : [0, 0, 0, 0, 0, 0, 0]
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(200)}
      className={`p-6 mt-4 rounded-3xl shadow-lg mb-6 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <Text className={`text-xl font-bold mb-4 ${
        isDark ? 'text-gray-100' : 'text-gray-900'
      }`}>
        Summary
      </Text>

      <View className="flex-row justify-between mb-8 px-2">
        <View className="items-center space-y-2 bg-opacity-10 p-4 rounded-2xl flex-1 mx-2" 
          style={{ backgroundColor: isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.05)' }}>
          <Ionicons name="eye-outline" size={32} color="#4F46E5" />
          <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Total Views
          </Text>
          <Text className={`text-lg font-pbold ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {safeStats.totalViews.toLocaleString()}
          </Text>
        </View>

        <View className="items-center space-y-2 bg-opacity-10 p-4 rounded-2xl flex-1 mx-2"
          style={{ backgroundColor: isDark ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.05)' }}>
          <Ionicons name="heart" size={32} color="#4F46E5" />
          <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Total Likes
          </Text>
          <Text className={`text-lg font-pbold ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {safeStats.totalLikes?.toLocaleString() || '0'}
          </Text>
        </View>
      </View>

      <View className={`p-4 rounded-2xl ${
        isDark ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <Text className={`text-base font-pmedium mb-4 ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Engagement Last 7 Days
        </Text>
        <View className="overflow-hidden rounded-xl">
          <EngagementGraph 
            data={engagementData}
            isSmallScreen={isSmallScreen}
            isVerySmallScreen={isVerySmallScreen}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default DashboardSummary;