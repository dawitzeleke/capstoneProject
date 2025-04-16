import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import CircularProgressChart from "@/components/CircularProgressChart";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

const TeacherDashboard = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isVerySmallScreen = width < 340;

  const metrics = [
    { id: "engagement", value: "0K", label: "Engagement" },
    { id: "views", value: "10K", label: "Views" },
    { id: "shares", value: "1K", label: "Shares" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#f1f3fc] px-3 pt-6">
      <View className="mb-4">
        <Text className="text-2xl font-pbold text-gray-900 mb-3">Dashboard</Text>

        {/* Profile Card */}
        <Animated.View entering={FadeInUp.delay(100)} className="bg-white p-4 rounded-3xl shadow-lg">
          <View className="flex-row items-center">
            <View className={`${isVerySmallScreen ? 'w-8 h-8 mr-4' : 'w-10 h-10 mr-5'} bg-[#d6ddff] rounded-full items-center justify-center`}>
              <Text className={`${isVerySmallScreen ? 'text-sm' : 'text-base'} text-[#4F46E5] font-pbold`}>FN</Text>
            </View>

            <View className="flex-1 space-y-2">
              <View className="flex-row items-center space-x-3">
                <Text className={`${isVerySmallScreen ? 'text-base' : 'text-lg'} font-psemibold text-gray-900`}>Full name</Text>
                <Ionicons name="ribbon" size={isVerySmallScreen ? 16 : 18} color="#4F46E5" />
              </View>
              <Text className={`${isVerySmallScreen ? 'text-xs' : 'text-sm'} text-gray-600`}>School name</Text>
              <View className="flex-row items-center space-x-2">
                <Ionicons name="book" size={isVerySmallScreen ? 10 : 12} color="#4F46E5" />
                <Text className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-[#4F46E5]`}>Biology • 32 Followers</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-2 mb-6">
        <Link href="/teacher/(tabs)/ContentList" asChild>
          <TouchableOpacity className="flex-1 bg-[#4F46E5] p-3 rounded-2xl shadow-lg min-h-[90px]">
            <View className="flex-1 justify-between h-full">
              <View className="items-end">
                <Ionicons name="folder-open" size={isVerySmallScreen ? 18 : 20} color="white" />
              </View>
              <Text
                className="text-white font-psemibold"
                style={{
                  fontSize: isVerySmallScreen ? 12 : 14,
                  lineHeight: isVerySmallScreen ? 16 : 18
                }}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                Content Management
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/teacher/(tabs)/Insights" asChild>
          <TouchableOpacity className="flex-1 bg-[#d6ddff] p-3 rounded-2xl shadow-lg min-h-[90px]">
            <View className="flex-1 justify-between h-full">
              <View className="items-end">
                <Ionicons name="stats-chart" size={isVerySmallScreen ? 18 : 20} color="#4F46E5" />
              </View>
              <Text
                className="text-gray-900 font-psemibold"
                style={{
                  fontSize: isVerySmallScreen ? 12 : 14,
                  lineHeight: isVerySmallScreen ? 16 : 18
                }}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                Engagement Insights
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Summary Section - Enhanced */}
      <Animated.View entering={FadeInUp.delay(200)} className="bg-white p-5 rounded-3xl shadow-lg mb-6">
        <Text className="text-lg font-psemibold text-gray-900 mb-6">Summary</Text>

        <View className={`${isSmallScreen ? 'flex-col' : 'flex-row'} items-center ${isSmallScreen ? 'space-y-6' : 'space-x-10'} justify-center mb-6`}>
          <CircularProgressChart />
          <View className="items-center">
            <Text className="text-4xl font-bold text-gray-900">72</Text>
            <Text className="text-base text-gray-600 mt-1">Questions Posted</Text>
          </View>
        </View>

        <View className="border-t border-gray-100 pt-4">
          <View className="flex-row justify-between">
            {metrics.map((metric, index) => (
              <Animated.View
                key={metric.id}
                entering={FadeInDown.delay(100 * (index + 1))}
                className="flex-1 items-center"
              >
                <View className="bg-[#f1f3fc] px-0 py-2 rounded-xl shadow-sm w-24 mx-3">
                  <Text className="text-center text-xl font-bold text-gray-900">{metric.value}</Text>
                  <Text className={`${isVerySmallScreen ? 'text-[10px]' : 'text-xs'} text-center text-gray-600 mt-1`}>
                    {metric.label}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default TeacherDashboard;
