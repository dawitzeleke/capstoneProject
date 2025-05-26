import React, { useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const mockData = {
  year: 2025,
  days_in_month: 31,
  heatmap: [
    [0, 1, 2, 0],
    [2, 0, 1, 0],
    [1, 0, 0, 2],
    [0, 2, 1, 0],
    [2, 0, 1, 2],
    [2, 0, 1, 2],
    [2, 0, 1, 2],
    [2, 0, 1, 2],
  ],
};

const Heatmap = () => {
  const [heatmapData] = useState(mockData);
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";

  return (
    <View
      className={`rounded-2xl p-4 w-full ${
        isDark ? "bg-neutral-900" : "bg-white border border-gray-200"
      }`}>

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
