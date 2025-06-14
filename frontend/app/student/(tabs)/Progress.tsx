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

const Progress = () => {
 
  const user = useSelector((state: any) => state.user.user);
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const progressData = useSelector((state: any) => state.progress.progressData);
  const isDark = currentTheme === "dark";
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
   const dispatch = useDispatch<AppDispatch>();
  const studentId = user?.id

  console.log(studentId)

  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    if (!isCurrentMonth) {
      const newDate = new Date(currentMonth);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentMonth(newDate);
    }
  };
  const token = user?.token; // Get the token from the user state
  const barChartData = useMemo(() => {
    const daysMap: Record<number, string> = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };

    const dayTotals: Record<string, number> = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    progressData.forEach((item: any) => {
      const date = new Date(item.date);
      const day = daysMap[date.getDay()];
      if (day in dayTotals) {
        dayTotals[day] += item.count;
      }
    });

    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [
            dayTotals["Mon"],
            dayTotals["Tue"],
            dayTotals["Wed"],
            dayTotals["Thu"],
            dayTotals["Fri"],
            dayTotals["Sat"],
            dayTotals["Sun"],
          ],
        },
      ],
    };
  }, [progressData]);

  useEffect(() => {
  const fetchProgressData = async () => {
    try {
      const data = await httpRequest(
        `/StudentProgress/${studentId}`,
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

  return (
    <ScrollView
      className={`flex-1 px-4 mb-16 pt-6 pb-20 ${
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
      <View
        className={`py-5 px-4 rounded-2xl shadow-md mb-6 items-center ${
          isDark ? "bg-neutral-800" : "bg-white border border-gray-200"
        }`}>
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

      {/* Stats and Heatmap */}
      <View className="flex-row justify-between mb-16">
        <View className="flex-col flex-1 mr-4">
          {/* Circular Progress */}
          <View
            className={`p-5 rounded-2xl mb-4 shadow-md ${
              isDark ? "bg-neutral-800" : "bg-white border border-gray-200"
            }`}>
            <CircularProgressChart isDark={isDark} />
          </View>

          {/* Correct Attempts */}
          <View
            className={`p-5 rounded-2xl shadow-md items-center justify-center ${
              isDark ? "bg-neutral-800" : "bg-white border border-gray-200"
            }`}>
            <Ionicons
              name="checkmark-circle-outline"
              size={28}
              color="#10B981"
            />
            <Text
              className={`font-pbold text-2xl text-center ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
              349
            </Text>
            <Text
              className={`text-lg font-pbold mt-2 text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
              Correct Attempts
            </Text>
          </View>
        </View>

        {/* Heatmap */}
        <View
          className={`rounded-2xl shadow-md flex-1 ml-2 p-4 ${
            isDark ? "bg-neutral-900" : "bg-white border border-gray-200"
          }`}>
          <View className="flex-row items-center justify-between mb-3">
            <TouchableOpacity
              onPress={handlePreviousMonth}
              className={`p-1.5 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}>
              <Ionicons
                name="chevron-back"
                size={18}
                color={isDark ? "#ccc" : "#4B5563"}
              />
            </TouchableOpacity>
            <View className="items-center">
              <Text
                className={`text-sm font-pmedium ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                {currentMonth.toLocaleString("default", { month: "long" })}
              </Text>
              <Text
                className={`text-xs font-pregular ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                {currentMonth.getFullYear()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNextMonth}
              disabled={isCurrentMonth}
              className={`p-1.5 rounded-lg ${
                isCurrentMonth
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
                  isCurrentMonth
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
          <Heatmap />
        </View>
      </View>
    </ScrollView>
  );
};

export default Progress;
