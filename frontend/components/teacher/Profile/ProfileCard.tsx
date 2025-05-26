import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { TeacherProfile, TeacherStats } from '@/types/teacherTypes';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/rootReducer';

interface ProfileCardProps {
  profile: TeacherProfile;
  stats?: TeacherStats | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  stats
}) => {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const isDark = currentTheme === 'dark';
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const totalViews = stats?.totalViews || 0;

  return (
    <Animated.View
      entering={FadeInUp.delay(100)}
      className={`p-6 mx-4 rounded-xl mb-4 shadow-lg -mt-12 z-10 pt-14 ${
        isDark ? 'bg-gray-800' : 'bg-[#4F46E5]'
      }`}
    >
      <View className="items-center">
        {/* ProfilePicture will be rendered in Profile.tsx with absolute positioning */}
      </View>

      <View className="items-center mt-2">
        <Text className={`text-xl font-psemibold ${isDark ? 'text-white' : 'text-white'}`}>
          {fullName}
        </Text>
        <Text className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-indigo-200'}`}>
          Subject: Math
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="school-outline" size={16} color={isDark ? 'white' : 'white'} />
          <Text className={`text-sm ml-1 ${isDark ? 'text-gray-300' : 'text-indigo-200'}`}>
            {profile.school}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-6 px-4">
        <View className="items-center">
          <Text className={`text-base font-psemibold ${isDark ? 'text-white' : 'text-white'}`}>
            {profile.followersCount.toLocaleString()}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-indigo-200'}`}>
            Followers
          </Text>
        </View>

        <View className={`w-[1px] h-8 ${isDark ? 'bg-gray-600' : 'bg-indigo-300'}`} />

        <View className="items-center">
          <Text className={`text-base font-psemibold ${isDark ? 'text-white' : 'text-white'}`}>
            {profile.postsCount.toLocaleString()}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-indigo-200'}`}>
            Posts
          </Text>
        </View>

        <View className={`w-[1px] h-8 ${isDark ? 'bg-gray-600' : 'bg-indigo-300'}`} />

        <View className="items-center">
          <Text className={`text-base font-psemibold ${isDark ? 'text-white' : 'text-white'}`}>
            {totalViews.toLocaleString()}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-indigo-200'}`}>
            Views
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileCard;
