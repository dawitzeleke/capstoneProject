import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TeacherItem from "@/components/TeacherItem"; // Adjust path based on your folder structure

const following = [
  {
    id: "1",
    name: "Birhanu Temesgen",
    title: "Teaches Biology at SOT",
    followers: "2k Followers",
    questions: "400 Questions",
  },
  {
    id: "2",
    name: "Sara Mekonnen",
    title: "Teaches Chemistry at SOT",
    followers: "1.5k Followers",
    questions: "320 Questions",
  },
  {
    id: "3",
    name: "Dereje Alemu",
    title: "Teaches Physics at SOT",
    followers: "2.3k Followers",
    questions: "500 Questions",
  },
];

const FollowingList = () => {
  return (
    <View className="flex-1 bg-primary px-4 pt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Link
          href="/student/(tabs)/Profile"
          className="text-lg font- font-pregularpregular text-blue-500 font-pregular">
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Link>
        <Text className="text-white text-2xl font-pbold">Following</Text>
        <Ionicons name="people-circle" size={28} color="white" />
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-700 p-3 rounded-full mb-4">
        <TextInput
          placeholder="Search followed teachers"
          placeholderTextColor="#ccc"
          className="flex-1 ml-2 text-white pl-4 font-pregular"
        />
        <TouchableOpacity className="p-2">
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Followed Teachers List */}
      <FlatList
        data={following}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TeacherItem
            name={item.name}
            title={item.title}
            followers={item.followers}
            questions={item.questions}
            onPress={() => {
              // Replace with your navigation logic
              console.log(`Navigate to profile of ${item.name}`);
            }}
          />
        )}
      />
    </View>
  );
};

export default FollowingList;
