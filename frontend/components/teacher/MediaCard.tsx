import React, { useCallback } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EditButton from "@/components/teacher/EditButton";
import DeleteButton from "@/components/teacher/DeleteButton";
import type { MediaItem } from "@/types/mediaTypes";
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

    const handleEdit = useCallback(() => {
        dispatch(setEditingMedia(item.id));
        router.push(`/teacher/UploadOther?id=${item.id}`);
    }, [item.id, dispatch, router]);

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
                <Pressable className="absolute left-2 top-2 z-10" onPress={onToggleSelection}>
                    <Ionicons
                        name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={isSelected ? "#4F46E5" : "#cbd5e1"}
                    />
                </Pressable>
            )}

            <Text className="text-xs text-gray-500 mb-1">
                {new Date(item.date).toLocaleDateString()}
            </Text>

            {/* Media Preview */}
            {item.type === "image" ? (
                <Image
                    source={{ uri: item.uri }}
                    className="w-full h-40 rounded-lg mb-2"
                    resizeMode="cover"
                />
            ) : (
                <View className="w-full h-40 rounded-lg mb-2 relative">
                    <Image
                        source={{ uri: item.uri }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                    <Pressable className="absolute inset-0 flex items-center justify-center">
                        <Ionicons name="play-circle" size={48} color="#4F46E5" />
                    </Pressable>
                </View>
            )}

            <Text className="text-base font-pmedium text-gray-800 mb-2">
                {item.name}
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-3">
                {item.tags.map((tag, index) => (
                    <View key={index} className="bg-indigo-100 px-2 py-1 rounded-full">
                        <Text className="text-xs font-pmedium text-indigo-700">{tag}</Text>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between items-center mt-2">
                <EditButton itemId={item.id} loading={loading} onNavigate={handleEdit} />
                <DeleteButton loading={loading} onPress={onDelete} variant="icon" />
            </View>

            <View className={`absolute top-2 right-2 px-2 py-1 rounded ${
                item.status === "draft" ? "bg-yellow-100" : "bg-blue-100"
            }`}>
                <Text className="text-xs font-pmedium">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
            </View>
        </Pressable>
    );
};

export default MediaCard;