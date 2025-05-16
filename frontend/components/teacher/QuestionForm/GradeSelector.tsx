import { View, Text, Pressable, ScrollView } from 'react-native';

type GradeSelectorProps = {
  value: number | null;
  onChange: (grade: number) => void;
  error: boolean;
  submitted: boolean;
};

const GradeSelector = ({ value, onChange, error, submitted }: GradeSelectorProps) => {
  const grades = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Grade Level<Text className="text-red-500 m-1 text-lg">*</Text>
        </Text>
        {submitted && error && (
          <Text className="text-red-500 text-xs">Required</Text>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
         scrollIndicatorInsets={{ bottom: 2 }}
        className="pb-2"
      >
        <View className="flex-row gap-2">
          {grades.map((grade) => (
            <Pressable
              key={grade}
              onPress={() => onChange(grade)}
              accessibilityRole="button"
              accessibilityLabel={`Select grade ${grade}`}
              className={`w-12 h-12 rounded-lg items-center justify-center ${
                value === grade 
                  ? 'bg-indigo-600' 
                  : 'bg-indigo-50'
              } ${
                submitted && error ? 'border-2 border-red-200' : ''
              }`}
            >
              <Text className={`text-lg font-pmedium ${
                value === grade ? 'text-white' : 'text-indigo-700'
              }`}>
                {grade}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default GradeSelector;