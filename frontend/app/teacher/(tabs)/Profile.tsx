import React, { useState, useEffect } from 'react';
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
import { TeacherProfile, TeacherStats } from '@/types/teacherTypes';
import ProfilePicture from '@/components/teacher/Profile/ProfilePicture';
import { fetchTeacherProfile } from '@/redux/teacherReducer/teacherSlice';
import { useAppDispatch } from '@/redux/teacherReducer/hooks';

type Metric = {
  id: string;
  value: string;
  label: string;
};

// Define default profile and stats to prevent errors when state is null
const defaultProfile: TeacherProfile = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  school: '',
  profilePictureUrl: '',
  followersCount: 0,
  postsCount: 0,
  createdAt: '',
  updatedAt: '',
};

const defaultStats: TeacherStats = {
  totalViews: 0,
  totalShares: 0,
  engagementLast7Days: [],
  engagementLabels: [],
};

const TeacherDashboard: React.FC = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isVerySmallScreen = width < 340;
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const isDark = currentTheme === 'dark';

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.teacher.profile);
  const stats = useSelector((state: RootState) => state.teacher.stats);
  const loadingImage = useSelector((state: RootState) => state.teacher.loading.image);

  useEffect(() => {
    dispatch(fetchTeacherProfile('current-teacher-id'));
  }, [dispatch]);

  const metrics: Metric[] = [
    { id: 'engagement', value: '0K', label: 'Engagement' },
    { id: 'views', value: '10K', label: 'Views' },
    { id: 'shares', value: '1K', label: 'Shares' },
  ];

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-[#f1f3fc]'}`}
      contentContainerStyle={{ paddingBottom: 24, paddingTop: 0 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className={`flex-row mt-6 justify-between items-center ${isDark ? 'bg-gray-800' : 'bg-white'} px-5 py-4`}>
        <Text className={`text-3xl font-pbold ${isDark ? 'text-white' : 'text-[#4F46E5]'} tracking-tight`}>
          Dashboard
        </Text>
        <Link href="../Settings" asChild>
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color={isDark ? 'white' : '#4F46E5'} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Profile Picture - positioned absolutely */}
      <View className="w-full items-center absolute" style={{ top: 90, zIndex: 20 }}>
        <View className={`rounded-full p-1 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <ProfilePicture
            profilePictureUrl={profile?.profilePictureUrl}
            loading={loadingImage}
          />
        </View>
      </View>

      {/* Content below profile picture, including ProfileCard */}
      <View className="space-y-6 px-4 mt-[120]">
        <ProfileCard
          profile={profile || defaultProfile}
          stats={stats || defaultStats}
        />

        <ScreenButtons isVerySmallScreen={isVerySmallScreen} />

        <DashboardSummary
          isSmallScreen={isSmallScreen}
          isVerySmallScreen={isVerySmallScreen}
          stats={stats || defaultStats}
        />
      </View>

      <Toast />
    </ScrollView>
  );
};

export default TeacherDashboard;
