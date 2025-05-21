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
import { TeacherProfile, TeacherStats } from '@/types/teacherTypes';
import ProfilePicture from '@/components/teacher/Profile/ProfilePicture';

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
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const dummyStats: TeacherStats = {
    totalViews: 10000,
    totalShares: 1000,
    engagementLast7Days: [20, 45, 28, 80, 99, 43, 50],
    engagementLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f1f3fc]"
      contentContainerStyle={{ paddingBottom: 24, paddingTop: 0 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row justify-between items-center bg-white px-5 py-4 ">
        <Text className="text-3xl font-pbold text-[#4F46E5] tracking-tight">Dashboard</Text>
        <Link href="../Settings" asChild>
          <Ionicons name="menu" size={28} color="#4F46E5" />
        </Link>
      </View>

      {/* Profile Picture - positioned absolutely */}
      <View className="w-full items-center absolute" style={{ top: 90, zIndex: 10 }}>
        <ProfilePicture
           profilePictureUrl={undefined}
           loading={uploadingImage}
           onUploadStart={() => setUploadingImage(true)}
        />
      </View>

      {/* Content below profile picture, including ProfileCard */}
      <View className="space-y-6 px-4 mt-[130]">
        <ProfileCard
          profile={dummyProfile}
          onChangeImage={(uri: string) => setProfileImage(uri)}
          uploadingImage={uploadingImage}
          stats={dummyStats}
        />

        <ScreenButtons isVerySmallScreen={isVerySmallScreen} />

        <DashboardSummary
          isSmallScreen={isSmallScreen}
          isVerySmallScreen={isVerySmallScreen}
          stats={dummyStats}
        />
      </View>

      <Toast />
    </ScrollView >
  );
};

export default TeacherDashboard;
