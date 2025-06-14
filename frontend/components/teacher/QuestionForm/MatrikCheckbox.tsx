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
    submitted: boolean; // THIS LINE IS ADDED/UPDATED
}

const MatrikCheckbox = ({ formState, setFormState, validationErrors, submitted }: MatrikCheckboxProps) => { // 'submitted' is added here
    const handleToggle = () => {
        setFormState(prev => ({ 
            ...prev, 
            isMatrik: !prev.isMatrik,
            year: !prev.isMatrik ? prev.year : '' // Clear year when unchecking
        }));
    };

    return (
        <View className="mb-4">
            <Pressable
                onPress={handleToggle}
                className="flex-row items-center mb-2"
            >
                <View className={`w-5 h-5 border-2 rounded mr-2 flex items-center justify-center ${formState.isMatrik ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {formState.isMatrik ? <Ionicons name="checkmark" size={14} color="white" /> : null}
                </View>
                <Text className="text-base text-gray-700 font-pmedium">Matrik</Text>
            </Pressable>
            {validationErrors.isMatrik ? (
                <Text className="text-red-500 text-sm font-pregular mt-1">{validationErrors.isMatrik}</Text>
            ) : null}

            {formState.isMatrik ? (
                <View className="bg-white rounded-xl shadow p-4 mb-4 border-b border-slate-200">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-lg font-psemibold text-slate-800">Year</Text>
                        {validationErrors.year && submitted && (
                            <Text className="text-red-500 text-xs">Required</Text>
                        )}
                    </View>
                    <TextInput
                        multiline
                        placeholder="Enter year"
                        placeholderTextColor="#94a3b8"
                        className={`min-h-[30px] text-base text-black font-pregular px-2 ${
                            validationErrors.year && submitted ? "border-2 border-red-200 bg-red-50 rounded" : "border-b border-slate-200"
                        }`}
                        value={formState.year}
                        onChangeText={(text) => setFormState(prev => ({ ...prev, year: text }))}
                        keyboardType="numeric"
                        maxLength={4}
                    />
                    {validationErrors.year ? (
                        <Text className="text-red-500 text-sm font-pregular mt-1">{validationErrors.year}</Text>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
};

export default MatrikCheckbox;