import React from "react";
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

const screenWidth = Dimensions.get("window").width;

const subjectsData = [
  { subject: "Physics", correct: 20, missed: 5 },
  { subject: "Math", correct: 18, missed: 3 },
  { subject: "Biology", correct: 22, missed: 4 },
  { subject: "Chemistry", correct: 15, missed: 6 },
];

export default function Activity() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";

  const progressData = {
    labels: subjectsData.map((s) => s.subject),
    datasets: [{ data: subjectsData.map((s) => s.correct) }],
  };

  return (
    <ScrollView
      className={`flex-1 px-4 py-6 ${
        isDark ? "bg-black" : "bg-[#f1f3fc]"
      }`}>
      
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "white" : "black"}
        />
        <Text
          className={`text-xl font-pbold ${
            isDark ? "text-white" : "text-black"
          }`}>
          Activity
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Date */}
      <Text className={`mb-2 font-psemibold ${
        isDark ? "text-gray-400" : "text-gray-600"
      }`}>
        02 Jan 2024
      </Text>

      {/* Tabs */}
      <View
        className={`flex-row justify-between p-2 rounded-xl border shadow-xl ${
          isDark
            ? "bg-neutral-800 border-neutral-700"
            : "bg-gray-50 border-gray-200"
        }`}>
        {["Daily", "Weekly", "Monthly", "Yearly"].map((label, index) => (
          <TouchableOpacity
            key={label}
            className={`px-4 py-2 rounded-lg ${
              index === 0
                ? isDark
                  ? "bg-white"
                  : "bg-indigo-100"
                : ""
            }`}>
            <Text
              className={`font-pmedium ${
                index === 0
                  ? isDark
                    ? "text-black"
                    : "text-indigo-700"
                  : isDark
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bar Chart */}
      <View
        className={`rounded-2xl p-4 mt-6 border shadow-xl ${
          isDark
            ? "bg-neutral-800 border-neutral-700"
            : "bg-gray-50 border-gray-200"
        }`}>
        <BarChart
          data={progressData}
          width={screenWidth - 40}
          height={220}
          fromZero
          withInnerLines={false}
          yAxisLabel=""
          yAxisSuffix="%"
          showBarTops={false}
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            decimalPlaces: 0,
            barPercentage: 0.6,
            fillShadowGradient: isDark ? "#60A5FA" : "#4F46E5",
            fillShadowGradientOpacity: 1,
            color: () => (isDark ? "#60A5FA" : "#4F46E5"),
            labelColor: () => (isDark ? "#E5E7EB" : "#4B5563"),
            propsForBackgroundLines: {
              stroke: "transparent",
            },
          }}
        />
      </View>

      {/* Subject Scores */}
      <View
        className={`rounded-2xl p-4 mt-6 border shadow-xl ${
          isDark
            ? "bg-neutral-800 border-neutral-700"
            : "bg-gray-50 border-gray-200"
        }`}>
        <Text
          className={`text-lg font-pbold mb-3 ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}>
          Subject Score
        </Text>

        <FlatList
          data={subjectsData}
          keyExtractor={(item) => item.subject}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              className={`flex-row justify-between items-center p-3 rounded-lg mt-3 border shadow ${
                isDark
                  ? "bg-neutral-900 border-neutral-700 shadow-black/30"
                  : "bg-white border-gray-200 shadow-gray-200"
              }`}>
              <Text
                className={`font-pmedium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                {item.subject}
              </Text>
              <View className="flex-row space-x-4">
                <Text className="text-green-400 font-pbold">
                  ✅ {item.correct}
                </Text>
                <Text className="text-red-400 font-pbold">
                  ❌ {item.missed}
                </Text>
              </View>
            </View>
          )}
        />

        <Text
          className={`mt-4 font-pregular text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
          Keep up the great work!
        </Text>
      </View>
    </ScrollView>
  );
}
