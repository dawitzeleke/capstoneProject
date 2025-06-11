import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Pressable,
  Modal,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ChatBubble from "../../../components/ChatBubble";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { rehydrateApp } from "@/redux/rehydrate";
import { useState } from "react";

const messages = [
  {
    id: "1",
    message:
      "Student Tamiru has taken the lead of Rank #1 doing a total of 200 questions this month. Congratulations Tamiru! 🎉",
    sender: "FunIQ Team",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    time: "1h ago",
    likes: 45,
    comments: 12,
    reposts: 5,
  },
  {
    id: "2",
    message: "Take part in my latest contest...",
    sender: "Birhanu Temesgen",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    time: "2h ago",
    image: "https://picsum.photos/500/300",
    likes: 23,
    comments: 8,
    reposts: 3,
  },
  {
    id: "3",
    message: "Here's a brief video overview of the new module.",
    sender: "Instructor",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    video: "https://www.w3schools.com/html/movie.mp4",
    time: "3h ago",
    likes: 67,
    comments: 15,
    reposts: 9,
  },
];

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await rehydrateApp(dispatch);
      } catch (e) {
        console.error("Rehydrate failed:", e);
      }
    };

    prepareApp();
  }, []);
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === "dark";
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showReportCategories, setShowReportCategories] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const reportCategories = [
    { id: 1, title: "Subject Irrelevant", icon: "close-circle-outline" },
    { id: 2, title: "Incorrect Information", icon: "alert-circle-outline" },
    { id: 3, title: "Non-Educational", icon: "school-outline" },
    { id: 4, title: "Spam", icon: "mail-unread-outline" },
    { id: 5, title: "Inappropriate Content", icon: "warning-outline" },
  ];

  const handleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleOptionsPress = (postId: string) => {
    setSelectedPost(postId);
    setShowOptionsModal(true);
    setShowReportCategories(false);
  };

  const handleReport = () => {
    setShowReportCategories(true);
  };

  const handleReportCategory = (categoryId: number) => {
    // Handle report submission here
    setShowOptionsModal(false);
    setShowReportCategories(false);
    setSelectedPost(null);
  };

  const renderPostActions = (post: (typeof messages)[0]) => (
    <View className="flex-row items-center justify-between mt-3 px-2">
      <Pressable
        onPress={() => handleLike(post.id)}
        className="flex-row items-center space-x-1">
        <AntDesign
          name={likedPosts.includes(post.id) ? "heart" : "hearto"}
          size={20}
          color={
            likedPosts.includes(post.id)
              ? "#ef4444"
              : isDark
              ? "#e5e5e5"
              : "#64748b"
          }
        />
        <Text
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
        </Text>
      </Pressable>

      <Pressable className="flex-row items-center space-x-1">
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={isDark ? "#e5e5e5" : "#64748b"}
        />
        <Text
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {post.comments}
        </Text>
      </Pressable>

      <Pressable className="flex-row items-center space-x-1">
        <MaterialIcons
          name="repeat"
          size={20}
          color={isDark ? "#e5e5e5" : "#64748b"}
        />
        <Text
          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {post.reposts}
        </Text>
      </Pressable>

      <Pressable>
        <Ionicons
          name="share-outline"
          size={20}
          color={isDark ? "#e5e5e5" : "#64748b"}
        />
      </Pressable>
    </View>
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-black" : "bg-[#f1f3fc]"}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-6 pb-3 border-b border-gray-200">
        <View className="flex-row items-center space-x-3">
          <Text
            className={`text-xl mt-2 font-pbold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
            Feed
          </Text>
        </View>
      </View>

      {/* Message Feed */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <View
              className={`h-[1px] ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
            />
            <View className="mb-4">
              <ChatBubble
                message={item.message}
                sender={item.sender}
                avatar={item.avatar}
                time={item.time}
                image={item.image}
                video={item.video}
                onOptionsPress={() => handleOptionsPress(item.id)}
              />
              {renderPostActions(item)}
            </View>
            <View
              className={`h-[1px] ${isDark ? "bg-gray-800" : "bg-gray-200"}`}
            />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowOptionsModal(false);
          setShowReportCategories(false);
        }}>
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => {
            setShowOptionsModal(false);
            setShowReportCategories(false);
          }}>
          <View
            className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-t-3xl`}>
            <View className="w-12 h-1 bg-gray-400 rounded-full self-center my-3" />

            {!showReportCategories ? (
              <Pressable
                onPress={handleReport}
                className="flex-row items-center px-6 py-4 border-b border-gray-200">
                <Ionicons
                  name="flag-outline"
                  size={24}
                  color="#ef4444"
                  className="mr-3"
                />
                <Text className="text-red-500 font-psemibold text-lg">
                  Report
                </Text>
              </Pressable>
            ) : (
              <View>
                <Text
                  className={`text-center font-pmedium text-lg mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}>
                  Why are you reporting this?
                </Text>
                {reportCategories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => handleReportCategory(category.id)}
                    className="flex-row items-center px-6 py-4 border-b border-gray-200">
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={isDark ? "#e5e5e5" : "#64748b"}
                      className="mr-3"
                    />
                    <Text
                      className={`font-pmedium text-base ${
                        isDark ? "text-gray-300" : "text-gray-800"
                      }`}>
                      {category.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Pressable
              onPress={() => {
                setShowOptionsModal(false);
                setShowReportCategories(false);
              }}
              className="p-4">
              <Text
                className={`text-center font-pmedium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Home;
