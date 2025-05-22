import { View, Text, Pressable, ScrollView } from 'react-native';
import { DifficultyLevel } from '@/types/questionTypes';

type DifficultySelectorProps = {
  value: DifficultyLevel | null;
  onChange: (difficulty: DifficultyLevel) => void;
  error: boolean;
  submitted: boolean;
};

const difficulties: DifficultyLevel[] = [
  DifficultyLevel.Easy,
  DifficultyLevel.Medium,
  DifficultyLevel.Hard
];

const DifficultySelector = ({ value, onChange, error, submitted }: DifficultySelectorProps) => {
  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Difficulty Level<Text className="text-red-500 m-1 text-lg">*</Text>
        </Text>
        {submitted && error && (
          <Text className="text-red-500 text-xs">Required</Text>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="pb-2"
      >
        <View className="flex-row gap-2">
          {difficulties.map((difficulty) => (
            <Pressable
              key={difficulty}
              onPress={() => onChange(difficulty)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${difficulty} difficulty`}
              className={`min-w-[80px] px-1 py-2 rounded-full items-center justify-center ${
                value === difficulty 
                  ? 'bg-indigo-600'
                  : 'bg-indigo-50'
              } ${
                submitted && error ? 'border-2 border-red-200' : ''
              }`}
              style={{ backgroundColor: value === difficulty ? '#4F46E5' : undefined }}
            >
              <Text className={`text-base font-pmedium ${
                value === difficulty ? 'text-white' : 'text-indigo-700'
              }`}>
                {difficulty}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default DifficultySelector;