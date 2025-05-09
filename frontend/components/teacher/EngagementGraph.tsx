import React from "react";
import { LineChart } from "react-native-chart-kit";
import { useWindowDimensions, View } from "react-native";

const EngagementGraph = ({ isSmallScreen, isVerySmallScreen }) => {
  const { width: screenWidth } = useWindowDimensions()
  
  // Calculate available width considering parent padding
  const graphWidth = Math.min(screenWidth - (isVerySmallScreen ? 32 : 40), 400)
  const graphHeight = Math.max(graphWidth * 0.5, 160)

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43, 50],
      strokeWidth: isVerySmallScreen ? 1.8 : 2.2,
      pointRadius: isVerySmallScreen ? 3 : 4,
    }]
  }

  return (
    <View className="flex-1">
      <LineChart
        data={data}
        width={graphWidth}
        height={graphHeight}
        chartConfig={{
          backgroundColor: "#f1f3fc",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#d6ddff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForLabels: {
            fontSize: isVerySmallScreen ? 9 : 10,
            dx: isVerySmallScreen ? -5 : -3
          }
        }}
        bezier
        style={{
          borderRadius: 12,
          marginVertical: 8,
        }}
        withHorizontalLabels={!isVerySmallScreen}
        withVerticalLabels={!isVerySmallScreen}
        yAxisInterval={isVerySmallScreen ? 2 : 1}
      />
    </View>
  )
}; 

export default EngagementGraph;