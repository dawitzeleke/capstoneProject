import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';

interface AttemptsDonutChartProps {
  correct: number;
  wrong: number;
}

export const AttemptsDonutChart: React.FC<AttemptsDonutChartProps> = ({ correct, wrong }) => {
  const { width: screenWidth } = useWindowDimensions();
  const paddingHorizontal = 32; // matches container padding (NativeWind px-4)

  // Determine diameter dynamically (max 220, min 120)
  const diameter = useMemo(() => {
    const max = 220;
    const min = 120;
    const available = screenWidth - paddingHorizontal;
    return Math.max(min, Math.min(max, available));
  }, [screenWidth]);

  const radius = diameter / 2;
  const strokeWidth = radius * 0.3; // donut thickness (30% of radius)
  const innerRadius = radius - strokeWidth;
  const total = correct + wrong;
  const correctPct = total ? correct / total : 0;
  const wrongPct = total ? wrong / total : 0;

  const circumference = 2 * Math.PI * radius;
  const correctStroke = correctPct * circumference;
  const wrongStroke = wrongPct * circumference;

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mb-4 w-full items-center">
      <Text className="font-pbold text-lg text-slate-700 mb-3">
        Correct vs. Wrong Attempts
      </Text>
      <Svg width={diameter} height={diameter}>
        <G rotation="90" origin={`${radius}, ${radius}`}>        
          {/* Correct segment */}
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            stroke="#4f46e5"
            strokeWidth={strokeWidth}
            strokeDasharray={`${correctStroke}, ${circumference}`}
            fill="transparent"
          />
          {/* Wrong segment */}
          <Circle
            cx={radius}
            cy={radius}
            r={innerRadius}
            stroke="#e5468d"
            strokeWidth={strokeWidth}
            strokeDasharray={`${wrongStroke}, ${circumference}`}
            strokeDashoffset={correctStroke}
            fill="transparent"
          />
        </G>
        {/* Center Label */}
        <SvgText
          x={radius}
          y={radius + 4}
          fontSize={24}
          fill="#505050"
          fontWeight="600"
          textAnchor="middle"
        >
          {`${Math.round(correctPct * 100)}%`}
        </SvgText>
      </Svg>
      {/* Legend */}
      <View className="flex-row justify-end mt-3">
        <View className="flex-row  items-center mr-4">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4f46e5' }} />
          <Text className="text-base font-pmedium text-[#4f46e5] ml-1">{correct} Correct</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e5468d' }} />
          <Text className="text-base font-pmedium text-[#e5468d] ml-1">{wrong} Wrong</Text>
        </View>
      </View>
    </View>
  );
};
