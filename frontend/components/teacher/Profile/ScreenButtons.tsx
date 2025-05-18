// File: src/components/teacher/Profile/ScreenButtons.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/redux/teacherReducer/hooks';

interface ActionButtonsProps {
  isVerySmallScreen: boolean;
}

const ScreenButtons: React.FC<ActionButtonsProps> = ({ isVerySmallScreen }) => {
  const { postsCount } = useAppSelector(state => ({
    postsCount: state.teacher.profile?.postsCount || 0
  }));

  return (
    <View className="flex-row gap-2 mb-6">
      <Link href="/teacher/(tabs)/ContentList" asChild>
        <View className={`flex-1 bg-indigo-600 p-4 rounded-xl items-center ${isVerySmallScreen ? 'px-2 py-3' : 'px-4 py-4'}`}>
          <Ionicons name="folder-open" size={24} color="white" />
          <Text className={`text-white ${isVerySmallScreen ? 'text-xs' : 'text-sm'} mt-1 font-pmedium`}>
            Manage Posts ({postsCount})
          </Text>
        </View>
      </Link>

      <Link href="/teacher/(tabs)/Insights" asChild>
        <View className={`flex-1 bg-indigo-100 p-4 rounded-xl items-center ${isVerySmallScreen ? 'px-2 py-3' : 'px-4 py-4'}`}>
          <Ionicons name="stats-chart" size={24} color="#4F46E5" />
          <Text className={`text-indigo-700 ${isVerySmallScreen ? 'text-xs' : 'text-sm'} mt-1 font-pmedium`}>
            Deep Analytics
          </Text>
        </View>
      </Link>
    </View>
  );
};

export default ScreenButtons;