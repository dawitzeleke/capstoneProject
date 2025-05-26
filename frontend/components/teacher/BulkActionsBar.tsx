import { View, Text, Pressable } from "react-native";
import React from "react";

interface BulkActionsBarProps {
  count: number;
  onClear: () => void;
  onDelete: () => void;
}

const BulkActionsBar = ({ count, onClear, onDelete }: BulkActionsBarProps) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex-row items-center justify-between">
      <Text className="text-gray-600 font-pmedium">{count} Selected</Text>
      <View className="flex-row gap-3">
        <Pressable
          onPress={onClear}
          className="px-4 py-2 bg-slate-200 rounded-lg"
        >
          <Text className="text-gray-600 font-pmedium">Clear</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          className="px-4 py-2 bg-red-100 rounded-lg"
        >
          <Text className="text-red-600 font-pmedium">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default BulkActionsBar;