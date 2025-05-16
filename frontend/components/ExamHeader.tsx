import React from "react";
import { View, Text } from "react-native";

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
  return (
    <View className="mb-2 flex-row justify-between items-center">
      <Text className="text-xl font-psemibold text-gray-800">
        {started ? "Answer the Questions" : score !== null ? "Result" : "Get Ready!"}
      </Text>

      {started && (
        <View className="bg-indigo-100 px-3 py-1 rounded-full">
          <Text className="text-indigo-700 font-semibold text-base">
            ⏱ {formatTime(timeLeft)}
          </Text>
        </View>
      )}
    </View>
  );
}
