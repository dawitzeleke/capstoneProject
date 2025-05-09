import React from 'react';
import { View } from 'react-native';
import DashboardButtons from '@/components/teacher/DashboardButtons';

interface ActionButtonsProps {
  isVerySmallScreen: boolean;
}

const ActionButtons = ({ isVerySmallScreen }: ActionButtonsProps) => {
  return (
    <View className="flex-row gap-2 mb-6">
      <DashboardButtons
        href="/teacher/(tabs)/ContentList"
        icon="folder-open"
        label="Content Management"
        color="bg-[#4F46E5]"
        textColor="text-white"
        isVerySmallScreen={isVerySmallScreen}
      />
      <DashboardButtons
        href="/teacher/(tabs)/Insights"
        icon="stats-chart"
        label="Engagement Insights"
        color="bg-[#d6ddff]"
        textColor="text-gray-900"
        isVerySmallScreen={isVerySmallScreen}
      />
    </View>
  );
};

export default ActionButtons;