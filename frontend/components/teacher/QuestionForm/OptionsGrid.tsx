import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type OptionsGridProps = {
  options: [string, string, string, string];
  correctAnswer: number;
  onOptionChange: (text: string, index: number) => void;
  onCorrectAnswer: (index: number) => void;
  errors: boolean[];
  correctAnswerError: boolean;
  submitted: boolean;
};

const OptionsGrid = ({
  options,
  correctAnswer,
  onOptionChange,
  onCorrectAnswer,
  errors,
  correctAnswerError,
  submitted
}: OptionsGridProps) => (
  <View className="bg-white rounded-xl shadow p-4 mb-4">
    <Text className="text-base font-psemibold text-slate-800 mb-2">
      Options<Text className="text-red-500">*</Text>
    </Text>
    
    {options.map((option, index) => (
      <View key={index} className="flex-row items-center mb-2">
        <Pressable
          onPress={() => onCorrectAnswer(index)}
          className="p-2 mr-2"
        >
          <Ionicons
            name={correctAnswer === index ? "radio-button-on" : "radio-button-off"}
            size={20}
            color="#4F46E5"
          />
        </Pressable>
        
        <Text className="w-6 text-sm font-pmedium text-indigo-700">
          {String.fromCharCode(65 + index)}.
        </Text>
        
        <TextInput
          placeholder={`Option ${String.fromCharCode(65 + index)}...`}
          placeholderTextColor="#94a3b8"
          className={`flex-1 border-b text-sm py-1 ${
            submitted && errors[index] 
              ? "border-red-200 bg-red-50 rounded px-2" 
              : "border-slate-200 text-slate-700"
          }`}
          value={option}
          onChangeText={(text) => onOptionChange(text, index)}
        />
      </View>
    ))}

    {submitted && correctAnswerError && (
      <Text className="text-red-500 text-xs mt-2 ml-2">
        Please select the correct answer
      </Text>
    )}
  </View>
);

export default OptionsGrid;