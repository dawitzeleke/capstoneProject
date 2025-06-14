// EngagementInsightsScreen.tsx
import React, { useCallback, useState } from 'react';
import { View, ScrollView, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import RefreshButton from '@/components/teacher/Insights/RefreshButton';
import { SummaryCard } from '@/components/teacher/Insights/SummaryCard';
import { RootState, AppDispatch } from '@/redux/store';
import { setFilters, FlaggedItem } from '@/redux/teacherReducer/teacherInsightsSlice';
import { GradeEngagementChart } from '@/components/teacher/Insights/GradeEngagementChart';
import { AttemptsDonutChart } from '@/components/teacher/Insights/AttemptsDonutChart';
import { MonthlyWeekHeatmap } from '@/components/teacher/Insights/PostingHeatmap';
import { fetchTeacherInsights } from '@/redux/teacherReducer/teacherInsightsSlice';

const EngagementInsightsScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { summaryStats, flaggedItems, filters, loading } = useSelector((state: RootState) => state.teacherInsights);
  const [detailPanelVisible, setDetailPanelVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlaggedItem | null>(null);

  const cardColumns = width > 1024 ? 4 : width > 640 ? 2 : 1;

  const handleReview = useCallback((item: FlaggedItem) => {
    setSelectedItem(item);
    setDetailPanelVisible(true);
  }, []);

  const handleMarkSafe = useCallback((item: FlaggedItem) => {
    setDetailPanelVisible(false);
  }, []);

  const handleRemoveItem = useCallback((item: FlaggedItem) => {
    setDetailPanelVisible(false);
  }, []);

  const handleRefresh = async () => {
    try {
      // Dispatch action to refresh data
      await dispatch(fetchTeacherInsights(filters));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row bg-[#4f46e5] p-4 items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-pbold text-white">Analytics</Text>
        <RefreshButton onPressAsync={handleRefresh} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {/* Filters */}

        {/* Summary Cards */}
        <View className="flex-row gap-3 flex-wrap mt-4">
          <View style={{ width: cardColumns === 1 ? '100%' : cardColumns === 2 ? '48%' : '24%', paddingHorizontal: 4, marginBottom: 8 }}>
            <SummaryCard title="Total Followers" value={summaryStats?.totalFollowers?.toString() || '1.2K'} icon="people-outline" color="indigo" />
          </View>
          <View style={{ width: cardColumns === 1 ? '100%' : cardColumns === 2 ? '48%' : '24%', paddingHorizontal: 4, marginBottom: 8 }}>
            <SummaryCard title="Total Questions Posted" value={summaryStats?.questionsThisWeek?.toString() || '78'} icon="help-circle-outline" color="emerald" />
          </View>
          <View style={{ width: cardColumns === 1 ? '100%' : cardColumns === 2 ? '48%' : '24%', paddingHorizontal: 4, marginBottom: 8 }}>
            <SummaryCard title="Likes" value={summaryStats?.totalLikes?.toString() || '1.5K'} icon="heart" color="rose" />
          </View>
          <View style={{ width: cardColumns === 1 ? '100%' : cardColumns === 2 ? '48%' : '24%', paddingHorizontal: 4, marginBottom: 8 }}>
            <SummaryCard title="Avg Saves" value={summaryStats?.avgSavesPerQ?.toString() || '15'} icon="bookmark-outline" color="amber" />
          </View>
        </View>

        {/* Charts */}
        <GradeEngagementChart
          data={[
            { grade: '9', engagementPct: 72 },
            { grade: '10', engagementPct: 85 },
            { grade: '11', engagementPct: 63 },
            { grade: '12', engagementPct: 90 },
          ]}
        />
        <AttemptsDonutChart correct={320} wrong={80} />
        <MonthlyWeekHeatmap
          data={[
            { date: '2025-01-03', count: 2 },
            { date: '2025-01-10', count: 5 },
            { date: '2025-02-14', count: 0 },
            { date: '2025-03-21', count: 7 },
            { date: '2025-04-05', count: 3 },
            { date: '2025-05-12', count: 8 },
            { date: '2025-06-18', count: 1 },
            { date: '2025-07-25', count: 0 },
            { date: '2025-08-02', count: 4 },
            { date: '2025-09-09', count: 6 },
            { date: '2025-10-16', count: 2 },
            { date: '2025-11-23', count: 9 },
          ]}
        />

      </ScrollView>
    </View>
  );
};

export default EngagementInsightsScreen;