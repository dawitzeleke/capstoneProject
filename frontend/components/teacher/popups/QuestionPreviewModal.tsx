import React from "react";
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type QuestionItem } from "@/redux/teacherReducer/contentSlice";

interface QuestionPreviewModalProps {
    visible: boolean;
    question: QuestionItem | null;
    onClose: () => void;
    onEdit: () => void;
    onConfirm?: () => void;
    onDelete?: () => void;
    loading: boolean;
    mode: 'add' | 'edit';
}

const QuestionPreviewModal = ({
    visible,
    question,
    onClose,
    onEdit,
    onConfirm,
    onDelete,
    loading,
    mode = 'add'
}: QuestionPreviewModalProps) => {
    if (!question) return null;

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

                    {/* Content Section */}
                    <ScrollView className="p-4">
                        {/* Course Info */}
                        <View className="mb-4">
                            <View className="flex-row gap-4 mt-2 mb-4 border-b  border-gray-200">
                                <View className="flex-1">
                                    <Text className="text-base text-gray-600 font-pmedium mb-2">Course Name</Text>
                                    <Text className="text-base text-black font-pregular mb-2">{question.courseName}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base text-gray-600 font-pmedium mb-2">Grade Level</Text>
                                    <Text className="text-base text-black font-pregular mb-2">Grade {question.grade}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Difficulty & Type */}
                        <View className="mb-5 flex-row gap-4 border-b border-gray-200">
                            <View className="flex-1">
                                <Text className="text-base text-gray-600 font-pmedium mb-2">Difficulty</Text>
                                <Text className="text-base text-black font-pregular mb-2">{question.difficulty}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-base text-gray-600 font-pmedium mb-2">Question Type</Text>
                                <Text className="text-base text-black font-pregular mb-2">
                                    {question.questionType.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                            </View>
                        </View>

                        {/* Question */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-600 mb-2">Question</Text>
                            <Text className="text-base font-psemibold text-black">{question.question}</Text>
                        </View>

                        {/* Options */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-600 mb-2">Options</Text>
                            {question.options.map((option: string, index: number) => (
                                <View key={index} className="flex-row items-center mb-2">
                                    <Text className="w-6 text-base font-pmedium text-indigo-700">
                                        {String.fromCharCode(65 + index)}.
                                    </Text>
                                    <Text className="text-base text-black ml-2 font-pregular">{option}</Text>
                                    {question.correctAnswer === index && (
                                        <Ionicons name="checkmark-circle" size={18} color="#22c55e" className="ml-2" />
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Hint */}
                        {!!question.hint && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-600 mb-2">Hint</Text>
                                <Text className="text-base text-black">{question.hint}</Text>
                            </View>
                        )}

                        {/* Explanation */}
                        {!!question.explanation && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-600 mb-2">Explanation</Text>
                                <Text className="text-base text-black font-pregular">{question.explanation}</Text>
                            </View>
                        )}

                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-600 mb-2">Tags</Text>
                                <View className="flex-row flex-wrap">
                                    {question.tags.map((tag: string, index: number) => (
                                        <View key={index} className="bg-indigo-100 px-2 py-1 rounded-full mr-2 mb-2">
                                            <Text className="text-sm font-pmedium text-indigo-700">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-between p-4 border-t border-gray-200 gap-2">
                        {/* Edit Button */}
                        <Pressable
                            className="flex-2 flex-row items-center justify-center px-4 py-2 bg-indigo-100 rounded-lg"
                            onPress={onEdit}
                            disabled={loading}
                        >
                            <Ionicons name="pencil" size={18} color="#4F46E5" />
                            <Text className="ml-4 text-[#4F46E5] font-pmedium">Edit</Text>
                        </Pressable>

                        {/* Conditional Action Button */}
                        {mode === 'add' ? (
                            <Pressable
                                className="flex-2 flex-row items-center justify-center px-4 py-2 bg-[#dcfce7] rounded-lg"
                                onPress={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#16a34a" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark" size={18} color="#16a34a" />
                                        <Text className="ml-2 text-[#16a34a] font-pmedium">Confirm</Text>
                                    </>
                                )}
                            </Pressable>
                        ) : (
                            <Pressable
                                className="flex-2 flex-row items-center justify-center px-4 py-2 bg-red-100 rounded-lg"
                                onPress={onDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#DC2626" />
                                ) : (
                                    <>
                                        <Ionicons name="trash" size={18} color="#DC2626" />
                                        <Text className="ml-2 text-red-600 font-pmedium">Delete</Text>
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

export default QuestionPreviewModal;