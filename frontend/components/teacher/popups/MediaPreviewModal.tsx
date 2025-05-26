import React, { useCallback, useState } from "react";
import { Modal, View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Video from "react-native-video";
import type { MediaItem, MediaStatus } from "@/types/mediaTypes";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setEditingMedia } from "@/redux/teacherReducer/mediaSlice";

interface MediaPreviewModalProps {
  visible: boolean;
  media: MediaItem | null;
  onClose: () => void;
  onEdit?: () => void;
  onConfirm?: () => void;
  onDelete?: () => void;
  loading: boolean;
  mode: 'preview' | 'edit' | 'create';
  status?: MediaStatus;
}

const DEFAULT_THUMBNAIL = 'https://placehold.co/400x400.png';
const getImageSource = (url: string | undefined) =>
  url && (url.startsWith('http') || url.startsWith('file:') || url.startsWith('blob:'))
    ? { uri: url }
    : { uri: DEFAULT_THUMBNAIL };

const MediaPreviewModal = ({
  visible,
  media,
  onClose,
  onEdit,
  onConfirm,
  onDelete,
  loading,
  mode = 'preview',
  status = 'draft'
}: MediaPreviewModalProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Add state for video preview
  const [showVideo, setShowVideo] = useState(false);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit();
      return;
    }
    if (!media) return;
    dispatch(setEditingMedia(media));
    (navigation as any).navigate('UploadOther', {
      mediaId: media.id,
      type: media.type,
      initialValues: media
    });
    onClose();
  }, [media, dispatch, navigation, onClose, onEdit]);

  if (!media) return null;

  const displayStatus = media.status;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <View className="bg-white rounded-xl max-h-[90vh]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-psemibold text-gray-800">{media.title || 'Media Preview'}</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close modal">
              <Ionicons name="close" size={24} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView className="p-4">
            {/* Media Preview */}
            <View className="mb-4 aspect-video bg-black rounded-lg overflow-hidden">
              {media.type === "image" ? (
                <Image
                  source={getImageSource(media.url)}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              ) : (
                showVideo ? (
                  <View style={{ width: '100%', height: '100%' }}>
                <Video
                  source={{ uri: media.url }}
                      style={{ width: '100%', height: 220 }}
                  resizeMode="contain"
                  controls
                  paused={false}
                />
                    <Pressable onPress={() => setShowVideo(false)} style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                      <Ionicons name="close-circle" size={32} color="#fff" />
                    </Pressable>
                  </View>
                ) : media.thumbnailUrl ? (
                  <Pressable onPress={() => setShowVideo(true)} style={{ width: '100%', height: '100%' }}>
                    <Image
                      source={getImageSource(media.thumbnailUrl)}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View style={{ position: 'absolute', top: '40%', left: '45%' }}>
                      <Ionicons name="play-circle" size={48} color="#fff" />
                    </View>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => setShowVideo(true)} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <View className="w-full h-full bg-black items-center justify-center">
                      <Ionicons name="play-circle" size={48} color="#fff" />
                    </View>
                  </Pressable>
                )
              )}
            </View>

            {/* Metadata Section */}
            <View className="mb-4">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 pr-4">
                  <Text className="text-base text-gray-600 font-pmedium">Upload Date</Text>
                  <Text className="text-base text-black font-pregular">
                    {new Date(media.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View className="flex-1 pl-4">
                  <Text className="text-base text-gray-600 font-pmedium">Media Type</Text>
                  <Text className="text-base text-black font-pregular capitalize">
                    {media.type}
                  </Text>
                </View>
              </View>

              {media.description && (
                <View className="mb-4">
                  <Text className="text-base font-pmedium text-gray-600 mb-2">Description</Text>
                  <Text className="text-base font-pregular text-black">
                    {media.description}
                  </Text>
                </View>
              )}

              {/* Tags */}
              {media.tags?.length > 0 && (
                <View className="mb-4">
                  <Text className="text-base font-pmedium text-gray-600 mb-2">Tags</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {media.tags.map((tag, index) => (
                      <View key={index} className="px-3 py-1 bg-indigo-100 rounded-full">
                        <Text className="text-sm font-pmedium text-indigo-700">{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Status */}
              <View className={`mb-4`}>
                <Text className="text-base font-pmedium text-gray-600 mb-2">Status</Text>
                <View
                  className={`self-start px-3 py-1 rounded-full ${
                    displayStatus === 'draft' ? 'bg-yellow-100' : 
                    displayStatus === 'posted' ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                  style={{ alignSelf: 'flex-start', minWidth: 60, paddingHorizontal: 12 }}
                >
                  <Text className={`text-sm font-pmedium ${displayStatus === 'draft' ? 'text-yellow-700' : 'text-green-700'}`}
                  >
                    {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row justify-between p-4 border-t border-gray-200 gap-3">
            {/* Edit Button */}
            <Pressable
              className="flex-1 items-center py-2 bg-indigo-100 rounded-lg"
              onPress={handleEdit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#4F46E5" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Ionicons name="pencil" size={20} color="#4F46E5" />
                  <Text className="ml-2 text-indigo-700 font-pmedium">Edit</Text>
                </View>
              )}
            </Pressable>

            {/* Conditional Action Button */}
            {mode === 'preview' ? (
              <Pressable
                className="flex-1 items-center py-2 bg-red-100 rounded-lg"
                onPress={onDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#DC2626" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="trash" size={20} color="#DC2626" />
                    <Text className="ml-2 text-red-700 font-pmedium">Delete</Text>
                  </View>
                )}
              </Pressable>
            ) : (
              <Pressable
                className="flex-1 items-center py-2 bg-green-100 rounded-lg"
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#16a34a" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="checkmark" size={20} color="#16a34a" />
                    <Text className="ml-2 text-green-700 font-pmedium">Confirm</Text>
                  </View>
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaPreviewModal;