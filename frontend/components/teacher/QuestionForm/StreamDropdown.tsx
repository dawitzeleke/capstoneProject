import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type StreamDropdownProps = {
  value: string;
  onChange: (stream: string) => void;
  error: boolean;
  submitted: boolean;
};

const streams = [
  'Natural Science',
  'Social Science',
  'Business',
  'Technology'
];

const StreamDropdown = ({ value, onChange, error, submitted }: StreamDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Stream<Text className="text-red-500 m-1 text-lg">*</Text>
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
        <Text className={`text-base font-pregular ${value ? 'text-black' : 'text-slate-400'}`}>
          {value || 'Select Stream'}
        </Text>
        <Ionicons 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#64748b" 
        />
      </Pressable>

      {isOpen && (
        <View className="mt-2 border border-slate-100 rounded-lg bg-white max-h-40">
          <ScrollView>
            {streams.map((stream) => (
              <Pressable
                key={stream}
                onPress={() => {
                  onChange(stream);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 ${
                  value === stream ? 'bg-indigo-50' : 'bg-white'
                }`}
                accessibilityRole="menuitem"
              >
                <Text className={`text-base ${
                  value === stream ? 'text-indigo-700 font-psemibold' : 'text-slate-600 font-pregular'
                }`}>
                  {stream}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default StreamDropdown; 