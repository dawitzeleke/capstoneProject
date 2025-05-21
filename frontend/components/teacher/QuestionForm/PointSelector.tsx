import { View, Text, Pressable, ScrollView } from 'react-native';

type PointSelectorProps = {
  value: number;
  onChange: (point: number) => void;
  error: boolean;
  submitted: boolean;
};

const PointSelector = ({ value, onChange, error, submitted }: PointSelectorProps) => {
  const points = [1, 2, 3, 5, 10, 15, 20];

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Points<Text className="text-red-500 m-1 text-lg">*</Text>
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
          {points.map((point) => (
            <Pressable
              key={point}
              onPress={() => onChange(point)}
              className={`w-12 h-12 rounded-lg items-center justify-center ${
                value === point ? 'bg-indigo-600' : 'bg-indigo-50'
              } ${submitted && error ? 'border-2 border-red-200' : ''}`}
            >
              <Text className={`text-lg font-pmedium ${
                value === point ? 'text-white' : 'text-indigo-700'
              }`}>
                {point}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PointSelector;