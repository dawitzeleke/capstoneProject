import { View, Text, TextInput } from 'react-native';

type HintInputProps = {
  value: string;
  onChange: (text: string) => void;
};

const HintInput = ({ value, onChange }: HintInputProps) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4">
    <Text className="text-base font-psemibold text-slate-800 mb-2">
      Hint (Optional)
    </Text>
    <TextInput
      multiline
      placeholder="You can add a hint to help students"
      placeholderTextColor="#94a3b8"
      className="min-h-[80px] text-sm text-slate-700"
      value={value}
      onChangeText={onChange}
    />
  </View>
);

export default HintInput;