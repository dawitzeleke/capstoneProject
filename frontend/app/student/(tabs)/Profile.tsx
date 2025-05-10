import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";

  return (
    <View className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      {/* 🔵 Top Section */}
      <View
        className={`py-8 px-12 mt-4 mx-6 shadow-lg rounded-3xl ${
          isDark
            ? "bg-neutral-900 border-b border-neutral-800"
            : "bg-white border-b border-gray-500"
        }`}>
        <View className="flex-row items-center justify-between">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            className="w-20 h-20 rounded-full border-2 border-white"
          />

          <View className="flex-1 ml-4">
            <Text
              className={`text-lg font-pbold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
              Username
            </Text>
            <Text
              className={`text-sm font-pregular ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}>
              Rank
            </Text>
          </View>

          <Link href="../Settings">
            <Ionicons
              name="settings-outline"
              size={22}
              color={isDark ? "white" : "#4F46E5"}
            />
          </Link>
        </View>

        <View className="flex-row mx-8 justify-between items-center mt-6">
          <Link href="../FollowingList">
            <View className="flex items-center">
              <FontAwesome5
                name="user-friends"
                size={28}
                color={isDark ? "white" : "#4F46E5"}
              />
              <Text
                className={`text-lg font-pbold ${
                  isDark ? "text-white" : "text-indigo-600"
                }`}>
                122
              </Text>
              <Text
                className={`text-sm font-pregular ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                Following
              </Text>
            </View>
          </Link>

          <Link href="/student/(tabs)/SavedQuestions">
            <View className="flex items-center">
              <FontAwesome5
                name="bookmark"
                size={28}
                color={isDark ? "white" : "#4F46E5"}
              />
              <Text
                className={`text-lg font-pbold ${
                  isDark ? "text-white" : "text-indigo-600"
                }`}>
                300
              </Text>
              <Text
                className={`text-sm font-pregular ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                Saved
              </Text>
            </View>
          </Link>
        </View>
      </View>

      {/* Dashboard Title */}
      <View className="px-6 py-6">
        <Text
          className={`text-2xl text-center font-pbold ${
            isDark ? "text-gray-300" : "text-gray-800"
          }`}>
          Dashboard
        </Text>
      </View>

      {/* Cards Grid */}
      <View className="flex-row flex-wrap justify-between px-6">
        {[
          {
            href: "/student/(tabs)/Progress",
            icon: <MaterialIcons name="insights" size={28} color="white" />,
            bg: isDark ? "bg-green-500" : "bg-purple-600",
            label: "Progress",
            stat: "+500",
          },
          {
            href: "/student/(tabs)/Leaderboard",
            icon: <MaterialIcons name="leaderboard" size={28} color="white" />,
            bg: isDark ? "bg-blue-500" : "bg-indigo-600",
            label: "Leader Board",
            stat: "+9k",
          },
          {
            href: "/student/(tabs)/Activity",
            icon: <FontAwesome5 name="running" size={28} color="white" />,
            bg: isDark ? "bg-yellow-500" : "bg-orange-500",
            label: "Activity",
            stat: "+28",
          },
          {
            href: "/student/(tabs)/QuestionsDone",
            icon: <FontAwesome5 name="tasks" size={28} color="white" />,
            bg: isDark ? "bg-red-500" : "bg-red-400",
            label: "Questions Done",
            stat: "+250",
          },
        ].map((card, index) => (
          <Link
            key={index}
            href={card.href as any}
            className={`w-[48%] mb-5 p-5 rounded-3xl transition-all duration-150 ${
              isDark
                ? "bg-neutral-800 border border-neutral-700 shadow-md"
                : "bg-white border border-gray-300 shadow-xl"
            }`}>
            <View className="flex justify-center items-center">
              <View
                className={`p-3 rounded-full mb-3 ${card.bg} shadow-md shadow-black/20`}>
                {card.icon}
              </View>
              <Text
                className={`text-2xl font-pbold tracking-wide ${
                  isDark ? "text-white" : "text-indigo-700"
                }`}>
                {card.stat}
              </Text>
              <Text
                className={`text-base font-pregular mt-1 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                {card.label}
              </Text>
            </View>
          </Link>
        ))}
      </View>
    </View>
  );
}
