// File: src/components/teacher/Profile/EngagementGraph.tsx

import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { useWindowDimensions, View } from 'react-native';

interface EngagementGraphProps {
  data: {
    labels: string[];
    values: number[];
  };
  isSmallScreen: boolean;
  isVerySmallScreen: boolean;
}

const EngagementGraph: React.FC<EngagementGraphProps> = ({
  data,
  isSmallScreen,
  isVerySmallScreen
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const chartConfig = {
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
  };

  return (
    <View className="flex-1">
      <LineChart
        data={{
          labels: data.labels,
          datasets: [{
            data: data.values,
            strokeWidth: isVerySmallScreen ? 1.8 : 2.2,
            pointRadius: isVerySmallScreen ? 3 : 4,
          }]
        }}
        width={Math.min(screenWidth - (isVerySmallScreen ? 32 : 40), 400)}
        height={Math.max((screenWidth * 0.5), 160)}
        chartConfig={chartConfig}
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
  );
};

export default EngagementGraph;