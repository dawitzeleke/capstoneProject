import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AnswerInputProps = {
  options: string[];
  correctOption: string;
  onOptionChange: (text: string, index: number) => void;
  onCorrectAnswer: (optionValue: string) => void;
  errors: boolean[];
  correctAnswerError: boolean;
  submitted: boolean;
};

const AnswerInput = ({
  options,
  correctOption,
  onOptionChange,
  onCorrectAnswer,
  errors,
  correctAnswerError,
  submitted,
}: AnswerInputProps) => {
  const [heights, setHeights] = useState<number[]>(() => 
    Array(options.length).fill(40)
  );

  const handleContentSizeChange = useCallback(
    (index: number) =>
      (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const newHeight = Math.max(40, Math.round(e.nativeEvent.contentSize.height) + 12);
        setHeights(prev => {
          if (prev[index] === newHeight) return prev;
          const newHeights = [...prev];
          newHeights[index] = newHeight;
          return newHeights;
        });
      },
    []
  );

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <Text className="text-lg font-psemibold text-slate-800 mb-2">
        Options<Text className="text-red-500 m-1 text-lg">*</Text>
      </Text>

      {options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const hasError = submitted && (errors[index] || false);
        const isSelected = correctOption === option && option.trim() !== "";

        return (
          <View key={`option-${index}`} className="flex-row items-start mb-4">
            <Pressable
              onPress={() => onCorrectAnswer(option)}
              className="mr-3 mt-2"
              accessibilityRole="checkbox"
            >
              <Ionicons
                name={isSelected ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={isSelected ? '#4F46E5' : '#CBD5E1'}
              />
            </Pressable>

            <Text className="text-lg font-pmedium text-indigo-700 mt-1.5 mr-2">
              {letter}.
            </Text>

            <TextInput
              placeholder={`Option ${letter}...`}
              placeholderTextColor="#94a3b8"
              value={option}
              onChangeText={(text) => onOptionChange(text, index)}
              className={`flex-1 text-base py-1 font-pregular ${
                hasError ? 'border-red-200 bg-red-50' : 'border-slate-200'
              }`}
              style={{
                borderBottomWidth: 1,
                height: heights[index],
                maxHeight: 40,
              }}
              onContentSizeChange={handleContentSizeChange(index)}
              multiline
              textAlignVertical="top"
            />
          </View>
        );
      })}

      {submitted && correctAnswerError && (
        <Text className="text-red-500 text-sm font-pregular mt-2">
          Please select the correct answer!
        </Text>
      )}
    </View>
  );
};

export default AnswerInput;