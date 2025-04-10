import React from "react";
import { View, Text, TextInput, FlatList, Image } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const teachers = [
  {
    id: "1",
    name: "Birhanu Temesgen",
    title: "Teaches Biology at SOT",
    followers: "2k Followers",
    questions: "400 Questions",
  },
  {
    id: "2",
    name: "Birhanu Temesgen",
    title: "Teaches Biology at SOT",
    followers: "2k Followers",
    questions: "400 Questions",
  },
  {
    id: "3",
    name: "Birhanu Temesgen",
    title: "Teaches Biology at SOT",
    followers: "2k Followers",
    questions: "400 Questions",
  },
];

const SearchScreen = () => {
  return (
    <View className="flex-1 bg-primary p-4">
      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-700 p-3 rounded-full mb-4">
        <TextInput placeholder="Search" className="flex-1 ml-2 text-gray-200 pl-6 font-pregular" />
        <TouchableOpacity className="bg-transpernt p-2 rounded-xl">
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity className="bg-cyan-700 px-4 py-4 rounded-xl">
          <Text className="text-white font-psemibold text-base">Teacher</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-transparent px-4 py-4 rounded-xl">
          <Text className="text-white font-psemibold text-base">Content</Text>
        </TouchableOpacity>
      </View>

      {/* Top Rated Section */}
      <Text className="text-lg font-pbold text-gray-800 mb-2">Top Rated</Text>
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-card p-4 rounded-2xl shadow-md mb-3 flex-row items-center">
            <View className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
            <Link href="/student/(tabs)/TeacherDetail">
              <Text className="text-gray-400 font-pbold text-md">
                {item.name}
              </Text>
              <Text className="text-gray-300 font-pregular text-md">
                {item.title}
              </Text>
              <Text className="text-gray-400 font-pregular text-sm mt-1">
                <Text className="font-pregular">+{item.followers}</Text>{" "}
                <Text className="font-pregular">{item.questions}</Text>
              </Text>
            </Link>
          </View>
        )}
      />
    </View>
  );
};

export default SearchScreen;
