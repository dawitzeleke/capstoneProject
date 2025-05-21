// File: src/components/teacher/Profile/ProfilePicture.tsx

import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/redux/teacherReducer/hooks';
import { updateProfileImage } from '@/redux/teacherReducer/teacherSlice';
import Toast from 'react-native-toast-message';

// Import the local default avatar image
import defaultAvatar from '@/assets/images/avatar.jpg';

const ProfilePicture: React.FC<{
  profilePictureUrl?: string;
  loading: boolean;
  error?: string | null;
  onUploadStart?: () => void;
}> = ({ profilePictureUrl, loading, error, onUploadStart }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();

  const handleImagePick = async (useCamera: boolean) => {
    setModalVisible(false);
    onUploadStart?.();

    try {
      const result = await (useCamera 
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          }));

      if (!result.canceled && result.assets[0].uri) {
        dispatch(updateProfileImage({
          teacherId: 'current-teacher-id', // Replace with real ID later
          imageUri: result.assets[0].uri
        }));
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Image Error',
        text2: 'Failed to select image'
      });
    }
  };

  return (
    <>
      <View className="relative rounded-full bg-white shadow-lg">
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            className="w-28 h-28 rounded-full bg-gray-200"
            style={{ width: 112, height: 112 }}
          />
        ) : (
          <Image
            source={defaultAvatar}
            className="w-28 h-28 rounded-full"
            resizeMode="cover"
            style={{ width: 112, height: 112 }}
          />
        )}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-sm"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <Ionicons name="pencil" size={18} color="#4F46E5" />
          )}
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 space-y-4">
            <Text className="text-lg font-psemibold text-gray-900">
              Update Profile Picture
            </Text>

            <TouchableOpacity
              onPress={() => handleImagePick(true)}
              className="bg-indigo-100 p-3 rounded-xl active:bg-indigo-200"
            >
              <Text className="text-center text-indigo-700 font-psemibold">
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleImagePick(false)}
              className="bg-indigo-100 p-3 rounded-xl active:bg-indigo-200"
            >
              <Text className="text-center text-indigo-700 font-psemibold">
                Choose From Gallery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-3 active:opacity-70"
            >
              <Text className="text-center text-gray-500 font-psemibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfilePicture;