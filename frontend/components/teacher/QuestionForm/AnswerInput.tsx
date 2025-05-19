import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuestionTypeEnum } from '@/types/questionTypes';

type AnswerInputProps = {
  questionType: QuestionTypeEnum;
  options: string[];
  correctOption: string;
  onOptionChange: (text: string, index: number) => void;
  onCorrectAnswer: (value: string) => void;
  errors: boolean[];
  correctAnswerError: boolean;
  submitted: boolean;
};

const AnswerInput = ({
  questionType,
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

  const isCodeOrProblemSolving = [
    QuestionTypeEnum.Code,
    QuestionTypeEnum.ProblemSolving,
  ].includes(questionType);
  const isTrueFalse = questionType === QuestionTypeEnum.TrueFalse;

  // Reset correct answer when switching question types
  useEffect(() => {
    onCorrectAnswer('');
  }, [questionType]);

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

  if (isCodeOrProblemSolving) {
    return (
      <View className="bg-white rounded-xl shadow p-4 mb-4">
        <Text className="text-lg font-psemibold text-slate-800 mb-2">
          Correct Answer
          <Text className="text-red-500 m-1 text-lg">*</Text>
        </Text>
        <TextInput
          placeholder="Enter correct answer..."
          placeholderTextColor="#94a3b8"
          value={correctOption}
          onChangeText={onCorrectAnswer}
          className={`px-4 rounded-lg border font-pregular  ${
            submitted && correctAnswerError
              ? 'border-red-200 bg-red-50'
              : 'border-slate-200'
          }`}
          style={{
            minHeight: 100,
            textAlignVertical: 'top',
            fontSize: 16,
            paddingVertical: 12,
          }}
          multiline
          numberOfLines={4}
          accessibilityLabel="Correct answer input"
        />
        {submitted && correctAnswerError && (
          <Text className="text-red-500 text-sm font-pregular mt-2">
            Please provide the correct answer!
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <Text className="text-lg font-psemibold text-slate-800 mb-2">
        {isTrueFalse ? 'True/False Options' : 'Options'}
        <Text className="text-red-500 m-1 text-lg">*</Text>
      </Text>

      {(isTrueFalse ? ['True', 'False'] : options).map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const hasError = submitted && (errors[index] || false);
        const isSelected = correctOption === option && option !== '';

        return (
          <View key={`option-${index}`} className="flex-row items-start mb-4">
            <Pressable
              onPress={() => onCorrectAnswer(isSelected ? '' : option)}
              className="mr-3 mt-2"
              accessibilityRole="checkbox"
            >
              <Ionicons
                name={isSelected ? 'checkbox' : 'checkbox-outline'}
                size={24}
                color={isSelected ? '#4F46E5' : '#CBD5E1'}
              />
            </Pressable>

            {!isTrueFalse && (
              <Text className="text-lg font-pmedium text-indigo-700 mt-1.5 mr-2">
                {letter}.
              </Text>
            )}

            <TextInput
              placeholder={isTrueFalse ? '' : `Option ${letter}...`}
              placeholderTextColor="#94a3b8"
              value={option}
              onChangeText={(text) => onOptionChange(text, index)}
              editable={!isTrueFalse}
              className={`flex-1 text-base py-1 font-pregular ${
                hasError ? 'border-red-200 bg-red-50' : 'border-slate-200'
              }`}
              style={{
                borderBottomWidth: 1,
                height: heights[index],
                // minHeight: 40,
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