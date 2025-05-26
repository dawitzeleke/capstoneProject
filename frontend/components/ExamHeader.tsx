import React from "react";
import { View, Text, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

type ExamHeaderProps = {
  started: boolean;
  score: number | null;
  timeLeft: number;
  formatTime: (seconds: number) => string;
};

export default function ExamHeader({
  started,
  score,
  timeLeft,
  formatTime,
}: ExamHeaderProps) {
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const getHeaderText = () => {
    if (started) return "Biology Exam";
    if (score !== null) return "Exam Results";
    return "";
  };

  const getHeaderIcon = () => {
    if (started) return "school";
    if (score !== null) return "assignment";
    return "timer";
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
            currentTheme === "dark" ? "bg-gray-800" : "bg-indigo-50"
          }`}>
            <MaterialIcons
              name={getHeaderIcon()}
              size={28}
              color={currentTheme === "dark" ? "#fff" : "#4F46E5"}
            />
          </View>
          <Text className={`text-2xl font-pbold ${
            currentTheme === "dark" ? "text-white" : "text-gray-800"
          }`}>
            {getHeaderText()}
          </Text>
        </View>

        {started && (
          <View className={`px-4 py-2 rounded-xl ${
            currentTheme === "dark" ? "bg-gray-800" : "bg-indigo-50"
          }`}>
            <View className="flex-row items-center">
              <MaterialIcons
                name="timer"
                size={20}
                color={currentTheme === "dark" ? "#fff" : "#4F46E5"}
              />
              <Text className={`ml-2 font-psemibold ${
                currentTheme === "dark" ? "text-white" : "text-indigo-700"
              }`}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {started && (
        <Text className={`mt-2 text-sm ${
          currentTheme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>
          Select the correct answer for each question
        </Text>
      )}
    </View>
  );
}
