import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { TeacherProfile, TeacherStats } from '@/types/teacherTypes';



interface ProfileCardProps {
  profile: TeacherProfile;
  stats?: TeacherStats | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  stats
}) => {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const totalViews = stats?.totalViews || 0;

  return (
    <Animated.View
      entering={FadeInUp.delay(100)}
      className="bg-[#4F46E5] p-6 mx-4 rounded-xl shadow-lg -mt-12 z-10 pt-14"
    >
      <View className="items-center">
        {/* ProfilePicture will be rendered in Profile.tsx with absolute positioning */}
      </View>

      <View className="items-center mt-2">
        <Text className="text-white text-xl font-psemibold">
              {fullName}
            </Text>
        <Text className="text-indigo-200 text-sm mt-1">Subject: Math</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="school-outline" size={16} color="white" />
          <Text className="text-indigo-200 text-sm ml-1">
            {profile.school}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-around items-center mt-6 border-t border-b border-indigo-300 py-4">
        <View className="items-center">
          <Text className="text-base font-psemibold text-white">
            {profile.followersCount.toLocaleString()}
              </Text>
          <Text className="text-xs text-indigo-200">Followers</Text>
            </View>

        <View className="w-[1px] h-full bg-indigo-300" />

        <View className="items-center">
          <Text className="text-base font-psemibold text-white">
            {profile.postsCount.toLocaleString()}
              </Text>
          <Text className="text-xs text-indigo-200">Posts</Text>
            </View>

        <View className="w-[1px] h-full bg-indigo-300" />

        <View className="items-center">
          <Text className="text-base font-psemibold text-white">
            {totalViews.toLocaleString()}
          </Text>
          <Text className="text-xs text-indigo-200">Views</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileCard;
