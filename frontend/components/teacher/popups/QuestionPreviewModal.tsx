import React from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type QuestionItem } from "@/redux/teacherReducer/contentSlice";
import EditButton from '@/components/teacher/EditButton';
import DeleteButton from "@/components/teacher/DeleteButton";

interface QuestionPreviewModalProps {
    visible: boolean;
    question: QuestionItem | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    loading: boolean;
}

const QuestionPreviewModal = ({
    visible,
    question,
    onClose,
    onEdit,
    onDelete,
    loading
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

                    <ScrollView className="p-4">
                        {/* Question */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-500 mb-1">Question</Text>
                            <Text className="text-lg font-psemibold text-gray-800">{question.question}</Text>
                        </View>

                        {/* Options */}
                        <View className="mb-4">
                            <Text className="text-base font-pmedium text-gray-500 mb-2">Options</Text>
                            {question.options.map((option: string, index: number) => (
                                <View key={index} className="flex-row items-center mb-2">
                                    <Text className="w-6 text-sm font-pmedium text-indigo-700">
                                        {String.fromCharCode(65 + index)}.
                                    </Text>
                                    <Text className="text-sm text-gray-700 ml-2">{option}</Text>
                                    {question.correctAnswer === option && (
                                        <Ionicons name="checkmark-circle" size={18} color="#22c55e" className="ml-2" />
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Hint */}
                        {question.hint && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-500 mb-1">Hint</Text>
                                <Text className="text-sm text-gray-600">{question.hint}</Text>
                            </View>
                        )}

                        {/* Explanation */}
                        {question.explanation && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-500 mb-1">Explanation</Text>
                                <Text className="text-sm text-gray-600">{question.explanation}</Text>
                            </View>
                        )}

                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-base font-pmedium text-gray-500 mb-1">Tags</Text>
                                <View className="flex-row flex-wrap">
                                    {question.tags.map((tag: string, index: number) => (
                                        <View key={index} className="bg-indigo-100 px-2 py-1 rounded-full mr-2 mb-2">
                                            <Text className="text-xs font-pmedium text-indigo-700">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-between p-4 border-t border-gray-200">
                        <EditButton
                            itemId={question.id}
                            loading={loading}
                            variant="text"
                            onNavigate={onEdit}
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

export default QuestionPreviewModal;