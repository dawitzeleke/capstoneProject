import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

const leaderboardData = [
  {
    id: "1",
    name: "Sebastian",
    score: 1124,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    trend: "up",
  },
  {
    id: "2",
    name: "Jason",
    score: 875,
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    trend: "up",
  },
  {
    id: "3",
    name: "Natalie",
    score: 774,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    trend: "up",
  },
  {
    id: "4",
    name: "Serenity",
    score: 723,
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    trend: "up",
  },
  {
    id: "5",
    name: "Hannah",
    score: 559,
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    trend: "up",
  },
];

const Leaderboard = () => {
  const [selectedTab, setSelectedTab] = useState("Region");

  return (
    <View className="flex-1 bg-[#101624] px-4 py-6 mt-4">
      <Link
        href="/student/(tabs)/Profile"
        className="text-lg text-blue-500 font-pregular">
        <Ionicons name="chevron-back" size={20} color="gray" />
      </Link>
      {/* 🔹 Header Section */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-2xl font-pbold">Leaderboard</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Tabs */}
      <View className="flex-row justify-around mb-8 bg-[#1A233A] p-2 rounded-full">
        {["Region", "National", "Global"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`py-2 px-6 rounded-full ${
              selectedTab === tab ? "bg-white" : "bg-transparent"
            }`}>
            <Text
              className={`text-sm font-psemibold ${
                selectedTab === tab ? "text-black" : "text-gray-400"
              }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Top 3 Users */}
      <View className="flex-row justify-center items-end mb-6">
        {/* Second Place */}
        <View className="items-center mx-4">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/9.jpg" }}
            className="w-16 h-16 rounded-full border-4 border-blue-500"
          />
          <Text className="text-white font-pbold mt-2">Jackson</Text>
          <Text className="text-blue-400 font-psemibold">1847</Text>
        </View>

        {/* First Place */}
        <View className="items-center mx-4 relative">
          {/* Crown Icon */}
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

          {/* Profile Image */}
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/8.jpg" }}
            className="w-20 h-20 rounded-full border-4 border-yellow-500 mt-3"
          />

          {/* Name & Score */}
          <Text className="text-yellow-400 font-pbold mt-2 text-lg">Eiden</Text>
          <Text className="text-yellow-400 font-psemibold text-lg">2430</Text>
        </View>

        {/* Third Place */}
        <View className="items-center mx-4">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/7.jpg" }}
            className="w-16 h-16 rounded-full border-4 border-green-500"
          />
          <Text className="text-white font-pbold mt-2">Emma Aria</Text>
          <Text className="text-green-400 font-psemibold">1674</Text>
        </View>
      </View>

      {/* Leaderboard List */}
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View className="flex-row justify-between items-center bg-[#1A233A] p-4 my-2 rounded-lg">
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.avatar }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View>
                <Text className="text-white font-psemibold">{item.name}</Text>
                <Text className="text-gray-400 text-lg">@username</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-white font-pbold mr-2">{item.score}</Text>
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
