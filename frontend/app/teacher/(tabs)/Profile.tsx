import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { updateTeacherImage } from "@/redux/teacherReducer/teacherActions";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import type { AppDispatch } from "@/redux/store";
import EngagementGraph from "@/components/teacher/EngagementGraph";
import Toast from 'react-native-toast-message';

type Metric = {
  id: string;
  value: string;
  label: string;
};

const TeacherDashboard = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isVerySmallScreen = width < 340;

  const teacherData = useSelector((state: RootState) => state.teacher.teacherData);
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fullName = teacherData?.name ?? "Full Name";
  const schoolName = teacherData?.title ?? "School Name";
  const followers = teacherData?.followers ?? "32 Followers";
  const profileImage = teacherData?.imageUrl ?? null;

  const handleImageUpload = async (pickerFunction: () => Promise<ImagePicker.ImagePickerResult>) => {
    try {
      setIsUploading(true);
      const result = await pickerFunction();
      
      if (!result.canceled && result.assets?.[0]?.uri) {
        await dispatch(updateTeacherImage(result.assets[0].uri)).unwrap();
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

  const metrics: Metric[] = [
    { id: "engagement", value: "0K", label: "Engagement" },
    { id: "views", value: "10K", label: "Views" },
    { id: "shares", value: "1K", label: "Shares" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#f1f3fc] px-3 pt-6">
      {/* Profile Section */}
      <View className="mb-4">
        <Text className="text-2xl font-pbold text-gray-900 mb-3">Dashboard</Text>
        <ProfileCard 
          profileImage={profileImage}
          fullName={fullName}
          schoolName={schoolName}
          followers={followers}
          onPress={() => setModalVisible(true)}
          isVerySmallScreen={isVerySmallScreen}
        />
      </View>

      {/* Action Buttons */}
      <ActionButtons isVerySmallScreen={isVerySmallScreen} />

      {/* Summary Section */}
      <SummarySection 
        isSmallScreen={isSmallScreen} 
        isVerySmallScreen={isVerySmallScreen}
        metrics={metrics}
      />

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCameraPress={openCameraAsync}
        onGalleryPress={openImagePickerAsync}
        isUploading={isUploading}
      />

      <Toast />
    </ScrollView>
  );
};

// Extracted Profile Card Component
const ProfileCard = ({ profileImage, fullName, schoolName, followers, onPress, isVerySmallScreen }: any) => (
  <Animated.View entering={FadeInUp.delay(100)} className="bg-white p-4 rounded-3xl shadow-lg">
    <View className="flex-row items-center">
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.8}
        accessibilityLabel="Update profile picture"
      >
        <View className="relative">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className={`${isVerySmallScreen ? 'w-10 h-10' : 'w-12 h-12'} rounded-full mr-4`}
              accessibilityLabel="Profile picture"
            />
          ) : (
            <View className={`${isVerySmallScreen ? 'w-10 h-10' : 'w-12 h-12'} bg-[#d6ddff] rounded-full items-center justify-center mr-4`}>
              <Text className={`${isVerySmallScreen ? 'text-sm' : 'text-base'} text-[#4F46E5] font-pbold`}>
                {fullName.charAt(0)}
              </Text>
            </View>
          )}
          <View className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
            <Ionicons name="pencil" size={14} color="#4F46E5" />
          </View>
        </View>
      </TouchableOpacity>

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

// Extracted Action Buttons Component
const ActionButtons = ({ isVerySmallScreen }: any) => (
  <View className="flex-row gap-2 mb-6">
    <DashboardButton
      href="/teacher/(tabs)/ContentList"
      icon="folder-open"
      label="Content Management"
      color="bg-[#4F46E5]"
      textColor="text-white"
      isVerySmallScreen={isVerySmallScreen}
    />
    <DashboardButton
      href="/teacher/(tabs)/Insights"
      icon="stats-chart"
      label="Engagement Insights"
      color="bg-[#d6ddff]"
      textColor="text-gray-900"
      isVerySmallScreen={isVerySmallScreen}
    />
  </View>
);

// Reusable Dashboard Button Component
const DashboardButton = ({ href, icon, label, color, textColor, isVerySmallScreen }: any) => (
  <Link href={href} asChild>
    <TouchableOpacity className={`flex-1 ${color} p-3 rounded-2xl shadow-lg min-h-[90px]`}>
      <View className="flex-1 justify-between h-full">
        <View className="items-end">
          <Ionicons 
            name={icon} 
            size={isVerySmallScreen ? 18 : 20} 
            color={textColor === 'text-white' ? 'white' : '#4F46E5'} 
          />
        </View>
        <Text
          className={`${textColor} font-psemibold`}
          style={{
            fontSize: isVerySmallScreen ? 12 : 14,
            lineHeight: isVerySmallScreen ? 16 : 18
          }}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  </Link>
);

// Extracted Summary Section Component
const SummarySection = ({ isSmallScreen, isVerySmallScreen, metrics }: any) => (
  <Animated.View entering={FadeInUp.delay(200)} className="bg-white p-5 rounded-3xl shadow-lg mb-6">
    <Text className="text-lg font-psemibold text-gray-900 mb-6">Summary</Text>

    <View className={`${isSmallScreen ? 'flex-col' : 'flex-row'} items-center ${isSmallScreen ? 'space-y-6' : 'space-x-10'} justify-center mb-6`}>
      <EngagementGraph />
      <View className="items-center">
        <Text className="text-4xl font-bold text-gray-900">72</Text>
        <Text className="text-base text-gray-600 mt-1">Questions Posted</Text>
      </View>
    </View>

    <View className="border-t border-gray-100 pt-4">
      <View className="flex-row justify-between">
        {metrics.map((metric: Metric, index: number) => (
          <Animated.View
            key={metric.id}
            entering={FadeInDown.delay(100 * (index + 1))}
            className="flex-1 items-center"
          >
            <View className="bg-[#f1f3fc] px-0 py-2 rounded-xl shadow-sm w-24 mx-3">
              <Text className="text-center text-xl font-bold text-gray-900">{metric.value}</Text>
              <Text className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-center text-gray-600 mt-1`}>
                {metric.label}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  </Animated.View>
);

// Extracted Image Picker Modal Component
const ImagePickerModal = ({ visible, onClose, onCameraPress, onGalleryPress, isUploading }: any) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-3xl p-6 space-y-4">
        <Text className="text-lg font-psemibold text-gray-900">Update Profile Picture</Text>

        <TouchableOpacity 
          onPress={onCameraPress} 
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
          onPress={onGalleryPress} 
          className="bg-indigo-100 p-3 rounded-xl"
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <Text className="text-center text-indigo-700 font-psemibold">Choose From Gallery</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} className="p-3" disabled={isUploading}>
          <Text className="text-center text-gray-500 font-psemibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default TeacherDashboard;