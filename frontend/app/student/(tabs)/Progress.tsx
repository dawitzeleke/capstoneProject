import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Heatmap from "@/components/Heatmap";
import CircularProgressChart from "@/components/CircularProgressChart";
import { BarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const Progress = () => {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
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

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <ScrollView
      className={`flex-1 px-4 pt-6 pb-20 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      
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
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ data: [50, 75, 60, 80, 95, 70, 85] }],
          }}
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
              color={isDark ? "#10B981" : "#10B981"}
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
              className={`p-1.5 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <Ionicons 
                name="chevron-back" 
                size={18} 
                color={isDark ? "#ccc" : "#4B5563"} 
              />
            </TouchableOpacity>
            <View className="items-center">
              <Text className={`text-sm font-pmedium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {currentMonth.toLocaleString('default', { month: 'long' })}
              </Text>
              <Text className={`text-xs font-pregular ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {currentMonth.getFullYear()}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleNextMonth}
              disabled={isCurrentMonth}
              className={`p-1.5 rounded-lg ${
                isCurrentMonth 
                  ? isDark ? "bg-gray-800/50" : "bg-gray-100/50"
                  : isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color={isCurrentMonth 
                  ? isDark ? "#666" : "#9CA3AF"
                  : isDark ? "#ccc" : "#4B5563"
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
