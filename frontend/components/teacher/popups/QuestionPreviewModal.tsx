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
            animationType="fade"
            onRequestClose={loading ? undefined : onClose}
            statusBarTranslucent
        >
            <View className="flex-1 bg-black/50 justify-center items-center z-[1000]">
                <View className="bg-white w-[90%] max-h-[80%] rounded-lg p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold">Question Preview</Text>
                        <Pressable
                            onPress={onClose}
                            disabled={loading}
                            className={`${loading ? 'opacity-50' : ''}`}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </Pressable>
                    </View>

                    <ScrollView className="flex-1">
                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm text-gray-500">Course</Text>
                                <Text className="text-base">{question.courseName}</Text>
                            </View>

                            <View>
                                <Text className="text-sm text-gray-500">Question</Text>
                                <Text className="text-base">{question.questionText}</Text>
                            </View>

                            <View>
                                <Text className="text-sm text-gray-500">Options</Text>
                                {question.options.map((option, index) => (
                                    <View key={index} className="flex-row items-center mt-1">
                                        <Text className="text-base">
                                            {String.fromCharCode(65 + index)}. {option}
                                        </Text>
                                        {option === question.correctOption && (
                                            <Ionicons name="checkmark-circle" size={20} color="#16a34a" className="ml-2" />
                                        )}
                                    </View>
                                ))}
                            </View>

                            {question.explanation && (
                                <View>
                                    <Text className="text-sm text-gray-500">Explanation</Text>
                                    <Text className="text-base">{question.explanation}</Text>
                                </View>
                            )}

                            {question.hint && (
                                <View>
                                    <Text className="text-sm text-gray-500">Hint</Text>
                                    <Text className="text-base">{question.hint}</Text>
                                </View>
                            )}

                            <View>
                                <Text className="text-sm text-gray-500">Tags</Text>
                                <View className="flex-row flex-wrap gap-2 mt-1">
                                    {question.tags.map((tag, index) => (
                                        <View key={index} className="bg-[#eae9fc] border border-[#bfbcf6] px-2 py-1 rounded-xl">
                                            <Text className="text-sm">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="text-sm text-gray-500">Grade</Text>
                                    <Text className="text-base">{question.grade}</Text>
                                </View>
                                <View>
                                    <Text className="text-sm text-gray-500">Difficulty</Text>
                                    <Text className="text-base">{question.difficulty}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View className="flex-row justify-end space-x-2 mt-4">
                        {mode === 'edit' ? (
                            <>
                                <Pressable
                                    onPress={onEdit}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded ${loading
                                            ? 'bg-gray-300 opacity-50'
                                            : 'bg-gray-200'
                                        }`}
                                >
                                    <Text>Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={onConfirm}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded ${loading
                                            ? 'bg-blue-300'
                                            : 'bg-blue-500'
                                        }`}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white">Confirm</Text>
                                    )}
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Pressable
                                    onPress={onDelete}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded ${loading
                                            ? 'bg-red-300 opacity-50'
                                            : 'bg-red-500'
                                        }`}
                                >
                                    <Text className="text-white">Delete</Text>
                                </Pressable>
                                <Pressable
                                    onPress={onEdit}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded ${loading
                                            ? 'bg-blue-300 opacity-50'
                                            : 'bg-blue-500'
                                        }`}
                                >
                                    <Text className="text-white">Edit</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default QuestionPreviewModal;