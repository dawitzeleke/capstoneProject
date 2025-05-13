// TeacherItem.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

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
      className={`mb-4 flex-row items-center p-4 rounded-lg ${
        theme === "dark" ? "bg-neutral-800" : "bg-white shadow-lg"
      }`}>
      <Image source={{ uri: imageUrl }} className="w-16 h-16 rounded-full" />
      <View className="ml-4">
        <Text
          className={`text-lg font-pbold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
          {name}
        </Text>
        <Text
          className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {title}
        </Text>
        <Text
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Followers: {followers}
        </Text>
        <Text
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Questions: {questions}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TeacherItem;
