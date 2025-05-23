import React, { useMemo } from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';

interface HeatmapCell {
  date: string; // YYYY-MM-DD
  count: number;
}

interface MonthlyWeekHeatmapProps {
  data: HeatmapCell[]; // daily raw posts; component will bucket into weeks
}

// Tints of #4f46e5 (indigo): lightest for no activity → darkest for high activity
const intensityColor = (count: number) => {
  if (count === 0)    return '#E0E7FF'; // lightest tint
  if (count < 3)      return '#A5B4FC';
  if (count < 7)      return '#6366D0';
  return '#554DD8';               // darkest, brand indigo
};

export const MonthlyWeekHeatmap: React.FC<MonthlyWeekHeatmapProps> = ({ data }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Bucket daily data into month/week cells (4 weeks per month)
  const grid = useMemo(() => {
    const result: number[][] = Array.from({ length: 12 }, () => [0, 0, 0, 0]);
    data.forEach(({ date, count }) => {
      const d = new Date(date);
      const month = d.getMonth();       // 0–11
      const day = d.getDate();          // 1–31
      const weekIdx = Math.min(3, Math.floor((day - 1) / 7));
      result[month][weekIdx] += count;
    });
    return result;
  }, [data]);

  // Determine cell size responsively
  const cellSize = useMemo(() => {
    const ideal = 40;
    const horizontalPadding = 32;  // parent padding
    const maxSize = Math.floor((screenWidth - horizontalPadding) / 4);
    return Math.min(ideal, maxSize);
  }, [screenWidth]);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mb-4">
      <Text className="font-pbold text-lg text-slate-700 mb-3 text-center">
        Posting by Month & Week
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 15
        }}
      >
        <View className="flex-col items-center">
          {grid.map((weeks, monthIdx) => (
            <View 
              key={monthIdx} 
              className="flex-row items-center mb-2"
              style={{ minWidth: screenWidth - 80 }} // Ensure full width centering
            >
              <Text className="w-12 text-sm font-psemibold text-slate-600 mr-1">
                {monthNames[monthIdx]}
              </Text>
              <View className="flex-row justify-center flex-1">
                {weeks.map((count, weekIdx) => (
                  <View
                    key={weekIdx}
                    className="mx-1 rounded-md justify-center"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: intensityColor(count),
                    }}
                  >
                    <Text className="text-xs text-center text-slate-800 font-pmedium">
                      {count || ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};