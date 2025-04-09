import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import CircularProgressChart from "@/components/CircularProgressChart";
import { Ionicons } from "@expo/vector-icons";

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
    <ScrollView className="flex-1 bg-purple-50 px-3 pt-6">
      <View className="mb-4">
        <Text className="text-2xl font-pbold text-gray-900 mb-3">
          Dashboard
        </Text>

        {/* Profile Card */}
        <View className="bg-white p-4 rounded-3xl shadow-lg">
          <View className="flex-row items-center">
            <View
              className={`${
                isVerySmallScreen ? "w-8 h-8 mr-4" : "w-10 h-10 mr-5"
              } bg-purple-100 rounded-full items-center justify-center`}
            >
              <Text
                className={`${
                  isVerySmallScreen ? "text-sm" : "text-base"
                } text-purple-700 font-pbold`}
              >
                FN
              </Text>
            </View>

            <View className="flex-1 space-y-2">
              <View className="flex-row items-center space-x-3">
                <Text
                  className={`${
                    isVerySmallScreen ? "text-base" : "text-lg"
                  } font-psemibold text-gray-900`}
                >
                  Full name
                </Text>
                <Ionicons
                  name="ribbon"
                  size={isVerySmallScreen ? 16 : 18}
                  color="#6D28D9"
                />
              </View>
              <Text
                className={`${
                  isVerySmallScreen ? "text-xs" : "text-sm"
                } text-gray-600`}
              >
                School name
              </Text>
              <View className="flex-row items-center space-x-2">
                <Ionicons
                  name="book"
                  size={isVerySmallScreen ? 10 : 12}
                  color="#6D28D9"
                />
                <Text
                  className={`${
                    isVerySmallScreen ? "text-[10px]" : "text-xs"
                  } text-purple-700`}
                >
                  Biology • 32 Followers
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons - Updated Layout */}
      <View className="flex-row gap-2 mb-6">
        <Link href="/teacher/(tabs)/contentList" asChild>
          <TouchableOpacity className="flex-1 bg-purple-600 p-3 rounded-2xl shadow-lg min-h-[90px]">
            <View className="flex-1 justify-between h-full">
              {/* Icon at top-right */}
              <View className="items-end">
                <Ionicons
                  name="folder-open"
                  size={isVerySmallScreen ? 18 : 20}
                  color="white"
                />
              </View>

              {/* Text at bottom-left */}
              <Text
                className="text-white font-psemibold"
                style={{
                  fontSize: isVerySmallScreen ? 12 : 14,
                  lineHeight: isVerySmallScreen ? 16 : 18,
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

        <Link href="/teacher/(tabs)/insights" asChild>
          <TouchableOpacity className="flex-1 bg-purple-50 p-3 rounded-2xl shadow-lg min-h-[90px]">
            <View className="flex-1 justify-between h-full">
              {/* Icon at top-right */}
              <View className="items-end">
                <Ionicons
                  name="stats-chart"
                  size={isVerySmallScreen ? 18 : 20}
                  color="#6D28D9"
                />
              </View>

              {/* Text at bottom-left */}
              <Text
                className="text-gray-900 font-psemibold"
                style={{
                  fontSize: isVerySmallScreen ? 12 : 14,
                  lineHeight: isVerySmallScreen ? 16 : 18,
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

      {/* Summary Section */}
      <View className="bg-white p-4 rounded-3xl shadow-lg mb-6">
        <Text className="text-lg font-psemibold text-gray-900 mb-6">
          Summary
        </Text>

        <View
          className={`${isSmallScreen ? "flex-col" : "flex-row"} items-center ${
            isSmallScreen ? "space-y-6" : "space-x-8"
          } justify-center mb-6`}
        >
          <CircularProgressChart />
          <View className={`${isSmallScreen ? "items-center space-y-2" : ""}`}>
            <Text className="text-3xl font-bold text-gray-900">72</Text>
            <Text className="text-sm text-gray-600">Questions Posted</Text>
          </View>
        </View>

        <View className="flex-row justify-between border-t border-gray-100 pt-4 space-x-2">
          {metrics.map((metric) => (
            <View key={metric.id} className="items-center flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {metric.value}
              </Text>
              <Text
                className={`${
                  isVerySmallScreen ? "text-[10px]" : "text-xs"
                } text-gray-600 mt-2`}
              >
                {metric.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default TeacherDashboard;