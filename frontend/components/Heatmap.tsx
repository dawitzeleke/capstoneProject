import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { HeatmapMonth } from "../redux/ProgressReducer/progressActionTypes"; // adjust path if needed

const Heatmap = () => {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const progressData: HeatmapMonth[] = useSelector(
    (state: any) => state.progress.progressData
  );

  const isDark = currentTheme === "dark";

  // Fallback if data is missing
  if (!progressData || progressData.length === 0) {
    return (
      <View className="rounded-2xl p-4 w-full">
        <Text className="text-center text-gray-500">No progress data available.</Text>
      </View>
    );
  }

  const heatmapData = progressData[0]; // take the first item for display

  return (
    <View
      className={`rounded-2xl p-4 w-full ${
        isDark ? "bg-neutral-900" : "bg-white border border-gray-200"
      }`}
    >
      <View className="flex-row flex-wrap justify-center">
        {heatmapData.heatmap.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row justify-center">
            {week.map((value, dayIndex) => {
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
                  className={`w-6 h-6 m-1 rounded-md border border-white/10 ${bgClass}`}
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
