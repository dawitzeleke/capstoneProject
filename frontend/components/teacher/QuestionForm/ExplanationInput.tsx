import { View, Text, TextInput } from 'react-native';

type ExplanationInputProps = {
  value: string;
  onChange: (text: string) => void;
  error: boolean;
  submitted: boolean;
};

const ExplanationInput = ({ value, onChange, error, submitted }: ExplanationInputProps) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-psemibold text-slate-800">
        Explanation<Text className="text-red-500 m-1 text-lg">*</Text>
      </Text>
      {submitted && error && (
        <Text className="text-red-500 text-xs">Required</Text>
      )}
    </View>
    <TextInput
      multiline
      placeholder="Explain why the correct answer is correct"
      placeholderTextColor="#94a3b8"
      className={`min-h-[100px] text-base text-black font-pregular ${
        submitted && error ? "border-2 border-red-200 bg-red-50 rounded px-2" : ""
      }`}
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default ExplanationInput;