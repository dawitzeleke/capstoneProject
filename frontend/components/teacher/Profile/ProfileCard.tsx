import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import ProfilePicture from '@/components/teacher/Profile/ProfilePicture';
import type { TeacherProfile } from '@/types/teacherTypes';



interface ProfileCardProps {
  profile: TeacherProfile;
  onChangeImage: (imageUri: string) => void;
  uploadingImage: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onChangeImage,
  uploadingImage,
}) => {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <Animated.View
      entering={FadeInUp.delay(100)}
      className="bg-white p-4 rounded-3xl shadow-lg"
    >
      <View className="flex-row items-center">
        <ProfilePicture
          profilePictureUrl={profile.profilePictureUrl}
          onChangeImage={onChangeImage}
          uploading={uploadingImage}
        />

        <View className="flex-1 space-y-1 ml-2">
          <View className="flex-row items-center space-x-2">
            <Text className="text-lg font-psemibold text-gray-900">
              {fullName}
            </Text>
            <Ionicons name="ribbon" size={18} color="#4F46E5" />
          </View>

          <Text className="text-sm text-gray-600">
            {profile.school}
          </Text>

          <View className="flex-row space-x-4 mt-2">
            <View className="flex-row items-center space-x-1">
              <Ionicons name="people" size={16} color="#4F46E5" />
              <Text className="text-sm text-[#4F46E5]">
                {profile.followersCount.toLocaleString()} Followers
              </Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Ionicons name="book" size={16} color="#4F46E5" />
              <Text className="text-sm text-[#4F46E5]">
                {profile.postsCount.toLocaleString()} Posts
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default ProfileCard;
