import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  onPress: () => void;
}

const EmptyState = ({ onPress }: EmptyStateProps) => (
  <View className="flex-1 items-center justify-center p-8">
    <Text className="text-gray-500 text-lg text-center mb-4">
      No questions found{"\n"}
      Start by creating your first question!
    </Text>
    
    <Pressable
      onPress={onPress}
      className="bg-indigo-600 px-6 py-3 rounded-lg flex-row items-center"
      android_ripple={{ color: '#4338ca' }}
    >
      <Ionicons name="add-circle" size={20} color="white" />
      <Text className="text-white font-pmedium ml-2">Create New Question</Text>
    </Pressable>
  </View>
);

export default EmptyState;