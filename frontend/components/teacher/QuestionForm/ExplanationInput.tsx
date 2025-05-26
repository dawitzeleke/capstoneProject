import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface ExplanationInputProps {
  value: string;
  onChange: (text: string) => void;
  error: boolean;
  submitted: boolean;
}

const ExplanationInput: React.FC<ExplanationInputProps> = ({
  value,
  onChange,
  error,
  submitted,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-base font-pmedium text-gray-600 mb-2">
        Hint {submitted && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        className={`p-3 border rounded-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        value={value}
        onChangeText={onChange}
        placeholder="Enter a hint for the question"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">Hint is required</Text>
      )}
    </View>
  );
};

export default ExplanationInput;