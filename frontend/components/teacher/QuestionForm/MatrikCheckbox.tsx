import React from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuestionFormState } from "@/types/questionTypes";

interface MatrikCheckboxProps {
    formState: QuestionFormState;
    setFormState: React.Dispatch<React.SetStateAction<QuestionFormState>>;
    validationErrors: {
        isMatrik?: string;
        year?: string;
    };
}

const MatrikCheckbox = ({ formState, setFormState, validationErrors }: MatrikCheckboxProps) => {
    return (
        <View className="mb-4">
            <Pressable
                onPress={() => setFormState(prev => ({ ...prev, isMatrik: !prev.isMatrik }))}
                className="flex-row items-center mb-2"
            >
                <View className={`w-5 h-5 border-2 rounded mr-2 flex items-center justify-center ${formState.isMatrik ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {formState.isMatrik && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text className="text-base text-gray-700 font-pmedium">Matrik</Text>
            </Pressable>
            {validationErrors.isMatrik && (
                <Text className="text-red-500 text-sm font-pregular mt-1">{validationErrors.isMatrik}</Text>
            )}

            {formState.isMatrik && (
                <View className="mt-2">
                    <Text className="text-base text-gray-700 font-pmedium mb-2">Year</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                        <TextInput
                            className="flex-1 text-base text-gray-800 font-pregular"
                            placeholder="Enter year"
                            value={formState.year || ''}
                            onChangeText={(text) => setFormState(prev => ({ ...prev, year: text }))}
                            keyboardType="numeric"
                            maxLength={4}
                        />
                    </View>
                    {validationErrors.year && (
                        <Text className="text-red-500 text-sm font-pregular mt-1">{validationErrors.year}</Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default MatrikCheckbox; 