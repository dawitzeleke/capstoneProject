import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";
  const router = useRouter();

  return (
    <ScrollView className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      {/* Profile Header */}
      <LinearGradient
        colors={isDark ? ["#1F2937", "#111827"] : ["#4F46E5", "#6366F1"]}
        className="pt-12 pb-8 px-6"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="flex-row items-center justify-between mb-6">
          <Text
            className={`text-2xl font-pbold ${
              isDark ? "text-white" : "text-white"
            }`}>
            Profile
          </Text>
          <TouchableOpacity onPress={() => router.push("/student/Settings")}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <View className="relative">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              className="w-24 h-24 rounded-full border-4 border-white/20"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-white p-2 rounded-full">
              <Ionicons name="camera" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-2xl font-pbold text-white mb-1">
              John Doe
            </Text>
            <Text className="text-white/80 font-pregular">@johndoe</Text>
            <View className="flex-row items-center mt-2">
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white font-pmedium text-sm">
                  Diamond III
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View
        className={`mx-6 -mt-6 p-4 rounded-2xl ${
          isDark ? "bg-gray-900" : "bg-white"
        } shadow-lg`}>
        <View className="flex-row justify-between">
          <Link href="../FollowingList">
            <View className="items-center">
              <Text
                className={`text-xl font-pbold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                122
              </Text>
              <Text
                className={`text-sm font-pregular ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                Following
              </Text>
            </View>
          </Link>
          <View className="h-12 w-[1px] bg-gray-200" />
          <Link href="/student/(tabs)/SavedQuestions">
            <View className="items-center">
              <Text
                className={`text-xl font-pbold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                300
              </Text>
              <Text
                className={`text-sm font-pregular ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                Saved
              </Text>
            </View>
          </Link>
          <View className="h-12 w-[1px] bg-gray-200" />
          <View className="items-center">
            <Text
              className={`text-xl font-pbold ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
              1.2k
            </Text>
            <Text
              className={`text-sm font-pregular ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
              Points
            </Text>
          </View>
        </View>
      </View>

      {/* Dashboard Section */}
      <View className="px-6 mt-8">
        <Text
          className={`text-xl font-pbold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
          Dashboard
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {[
            {
              href: "/student/(tabs)/Progress",
              icon: <MaterialIcons name="insights" size={24} color="white" />,
              bg: isDark ? "bg-green-500" : "bg-purple-600",
              label: "Progress",
              stat: "+500",
            },
            {
              href: "/student/(tabs)/Leaderboard",
              icon: (
                <MaterialIcons name="leaderboard" size={24} color="white" />
              ),
              bg: isDark ? "bg-blue-500" : "bg-indigo-600",
              label: "Leader Board",
              stat: "+9k",
            },
            {
              href: "/student/(tabs)/Activity",
              icon: <FontAwesome5 name="running" size={24} color="white" />,
              bg: isDark ? "bg-yellow-500" : "bg-orange-500",
              label: "Activity",
              stat: "+28",
            },
            {
              href: "/student/(tabs)/QuestionsDone",
              icon: <FontAwesome5 name="tasks" size={24} color="white" />,
              bg: isDark ? "bg-red-500" : "bg-red-400",
              label: "Questions Done",
              stat: "+250",
            },
          ].map((card, index) => (
            <Link
              key={index}
              href={card.href as any}
              className={`w-[48%] mb-5 p-5 rounded-2xl ${
                isDark ? "bg-gray-900" : "bg-white"
              } shadow-lg`}>
              <View className="items-start">
                <View className={`p-3 rounded-xl mb-3 ${card.bg}`}>
                  {card.icon}
                </View>
                <Text
                  className={`text-2xl font-pbold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                  {card.stat}
                </Text>
                <Text
                  className={`text-sm font-pregular mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                  {card.label}
                </Text>
              </View>
            </Link>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-6 mt-4 mb-8">
        <Text
          className={`text-xl font-pbold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
          Recent Activity
        </Text>
        {[
          {
            icon: "check-circle",
            color: "#10B981",
            title: "Completed Chemistry Quiz",
            time: "2 hours ago",
          },
          {
            icon: "star",
            color: "#F59E0B",
            title: "Earned 50 points",
            time: "4 hours ago",
          },
          {
            icon: "trophy",
            color: "#6366F1",
            title: "Reached Diamond III",
            time: "1 day ago",
          },
        ].map((activity, index) => (
          <View
            key={index}
            className={`flex-row items-start p-4 mb-3 rounded-xl ${
              isDark ? "bg-gray-900" : "bg-white"
            } shadow-sm`}>
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: `${activity.color}20` }}>
              <FontAwesome5
                name={activity.icon}
                size={20}
                color={activity.color}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`font-pmedium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                {activity.title}
              </Text>
              <Text
                className={`text-sm font-pregular ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                {activity.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
