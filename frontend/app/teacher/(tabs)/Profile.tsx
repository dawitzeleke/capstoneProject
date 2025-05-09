import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, Modal } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import ProfilePicture from '@/components/teacher/ProfilePicture';
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
      <ActionButtons isVerySmallScreen={isVerySmallScreen} />

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

// Extracted Profile Card Component
const ProfileCard = ({ profileImage, fullName, schoolName, followers, onImageChange, isVerySmallScreen }: any) => (
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

export default TeacherDashboard;