import React from "react";
import { View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

const CircularProgressChart = ({ isDark }: { isDark: boolean }) => {
  return (
    <View className="items-center font-pbold justify-center">
      <CircularProgress
        value={72}
        radius={60}
        duration={1500}
        maxValue={100}
        inActiveStrokeOpacity={0.2}
        activeStrokeWidth={10}
        inActiveStrokeWidth={10}
        progressValueColor={
          isDark ? "rgba(255, 255, 255, 1)" : "rgba(99, 102, 241, 1)" // Indigo for both modes
        }
        activeStrokeColor={isDark ? "#ffffff" : "#d6ddff"} // Keep the stroke color white for both modes
        inActiveStrokeColor={isDark ? "#ffffff" : "#d6ddff"} // Darker for dark mode and lighter for light mode
        title={"%"}
        titleColor={isDark ? "rgba(255, 255, 255, 1)" : "rgba(99, 102, 241, 1)"} // Match value color
        titleStyle={{ 
          fontSize: 20, 
          fontWeight: "bold",
          fontFamily: "Poppins"
        }}
      />
    </View>
  );
};

export default CircularProgressChart;
