// components/teacher/FilterPanel.tsx
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { DifficultyLevel, QuestionTypeEnum } from '@/types/questionTypes';
import { Ionicons } from '@expo/vector-icons';

interface FilterPanelProps {
  difficulties: DifficultyLevel[];
  selectedDifficulties: DifficultyLevel[];
  onDifficultyChange: (values: DifficultyLevel[]) => void;
  questionTypes: QuestionTypeEnum[];
  selectedTypes: QuestionTypeEnum[];
  onTypeChange: (values: QuestionTypeEnum[]) => void;
  grades: number[];
  selectedGrades: number[];
  onGradeChange: (values: number[]) => void;
  points: number[];
  selectedPoints: number[];
  onPointChange: (values: number[]) => void;
  onClose: () => void;
}

const FilterPanel = ({
  difficulties,
  selectedDifficulties,
  onDifficultyChange,
  questionTypes,
  selectedTypes,
  onTypeChange,
  grades,
  selectedGrades,
  onGradeChange,
  points,
  selectedPoints,
  onPointChange,
  onClose
}: FilterPanelProps) => {
  // Generate grades 1-12
  const allGrades = Array.from({length: 12}, (_, i) => i + 1);
  // Common point values
  const commonPoints = [1, 2, 3, 5, 10, 15, 20];

  return (
    <View className="bg-white border-b border-gray-200">
      {/* Filter Header */}
      <View className="flex-row justify-between items-center px-4 py-1 border-b border-gray-100">
        <Text className="text-lg font-psemibold text-gray-800">Filters</Text>
        <Pressable onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView className="max-h-96 px-4 py-3" showsVerticalScrollIndicator={false}>
        <FilterSection 
          title="Difficulty Level"
          items={difficulties}
          selected={selectedDifficulties}
          onChange={onDifficultyChange}
        />
        
        <FilterSection
          title="Question Type"
          items={questionTypes}
          selected={selectedTypes}
          onChange={onTypeChange}
        />
        
        <FilterSection
          title="Grade (1-12)"
          items={allGrades}
          selected={selectedGrades}
          onChange={onGradeChange}
        />
        
        <FilterSection
          title="Points Value"
          items={commonPoints}
          selected={selectedPoints}
          onChange={onPointChange}
        />
      </ScrollView>
    </View>
  );
};

const FilterSection = ({ title, items, selected, onChange }: any) => (
  <View className="mb-4">
    <Text className="text-sm font-pmedium text-gray-700 mb-2">{title}</Text>
    <View className="flex-row flex-wrap gap-2">
      {items.map((item: string | number) => (
        <Pressable
          key={item}
          onPress={() => {
            const newSelection = selected.includes(item)
              ? selected.filter((i: any) => i !== item)
              : [...selected, item];
            onChange(newSelection);
          }}
          className={`px-3 py-1 rounded-lg ${
            selected.includes(item) 
              ? 'bg-indigo-100 border border-indigo-300'
              : 'bg-[#EAEAEA] border border-gray-200'
          }`}
        >
          <Text className={`text-sm ${
            selected.includes(item) 
              ? 'text-indigo-700 font-pmedium' 
              : 'text-gray-700 font-pmedium'
          }`}>
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
);

export default FilterPanel;