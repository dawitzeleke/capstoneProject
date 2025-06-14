import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, ScrollView } from "react-native";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import httpRequest from "@/util/httpRequest";
import { getUserData } from "@/scripts/storage";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

type StudentRank = {
  id: string;
  name: string;
  score: number;
  trend: "up" | "down";
  avatar: string;
  division: string;
  username: string;
  rank?: number;
};

const Leaderboard = () => {
  const theme = useSelector((state: any) => state.theme.mode);
  const isDark = theme === "dark";
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<StudentRank[]>([]);
  const [userRank, setUserRank] = useState<StudentRank>({
    id: "",
    name: "You",
    score: 0,
    trend: "up",
    avatar: "",
    division: "Bronze",
    username: "",
    rank: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const userData = await getUserData();
        if (!userData?.token) {
          console.error("No user token found");
          return;
        }

        // Fetch top 3 students
        const topThreeResponse = await httpRequest(
          "/students/rank",
          {},
          "GET",
          userData.token
        );

        // Fetch rest of the students
        const restResponse = await httpRequest(
          "/students/leader-students",
          {},
          "GET",
          userData.token
        );

        if (topThreeResponse?.data && restResponse?.data) {
          // Transform the top 3 data
          const topThreeData = topThreeResponse.data.map((student: any, index: number) => ({
            id: student.id,
            name: student.name || `${student.firstName} ${student.lastName}`,
            score: student.score || 0,
            trend: student.trend || "up",
            avatar: student.avatar || student.profilePictureUrl || "",
            division: student.division || "Bronze",
            username: student.username || student.name?.toLowerCase().replace(" ", "") || "",
            rank: index + 1
          }));

          // Transform the rest of the students data
          const restData = restResponse.data.map((student: any, index: number) => ({
            id: student.id,
            name: student.name || `${student.firstName} ${student.lastName}`,
            score: student.score || 0,
            trend: student.trend || "up",
            avatar: student.avatar || student.profilePictureUrl || "",
            division: student.division || "Bronze",
            username: student.username || student.name?.toLowerCase().replace(" ", "") || "",
            rank: index + 4
          }));

          // Combine both datasets
          const allData = [...topThreeData, ...restData];
          setLeaderboardData(allData);

          // Find the current user's rank
          const currentUser = allData.find((student: StudentRank) => student.id === userData.id);
          if (currentUser) {
            setUserRank({
              ...currentUser,
              rank: allData.findIndex((student: StudentRank) => student.id === userData.id) + 1
            });
          }
        }
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

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

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-[#f1f3fc]"}`}>
        <View className="flex-1 items-center justify-center">
          <Text className={`text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
            Loading leaderboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-[#f1f3fc]"}`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4">
          <Text className={`text-2xl font-pbold ${isDark ? "text-white" : "text-gray-800"}`}>
            Leaderboard
          </Text>
          <Text className={`text-base mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Top performers this week
          </Text>
        </View>

        {/* Top 3 Podium */}
        <View className="mt-6 px-6">
          <View className="flex-row justify-between items-end h-48">
            {/* Second Place */}
            <View className="items-center flex-1">
              <View className="w-20 h-20 rounded-full border-2 border-gray-300 mb-2 overflow-hidden">
                {leaderboardData[1]?.avatar ? (
                  <Image
                    source={{ uri: leaderboardData[1].avatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full bg-indigo-100 items-center justify-center">
                    <Ionicons name="person" size={30} color="#4F46E5" />
                  </View>
                )}
              </View>
              <View className="bg-gray-200 w-20 h-24 rounded-t-xl items-center justify-end pb-2">
                <Text className="text-lg font-pbold text-gray-600">2</Text>
              </View>
              <Text className="mt-2 font-pmedium text-gray-600" numberOfLines={1}>
                {leaderboardData[1]?.name || "No data"}
              </Text>
              <Text className="text-sm text-gray-500">
                {leaderboardData[1]?.score || 0} pts
              </Text>
            </View>

            {/* First Place */}
            <View className="items-center flex-1">
              <View className="w-24 h-24 rounded-full border-2 border-yellow-400 mb-2 overflow-hidden">
                {leaderboardData[0]?.avatar ? (
                  <Image
                    source={{ uri: leaderboardData[0].avatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full bg-indigo-100 items-center justify-center">
                    <Ionicons name="person" size={36} color="#4F46E5" />
                  </View>
                )}
              </View>
              <View className="bg-yellow-400 w-20 h-32 rounded-t-xl items-center justify-end pb-2">
                <Text className="text-lg font-pbold text-white">1</Text>
              </View>
              <Text className="mt-2 font-pmedium text-gray-800" numberOfLines={1}>
                {leaderboardData[0]?.name || "No data"}
              </Text>
              <Text className="text-sm text-gray-600">
                {leaderboardData[0]?.score || 0} pts
              </Text>
            </View>

            {/* Third Place */}
            <View className="items-center flex-1">
              <View className="w-20 h-20 rounded-full border-2 border-amber-600 mb-2 overflow-hidden">
                {leaderboardData[2]?.avatar ? (
                  <Image
                    source={{ uri: leaderboardData[2].avatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full bg-indigo-100 items-center justify-center">
                    <Ionicons name="person" size={30} color="#4F46E5" />
                  </View>
                )}
              </View>
              <View className="bg-amber-600 w-20 h-20 rounded-t-xl items-center justify-end pb-2">
                <Text className="text-lg font-pbold text-white">3</Text>
              </View>
              <Text className="mt-2 font-pmedium text-gray-600" numberOfLines={1}>
                {leaderboardData[2]?.name || "No data"}
              </Text>
              <Text className="text-sm text-gray-500">
                {leaderboardData[2]?.score || 0} pts
              </Text>
            </View>
          </View>
        </View>

        {/* Current User Rank */}
        <View className={`mt-6 mx-6 p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <Text className="text-lg font-pbold text-gray-400">#{userRank.rank}</Text>
              <View className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden">
                {userRank.avatar ? (
                  <Image
                    source={{ uri: userRank.avatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full bg-indigo-100 items-center justify-center">
                    <Ionicons name="person" size={24} color="#4F46E5" />
                  </View>
                )}
              </View>
              <View>
                <Text className={`font-pmedium ${isDark ? "text-white" : "text-gray-800"}`}>
                  {userRank.name}
                </Text>
                <Text className="text-sm text-gray-500">{userRank.division}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className={`font-pbold ${isDark ? "text-white" : "text-gray-800"}`}>
                {userRank.score} pts
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name={userRank.trend === "up" ? "trending-up" : "trending-down"}
                  size={16}
                  color={userRank.trend === "up" ? "#10B981" : "#EF4444"}
                />
                <Text
                  className={`text-sm ml-1 ${
                    userRank.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {userRank.trend === "up" ? "Rising" : "Falling"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rest of Rankings */}
        <View className="mt-6 px-6">
          <Text className={`text-lg font-pbold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
            All Rankings
          </Text>
          {leaderboardData.slice(3).map((student, index) => (
            <View
              key={student.id}
              className={`flex-row items-center justify-between py-3 ${
                index !== leaderboardData.length - 4 ? "border-b border-gray-200" : ""
              }`}
            >
              <View className="flex-row items-center space-x-3">
                <Text className="text-lg font-pbold text-gray-400">#{student.rank}</Text>
                <View className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden">
                  {student.avatar ? (
                    <Image
                      source={{ uri: student.avatar }}
                      className="w-full h-full"
                    />
                  ) : (
                    <View className="w-full h-full bg-indigo-100 items-center justify-center">
                      <Ionicons name="person" size={20} color="#4F46E5" />
                    </View>
                  )}
                </View>
                <View>
                  <Text className={`font-pmedium ${isDark ? "text-white" : "text-gray-800"}`}>
                    {student.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{student.division}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`font-pbold ${isDark ? "text-white" : "text-gray-800"}`}>
                  {student.score} pts
                </Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name={student.trend === "up" ? "trending-up" : "trending-down"}
                    size={16}
                    color={student.trend === "up" ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    className={`text-sm ml-1 ${
                      student.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {student.trend === "up" ? "Rising" : "Falling"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;
