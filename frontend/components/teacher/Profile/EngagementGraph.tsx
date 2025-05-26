// File: src/components/teacher/Profile/EngagementGraph.tsx

import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { useWindowDimensions, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/rootReducer';

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
  isVerySmallScreen,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const isDark = currentTheme === 'dark';

  const chartConfig = {
    backgroundColor: isDark ? "#1f2937" : "#f9fafb",  // gray-50
    backgroundGradientFrom: isDark ? "#1f2937" : "#f9fafb",  // gray-50
    backgroundGradientTo: isDark ? "#374151" : "#f9fafb",  // gray-50
    decimalPlaces: 0,
    color: (opacity = 1) => isDark 
      ? `rgba(99, 102, 241, ${opacity})`  // indigo-500 for dark mode
      : `rgba(79, 70, 229, ${opacity})`,  // indigo-600 for light mode
    labelColor: (opacity = 1) => isDark 
      ? `rgba(229, 231, 235, ${opacity})`  // gray-200 for dark mode
      : `rgba(55, 65, 81, ${opacity})`,    // gray-700 for light mode
    propsForLabels: {
      fontSize: isVerySmallScreen ? 9 : 10,
      dx: isVerySmallScreen ? -5 : -3
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: isDark ? "#6366F1" : "#4F46E5",  // indigo-500/600
      fill: isDark ? "#1f2937" : "#f9fafb"     // dark/light background
    },
    propsForBackgroundLines: {
      stroke: isDark ? "rgba(229, 231, 235, 0.1)" : "rgba(55, 65, 81, 0.1)",
      strokeDasharray: "5, 5"
    }
  };

  return (
    <View className={`flex-1 rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <LineChart
        data={{
          labels: data.labels,
          datasets: [{
            data: data.values,
            strokeWidth: isVerySmallScreen ? 2 : 2.5,
            color: (opacity = 1) => isDark 
              ? `rgba(99, 102, 241, ${opacity})`  // indigo-500 for dark mode
              : `rgba(79, 70, 229, ${opacity})`,  // indigo-600 for light mode
          }]
        }}
        width={Math.min(screenWidth - (isVerySmallScreen ? 32 : 40), 400)}
        height={Math.max((screenWidth * 0.5), 160)}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          paddingRight: 16,
          backgroundColor: isDark ? "#1f2937" : "#f9fafb"  // gray-50
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
        withVerticalLabels={!isVerySmallScreen}
        withHorizontalLabels={!isVerySmallScreen}
        fromZero={true}
        segments={5}
        renderDotContent={({ x, y, index, indexData }) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              top: y - 20,
              left: x - 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: isDark ? '#1f2937' : '#f9fafb',  // gray-50
                padding: 4,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isDark ? '#6366F1' : '#4F46E5',
              }}
            >
              <Text
                style={{
                  color: isDark ? '#E5E7EB' : '#374151',
                  fontSize: 10,
                  fontWeight: '600',
                }}
              >
                {indexData}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default EngagementGraph;