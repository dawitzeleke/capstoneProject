import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/rootReducer';
import { ScrollView, useWindowDimensions, View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import ProfileCard from '@/components/teacher/Profile/ProfileCard';
import ScreenButtons from '@/components/teacher/Profile/ScreenButtons';
import DashboardSummary from '@/components/teacher/Profile/DashboardSummary';
import { TeacherProfile } from '@/types/teacherTypes';

type Metric = {
  id: string;
  value: string;
  label: string;
};

const TeacherDashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isVerySmallScreen = width < 340;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRouter();
  const teacherData = useSelector((state: RootState) => state.teacher.teacherData);

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const metrics: Metric[] = [
    { id: 'engagement', value: '0K', label: 'Engagement' },
    { id: 'views', value: '10K', label: 'Views' },
    { id: 'shares', value: '1K', label: 'Shares' },
  ];

  const dummyProfile: TeacherProfile = {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    school: 'Bright Future Academy',
    profilePictureUrl: '@/assets/images/avatar',
    followersCount: 1234,
    postsCount: 56,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f1f3fc]  pt-3"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="space-y-6">
        {/* Styled Header */}
         <View className="flex-row justify-between items-center bg-white px-5 py-4 ">
          <Text className="text-3xl font-pbold text-[#4F46E5] tracking-tight">Dashboard</Text>
          <Link href="../Settings" asChild>
            <Ionicons name="menu" size={28} color="#4F46E5" />
          </Link>
        </View>
     

      {/* Profile Section */}
      <ProfileCard
        profile={dummyProfile}
        onChangeImage={(uri: string) => setProfileImage(uri)}
        uploadingImage={false}
      />

      {/* Quick Actions */}
      <View className="flex-row justify-center">
        <ScreenButtons isVerySmallScreen={isVerySmallScreen} />
      </View>

      {/* Summary Section */}
      <DashboardSummary
        isSmallScreen={isSmallScreen}
        isVerySmallScreen={isVerySmallScreen}
        activity={{
          totalPosts: 32,
          totalStudents: 120,
          totalComments: 87,
        }}
        metrics={metrics}
      />
    </View>

      {/* Toast Notification */ }
  <Toast />
    </ScrollView >
  );
};

export default TeacherDashboard;
