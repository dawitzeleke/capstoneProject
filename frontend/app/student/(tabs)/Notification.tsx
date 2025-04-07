import React, { useState } from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

interface Notification {
  id: string;
  user: string;
  message: string;
  time: string;
  date: string;
  avatar: string;
  isRead: boolean;
  bgColor: string;
}

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      user: "Hannah Emma",
      message: "Created an article to your page, confirm you’re the...",
      time: "1 day ago",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      isRead: false,
      bgColor: "bg-blue-100",
    },
    {
      id: "2",
      user: "Isaac Joanne",
      message: "Sent you a friend request.",
      time: "2 days ago - 05:00 PM",
      date: "Today",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      isRead: false,
      bgColor: "bg-blue-100",
    },
    {
      id: "3",
      user: "Thomas Black",
      message: "You have a new friend suggestion - Accept / Decline",
      time: "3 days ago - 08:30 AM",
      date: "November 26, 2020",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      isRead: true,
      bgColor: "bg-yellow-100",
    },
    {
      id: "4",
      user: "Stephen",
      message: "Has a new post: 'Lorem Ipsum is simply dummy text...'",
      time: "4 days ago - 05:00 PM",
      date: "November 25, 2020",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      isRead: true,
      bgColor: "bg-pink-100",
    },
    {
      id: "5",
      user: "Stephen",
      message: "Has a new post: 'Lorem Ipsum is simply dummy text...'",
      time: "4 days ago - 05:00 PM",
      date: "November 25, 2020",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      isRead: true,
      bgColor: "bg-pink-100",
    },
    {
      id: "6",
      user: "Stephen",
      message: "Has a new post: 'Lorem Ipsum is simply dummy text...'",
      time: "4 days ago - 05:00 PM",
      date: "November 25, 2020",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      isRead: true,
      bgColor: "bg-pink-100",
    },
    {
      id: "7",
      user: "Stephen",
      message: "Has a new post: 'Lorem Ipsum is simply dummy text...'",
      time: "4 days ago - 05:00 PM",
      date: "November 25, 2020",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      isRead: true,
      bgColor: "bg-pink-100",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <View className={`rounded-lg p-4 my-2 mx-4 bg-card`}>
      <View className="flex-row items-center space-x-3">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full mx-2"
        />
        <View className="flex-1">
          <Text className="font-psemibold text-gray-200">{item.user}</Text>
          <Text className="text-gray-400 font-pregular">{item.message}</Text>
          <Text className="text-gray-400 text-xs mt-1 font-pextralight">
            {item.time}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-3">
        <Pressable>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-lg font-psemibold">Notification</Text>
        <Pressable onPress={markAllAsRead}>
          <Text className="text-blue-400 text-sm font-pregular">
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
