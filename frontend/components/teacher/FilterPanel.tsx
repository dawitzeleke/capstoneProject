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
  onClearAll: () => void;
  mediaTypes: string[];
  selectedMediaTypes: string[];
  onMediaTypeChange: (values: string[]) => void;
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
  onClose,
  onClearAll,
  mediaTypes,
  selectedMediaTypes,
  onMediaTypeChange
}: FilterPanelProps) => {
  // Generate grades 9-12
  const allGrades = [9, 10, 11, 12];
  // Common point values
  const commonPoints = [1, 2, 3, 5, 10, 15, 20];

  return (
    <View className="bg-white border-b border-gray-200">
      {/* Filter Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
        <Text style={{ flex: 1, fontWeight: '600', fontSize: 18, color: '#1e293b' }}>Filters</Text>
        <Pressable onPress={onClearAll} style={{ marginRight: 12 }}>
          <Text style={{ color: '#4F46E5', fontWeight: '500', fontSize: 16 }}>Clear</Text>
        </Pressable>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView className="max-h-96 px-4 py-3" showsVerticalScrollIndicator={false}>
        {/* Content Type Filter */}
        <FilterSection
          title="Content Type"
          items={mediaTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1))}
          selected={selectedMediaTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1))}
          onChange={(values) => onMediaTypeChange(values.map((value: string) => value.toLowerCase()))}
        />
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
          title="Grade (9-12)"
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