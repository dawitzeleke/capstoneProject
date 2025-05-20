// MediaCard.tsx
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditButton from "@/components/teacher/EditButton";
import DeleteButton from "@/components/teacher/DeleteButton";
import type { MediaItem, MediaStatus } from "@/types/mediaTypes";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setEditingMedia } from "@/redux/teacherReducer/mediaSlice";

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onToggleSelection: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  selectionMode: boolean;
  setSelectionMode: (value: boolean) => void;
  loading: boolean;
}

const MediaCard = ({
  item,
  isSelected,
  onToggleSelection,
  onEdit,
  onDelete,
  onPreview,
  selectionMode,
  setSelectionMode,
  loading,
}: MediaCardProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(setEditingMedia(item.id));
    router.push(`/teacher/UploadOther?id=${item.id}`);
  };

  return (
    <Pressable
      className={`bg-white rounded-lg p-4 mb-3 shadow ${
        isSelected ? "border-2 border-indigo-600 bg-indigo-50" : ""
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
        <Pressable className="absolute left-2 top-2 z-10" onPress={onToggleSelection}>
          <Ionicons
            name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={isSelected ? "#4F46E5" : "#cbd5e1"}
          />
        </Pressable>
      )}

      {/* Header Section */}
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-base font-pmedium text-gray-800">
          {item.title}
        </Text>
        <View className={`px-2 py-1 rounded ${
          item.status === 'draft' ? "bg-yellow-100" : "bg-blue-100"
        }`}>
          <Text className="text-xs font-pmedium">
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Media Preview */}
      <View className="w-full h-40 rounded-lg mb-2 relative">
        {item.type === "image" ? (
          <Image
            source={{ uri: item.url }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <>
            <Image
              source={{ uri: item.thumbnailUrl || '' }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            <Pressable className="absolute inset-0 flex items-center justify-center">
              <Ionicons name="play-circle" size={48} color="#4F46E5" />
            </Pressable>
          </>
        )}
      </View>

      {/* Tags */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {item.tags.map((tag, index) => (
          <View key={index} className="bg-indigo-100 px-2 py-1 rounded-full">
            <Text className="text-xs font-pmedium text-indigo-700">{tag}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center border-t border-slate-100 pt-2">
        <Text className="text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View className="flex-row gap-3">
          <EditButton itemId={item.id} loading={loading} onPress={handleEdit} />
          <DeleteButton loading={loading} onPress={onDelete} variant="icon" />
        </View>
      </View>
    </Pressable>
  );
};

export default MediaCard;