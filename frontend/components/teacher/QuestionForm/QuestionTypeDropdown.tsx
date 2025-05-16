import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type QuestionTypeDropdownProps = {
  value: string | null;
  onChange: (type: string) => void;
  error: boolean;
  submitted: boolean;
};

const questionTypes = [
  'MultipleChoice',
  'TrueFalse', 
  'ProblemSolving',
  'Code'
];

const QuestionTypeDropdown = ({ value, onChange, error, submitted }: QuestionTypeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayValue = value ? value.replace(/([A-Z])/g, ' $1').trim() : 'Select Question Type';

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Question Type<Text className="text-red-500 m-1 text-lg">*</Text>
        </Text>
        {submitted && error && (
          <Text className="text-red-500 text-xs">Required</Text>
        )}
      </View>

      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className={`h-12 px-4 flex-row items-center justify-between rounded-lg border ${
          submitted && error ? 'border-red-200 bg-red-50' : 'border-slate-200'
        }`}
        accessibilityRole="combobox"
      >
        <Text className={`text-base font-pregular ${value ? 'text-black font-pregular' : 'text-slate-400 font-pregular'}`}>
          {displayValue}
        </Text>
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#64748b" 
        />
      </Pressable>

      {isOpen && (
        <View className="mt-2 border border-slate-100 rounded-lg bg-white max-h-40 font-pregular">
          <ScrollView>
            {questionTypes.map((type) => {
              const displayType = type.replace(/([A-Z])/g, ' $1').trim();
              
              return (
                <Pressable
                  key={type}
                  onPress={() => {
                    onChange(type);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 ${
                    value === type ? 'bg-indigo-50' : 'bg-white'
                  }`}
                  accessibilityRole="menuitem"
                >
                  <Text className={`text-base ${
                    value === type ? 'text-indigo-700 font-psemibold' : 'text-slate-600 font-pregular'
                  }`}>
                    {displayType}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default QuestionTypeDropdown;