import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Dashboard() {
  return (
    <View className="flex-1 bg-primary">
      {/* 🔵 Top Section */}
      <View className="bg-card py-8 px-6 rounded-b-3xl mt-4">
        <View className="flex-row items-center justify-between">
          {/* Profile Image */}
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            className="w-20 h-20 rounded-full"
          />

          {/* User Info */}
          <View className="flex-1 ml-4">
            <Text className="text-white text-lg font-bold">Username</Text>
            <Text className="text-gray-300 text-sm">Rank</Text>
          </View>

          {/* Settings Icon */}
          <Link
            href="../Settings"
            className="text-lg font-pregular text-blue-500">
            <Ionicons name="settings-outline" size={22} color="white" />
          </Link>
        </View>

        {/* Stats & Buttons */}
        <View className="flex-row mx-8 justify-between items-center mt-6">
          <Link href="../FollowingList" className="text-lg font-pregular">
            <View className="flex items-center">
              <FontAwesome5 name="user-friends" size={16} color="white" />
              <Text className="text-white text-lg font-bold">122</Text>
              <Text className="text-gray-300 text-xs">Following</Text>
            </View>
          </Link>
          <View className="flex items-center">
            <FontAwesome5 name="bookmark" size={16} color="white" />
            <Text className="text-white text-lg font-bold">300</Text>
            <Text className="text-gray-300 text-xs">Saved</Text>
          </View>
        </View>
      </View>

      <View className="p-6">
        <Text className="text-gray-400 text-xl mx-1 text-center font-bold mb-4">
          Dashboard
        </Text>

        {/* Grid Layout */}
        <View className="flex-row flex-wrap justify-between">
          {/* Card 1 */}
          <Link
            href="/student/(tabs)/Progress"
            className="w-[48%] bg-card p-5 rounded-2xl shadow-lg mb-4">
            <View className="flex justify-center items-center">
              <View className="bg-green-500 p-2 rounded-full">
                <MaterialIcons name="insights" size={28} color="white" />
              </View>
              <Text className="text-lg font-pbold text-center mt-2 text-white">
                500+
              </Text>
              <Text className="text-gray-400 font-pregular text-center">
                Progress
              </Text>
            </View>
          </Link>

          {/* Card 2 */}
          <Link
            href="/student/(tabs)/Leaderboard"
            className="w-[48%] bg-card p-5 rounded-2xl shadow-lg  mb-4">
            <View className=" flex justify-center items-center">
              <View className="bg-blue-500 p-2 rounded-full">
                <MaterialIcons name="leaderboard" size={28} color="white" />
              </View>
              <Text className="text-lg font-pbold text-center mt-2 text-white">
                +9K Students
              </Text>
              <Text className="text-gray-400 font-pregular text-center">
                Leader Board
              </Text>
            </View>
          </Link>

          {/* Card 3 */}
          <Link
            href="/student/(tabs)/Activity"
            className="w-[48%] bg-card p-5 rounded-2xl shadow-lg mb-4">
            <View className="flex justify-center items-center">
              <View className="bg-yellow-500 p-2 rounded-full">
                <FontAwesome5 name="running" size={28} color="white" />
              </View>
              <Text className="text-lg font-pbold text-center mt-2 text-white">
                28+
              </Text>
              <Text className="text-gray-400 font-pregular text-center">
                Activity
              </Text>
            </View>
          </Link>

          {/* Card 4 */}
          <Link
            href="/student/(tabs)/QuestionsDone"
            className="w-[48%] bg-card p-5 rounded-2xl shadow-lg mb-4">
            <View className="flex justify-center items-center">
              <View className="bg-red-500 p-2 rounded-full">
                <FontAwesome5 name="tasks" size={28} color="white" />
              </View>
              <Text className="text-lg font-pbold text-center mt-2 text-white">
                8+
              </Text>
              <Text className="text-gray-400 font-pregular text-center">
                Questions Done
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </View>
  );
}
