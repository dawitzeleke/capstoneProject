import { View, Text, TextInput } from 'react-native';

type HintInputProps = {
  value: string;
  onChange: (text: string) => void;
};

const HintInput = ({ value, onChange }: HintInputProps) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4 border-b border-slate-200">
    <Text className="text-lg font-psemibold text-slate-800 mb-2">
      Hint (Optional)
    </Text>
    <TextInput
      multiline
      placeholder="You can add a hint to help students"
      placeholderTextColor="#94a3b8"
      className="min-h-[80px] text-base text-black font-pregular border-b border-slate-200 px-2"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default HintInput;