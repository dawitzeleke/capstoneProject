import React, { useCallback } from "react";
import { Modal, View, Text, Pressable, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MediaItem } from "@/types/mediaTypes";
import EditButton from '@/components/teacher/EditButton';
import DeleteButton from "@/components/teacher/DeleteButton";
import Video from "react-native-video";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setEditingMedia } from "@/redux/teacherReducer/mediaSlice";

interface MediaPreviewModalProps {
    visible: boolean;
    media: MediaItem | null;
    onClose: () => void;
    onDelete: () => void;
    loading: boolean;
}

const MediaPreviewModal = ({
    visible,
    media,
    onClose,
    onDelete,
    loading
}: MediaPreviewModalProps) => {
    const router = useRouter();
    const dispatch = useDispatch();

    if (!media) return null;

    const handleEdit = useCallback(() => {
        dispatch(setEditingMedia(media.id));
        router.push(`/teacher/UploadOther?id=${media.id}`);
        onClose(); // Optional: Close modal after navigating
    }, [media.id, dispatch, router, onClose]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center p-4" style={{ zIndex: 900 }}>
                <View className="bg-white rounded-xl max-h-[90vh]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-lg font-psemibold text-gray-800">Preview</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </Pressable>
                    </View>

                    <ScrollView className="p-4">
                        {/* Media Preview */}
                        <View className="mb-4">
                            {media.type === "image" ? (
                                <Image
                                    source={{ uri: media.uri }}
                                    className="w-full h-64 rounded-lg"
                                    resizeMode="contain"
                                />
                            ) : (
                                <View className="w-full h-64 rounded-lg overflow-hidden bg-black">
                                    <Video
                                        source={{ uri: media.uri }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                        controls
                                        paused={false}
                                        onError={(error) => console.error("Video error:", error)}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Media Type */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-500 mb-1">Type</Text>
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={media.type === "image" ? "image" : "videocam"}
                                    size={24}
                                    color="#4F46E5"
                                    className="mr-2"
                                />
                                <Text className="text-lg font-psemibold text-gray-800">
                                    {media.type.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {/* Name */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-500 mb-1">Name</Text>
                            <Text className="text-lg font-psemibold text-gray-800">{media.name}</Text>
                        </View>

                        {/* Tags */}
                        {media.tags && media.tags.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-500 mb-1">Tags</Text>
                                <View className="flex-row flex-wrap">
                                    {media.tags.map((tag: string, index: number) => (
                                        <View key={index} className="bg-indigo-100 px-2 py-1 rounded-full mr-2 mb-2">
                                            <Text className="text-xs font-pmedium text-indigo-700">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Status */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-500 mb-1">Status</Text>
                            <View className="flex-row items-center">
                                <View
                                    className={`px-2 py-1 rounded ${media.status === "draft" ? "bg-yellow-100" : "bg-blue-100"}`}
                                >
                                    <Text className="text-xs font-pmedium">
                                        {media.status.charAt(0).toUpperCase() + media.status.slice(1)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-between p-4 border-t border-gray-200">
                        <EditButton
                            itemId={media.id}
                            loading={loading}
                            onNavigate={handleEdit}
                            variant="text"
                        />

                        <DeleteButton
                            loading={loading}
                            onPress={onDelete}
                            variant="text"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default MediaPreviewModal;
