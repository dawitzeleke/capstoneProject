import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { updateTeacherImage } from '@/redux/teacherReducer/teacherActions';
import Toast from 'react-native-toast-message';
import type { AppDispatch } from "@/redux/store";

const ProfilePicture = ({ profileImage, onImageChange }: { profileImage: string | null; onImageChange: (imageUri: string) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageUpload = async (pickerFunction: () => Promise<ImagePicker.ImagePickerResult>) => {
    try {
      setIsUploading(true);
      const result = await pickerFunction();

      if (!result.canceled && result.assets?.[0]?.uri) {
        const imageUri = result.assets[0].uri;
        
        // Dispatch the action to update the teacher's image
        dispatch(updateTeacherImage(imageUri));
        
        // Update the local state immediately
        onImageChange(imageUri);
        
        Toast.show({
          type: 'success',
          text1: 'Profile updated',
          text2: 'Your profile picture has been updated successfully 👋'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: 'Could not update profile picture. Please try again.'
      });
    } finally {
      setIsUploading(false);
      setModalVisible(false);
    }
  };

  const openImagePickerAsync = () =>
    handleImageUpload(() => ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    }));

  const openCameraAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Camera access required',
        text2: 'Please enable camera permissions in settings'
      });
      return;
    }

    handleImageUpload(() => ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    }));
  };

  return (
    <>
      <View className="relative">
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            className="w-12 h-12 rounded-full mr-4"
            accessibilityLabel="Profile picture"
          />
        ) : (
          <View className="w-12 h-12 bg-[#d6ddff] rounded-full items-center justify-center mr-4">
            <Text className="text-base text-[#4F46E5] font-pbold">
              {profileImage ? profileImage.charAt(0) : ' '}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full"
          accessibilityLabel="Update profile picture"
        >
          {isUploading ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <Ionicons name="pencil" size={14} color="#4F46E5" />
          )}
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setIsUploading(false);
        }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 space-y-4">
            <Text className="text-lg font-psemibold text-gray-900">Update Profile Picture</Text>

            <TouchableOpacity
              onPress={openCameraAsync}
              className="bg-indigo-100 p-3 rounded-xl"
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#4F46E5" />
              ) : (
                <Text className="text-center text-indigo-700 font-psemibold">Take Photo</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openImagePickerAsync}
              className="bg-indigo-100 p-3 rounded-xl"
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#4F46E5" />
              ) : (
                <Text className="text-center text-indigo-700 font-psemibold">Choose From Gallery</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setIsUploading(false);
              }}
              className="p-3"
              disabled={isUploading}
            >
              <Text className="text-center text-gray-500 font-psemibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfilePicture;