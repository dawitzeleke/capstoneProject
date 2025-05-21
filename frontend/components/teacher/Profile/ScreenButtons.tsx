// File: src/components/teacher/Profile/ScreenButtons.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View className="flex-row gap-4 mb-6 px-4">
      <Link href="/teacher/(tabs)/ContentList" asChild>
        <TouchableOpacity className="flex-1 items-center p-4 rounded-xl shadow-md" style={{ backgroundColor: '#0a7e7e' }} activeOpacity={0.8}>
          <Ionicons name="folder-open" size={24} color="white" />
          <Text className={`text-white ${isVerySmallScreen ? 'text-xs' : 'text-sm'} mt-2 font-pmedium text-center`}>
            Manage Posts ({postsCount})
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/teacher/(tabs)/Insights" asChild>
        <TouchableOpacity className="flex-1 items-center p-4 rounded-xl shadow-md" style={{ backgroundColor: '#E6B325' }} activeOpacity={0.8}>
          <Ionicons name="stats-chart" size={24} color="white" />
          <Text className={`text-white ${isVerySmallScreen ? 'text-xs' : 'text-sm'} mt-2 font-pmedium text-center`}>
            Deep Analytics
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ScreenButtons;