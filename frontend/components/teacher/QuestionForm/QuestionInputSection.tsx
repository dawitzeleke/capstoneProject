import { Text, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (text: string) => void;
  error: boolean;
  submitted: boolean;
};

const QuestionInputSection = ({ value, onChange, error, submitted }: Props) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4 border-b border-slate-200">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-psemibold text-slate-800">
        Question<Text className="text-red-500 m-1 text-xl">*</Text>
      </Text>
      {submitted && error && (
        <Text className="text-red-500 text-xs">Required</Text>
      )}
    </View>
    <TextInput
      multiline
      placeholder="Start writing your question here..."
      placeholderTextColor="#94a3b8"
      className={`min-h-[100px] text-base text-black font-pregular px-2 ${
        submitted && error ?  "border-2 border-red-200 bg-red-50 rounded" : "border-b border-slate-200"
      }`}
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default QuestionInputSection;