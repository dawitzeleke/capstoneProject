// TeacherItem.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TeacherItemProps {
  name: string;
  title: string;
  followers: string;
  questions: string;
  imageUrl: string;
  onPress: () => void;
  theme: "dark" | "light"; // Add the theme prop
}

const TeacherItem: React.FC<TeacherItemProps> = ({
  name,
  title,
  followers,
  questions,
  imageUrl,
  onPress,
  theme, // Destructure the theme prop
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 p-4 rounded-xl ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } shadow-sm`}>
      <View className="flex-row items-center">
        <Image 
          source={{ uri: imageUrl }} 
          className="w-14 h-14 rounded-full border-2 border-indigo-500"
        />
        <View className="ml-4 flex-1">
          <Text
            className={`text-lg font-pbold mb-1 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
            {name}
          </Text>
          <Text
            className={`text-sm font-pmedium mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
            {title}
          </Text>
          <View className="flex-row items-center space-x-4">
            <View className="flex-row items-center">
              <Ionicons
                name="people-outline"
                size={16}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text
                className={`ml-1 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                {followers}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="help-circle-outline"
                size={16}
                color={theme === "dark" ? "#9ca3af" : "#6b7280"}
              />
              <Text
                className={`ml-1 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                {questions}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme === "dark" ? "#9ca3af" : "#6b7280"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default TeacherItem;
