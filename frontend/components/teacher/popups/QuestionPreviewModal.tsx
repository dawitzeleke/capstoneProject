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
            <View
                className="flex-1 bg-black/50 justify-center items-center"
                style={{ elevation: 2 }} // Android fix
                pointerEvents="box-none" // Prevent touch conflicts
            >
                <View className="bg-white w-[95%] max-h-[90%] min-h-[500] rounded-lg p-4">
                    <View>
                         <View className="flex-row justify-between items-center mb-4 ">

                        <Text className="text-lg font-semibold ">Question Preview</Text>
                        <Pressable
                            onPress={onClose}
                            disabled={loading}
                            className={`${loading ? 'opacity-50' : ''}`}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </Pressable>
                        </View>
                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        <View className="space-y-4">
                            {/* Course and Grade Section */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 mb-2">
                                    <Text className="text-sm text-gray-500">Course</Text>
                                    <Text className="text-base font-medium">{question.courseName}</Text>
                                </View>
                                <View className="ml-4 mb-2">
                                    <Text className="text-sm text-gray-500">Grade</Text>
                                    <Text className="text-base font-medium">{question.grade}</Text>
                                </View>
                            </View>

                            {/* Stream and Chapter Section */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 mb-2">
                                    <Text className="text-sm text-gray-500">Stream</Text>
                                    <Text className="text-base font-medium">{question.stream}</Text>
                                </View>
                                <View className="ml-4 mb-2">
                                    <Text className="text-sm text-gray-500">Chapter</Text>
                                    <Text className="text-base font-medium">{question.chapter}</Text>
                                </View>
                            </View>

                            {/* Question Type and Difficulty Section */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 mb-2">
                                    <Text className="text-sm text-gray-500">Difficulty</Text>
                                    <Text className="text-base font-medium">{question.difficulty}</Text>
                                </View>
                            </View>

                            {/* Question Text Section */}
                            <View className="bg-gray-50 p-3 rounded-lg mb-2">
                                <Text className="text-sm text-gray-500 mb-1">Question</Text>
                                <Text className="text-base">{question.questionText}</Text>
                            </View>

                            {/* Options Section */}
                            <View className="bg-gray-50 p-3 rounded-lg mb-2">
                                <Text className="text-sm text-gray-500 mb-2">Options</Text>
                                {question.options.map((option, index) => (
                                    <View key={index} className="flex-row items-center mt-1 bg-white p-2 rounded">
                                        <Text className="text-base flex-1">
                                            {String.fromCharCode(65 + index)}. {option}
                                        </Text>
                                        {option === question.correctOption && (
                                            <Ionicons name="checkmark-circle" size={20} color="#16a34a" className="ml-2" />
                                        )}
                                    </View>
                                ))}
                            </View>

                            {/* Explanation Section */}
                            {!!question.explanation && (
                                <View className="bg-gray-50 p-3 rounded-lg mb-2">
                                    <Text className="text-sm text-gray-500 mb-1">Explanation</Text>
                                    <Text className="text-base">{question.explanation}</Text>
                                </View>
                            )}

                            {/* Hint Section */}
                            {!!question.hint && (
                                <View className="bg-gray-50 p-3 rounded-lg mb-2">
                                    <Text className="text-sm text-gray-500 mb-1">Hint</Text>
                                    <Text className="text-base">{question.hint}</Text>
                                </View>
                            )}

                            {/* Tags Section */}
                            <View className="bg-gray-50 p-3 rounded-lg">
                                <Text className="text-sm text-gray-500 mb-2">Tags</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {question.tags.map((tag, index) => (
                                        <View key={index} className="bg-indigo-100 px-3 py-1 rounded-full">
                                            <Text className="text-sm text-indigo-700">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View className="flex-row justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                        {mode === "edit" ? (
                            <>
                                <Pressable
                                    onPress={onEdit}
                                    disabled={loading}
                                    className={`mx-2 px-4 py-2 rounded-lg ${loading
                                        ? 'bg-gray-300 opacity-50'
                                        : 'bg-gray-200'
                                        }`}
                                >
                                    <Text className="font-medium">Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={onConfirm}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-lg ${loading
                                        ? 'bg-indigo-400'
                                        : 'bg-[#4F46E5]'
                                        }`}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-medium">Confirm</Text>
                                    )}
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Pressable
                                    onPress={onDelete}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-lg ${loading
                                        ? 'bg-red-300 opacity-50'
                                        : 'bg-red-500'
                                        }`}
                                >
                                    <Text className="text-white font-medium">Delete</Text>
                                </Pressable>
                                <Pressable
                                    onPress={onEdit}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-lg ${loading
                                        ? 'bg-blue-300 opacity-50'
                                        : 'bg-blue-500'
                                        }`}
                                >
                                    <Text className="text-white font-medium">Edit</Text>
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