import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StrictOptions } from '@/redux/teacherReducer/contentSlice'; 



type OptionsGridProps = {
  options: StrictOptions;
  correctAnswer: number;
  onOptionChange: (text: string, index: number) => void;
  onCorrectAnswer: (index: number) => void;
  errors: boolean[];
  correctAnswerError: boolean;
  submitted: boolean;
};

const FormGroup: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4">
    <Text className="text-lg font-psemibold text-slate-800 mb-2">
      {label}
      {required && <Text className="text-red-500 m-1 text-xl">*</Text>}
    </Text>
    {children}
  </View>
);

const OptionsGrid = ({
  options,
  correctAnswer,
  onOptionChange,
  onCorrectAnswer,
  errors,
  correctAnswerError,
  submitted,
}: OptionsGridProps) => {
  const [heights, setHeights] = useState<number[]>(() => [40, 40, 40, 40]);

  const handleContentSizeChange = useCallback(
    (index: number) => 
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const newHeight = Math.max(40, e.nativeEvent.contentSize.height + 12);
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
    <FormGroup label="Options" required>
      {options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const hasError = submitted && errors[index];

        return (
          <View key={index} className="flex-row items-start mb-4 flex-wrap">
            <Pressable
              onPress={() => onCorrectAnswer(index)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="radio"
              accessibilityLabel={`Mark option ${letter} as correct`}
              accessibilityState={{ selected: correctAnswer === index }}
              className="mr-2 mt-1"
            >
              <Ionicons
                name={correctAnswer === index ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={correctAnswer === index ? '#4F46E5' : '#cbd5e1'}
              />
            </Pressable>

            <Text className="w-6 text-lg font-pmedium text-indigo-700 mt-1">
              {letter}.
            </Text>

            <TextInput
              placeholder={`Option ${letter}…`}
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              className={`flex-1 text-base py-1 font-pregular ${
                hasError
                  ? 'border-2 border-red-200 bg-red-50 rounded px-2'
                  : 'border-b border-slate-200 text-black'
              }`}
              style={{ 
                height: heights[index],
                minHeight: 20,
                maxHeight: 40 
              }}
              onContentSizeChange={handleContentSizeChange(index)}
              value={option}
              onChangeText={text => onOptionChange(text.trim(), index)}
              accessibilityLabel={`Option ${letter} text input`}
            />
          </View>
        );
      })}

      {submitted && correctAnswerError && (
        <Text className="text-red-500 text-sm mt-2 ml-2">
          Please select the correct answer
        </Text>
      )}
    </FormGroup>
  );
};

export default OptionsGrid;