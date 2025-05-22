import React from 'react';
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Video from 'react-native-video';
import type { MediaItem } from '@/types/mediaTypes';
import { useDispatch } from 'react-redux';
import { toggleMediaSelection, setEditingMedia } from '@/redux/teacherReducer/mediaSlice';
import { useRouter } from 'expo-router';

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  selectionMode: boolean;
  onDelete: () => void;
  onPreview: (item: MediaItem) => void;
  loading?: boolean;
  onEdit: (id: string) => void;
  onToggleSelection: () => void;
  setSelectionMode: (mode: boolean) => void;
}

const DEFAULT_THUMBNAIL = 'https://via.placeholder.com/400x225';

// Helper to get a valid image source (supports http, file, blob)
const getImageSource = (url: string | undefined) =>
  url && (url.startsWith('http') || url.startsWith('file:') || url.startsWith('blob:'))
    ? { uri: url }
    : { uri: DEFAULT_THUMBNAIL };

const MediaCard = ({
  item,
  isSelected,
  selectionMode,
  onDelete,
  onPreview,
  loading,
  onEdit,
  onToggleSelection,
  setSelectionMode
}: MediaCardProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleToggleSelection = () => {
    if (!selectionMode) return;
    dispatch(toggleMediaSelection(item.id));
  };

  const handleEdit = () => {
    dispatch(setEditingMedia(item));
    router.push({
      pathname: "/teacher/(tabs)/UploadOther",
      params: { 
        mediaId: item.id,
        type: item.type
      }
    });
  };

  return (
    <Pressable
      className={`bg-white rounded-lg p-4 mb-3 shadow ${isSelected ? "border-2 border-indigo-600 bg-indigo-50" : ""}`}
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
          onPreview(item);
        }
      }}
    >
      {/* Selection Indicator */}
      {selectionMode && (
          <Ionicons
          name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            size={24}
          color={isSelected ? "#4F46E5" : "#cbd5e1"}
          style={{ position: 'absolute', top: 8, left: 8, zIndex: 10 }}
          />
      )}

      {/* Header Row */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-base font-psemibold text-gray-800">{item.title}</Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-sm text-gray-600 font-pregular capitalize">{item.type}</Text>
            <Text className="text-sm text-gray-600 font-pregular">•</Text>
            <Text className="text-sm text-gray-600 font-pregular">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className={`px-2 py-1 rounded ${item.status === 'draft' ? "bg-yellow-100" : "bg-green-100"}`}>
          <Text className="text-xs font-pmedium">
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Media Preview */}
      <View className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
        {item.type === 'image' ? (
          <Image source={getImageSource(item.url)} className="w-full h-full" resizeMode="cover" />
        ) : item.type === 'video' && item.thumbnailUrl ? (
          <>
            <Image source={getImageSource(item.thumbnailUrl)} className="w-full h-full" resizeMode="cover" />
            <View style={{ position: 'absolute', top: '35%', left: '35%' }}>
              <Ionicons name="play-circle" size={32} color="#fff" />
            </View>
          </>
        ) : item.type === 'video' && item.url ? (
          <>
            <View className="w-full h-full bg-black items-center justify-center">
              <Ionicons name="play-circle" size={32} color="#fff" />
            </View>
          </>
        ) : (
          <Image source={{ uri: DEFAULT_THUMBNAIL }} className="w-full h-full" resizeMode="cover" />
        )}
      </View>

      {/* Description */}
      {item.description && (
        <Text className="text-base text-gray-700 mb-3 font-pregular" numberOfLines={2}>
          {item.description}
        </Text>
      )}

      {/* Tags */}
        {item.tags?.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3">
            {item.tags.map((tag, index) => (
            <View key={`${item.id}-tag-${index}`} className="px-2 py-1 bg-indigo-100 rounded-full">
                <Text className="text-xs font-pmedium text-indigo-700">{tag}</Text>
              </View>
            ))}
          </View>
        )}

      {/* Footer */}
      <View className="flex-row justify-between items-center border-t border-slate-100 pt-2">
        <Text className="text-xs text-gray-400 font-pregular">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View className="flex-row gap-3">
          <Pressable onPress={handleEdit} className="p-2 bg-indigo-100 rounded-lg">
            <Ionicons name="pencil" size={20} color="#4F46E5" />
          </Pressable>
          <Pressable onPress={onDelete} className="p-2 bg-red-100 rounded-lg">
            {loading ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Ionicons name="trash" size={20} color="#ef4444" />
            )}
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default MediaCard;