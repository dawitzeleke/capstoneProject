import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const subjectsData = [
  { subject: "Physics", correct: 20, missed: 5 },
  { subject: "Math", correct: 18, missed: 3 },
  { subject: "Biology", correct: 22, missed: 4 },
  { subject: "Chemistry", correct: 15, missed: 6 },
];

export default function Activity() {
  const progressData = {
    labels: subjectsData.slice(0, 4).map((s) => s.subject), // Only first 4 subjects
    datasets: [{ data: subjectsData.slice(0, 4).map((s) => s.correct) }],
  };

  return (
    <ScrollView className="flex-1 bg-primary p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Ionicons name="arrow-back" size={24} color="gray" />
        <Text className="text-xl font-semibold text-gray-100">Activity</Text>
      </View>

      {/* Date */}
      <View className="flex-row justify-between items-center mt-4">
        <Text className="text-gray-100 font-pregular">02 Jan 2024</Text>
      </View>

      {/* Tab Switcher */}
      <View className="flex-row justify-between align-middle mt-4 bg-card p-2 rounded-xl">
        {["Daily", "Weekly", "Monthly", "Yearly"].map((label, index) => (
          <TouchableOpacity
            key={index}
            className={`${
              index === 0
                ? "bg-white px-4 py-2 rounded-lg justify-center"
                : "justify-center"
            }`}>
            <Text
              className={`${
                index === 0 ? "text-gray-700 font-pmedium" : "text-gray-400"
              }`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bar Chart */}
      <View className="bg-card mt-4 p-2 flex justify-center font-pregular align-middle rounded-xl">
        <BarChart
          data={progressData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          fromZero
          withInnerLines={false}
          chartConfig={{
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            fillShadowGradient: "aqua", // Ensure bars stay colored
            fillShadowGradientOpacity: 1, // Keep bars fully visible
            barPercentage: 0.6,
            color: () => "aqua", // Purple bars
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            decimalPlaces: 0,
            propsForBackgroundLines: { stroke: "transparent" },
          }}
          showBarTops={false}
        />
      </View>

      {/* Subject Streak - Now Scrollable! */}
      <View className="bg-card p-4 rounded-xl shadow-md mt-6">
        <Text className="text-lg font-psemibold text-gray-100">
          Subject Score
        </Text>

        {/* Make the list scrollable */}
        <FlatList
          data={subjectsData}
          keyExtractor={(item) => item.subject}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center p-3 bg-gray-800 rounded-lg mt-3">
              <Text className="text-gray-300 font-pregular">
                {item.subject}
              </Text>
              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <Text className="text-green-400 font-psemibold ml-1">
                    {item.correct}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-red-400 font-psemibold ml-1">
                    {item.missed}
                  </Text>
                </View>
              </View>
            </View>
          )}
          scrollEnabled={false} // Allows the parent ScrollView to handle scrolling
        />

        <Text className="text-gray-400 font-pregular mt-3">
          Keep up the great work!
        </Text>
      </View>
    </ScrollView>
  );
}
