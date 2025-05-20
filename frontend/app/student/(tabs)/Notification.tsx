import React, { useState } from "react";
import { View, Text, FlatList, Image, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";

interface Notification {
  id: string;
  user: string;
  message: string;
  time: string;
  date: string;
  avatar: string;
  isRead: boolean;
  type: "exam" | "friend" | "content" | "system";
}

const NotificationScreen = () => {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      user: "Hannah Emma",
      message: "Created a new exam: Biology Quiz 3",
      time: "1 hour ago",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      isRead: false,
      type: "exam",
    },
    {
      id: "2",
      user: "Isaac Joanne",
      message: "Sent you a friend request",
      time: "2 hours ago",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      isRead: false,
      type: "friend",
    },
    {
      id: "3",
      user: "Thomas Black",
      message: "Posted new content: Physics Formulas",
      time: "3 hours ago",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      isRead: true,
      type: "content",
    },
    {
      id: "4",
      user: "System",
      message: "Your exam results are ready",
      time: "4 hours ago",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      isRead: true,
      type: "system",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "exam":
        return <MaterialIcons name="assignment" size={24} color="#4F46E5" />;
      case "friend":
        return <MaterialIcons name="person-add" size={24} color="#10B981" />;
      case "content":
        return <MaterialIcons name="article" size={24} color="#F59E0B" />;
      case "system":
        return <MaterialIcons name="info" size={24} color="#6B7280" />;
    }
  };

  const filteredNotifications = activeFilter === "all" 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => {
        if (!item.isRead) {
          setNotifications(notifications.map(n => 
            n.id === item.id ? { ...n, isRead: true } : n
          ));
        }
      }}
      className={`w-[94%] self-center p-5 mb-3 rounded-xl ${
        currentTheme === "dark"
          ? item.isRead ? "bg-gray-800" : "bg-gray-700"
          : item.isRead ? "bg-white" : "bg-gray-50"
      } shadow-sm`}
    >
      <View className="flex-row items-start space-x-4">
        <View className={`p-3 mr-4 rounded-lg ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}>
          {getNotificationIcon(item.type)}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className={`font-psemibold text-base ${
                currentTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {item.user}
            </Text>
            <Text
              className={`text-xs font-pregular ${
                currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {item.time}
            </Text>
          </View>
          <Text
            className={`font-pregular text-sm ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {item.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${
        currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"
      }`}
    >
      {/* Header */}
      <View className={`px-6 pt-6 pb-4 ${
        currentTheme === "dark" ? "bg-gray-900" : "bg-white"
      }`}>
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={currentTheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text
            className={`text-xl font-pbold ${
              currentTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Notifications
          </Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text
              className={`text-sm font-pmedium ${
                currentTheme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => setActiveFilter("all")}
            className={`flex-1 py-3 rounded-xl border ${
              activeFilter === "all"
                ? currentTheme === "dark"
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-indigo-600 bg-indigo-500/10"
                : currentTheme === "dark"
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-200/50"
            }`}
          >
            <Text
              className={`text-center font-psemibold ${
                activeFilter === "all"
                  ? currentTheme === "dark"
                    ? "text-indigo-400"
                    : "text-indigo-600"
                  : currentTheme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter("unread")}
            className={`flex-1 py-3 rounded-xl border ${
              activeFilter === "unread"
                ? currentTheme === "dark"
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-indigo-600 bg-indigo-500/10"
                : currentTheme === "dark"
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-200/50"
            }`}
          >
            <Text
              className={`text-center font-psemibold ${
                activeFilter === "unread"
                  ? currentTheme === "dark"
                    ? "text-indigo-400"
                    : "text-indigo-600"
                  : currentTheme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Unread
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10 px-6">
            <MaterialIcons
              name="notifications-off"
              size={48}
              color={currentTheme === "dark" ? "#4b5563" : "#9ca3af"}
            />
            <Text
              className={`text-center mt-4 text-base font-pmedium ${
                currentTheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No notifications found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
  