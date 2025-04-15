// TeacherItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface TeacherItemProps {
  name: string;
  title: string;
  followers: string;
  questions: string;
  imageUrl: string;
  onPress: () => void;
}

const TeacherItem: React.FC<TeacherItemProps> = ({
  name,
  title,
  followers,
  questions,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="mb-4 flex-row items-center">
      <Image source={{ uri: imageUrl }} className="w-16 h-16 rounded-full" />
      <View className="ml-4">
        <Text className="text-white text-lg font-pbold">{name}</Text>
        <Text className="text-gray-400">{title}</Text>
        <Text className="text-gray-400">Followers: {followers}</Text>
        <Text className="text-gray-400">Questions: {questions}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TeacherItem;
