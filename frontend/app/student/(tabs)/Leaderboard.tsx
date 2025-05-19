import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSelector } from "react-redux";

const leaderboardData = [
  {
    id: "1",
    name: "Lucas Gray",
    score: 1570,
    trend: "up",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "2",
    name: "Ava Smith",
    score: 1462,
    trend: "up",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: "3",
    name: "Liam Brown",
    score: 1418,
    trend: "down",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "4",
    name: "Sophia Johnson",
    score: 1384,
    trend: "up",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "5",
    name: "Noah Davis",
    score: 1325,
    trend: "down",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const Leaderboard = () => {
  const [selectedTab, setSelectedTab] = useState("Region");
  const theme = useSelector((state: any) => state.theme.mode);
  const isDark = theme === "dark";

  const bgColor = isDark ? "#000000" : "#f1f3fc";
  const cardColor = isDark ? "#1C1C1E" : "#f3f4f6";
  const textPrimary = isDark ? "#F3F4F6" : "#1f2937";
  const textSecondary = isDark ? "#9CA3AF" : "#6b7280";

  return (
    <View
      style={{ flex: 1 }}
      className={`px-4 py-6 ${isDark ? "bg-[#000000]" : "bg-[#f1f3fc]"}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Link href="/student/(tabs)/Profile" className="text-lg font-pregular">
          <Ionicons name="chevron-back" size={20} color={textSecondary} />
        </Link>
        <Text style={{ color: textPrimary }} className="text-2xl font-pbold">
          Leaderboard
        </Text>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={20} color={textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Top 3 Users */}
      <View className="flex-row justify-center items-end mb-6">
        {/* Second */}
        <View className="items-center mx-4">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/9.jpg" }}
            className="w-16 h-16 rounded-full border-4 border-blue-500"
          />
          <Text style={{ color: textPrimary }} className="font-pbold mt-2">
            Jackson
          </Text>
          <Text className="text-blue-400 font-psemibold">1847</Text>
        </View>

        {/* First */}
        <View className="items-center mx-4 relative">
          <Image
            source={require("../../../assets/images/crown.png")}
            className="absolute"
            style={{
              width: 30,
              height: 30,
              top: -20,
              left: "50%",
              transform: [{ translateX: -16 }],
            }}
          />
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/8.jpg" }}
            className="w-20 h-20 rounded-full border-4 border-yellow-500 mt-3"
          />
          <Text className="text-yellow-400 font-pbold mt-2 text-lg">Eiden</Text>
          <Text className="text-yellow-400 font-psemibold text-lg">2430</Text>
        </View>

        {/* Third */}
        <View className="items-center mx-4">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/7.jpg" }}
            className="w-16 h-16 rounded-full border-4 border-green-500"
          />
          <Text style={{ color: textPrimary }} className="font-pbold mt-2">
            Emma Aria
          </Text>
          <Text className="text-green-400 font-psemibold">1674</Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{ backgroundColor: cardColor }}
            className="flex-row justify-between items-center p-4 my-2 rounded-lg border border-neutral-700">
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.avatar }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View>
                <Text style={{ color: textPrimary }} className="font-psemibold">
                  {item.name}
                </Text>
                <Text style={{ color: textSecondary }} className="text-lg">
                  @username
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text style={{ color: textPrimary }} className="font-pbold mr-2">
                {item.score}
              </Text>
              <Ionicons
                name={item.trend === "up" ? "arrow-up" : "arrow-down"}
                size={16}
                color={item.trend === "up" ? "green" : "red"}
              />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Leaderboard;
