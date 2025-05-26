import { View, Text, TextInput } from 'react-native';

type ChapterInputProps = {
  value: string;
  onChange: (text: string) => void;
  error: boolean;
  submitted: boolean;
};

const ChapterInput = ({ value, onChange, error, submitted }: ChapterInputProps) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-psemibold text-slate-800">
        Chapter<Text className="text-red-500 m-1 text-lg">*</Text>
      </Text>
      {submitted && error && (
        <Text className="text-red-500 text-xs">Required</Text>
      )}
    </View>
    <TextInput
      placeholder="Enter chapter number or name"
      placeholderTextColor="#94a3b8"
      className={`h-12 px-4 rounded-lg border text-base font-pregular ${
        submitted && error ? 'border-red-200 bg-red-50' : 'border-slate-200'
      }`}
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default ChapterInput; 