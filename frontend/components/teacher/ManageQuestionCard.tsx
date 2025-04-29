import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditButton from "@/components/teacher/EditButton";
import DeleteButton from "@/components/teacher/DeleteButton";

interface ManageQuestionItem {
  id: string;
  question: string;
  options: string[];
  status: "draft" | "posted";
  date: string;
}

interface ManageQuestionCardProps {
  item: ManageQuestionItem;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onDelete: () => void;
  loading: boolean;
  onPreview: () => void;
  selectionMode: boolean;
  setSelectionMode: (value: boolean) => void;
}

const ManageQuestionCard = ({
  item,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  loading,
  onPreview,
  selectionMode,
  setSelectionMode,
}: ManageQuestionCardProps) => {
  return (
    <Pressable
      className={`bg-white rounded-lg p-4 mb-3 shadow ${
        isSelected ? "border-2 border-indigo-600 bg-indigo-50" : ""
      }`}
      onLongPress={() => {
        onToggleSelection();
        setSelectionMode(true);
      }}
      onPress={onPreview}
    >
      {selectionMode && (
        <Pressable
          className="absolute left-2 top-2 z-10"
          onPress={onToggleSelection}
        >
          <Ionicons
            name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={isSelected ? "#4F46E5" : "#cbd5e1"}
          />
        </Pressable>
      )}

      <Text className="text-xs text-gray-500 ml-6 mb-1">
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text className="text-base font-pmedium text-gray-800 mb-3">
        {item.question}
      </Text>

      <View className="mb-4">
        {item.options.map((option: string, index: number) => (
          <Text
            key={`${item.id}-${index}`}
            className="text-sm text-gray-600 mb-1"
          >
            {option}
          </Text>
        ))}
      </View>

      <View className="flex-row justify-between items-center mt-2">
        <EditButton itemId={item.id} loading={loading} />
        <DeleteButton loading={loading} onPress={onDelete} variant="icon" />
      </View>

      <View
        className={`absolute top-2 right-2 px-2 py-1 rounded ${
          item.status === "draft" ? "bg-yellow-100" : "bg-blue-100"
        }`}
      >
        <Text className="text-xs font-pmedium">
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </Pressable>
  );
};

export default ManageQuestionCard;