import React from "react";
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuestionItem } from "@/types/questionTypes";

interface QuestionPreviewModalProps {
    visible: boolean;
    question: QuestionItem | null;
    onClose: () => void;
    onEdit: () => void;
    onConfirm?: () => void;
    onDelete?: () => void;
    loading: boolean;
    mode: 'preview' | 'edit';
}

const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
    visible,
    question,
    onClose,
    onEdit,
    onConfirm,
    onDelete,
    loading,
    mode
}) => {
    if (!question) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={loading ? undefined : onClose}
            statusBarTranslucent
        >
            <View className="flex-1 bg-black/50 justify-center p-4">
                <View className="bg-white rounded-xl max-h-[90vh]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-lg font-psemibold text-gray-800">Question Preview</Text>
                        <Pressable onPress={onClose} accessibilityLabel="Close modal">
                            <Ionicons name="close" size={24} color="#64748b" />
                        </Pressable>
                    </View>

                    <ScrollView className="p-4">
                        <View className="space-y-4">
                            {/* Course and Grade Section */}
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-1 pr-4">
                                    <Text className="text-base text-gray-600 font-pmedium">Course</Text>
                                    <Text className="text-base text-black font-pregular">{question.courseName}</Text>
                                </View>
                                <View className="flex-1 pl-4">
                                    <Text className="text-base text-gray-600 font-pmedium">Grade</Text>
                                    <Text className="text-base text-black font-pregular">{question.grade}</Text>
                                </View>
                            </View>

                            {/* Stream and Chapter Section */}
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="flex-1 pr-4">
                                    <Text className="text-base text-gray-600 font-pmedium">Stream</Text>
                                    <Text className="text-base text-black font-pregular">{question.stream}</Text>
                                </View>
                                <View className="flex-1 pl-4">
                                    <Text className="text-base text-gray-600 font-pmedium">Chapter</Text>
                                    <Text className="text-base text-black font-pregular">{question.chapter}</Text>
                                </View>
                            </View>

                            {/* Difficulty Section */}
                            <View className="mb-4">
                                <Text className="text-base text-gray-600 font-pmedium mb-2">Difficulty</Text>
                                <View className="self-start px-3 py-1 rounded-full bg-indigo-100">
                                    <Text className="text-sm font-pmedium text-indigo-700 capitalize">{question.difficulty}</Text>
                                </View>
                            </View>

                            {/* Question Text Section */}
                            <View className="mb-4">
                                <Text className="text-base text-gray-600 font-pmedium mb-2">Question</Text>
                                <View className="bg-gray-50 p-4 rounded-lg">
                                    <Text className="text-base text-black font-pregular">{question.questionText}</Text>
                                </View>
                            </View>

                            {/* Options Section */}
                            <View className="mb-4">
                                <Text className="text-base text-gray-600 font-pmedium mb-2">Options</Text>
                                <View className="space-y-2">
                                    {question.options.map((option, index) => (
                                        <View 
                                            key={index} 
                                            className={`flex-row items-center p-3 rounded-lg ${
                                                option === question.correctOption ? 'bg-green-50' : 'bg-gray-50'
                                            }`}
                                        >
                                            <Text className="text-base text-black font-pregular flex-1">
                                                {String.fromCharCode(65 + index)}. {option}
                                            </Text>
                                            {option === question.correctOption && (
                                                <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Explanation Section */}
                            {!!question.explanation && (
                                <View className="mb-4">
                                    <Text className="text-base text-gray-600 font-pmedium mb-2">Explanation</Text>
                                    <View className="bg-gray-50 p-4 rounded-lg">
                                        <Text className="text-base text-black font-pregular">{question.explanation}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Hint Section */}
                            {!!question.hint && (
                                <View className="mb-4">
                                    <Text className="text-base text-gray-600 font-pmedium mb-2">Hint</Text>
                                    <View className="bg-gray-50 p-4 rounded-lg">
                                        <Text className="text-base text-black font-pregular">{question.hint}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Tags Section */}
                            {question.tags.length > 0 && (
                                <View className="mb-7">
                                    <Text className="text-base text-gray-600 font-pmedium mb-2">Tags</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {question.tags.map((tag, index) => (
                                            <View key={index} className="px-3 py-1 bg-indigo-100 rounded-full">
                                                <Text className="text-sm font-pmedium text-indigo-700">{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-between p-4 border-t border-gray-200 gap-3">
                        {/* Edit Button */}
                        <Pressable
                            className="flex-1 items-center py-2 bg-indigo-100 rounded-lg"
                            onPress={onEdit}
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

export default QuestionPreviewModal;