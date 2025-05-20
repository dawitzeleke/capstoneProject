// src/components/teacher/TitleInput.tsx
import { Text, TextInput, View } from 'react-native';

type TitleInputProps = {
  value: string;
  onChange: (text: string) => void;
  error: boolean;
  submitted: boolean;
  placeholder?: string;
  label?: string;
};

const TitleInput = ({ 
  value, 
  onChange, 
  error, 
  submitted,
  placeholder = "Enter title",
  label = "Title"
}: TitleInputProps) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-psemibold text-slate-800">
        {label}<Text className="text-red-500 m-1 text-lg">*</Text>
      </Text>
      {submitted && error && (
        <Text className="text-red-500 text-xs">Required</Text>
      )}
    </View>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      className={`text-base text-black font-pregular ${
        submitted && error ? "border-2 border-red-200 bg-red-50 rounded px-2" : ""
      }`}
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default TitleInput;