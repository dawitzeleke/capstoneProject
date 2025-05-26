import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, ScrollView } from "react-native";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const screenWidth = Dimensions.get("window").width;

const leaderboardData = [
  {
    id: "1",
    name: "Lucas Gray",
    score: 1570,
    trend: "up",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    division: "Gold",
  },
  {
    id: "2",
    name: "Ava Smith",
    score: 1462,
    trend: "up",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    division: "Silver",
  },
  {
    id: "3",
    name: "Liam Brown",
    score: 1418,
    trend: "down",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    division: "Silver",
  },
  {
    id: "4",
    name: "Sophia Johnson",
    score: 1384,
    trend: "up",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    division: "Bronze",
  },
  {
    id: "5",
    name: "Noah Davis",
    score: 1325,
    trend: "down",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    division: "Bronze",
  },
];

const Leaderboard = () => {
  const theme = useSelector((state: any) => state.theme.mode);
  const isDark = theme === "dark";
  const router = useRouter();
  const [userRank, setUserRank] = useState({
    rank: 8,
    score: 85,
    trend: "up",
    division: "Platinum",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    username: "yourusername"
  });

  const getDivisionColor = (division: string) => {
    switch (division) {
      case "Gold":
        return "#FCD34D";
      case "Silver":
        return "#94A3B8";
      case "Bronze":
        return "#B45309";
      case "Platinum":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const formatScore = (score: number) => `${score}%`;

  return (
    <View className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      {/* Header */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? "white" : "#4F46E5"} />
          </TouchableOpacity>
          <Text className={`text-2xl font-pbold ${isDark ? "text-white" : "text-gray-900"}`}>
            Leaderboard
          </Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg">
            <Entypo name="dots-three-vertical" size={24} color={isDark ? "white" : "#4F46E5"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Top 3 Users */}
        <View className="px-4 mt-4">
          <View className={`rounded-3xl p-6 border shadow-xl ${
            isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-white border-gray-200"
          }`}>
            <Text className={`text-xl font-pbold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Top Performers
            </Text>
            <View className="flex-row justify-center items-end mb-4">
              {/* Second Place */}
              <View className="items-center mx-2">
                <View className="relative">
                  <Image
                    source={{ uri: "https://randomuser.me/api/portraits/men/9.jpg" }}
                    className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-lg"
                  />
                  <View className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-8 h-8 items-center justify-center shadow-lg">
                    <Text className="text-white font-pbold">2</Text>
                  </View>
                </View>
                <View className="items-center mt-3">
                  <Text className={`font-pbold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Jackson
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-blue-400 font-psemibold">92%</Text>
                    <Ionicons name="arrow-up" size={16} color="#10B981" style={{ marginLeft: 4 }} />
                  </View>
                  <View className="mt-2 px-2 py-0.5 rounded-full bg-blue-500/10 self-start">
                    <Text className="text-blue-400 text-xs">Gold Division</Text>
                  </View>
                  <Text className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    @jackson
                  </Text>
                </View>
              </View>

              {/* First Place */}
              <View className="items-center mx-2">
                <View className="relative">
                  <MaterialIcons
                    name="stars"
                    size={32}
                    color="#FCD34D"
                    style={{ position: 'absolute', top: -16, left: '50%', transform: [{ translateX: -16 }] }}
                  />
                  <Image
                    source={{ uri: "https://randomuser.me/api/portraits/men/8.jpg" }}
                    className="w-24 h-24 rounded-full border-4 border-yellow-500 shadow-lg"
                  />
                  <View className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-8 h-8 items-center justify-center shadow-lg">
                    <Text className="text-white font-pbold">1</Text>
                  </View>
                </View>
                <View className="items-center mt-3">
                  <Text className="text-yellow-400 font-pbold text-lg">Eiden</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-yellow-400 font-psemibold text-lg">98%</Text>
                    <Ionicons name="arrow-up" size={16} color="#10B981" style={{ marginLeft: 4 }} />
                  </View>
                  <View className="mt-2 px-2 py-0.5 rounded-full bg-yellow-500/10 self-start">
                    <Text className="text-yellow-400 text-xs">Master Division</Text>
                  </View>
                  <Text className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    @eiden
                  </Text>
                </View>
              </View>

              {/* Third Place */}
              <View className="items-center mx-2">
                <View className="relative">
                  <Image
                    source={{ uri: "https://randomuser.me/api/portraits/women/7.jpg" }}
                    className="w-20 h-20 rounded-full border-4 border-green-500 shadow-lg"
                  />
                  <View className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 items-center justify-center shadow-lg">
                    <Text className="text-white font-pbold">3</Text>
                  </View>
                </View>
                <View className="items-center mt-3">
                  <Text className={`font-pbold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Emma Aria
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-green-400 font-psemibold">89%</Text>
                    <Ionicons name="arrow-up" size={16} color="#10B981" style={{ marginLeft: 4 }} />
                  </View>
                  <View className="mt-2 px-2 py-0.5 rounded-full bg-green-500/10 self-start">
                    <Text className="text-green-400 text-xs">Gold Division</Text>
                  </View>
                  <Text className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    @emmaaria
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Your Rank */}
          <View className={`rounded-3xl p-6 mt-4 border shadow-xl ${
            isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-white border-gray-200"
          }`}>
            <Text className={`text-xl font-pbold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Your Rank
            </Text>
            <View className={`flex-row justify-between items-center p-4 rounded-2xl ${
              isDark ? "bg-neutral-900" : "bg-gray-50"
            }`}>
              <View className="flex-row items-center">
                <Text className={`font-pbold mr-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  #{userRank.rank}
                </Text>
                <Image
                  source={{ uri: userRank.avatar }}
                  className="w-12 h-12 rounded-full mr-3 shadow-md"
                />
                <View>
                  <Text className={`font-psemibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    You
                  </Text>
                  <View className="mt-1">
                    <View className="px-2 py-0.5 rounded-full self-start" style={{ backgroundColor: `${getDivisionColor(userRank.division)}20` }}>
                      <Text 
                        className="text-xs"
                        style={{ color: getDivisionColor(userRank.division) }}
                      >
                        {userRank.division}
                      </Text>
                    </View>
                    <Text className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      @{userRank.username}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className={`font-pbold mr-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {formatScore(userRank.score)}
                </Text>
                <Ionicons
                  name={userRank.trend === "up" ? "arrow-up" : "arrow-down"}
                  size={16}
                  color={userRank.trend === "up" ? "#10B981" : "#EF4444"}
                />
              </View>
            </View>
          </View>

          {/* Leaderboard List */}
          <View className={`rounded-3xl p-6 mt-4 mb-4 border shadow-xl ${
            isDark ? "bg-neutral-800/50 border-neutral-700" : "bg-white border-gray-200"
          }`}>
            <Text className={`text-xl font-pbold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
              Rankings
            </Text>
            <FlatList
              data={leaderboardData}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View className={`flex-row justify-between items-center p-4 rounded-2xl mb-3 ${
                  isDark ? "bg-neutral-900" : "bg-gray-50"
                }`}>
                  <View className="flex-row items-center">
                    <Text className={`font-pbold mr-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      #{index + 4}
                    </Text>
                    <Image
                      source={{ uri: item.avatar }}
                      className="w-12 h-12 rounded-full mr-3 shadow-md"
                    />
                    <View>
                      <Text className={`font-psemibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {item.name}
                      </Text>
                      <View className="mt-1">
                        <View className="px-2 py-0.5 rounded-full self-start" style={{ backgroundColor: `${getDivisionColor(item.division)}20` }}>
                          <Text 
                            className="text-xs"
                            style={{ color: getDivisionColor(item.division) }}
                          >
                            {item.division}
                          </Text>
                        </View>
                        <Text className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          @{item.name.toLowerCase().replace(" ", "")}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className={`font-pbold mr-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {formatScore(Math.floor(item.score / 25))}
                    </Text>
                    <Ionicons
                      name={item.trend === "up" ? "arrow-up" : "arrow-down"}
                      size={16}
                      color={item.trend === "up" ? "#10B981" : "#EF4444"}
                    />
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Leaderboard;
