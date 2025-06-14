import React from "react";
import { View, Text } from "react-native";

interface HeatmapProps {
  data: {
    month: string;
    year: string;
    days_in_month: number;
    heatmap: number[][];
  } | null;
  isDark: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({ data, isDark }) => {
  if (!data) {
    return (
      <View className={`rounded-2xl p-4 w-full ${isDark ? "bg-neutral-900" : "bg-white border border-gray-200"}`}>
        <Text className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          No progress data available.
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`rounded-2xl px-6 py-4 w-full ${
        isDark ? "bg-neutral-900" : "bg-white border border-gray-200"
      }`}
    >
      <View className="flex-row flex-wrap justify-center items-center">
        {data.heatmap.map((week: number[], weekIndex: number) => (
          <View key={weekIndex} className="flex-row justify-center">
            {week.map((value: number, dayIndex: number) => {
              let bgClass = "";

              if (value === 0) {
                bgClass = isDark ? "bg-gray-700" : "bg-gray-300";
              } else if (value === 1) {
                bgClass = isDark ? "bg-gray-400" : "bg-indigo-300";
              } else {
                bgClass = isDark ? "bg-white" : "bg-indigo-500";
              }

              return (
                <View
                  key={dayIndex}
                  className={`w-6 h-6 m-1 rounded-md ${bgClass}`}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Heatmap;