import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

interface GradeEngagementChartProps {
  data: { grade: string; engagementPct: number }[];
}

const BAR_HEIGHT = 24;
const BAR_GAP = 12;
const LABEL_WIDTH = 32;
const PADDING = 16;
const MAX_PCT = 100;

export const GradeEngagementChart: React.FC<GradeEngagementChartProps> = ({ data }) => {
  const { width: screenWidth } = useWindowDimensions();

  // Calculate chart width dynamically (full width minus padding and label area)
  const chartWidth = useMemo(() => {
    const available = screenWidth - PADDING * 2 - LABEL_WIDTH - 24; // 24 = reserved for percent labels
    return Math.max(100, available);
  }, [screenWidth]);

  const chartHeight = data.length * (BAR_HEIGHT + BAR_GAP) - BAR_GAP;
  const viewBoxWidth = LABEL_WIDTH + chartWidth + 24;
  const viewBoxHeight = chartHeight;

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mb-4 w-full">
      <Text className="font-pbold text-lg text-slate-700 mb-4">
        Engagement by Grade (%)
      </Text>
      <Svg
        width="100%"
        height={viewBoxHeight}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        {data.map((item, i) => {
          const yPos = i * (BAR_HEIGHT + BAR_GAP);
          const barLen = (item.engagementPct / MAX_PCT) * chartWidth;
          return (
            <React.Fragment key={item.grade}>
              {/* Grade label */}
              <SvgText
                x={0}
                y={yPos + BAR_HEIGHT / 2 + 6}
                fontSize={15}
                fill="#64748B"
                fontWeight="700"
              >
                {item.grade}
              </SvgText>

              {/* Bar */}
              <Rect
                x={LABEL_WIDTH}
                y={yPos}
                width={barLen}
                height={BAR_HEIGHT}
                rx={6}
                fill="#4f46e5"
              />

              {/* % Label */}
              <SvgText
                x={LABEL_WIDTH + barLen + 8}
                y={yPos + BAR_HEIGHT / 2 + 6}
                fontSize={15}
                fill="#334155"
                fontWeight="600"
              >
                {`${item.engagementPct}%`}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};
