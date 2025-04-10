import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

// Mock data for testing (replace with API response later)
const mockData = {
  month: "March",
  year: 2025,
  days_in_month: 31,
  heatmap: [
    [0, 1, 2, 0], // Week 1
    [2, 0, 1, 0], // Week 2
    [1, 0, 0, 2], // Week 3
    [0, 2, 1, 0], // Week 4
    [2, 0, 1, 2], // Week 5 (only for 31-day months)
    [2, 0, 1, 2], // Week 5 (only for 31-day months)
    [2, 0, 1, 2], // Week 5 (only for 31-day months)
    [2, 0, 1, 2], // Week 5 (only for 31-day months)
  ],
};

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState(mockData);

  // Future API call (commented out for now)
  /*
  useEffect(() => {
    fetch("https://your-backend.com/api/heatmap?month=3&year=2025")
      .then((res) => res.json())
      .then((data) => setHeatmapData(data))
      .catch((err) => console.error("Error fetching heatmap:", err));
  }, []);
  */

  return (
    <View className="bg-card rounded-2xl shadow-md w-100 flex-1 p-2">
      {/* Month Label */}
      <Text className="text-gray-500 font-pregular text-sm text-center mb-2">
        <Ionicons name="calendar-outline" size={16} /> {heatmapData.month}
      </Text>
      {/* Heatmap Grid */}
      <View className="flex-row flex-wrap justify-center">
        {heatmapData.heatmap.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row justify-center">
            {week.map((value, dayIndex) => (
              <View
                key={dayIndex}
                className={`w-6 h-6 m-1 rounded-md ${
                  value === 0
                    ? "bg-gray-800" // No activity
                    : value === 1
                    ? "bg-cyan-400" // Low activity
                    : "bg-cyan-700" // High activity
                }`}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Heatmap;
