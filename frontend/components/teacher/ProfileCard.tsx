import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ProfilePicture from '@/components/teacher/ProfilePicture';
import { Ionicons } from '@expo/vector-icons';

interface ProfileCardProps {
  profileImage: string | null;
  fullName: string;
  schoolName: string;
  followers: string;
  onImageChange: (imageUri: string) => void;
  isVerySmallScreen: boolean;
}

const ProfileCard = ({ profileImage, fullName, schoolName, followers, onImageChange, isVerySmallScreen }: ProfileCardProps) => {
  return (
    <Animated.View entering={FadeInUp.delay(100)} className="bg-white p-4 rounded-3xl shadow-lg">
      <View className="flex-row items-center">
        <ProfilePicture profileImage={profileImage} onImageChange={onImageChange} />

        <View className="flex-1 space-y-2">
          <View className="flex-row items-center space-x-3">
            <Text className={`${isVerySmallScreen ? 'text-base' : 'text-lg'} font-psemibold text-gray-900`}>
              {fullName}
            </Text>
            <Ionicons name="ribbon" size={isVerySmallScreen ? 16 : 18} color="#4F46E5" />
          </View>
          <Text className={`${isVerySmallScreen ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {schoolName}
          </Text>
          <View className="flex-row items-center space-x-2">
            <Ionicons name="book" size={isVerySmallScreen ? 10 : 12} color="#4F46E5" />
            <Text className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-[#4F46E5]`}>
              {followers}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileCard;