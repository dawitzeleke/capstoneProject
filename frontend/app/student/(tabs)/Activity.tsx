import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const subjectsData = [
  { subject: "Physics", correct: 20, missed: 5, color: "#F97316" },
  { subject: "Math", correct: 18, missed: 3, color: "#3B82F6" },
  { subject: "Biology", correct: 22, missed: 4, color: "#10B981" },
  { subject: "Chemistry", correct: 15, missed: 6, color: "#6366F1" },
];

export default function Activity() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";
  const [activeTab, setActiveTab] = useState("Daily");
  const router = useRouter();

  const progressData = {
    labels: subjectsData.map((s) => s.subject),
    datasets: [{ data: subjectsData.map((s) => s.correct) }],
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] : ['#EEF2FF', '#E0E7FF']}
        className="px-6 pt-12 pb-6 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
            <Ionicons
              name="arrow-back"
              onPress={() => router.back()}
              size={24}
              color={isDark ? "white" : "#4F46E5"}
            />
          </TouchableOpacity>
          <Text
            className={`text-2xl font-pbold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
            Activity
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={isDark ? "white" : "#4F46E5"}
            />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text className={`mb-4 font-psemibold ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}>
          02 Jan 2024
        </Text>

        {/* Tabs */}
        <View className="flex-row justify-between">
          {["Daily", "Weekly", "Monthly", "Yearly"].map((label) => (
            <TouchableOpacity
              key={label}
              onPress={() => setActiveTab(label)}
              className={`px-3 py-1.5 rounded-xl ${
                activeTab === label
                  ? isDark
                    ? "bg-white"
                    : "bg-indigo-500"
                  : isDark
                    ? "bg-white/10"
                    : "bg-white/50"
              }`}>
              <Text
                className={`text-sm font-pmedium ${
                  activeTab === label
                    ? isDark
                      ? "text-black"
                      : "text-white"
                    : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Content */}
      <View className="px-4 -mt-4">
        {/* Bar Chart */}
        <View
          className={`rounded-2xl p-4 border shadow-lg ${
            isDark
              ? "bg-neutral-800/50 border-neutral-700"
              : "bg-white border-gray-200"
          }`}>
          <Text
            className={`text-lg font-pbold mb-4 ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}>
            Performance Overview
          </Text>
          <BarChart
            data={progressData}
            width={screenWidth - 40}
            height={220}
            fromZero
            withInnerLines={false}
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

        {/* Subject Scores */}
        <View
          className={`rounded-2xl p-4 mt-4 border shadow-lg ${
            isDark
              ? "bg-neutral-800 border-neutral-700"
              : "bg-white border-gray-200"
          }`}>
          <Text
            className={`text-lg font-pbold mb-4 ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}>
            Subject Performance
          </Text>

          <FlatList
            data={subjectsData}
            keyExtractor={(item) => item.subject}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                className={`flex-row justify-between items-center p-4 rounded-xl mt-3 ${
                  isDark
                    ? "bg-neutral-900"
                    : "bg-gray-50"
                }`}>
                <View className="flex-row items-center space-x-3">
                  <View 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text
                    className={`font-pmedium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                    {item.subject}
                  </Text>
                </View>
                <View className="flex-row space-x-4">
                  <View className="items-center">
                    <Text className="text-green-500 font-pbold">
                      {item.correct}
                    </Text>
                    <Text className={`text-xs mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Correct
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-red-500 font-pbold">
                      {item.missed}
                    </Text>
                    <Text className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Missed
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />

          <View className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <Text
              className={`font-pmedium text-center ${
                isDark ? "text-indigo-300" : "text-indigo-700"
              }`}>
              Keep up the great work! Your progress is impressive.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
