// Progress.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Heatmap from "@/components/Heatmap";
import CircularProgressChart from "@/components/CircularProgressChart";
import { BarChart } from "react-native-chart-kit";
import { setProgressData } from "@/redux/ProgressReducer/progressActions";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AppDispatch } from "@/redux/store";
import { httpRequest } from "@/util/httpRequest";

const screenWidth = Dimensions.get("window").width;

interface ProgressData {
  month: string;
  year: string;
  days_in_month: number;
  heatmap: number[];
}

const Progress = () => {
  const user = useSelector((state: any) => state.user.user);
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const progressData = useSelector((state: any) => state.progress.progressData);
  const isDark = currentTheme === "dark";
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const studentId = user?.id;
  const token = user?.token;

  // Get current month data
  const currentMonthData = useMemo(() => {
    if (!progressData || progressData.length === 0) return null;

    const monthData = progressData[currentMonthIndex];
    
    // Transform the flat array into weeks (5 weeks x 7 days)
    const weeks: number[][] = [];
    const daysInMonth = monthData.days_in_month;
    const firstDay = new Date(parseInt(monthData.year), getMonthNumber(monthData.month), 1).getDay();
    
    // Initialize weeks array
    for (let i = 0; i < 5; i++) {
      weeks.push(Array(7).fill(0));
    }

    // Fill in the data
    for (let day = 0; day < daysInMonth; day++) {
      const weekIndex = Math.floor((day + firstDay) / 7);
      const dayIndex = (day + firstDay) % 7;
      if (weekIndex < 5) { // Ensure we don't exceed our 5 weeks
        weeks[weekIndex][dayIndex] = monthData.heatmap[day];
      }
    }

    return {
      month: monthData.month,
      year: monthData.year,
      days_in_month: monthData.days_in_month,
      heatmap: weeks
    };
  }, [progressData, currentMonthIndex]);

  // Helper function to convert month name to number
  function getMonthNumber(monthName: string): number {
    const months: { [key: string]: number } = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3,
      'May': 4, 'June': 5, 'July': 6, 'August': 7,
      'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    return months[monthName] || 0;
  }

  // Get the latest week's data for the bar chart
  const barChartData = useMemo(() => {
    if (!progressData || progressData.length === 0) return null;

    // Get the latest month's data
    const latestMonth = progressData[progressData.length - 1];
    
    // Transform the flat array into weeks (5 weeks x 7 days)
    const weeks: number[][] = [];
    const daysInMonth = latestMonth.days_in_month;
    const firstDay = new Date(parseInt(latestMonth.year), getMonthNumber(latestMonth.month), 1).getDay();
    
    // Initialize weeks array
    for (let i = 0; i < 5; i++) {
      weeks.push(Array(7).fill(0));
    }

    // Fill in the data
    for (let day = 0; day < daysInMonth; day++) {
      const weekIndex = Math.floor((day + firstDay) / 7);
      const dayIndex = (day + firstDay) % 7;
      if (weekIndex < 5) { // Ensure we don't exceed our 5 weeks
        weeks[weekIndex][dayIndex] = latestMonth.heatmap[day];
      }
    }

    // Get the last non-empty week
    let latestWeek = weeks[0];
    for (let i = weeks.length - 1; i >= 0; i--) {
      if (weeks[i].some(value => value > 0)) {
        latestWeek = weeks[i];
        break;
      }
    }

    return {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          data: latestWeek,
        },
      ],
    };
  }, [progressData]);

  const handlePreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < progressData.length - 1) {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const data = await httpRequest(
          `/StudentProgress`,
          undefined, 
          "GET",
          token
        );
        console.log("Fetched progress data:", data);
        if (data) {
          dispatch(setProgressData(data));
        }
      } catch (error) {
        console.error("Failed to fetch student progress data:", error);
      }
    };

    if (studentId) {
      fetchProgressData();
    }
  }, [studentId, token, dispatch]);

  if (!progressData || progressData.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No progress data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 px-4 pt-6 pb-20 ${
        isDark ? "bg-black" : "bg-[#f1f3fc]"
      }`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 mt-8">
        <Link href="/student/(tabs)/Profile" className="w-10">
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDark ? "#ccc" : "#4B5563"}
          />
        </Link>
        <Text
          className={`text-xl font-pbold flex-1 text-center ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
          Progress
        </Text>
        <TouchableOpacity className="w-10">
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={isDark ? "#ccc" : "#4B5563"}
          />
        </TouchableOpacity>
      </View>

      {/* Bar Chart */}
      {barChartData && (
        <View
          className={`py-5 px-4 rounded-2xl shadow-md mb-6 items-center ${
            isDark ? "bg-neutral-800" : "bg-white border border-gray-200"
          }`}>
          <Text
            className={`text-lg font-pbold mb-4 ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
            Latest Week's Activity
          </Text>
          <BarChart
            data={barChartData}
            width={screenWidth - 50}
            height={220}
            fromZero
            withInnerLines={false}
            withHorizontalLabels={true}
            yAxisLabel=""
            yAxisSuffix=""
            showBarTops={false}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              decimalPlaces: 0,
              barRadius: 6,
              fillShadowGradient: isDark ? "#ffffff" : "#6366F1",
              fillShadowGradientOpacity: 1,
              color: () => (isDark ? "#ffffff" : "#6366F1"),
              labelColor: () => (isDark ? "#ffffff" : "#374151"),
              propsForBackgroundLines: {
                stroke: isDark ? "#374151" : "#D1D5DB",
              },
              barPercentage: 0.7,
            }}
          />
        </View>
      )}

      {/* Calendar Header */}
      <View className="flex-row items-center justify-between mb-2 px-1">
        <TouchableOpacity
          onPress={handlePreviousMonth}
          disabled={currentMonthIndex === 0}
          className={`p-1.5 rounded-lg ${
            currentMonthIndex === 0
              ? isDark
                ? "bg-gray-800/50"
                : "bg-gray-100/50"
              : isDark
              ? "bg-gray-800"
              : "bg-gray-100"
          }`}>
          <Ionicons
            name="chevron-back"
            size={18}
            color={
              currentMonthIndex === 0
                ? isDark
                  ? "#666"
                  : "#9CA3AF"
                : isDark
                ? "#ccc"
                : "#4B5563"
            }
          />
        </TouchableOpacity>
        <View className="items-center">
          <Text
            className={`text-base font-pmedium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
            {currentMonthData?.month}
          </Text>
          <Text
            className={`text-sm font-pregular ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
            {currentMonthData?.year}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleNextMonth}
          disabled={currentMonthIndex === progressData.length - 1}
          className={`p-1.5 rounded-lg ${
            currentMonthIndex === progressData.length - 1
              ? isDark
                ? "bg-gray-800/50"
                : "bg-gray-100/50"
              : isDark
              ? "bg-gray-800"
              : "bg-gray-100"
          }`}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={
              currentMonthIndex === progressData.length - 1
                ? isDark
                  ? "#666"
                  : "#9CA3AF"
                : isDark
                ? "#ccc"
                : "#4B5563"
            }
          />
        </TouchableOpacity>
      </View>

      {/* Heatmap */}
      <View className="mb-6">
        <Heatmap data={currentMonthData} isDark={isDark} />
      </View>

      {/* Stats Section */}
      <View className="flex-row mb-6">
        {/* Circular Progress */}
        <View
          className={`p-5 rounded-2xl shadow-md flex-1 mr-4 ${
            isDark ? "bg-neutral-800" : "bg-white border border-gray-200"
          }`}>
          <CircularProgressChart isDark={isDark} />
          <Text
            className={`text-base text-center font-pmedium ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
            Accuracy Rate
          </Text>
        </View>

        {/* Correct Attempts */}
        <View
          className={`p-5 rounded-2xl shadow-md flex-1 ${
            isDark ? "bg-neutral-800" : "bg-white border border-gray-200"
          }`}>
          <View className="items-center justify-center">
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
              isDark ? "bg-emerald-900/30" : "bg-emerald-50"
            }`}>
              <Ionicons
                name="checkmark-circle-outline"
                size={32}
                color="#10B981"
              />
            </View>
            <Text
              className={`font-pbold text-3xl mb-1 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
              349
            </Text>
            <Text
              className={`text-base text-center font-pmedium ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
              Correct Attempts
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Progress;
