import React, { useCallback } from "react";
import { Modal, View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MediaItem, MediaStatus } from "@/types/mediaTypes";
import Video from "react-native-video";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setEditingMedia } from "@/redux/teacherReducer/mediaSlice";

interface MediaPreviewModalProps {
    visible: boolean;
    media: MediaItem | null;
    onClose: () => void;
    onConfirm?: () => void;
    onDelete?: () => void;
    loading: boolean;
    mode: 'preview' | 'edit';
    status: MediaStatus;
}

const MediaPreviewModal = ({
    visible,
    media,
    onClose,
    onConfirm,
    onDelete,
    loading,
    mode = 'preview',
    status = 'draft'
}: MediaPreviewModalProps) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const handleEdit = useCallback(() => {
        if (!media) return;
        dispatch(setEditingMedia(media.id));
        router.push(`/teacher/UploadOther?id=${media.id}`);
        onClose();
    }, [media, dispatch, router, onClose]);

    if (!media) return null;

    const displayStatus = mode === 'edit' ? status : media.status;

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
                        <Text className="text-lg font-psemibold text-gray-800">Media Preview</Text>
                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </Pressable>
                    </View>

                    <ScrollView className="p-4">
                        {/* Media Preview */}
                        <View className="mb-4">
                            {media.type === "image" ? (
                                <Image
                                    source={{ uri: media.url }}
                                    className="w-full h-64 rounded-lg"
                                    resizeMode="contain"
                                />
                            ) : (
                                <View className="w-full h-64 rounded-lg overflow-hidden bg-black">
                                    <Video
                                        source={{ uri: media.url }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                        controls
                                        paused={false}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Details */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-600 mb-2">Title</Text>
                            <Text className="text-lg font-psemibold text-black">{media.title}</Text>
                        </View>

                        {media.description && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-600 mb-2">Description</Text>
                                <Text className="text-lg font-pregular text-black">{media.description}</Text>
                            </View>
                        )}

                        {/* Tags */}
                        {media.tags?.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-600 mb-2">Tags</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {media.tags.map((tag, index) => (
                                        <View key={index} className="px-3 py-1 bg-indigo-100 rounded-full">
                                            <Text className="text-sm font-pmedium text-indigo-700">#{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Status */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-600 mb-2">Status</Text>
                            <View className={`px-3 py-1 rounded-full ${displayStatus === 'draft' ? 'bg-yellow-100' : 'bg-green-100'
                                } self-start`}>
                                <Text className={`text-sm font-pmedium ${displayStatus === 'draft' ? 'text-yellow-700' : 'text-green-700'
                                    }`}>
                                    {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-between p-4 border-t border-gray-200 gap-3">
                        {/* Edit Button (Always visible) */}
                        <Pressable
                            className="flex-1 flex-row items-center justify-center px-4 py-2 bg-indigo-100 rounded-lg"
                            onPress={handleEdit}
                            disabled={loading}
                        >
                            {loading && mode === 'preview' ? (
                                <ActivityIndicator color="#4F46E5" />
                            ) : (
                                <>
                                    <Ionicons name="pencil" size={18} color="#4F46E5" />
                                    <Text className="ml-2 text-indigo-700 font-pmedium">Edit</Text>
                                </>
                            )}
                        </Pressable>

                        {/* Conditional Action Button */}
                        {mode === 'preview' ? (
                            // Delete Button
                            <Pressable
                                className="flex-1 flex-row items-center justify-center px-4 py-2 bg-red-100 rounded-lg"
                                onPress={onDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#DC2626" />
                                ) : (
                                    <>
                                        <Ionicons name="trash" size={18} color="#DC2626" />
                                        <Text className="ml-2 text-red-700 font-pmedium">Delete</Text>
                                    </>
                                )}
                            </Pressable>
                        ) : (
                            // Confirm Button
                            <Pressable
                                className="flex-1 flex-row items-center justify-center px-4 py-2 bg-green-100 rounded-lg"
                                onPress={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#16a34a" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark" size={18} color="#16a34a" />
                                        <Text className="ml-2 text-green-700 font-pmedium">Confirm</Text>
                                    </>
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