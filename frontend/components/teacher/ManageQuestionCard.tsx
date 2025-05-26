import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuestionItem, ContentStatus } from "@/types/questionTypes";

interface ManageQuestionCardProps {
  item: QuestionItem;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: (item: QuestionItem) => void;
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
      className={`bg-white rounded-lg p-4 mb-3 shadow ${isSelected ? "border-2 border-indigo-600 bg-indigo-50" : ""
        }`}
      onLongPress={() => {
        if (!selectionMode) {
          onToggleSelection();
          setSelectionMode(true);
        }
      }}
      onPress={() => {
        if (selectionMode) {
          onToggleSelection();
        } else {
          onPreview();
        }
      }}
    >
      {selectionMode && (
        
          <Ionicons
            name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={isSelected ? "#4F46E5" : "#cbd5e1"}
          />
      
      )}

      {/* Header Section */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-psemibold text-gray-800">
            {item.courseName}
          </Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-sm text-gray-600 font-pregular">Grade {item.grade}</Text>
            <Text className="text-sm text-gray-600 font-pregular">•</Text>
            <Text className="text-sm text-gray-600 font-pregular">
              {item.point} pts
            </Text>
          </View>
        </View>

        <View className={`px-2 py-1 rounded ${item.status === ContentStatus.Draft
            ? "bg-yellow-100"
            : "bg-green-100"
          }`}>
          <Text className="text-xs font-pmedium">
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Difficulty and Type */}
      <View className="flex-row gap-2 mb-2">
        <View className="bg-indigo-100 px-2 py-1 rounded">
          <Text className="text-xs text-indigo-700 font-pmedium">
            {item.difficulty}
          </Text>
        </View>
        <View className="bg-slate-100 px-2 py-1 rounded">
          <Text className="text-xs text-slate-700 font-pmedium">
            {item.questionType.replace(/([A-Z])/g, ' $1').trim()}
          </Text>
        </View>
      </View>

      {/* Question Preview */}
      <Text className="text-lg font-psemibold text-gray-800 mb-2">
        {item.questionText}
      </Text>

      {/* Description */}
      {item.description && (
        <Text className="text-base text-gray-600 mb-3 font-pregular" numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {/* Options Preview */}
      <View className="mb-3">
        {item.options.slice(0, 2).map((option, index) => (
          <View key={`${item.id}-${index}`} className="flex-row items-center">
            <Text className="text-base font-pmedium text-gray-700 mr-2">
              {String.fromCharCode(65 + index)}.
            </Text>
            <Text className="text-base font-pmedium text-gray-700" numberOfLines={1}>
              {option}
            </Text>
          </View>
        ))}
        {item.options.length > 2 && (
          <Text className="text-sm text-gray-400 mt-1 font-pregular">
            + {item.options.length - 2} more options
          </Text>
        )}
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center border-t border-slate-100 pt-2">
        <Text className="text-xs text-gray-400 font-pregular">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>

        <View className="flex-row gap-3">
          <Pressable onPress={() => onEdit(item)} className="p-2 bg-indigo-100 rounded-lg" disabled={loading}>
            <Ionicons name="pencil" size={20} color="#4F46E5" />
          </Pressable>
          <Pressable onPress={onDelete} className="p-2 bg-red-100 rounded-lg" disabled={loading}>
            <Ionicons name="trash" size={20} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default ManageQuestionCard;

export default ManageQuestionCard;

export default ManageQuestionCard;