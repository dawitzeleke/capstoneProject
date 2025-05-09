import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { View, ScrollView, useWindowDimensions, Text } from "react-native";
import ProfileCard from '@/components/teacher/ProfileCard';
import ScreenButtons from '@/components/teacher/ScreenButtons';
import SummarySection from '@/components/teacher//SummarySection';
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
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(teacherData?.imageUrl ?? null);

  const fullName = teacherData?.name ?? "Full Name";
  const schoolName = teacherData?.title ?? "School Name";
  const followers = teacherData?.followers ?? "32 Followers";

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
          onImageChange={(imageUri: string) => setProfileImage(imageUri)}
          isVerySmallScreen={isVerySmallScreen}
        />
      </View>

      {/* Action Buttons */}
      <ScreenButtons isVerySmallScreen={isVerySmallScreen} />

      {/* Summary Section */}
      <SummarySection
        isSmallScreen={isSmallScreen}
        isVerySmallScreen={isVerySmallScreen}
        metrics={metrics}
      />

      <Toast />
    </ScrollView>
  );
};

export default TeacherDashboard;