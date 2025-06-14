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
    <View className="bg-white rounded-xl shadow p-4 mb-4 border-b border-slate-200">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Course Name<Text className="text-red-500 m-1 text-lg">*</Text>
        </Text>
        {submitted && error && (
          <Text className="text-red-500 text-xs">Required</Text>
        )}
      </View>
      <TextInput
        placeholder="Enter course name (e.g. Biology)"
        placeholderTextColor="#94a3b8"
        className={`text-base h-12 px-2 text-black font-pregular ${
          submitted && error ? "border-2 border-red-200 bg-red-50 rounded" : "border-b border-slate-200"
        }`}
        value={value}
        onChangeText={onChange}
        accessibilityLabel="Course name input"
      />
    </View>
  );
};

export default CourseNameInput; 