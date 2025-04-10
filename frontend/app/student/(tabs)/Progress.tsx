import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Link } from "expo-router";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Heatmap from "@/components/Heatmap";
import CircularProgressChart from "@/components/CircularProgressChart";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const Progress = () => {
  return (
    <ScrollView className="bg-primary flex-1 p-5 mt-3">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Link
          href="/student/(tabs)/Profile"
          className="text-lg font- font-pregularpregular text-blue-500 font-pregular">
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Link>
        <Text className="text-gray-100 text-2xl font-pbold">Progress</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="gray" />
      </View>
      {/* Wellness Statistics */}
      <View className="bg-card pt-5 pb-5 pr-8 font-pregular flex rounded-2xl shadow-md mb-6 items-center">
        <BarChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Weekly labels
            datasets: [{ data: [50, 75, 60, 80, 95, 70, 85] }], // Weekly progress data
          }}
          width={screenWidth * 0.9} // Slightly reduced to fit inside the container
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero={true} // Ensures bars start from zero
          withInnerLines={false} // Hide horizontal grid lines
          withHorizontalLabels={true} // Show y-axis labels for better understanding
          chartConfig={{
            backgroundGradientFromOpacity: 0, // Ensures full transparency
            backgroundGradientToOpacity: 0, // Ensures full transparency
            fillShadowGradient: "aqua", // Ensure bars stay colored
            fillShadowGradientOpacity: 1, // Keep bars fully visible
            barPercentage: 0.6,
            color: () => "aqua",
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            decimalPlaces: 0,
            propsForBackgroundLines: {
              stroke: "transparent", // Removes grid lines if needed
            },
          }}
          showBarTops={false}
        />
      </View>

      <View className="flex-row justify-between mb-16">
        <View className="flex-col flex-1 mr-4">
          <View className="bg-card p-5 rounded-2xl mb-2 shadow-md">
            <CircularProgressChart />
          </View>
          <View className="bg-card p-5 rounded-2xl mt-2 shadow-md items-center justify-center">
            <Ionicons name="checkmark-circle-outline" size={28} color="gray" />
            <Text className="font-pbold text-2xl text-center text-[#00FFFF]">
              349
            </Text>
            <Text className="text-gray-500 text-lg font-pbold mt-2 text-center">
              Correct Attempts
            </Text>
          </View>
        </View>
        <View className="bg-card rounded-2xl shadow-md flex-1 row-span-2">
          <Heatmap/>
        </View>
      </View>
    </ScrollView>
  );
};

export default Progress;
