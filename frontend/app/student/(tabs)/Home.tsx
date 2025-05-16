import React from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Home() {
  function handleCustomize() {
    throw new Error("Function not implemented.");
  }
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f1f3fc]">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-4 mt-2">
          <View className="flex-row items-center space-x-2">
            <View className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
            <Text className="text-sm font-psemibold text-indigo-600">
              Cognify
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/student/(tabs)/Notification")}>
            <Ionicons name="notifications-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Promo Card */}
        <View className="mx-4 mt-4 bg-[#4F46E5] rounded-xl p-4 flex-row items-center justify-between">
          <View>
            <Text className="text-base font-pregular text-white">
              Mon, 19 2025
            </Text>
            <Text className="text-3xl font-pbold text-white mt-1">
              Hello user 👋
            </Text>
            <Text className="text-xs text-white font-pregular mt-1">
              happy session!
            </Text>
          </View>
          <Image
            source={{
              uri: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-credit-card-payment-flatart-icons-outline-flatarticons.png",
            }}
            className="w-16 h-16"
          />
        </View>

        {/* Points */}
        <View className="mx-4 mt-4 bg-white p-4 rounded-xl border border-gray-200 flex-row justify-between items-center shadow-sm">
          <Text className="text-base font-psemibold text-gray-700">
            My Points
          </Text>
          <View className="flex-row items-center space-x-1">
            <Text className="text-xl font-pbold text-purple-800">380</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#6b7280"
            />
          </View>
        </View>

        {/* Service Options */}
        <View className="flex-row justify-around mt-6 px-2">
          {[
            {
              label: "Exam",
              icon: "tasks", // 🗒️ Task list with checkboxes
              bg: "#7c3aed",
              color: "#f3e8ff",
            },
            {
              label: "News",
              icon: "newspaper", // Represents news/articles
              bg: "#3b82f6", // Blue
              color: "#dbeafe",
            },
            {
              label: "Search",
              icon: "search", // Search icon
              bg: "#facc15", // Yellow
              color: "#ffffff",
            },
            {
              label: "Customize",
              icon: "tools", // Represents customization
              bg: "#10b981",
              color: "#d1fae5",
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
                      router.push("../CreateExam");
                      break;
                    case "News":
                      router.push("../(tabs)/Blog");
                      break;
                    case "Search":
                      router.push("/student/SearchScreen");
                      break;
                    default:
                      break;
                  }
                }}>
                <View
                  className="p-4 w-14 justify-center items-center drop-shadow-md rounded-full mb-2"
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
              <Text className="text-xs font-pmedium text-gray-700">
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* My Package Section */}
        <View className="mt-6 px-4">
          <Text className="text-base font-pbold text-gray-800 mb-2">
            Daily Tasks
          </Text>

          {/* Package Card 1 */}
          <View className="flex-row shadow-lg justify-between items-center p-4 bg-white rounded-lg mb-2">
            <View>
              <Text className="text-sm font-psemibold text-purple-800">
                Chemistry
              </Text>
              <Text className="text-xs font-pregular text-gray-500">
                Do 15 questions
              </Text>
            </View>
            <Text className="text-xs font-pregular text-gray-500">
              est. Nov 14
            </Text>
          </View>

          {/* Package Card 2 */}
          <View className="flex-row shadow-lg justify-between items-center p-4 bg-white rounded-lg mb-2">
            <View>
              <Text className="text-sm font-psemibold text-green-800">
                Biology
              </Text>
              <Text className="text-xs font-pregular text-gray-500">
                Do 15 questions
              </Text>
            </View>
            <Text className="text-xs font-pregular text-gray-500">
              est. Nov 12
            </Text>
          </View>

          {/* Package Card 3 */}
          <View className="flex-row shadow-lg justify-between items-center p-4 bg-white rounded-lg mb-2">
            <View>
              <Text className="text-sm font-psemibold text-blue-800">Math</Text>
              <Text className="text-xs font-pregular text-gray-500">
                Do 15 questionsy
              </Text>
            </View>
            <Text className="text-xs font-pregular text-gray-500">
              est. Nov 13
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
