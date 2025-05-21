import { Text, TextInput, View, ActivityIndicator } from 'react-native';

type TitleInputProps = {
  value: string;
  onChange: (text: string) => void;
  error?: boolean;
  submitted?: boolean;
  loading?: boolean;
  placeholder?: string;
  label?: string;
  maxLength?: number;
};

const TitleInput = ({ 
  value, 
  onChange, 
  error = false,
  submitted = false,
  loading = false,
  placeholder = "Enter title",
  label = "Title",
  maxLength = 100
}: TitleInputProps) => {
  const charCount = value.length;
  const showError = (submitted && error) || charCount > maxLength;

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-psemibold text-slate-800">
          {label}
          <Text className="text-red-500"> *</Text>
        </Text>
        {loading && <ActivityIndicator size="small" color="#4F46E5" />}
      </View>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className={`text-base text-black font-pregular border-b border-slate-200  ${
          showError ? "border-2 border-red-200 bg-red-50 rounded px-2" : ""
        }`}
        value={value}
        onChangeText={onChange}
        editable={!loading}
        maxLength={maxLength}
      />

      <View className="flex-row justify-between mt-3">
        {showError && (
          <Text className="text-red-500 text-sm">
            {charCount > maxLength 
              ? `Exceeds ${maxLength} characters` 
              : "Required field"}
          </Text>
        )}
        <Text className={`text-sm ${showError ? 'text-red-500' : 'text-gray-400'}`}>
          {charCount}/{maxLength}
        </Text>
      </View>
    </View>
  );
};

export default TitleInput;