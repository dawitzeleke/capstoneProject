import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface CourseNameInputProps {
  value: string;
  onChange: (text: string) => void;
  error: boolean;
  submitted: boolean;
}

const CourseNameInput: React.FC<CourseNameInputProps> = ({
  value,
  onChange,
  error,
  submitted
}) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">
        Course Name <Text className="text-red-500">*</Text>
      </Text>
      <TextInput
        className={`border rounded-lg px-3 py-2 ${
          error && submitted ? 'border-red-500' : 'border-gray-300'
        }`}
        value={value}
        onChangeText={onChange}
        placeholder="Enter course name"
      />
      {error && submitted && (
        <Text className="text-red-500 text-sm mt-1">Course name is required</Text>
      )}
    </View>
  );
};

export default CourseNameInput; 