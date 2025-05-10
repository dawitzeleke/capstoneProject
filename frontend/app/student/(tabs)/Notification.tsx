import React, { useState } from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

interface Notification {
  id: string;
  user: string;
  message: string;
  time: string;
  date: string;
  avatar: string;
  isRead: boolean;
}

const NotificationScreen = () => {
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      user: "Hannah Emma",
      message: "Created an article to your page, confirm you’re the...",
      time: "1 day ago",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      isRead: false,
    },
    {
      id: "2",
      user: "Isaac Joanne",
      message: "Sent you a friend request.",
      time: "2 days ago - 05:00 PM",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      isRead: false,
    },
    {
      id: "3",
      user: "Thomas Black",
      message: "You have a new friend suggestion - Accept / Decline",
      time: "3 days ago - 08:30 AM",
      date: "November 26, 2020",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      isRead: true,
    },
    {
      id: "4",
      user: "Stephen",
      message: "Has a new post: 'Lorem Ipsum is simply dummy text...'",
      time: "4 days ago - 05:00 PM",
      date: "November 25, 2020",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      isRead: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View
      className={`w-[94%] self-center p-5 mb-4 rounded-2xl border shadow-xl ${
        currentTheme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <View className="flex-row items-center space-x-4">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1">
          <Text
            className={`font-psemibold text-base ${
              currentTheme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {item.user}
          </Text>
          <Text
            className={`font-pregular text-sm ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {item.message}
          </Text>
          <Text
            className={`text-xs mt-1 font-pextralight ${
              currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {item.time}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${
        currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"
      }`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-3">
        <Pressable>
          <Ionicons
            name="arrow-back"
            size={24}
            color={currentTheme === "dark" ? "white" : "black"}
          />
        </Pressable>
        <Text
          className={`text-lg font-psemibold ${
            currentTheme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Notification
        </Text>
        <Pressable onPress={markAllAsRead}>
          <Text
            className={`text-sm font-pregular ${
              currentTheme === "dark" ? "text-blue-400" : "text-indigo-600"
            }`}
          >
            Mark All as Read
          </Text>
        </Pressable>
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListFooterComponent={<View className="h-5" />}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
  