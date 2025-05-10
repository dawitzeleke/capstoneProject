import { View, FlatList, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import ChatBubble from "../../../components/ChatBubble";
import { useSelector } from "react-redux";

const messages = [
  {
    id: "1",
    message:
      "Student Tamiru has taken the lead of Rank #1 doing a total of 200 questions this month. Congratulations Tamiru!",
    sender: "FunIQ Team",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    time: "1h ago",
  },
  {
    id: "2",
    message: "Take part in my latest contest...",
    sender: "Birhanu Temesgen",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    time: "2h ago",
    image: "https://picsum.photos/500/300",
  },
  {
    id: "3",
    message: "Here's a brief video overview of the new module.",
    sender: "Instructor",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    video: "https://www.w3schools.com/html/movie.mp4",
    time: "3h ago",
  },
];

const Blog = () => {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";

  return (
    <View
      className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      {/* Header */}
      <View className="flex-row justify-end items-center px-5 pt-6 pb-3">
        <TouchableOpacity
          className={`p-3 rounded-full shadow-md ${
            isDark ? "bg-gray-800" : "bg-[#4F46E5]"
          }`}
          onPress={() => router.push("/student/SearchScreen")}>
          <AntDesign
            name="search1"
            size={20}
            color={isDark ? "#e5e5e5" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Message Feed */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item.message}
            sender={item.sender}
            avatar={item.avatar}
            time={item.time}
            image={item.image}
            video={item.video}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Blog;
