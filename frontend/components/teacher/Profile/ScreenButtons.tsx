import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
      {/* Manage Posts Button */}
      <Link href="/teacher/(tabs)/ContentList" asChild>
        <TouchableOpacity 
          className="flex-1 rounded-xl shadow-md"
          style={{ backgroundColor: '#0a7e7e' }} 
          activeOpacity={0.8}
        >
          <View className="flex-col items-center justify-center p-4 ">
            <Ionicons name="folder-open" size={24} color="white" />
            <View className="mt-2 flex-col items-center">
              <Text 
                className={`text-white font-pmedium text-center ${
                  isVerySmallScreen ? 'text-xs' : 'text-sm'
                }`}
              >
                Manage Posts
              </Text>
              <Text 
                className={`text-white font-pmedium text-center ${
                  isVerySmallScreen ? 'text-xs' : 'text-sm'
                }`}
              >
                ({postsCount})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>

      {/* Analytics Button */}
      <Link href="/teacher/(tabs)/Insights" asChild>
        <TouchableOpacity 
          className="flex-1 rounded-xl shadow-md" 
          style={{ backgroundColor: '#E6B325' }} 
          activeOpacity={0.8}
        >
          <View className="flex-col items-center justify-center p-4">
            <Ionicons name="stats-chart" size={24} color="white" />
            <Text 
              className={`text-white mt-2 font-pmedium text-center ${
                isVerySmallScreen ? 'text-xs' : 'text-sm'
              }`}
            >
              Analytics
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default ScreenButtons;