import React, { useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Animated } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

type RoutePath = `/(student)${string}`;

export default function Home() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === "dark" ? "bg-gray-900" : "bg-[#f1f3fc]"}`}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-6 mt-4">
          <View className="flex-row items-center space-x-2">
            <View className="w-3 h-3 rounded-full bg-indigo-500" />
            <Text className={`text-lg font-pbold ${currentTheme === "dark" ? "text-white" : "text-indigo-600"}`}>
              Cognify
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/student/(tabs)/Notification")}
            className={`p-2 rounded-full ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"}`}
          >
            <Ionicons 
              name="notifications-outline" 
              size={24} 
              color={currentTheme === "dark" ? "#fff" : "#6b7280"} 
            />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={currentTheme === "dark" ? ['#1F2937', '#111827'] : ['#4F46E5', '#6366F1']}
          className="mx-6 mt-6 rounded-3xl p-6 shadow-xl overflow-hidden"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center space-x-2 mb-2">
                <View className="w-2 h-2 rounded-full bg-white/30" />
                <Text className="text-sm font-pregular text-white/80">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                </Text>
              </View>
              <Text className="text-3xl font-pbold text-white">
                Welcome back! 👋
              </Text>
              <Text className="text-base text-white/80 font-pregular mt-2">
                Ready to learn something new today?
              </Text>
            </View>
            <View className="relative">
              <View className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <Image
                source={{
                  uri: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-credit-card-payment-flatart-icons-outline-flatarticons.png",
                }}
                className="w-24 h-24 opacity-90"
              />
            </View>
          </View>
          <View className="absolute -bottom-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        </LinearGradient>

        {/* Division Card */}
        <Animated.View 
          style={{ transform: [{ scale: scaleAnim }] }}
          className={`mx-6 mt-6 p-5 rounded-2xl ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className={`text-base font-psemibold ${currentTheme === "dark" ? "text-gray-200" : "text-gray-700"}`}>
                My Division
              </Text>
              <View className="flex-row items-center mt-1 space-x-2">
                <Text className={`text-2xl font-pbold ${currentTheme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
                  Diamond
                </Text>
                <View className={`px-2 py-0.5 rounded-md ${currentTheme === "dark" ? "bg-yellow-400/20" : "bg-yellow-100"}`}>
                  <Text className={`text-sm font-pbold ${currentTheme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
                    III
                  </Text>
                </View>
              </View>
            </View>
            <View className={`p-3 rounded-xl ${currentTheme === "dark" ? "bg-gray-700" : "bg-yellow-50"}`}>
              <MaterialIcons
                name="military-tech"
                size={28}
                color={currentTheme === "dark" ? "#FCD34D" : "#D97706"}
              />
            </View>
          </View>
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <View className={`w-2 h-2 rounded-full ${currentTheme === "dark" ? "bg-yellow-400" : "bg-yellow-500"}`} />
              <Text className={`text-sm font-pregular ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                250 points to next division
              </Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Text className={`text-sm font-pbold ${currentTheme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
                1750
              </Text>
              <Text className={`text-sm font-pregular ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                / 2000
              </Text>
            </View>
          </View>
          <View className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: "87.5%",
                backgroundColor: currentTheme === "dark" ? "#FCD34D" : "#D97706",
              }}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View className="mt-8 px-6">
          <Text className={`text-lg font-pbold mb-4 ${currentTheme === "dark" ? "text-white" : "text-gray-800"}`}>
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            {[
              {
                label: "Exam",
                icon: "tasks",
                bg: currentTheme === "dark" ? "#7c3aed" : "#7c3aed",
                color: "#ffffff",
              },
              {
                label: "News",
                icon: "newspaper",
                bg: currentTheme === "dark" ? "#3b82f6" : "#3b82f6",
                color: "#ffffff",
              },
              {
                label: "Search",
                icon: "search",
                bg: currentTheme === "dark" ? "#f59e0b" : "#facc15",
                color: "#ffffff",
              },
              {
                label: "Customize",
                icon: "tools",
                bg: currentTheme === "dark" ? "#10b981" : "#10b981",
                color: "#ffffff",
              },
            ].map((item, index) => (
              <View key={index} className="items-center">
                <Pressable
                  onPress={() => {
                    switch (item.label) {
                      case "Customize":
                        router.push("/student/Game");
                        break;
                      case "Exam":
                        router.push("/student/Exam");
                        break;
                      case "News":
                        router.push("/student/(tabs)/Blog");
                        break;
                      case "Search":
                        router.push("/student/SearchScreen");
                        break;
                      default:
                        break;
                    }
                  }}
                  className="active:scale-95">
                  <View
                    className="p-4 w-16 h-16 justify-center items-center rounded-2xl mb-2 shadow-lg"
                    style={{
                      backgroundColor: item.bg,
                    }}>
                    <FontAwesome5
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                </Pressable>
                <Text className={`text-xs font-pmedium ${currentTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Tasks Section */}
        <View className="mt-8 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-pbold ${currentTheme === "dark" ? "text-white" : "text-gray-800"}`}>
              Daily Tasks
            </Text>
            <TouchableOpacity>
              <Text className={`text-sm font-pmedium ${currentTheme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {[
            {
              subject: "Chemistry",
              task: "Complete 15 questions",
              progress: 60,
              dueDate: "Nov 14",
              color: currentTheme === "dark" ? "#A78BFA" : "#7C3AED"
            },
            {
              subject: "Biology",
              task: "Complete 15 questions",
              progress: 40,
              dueDate: "Nov 12",
              color: currentTheme === "dark" ? "#34D399" : "#10B981"
            },
            {
              subject: "Mathematics",
              task: "Complete 15 questions",
              progress: 80,
              dueDate: "Nov 13",
              color: currentTheme === "dark" ? "#60A5FA" : "#3B82F6"
            },
          ].map((task, index) => (
            <View
              key={index}
              className={`p-4 rounded-2xl mb-3 ${currentTheme === "dark" ? "bg-gray-800" : "bg-white"} shadow-sm`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className={`text-base font-psemibold ${currentTheme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {task.subject}
                </Text>
                <Text className={`text-sm font-pregular ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Due {task.dueDate}
                </Text>
              </View>
              <Text className={`text-sm font-pregular mb-3 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {task.task}
              </Text>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: task.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}