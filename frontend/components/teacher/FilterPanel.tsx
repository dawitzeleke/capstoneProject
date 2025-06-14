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
  onClose: () => void;
  onClearAll: () => void;
  mediaTypes: string[];
  selectedMediaTypes: string[];
  onMediaTypeChange: (values: string[]) => void;
  selectedStreams: string[];
  onStreamChange: (values: string[]) => void;
  selectedMatrik: boolean;
  onMatrikChange: (value: boolean) => void;
}

const streams = [
  'Natural Science',
  'Social Science',
  'Business',
  'Technology'
];

interface FilterSectionProps<T> {
  title: string;
  items: T[];
  selected?: T[];
  onChange: (values: T[]) => void;
}

const FilterSection = <T extends string | number | DifficultyLevel | QuestionTypeEnum>({ 
  title, 
  items, 
  selected = [], 
  onChange 
}: FilterSectionProps<T>) => {
  const safeSelected = selected || [];
  
  return (
    <View className="mb-5">
      <Text className="text-sm font-pmedium text-gray-700 mb-2">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = safeSelected.includes(item);
          return (
            <Pressable
              key={String(item)}
              onPress={() => {
                const newSelection = isSelected
                  ? safeSelected.filter((i) => i !== item)
                  : [...safeSelected, item];
                onChange(newSelection);
              }}
              className={`px-3 py-1 rounded-lg ${
                isSelected
                  ? 'bg-indigo-100 border border-indigo-300'
                  : 'bg-[#EAEAEA] border border-gray-200'
              }`}
            >
              <Text className={`text-sm ${
                isSelected
                  ? 'text-indigo-700 font-pmedium' 
                  : 'text-gray-700 font-pmedium'
              }`}>
                {String(item)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const FilterPanel = ({
  difficulties,
  selectedDifficulties = [],
  onDifficultyChange,
  questionTypes,
  selectedTypes = [],
  onTypeChange,
  grades,
  selectedGrades = [],
  onGradeChange,
  onClose,
  onClearAll,
  mediaTypes,
  selectedMediaTypes = [],
  onMediaTypeChange,
  selectedStreams = [],
  onStreamChange,
  selectedMatrik = false,
  onMatrikChange
}: FilterPanelProps) => {
  // Generate grades 9-12
  const allGrades = [9, 10, 11, 12];

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

      <ScrollView className="max-h-72 px-4 py-3" showsVerticalScrollIndicator={true}>
        {/* Content Type Filter */}
        <FilterSection<string>
          title="Content Type"
          items={mediaTypes.map(type => type.toUpperCase())} // Ensure media types are in lowercase 
          selected={selectedMediaTypes}
          onChange={onMediaTypeChange}
        />

        {/* Stream Filter */}
        <FilterSection<string>
          title="Stream"
          items={streams}
          selected={selectedStreams}
          onChange={onStreamChange}
        />

        {/* Matrik Filter */}
        <View className="mb-5">
          <Text className="text-sm font-pmedium text-gray-700 mb-2">Matrik</Text>
          <View className="flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => onMatrikChange(!selectedMatrik)}
              className={`px-3 py-1 rounded-lg ${
                selectedMatrik 
                  ? 'bg-indigo-100 border border-indigo-300'
                  : 'bg-[#EAEAEA] border border-gray-200'
              }`}
            >
              <Text className={`text-sm ${
                selectedMatrik 
                  ? 'text-indigo-700 font-pmedium' 
                  : 'text-gray-700 font-pmedium'
              }`}>
                Matrik
              </Text>
            </Pressable>
          </View>
        </View>

        <FilterSection<DifficultyLevel>
          title="Difficulty Level"
          items={difficulties}
          selected={selectedDifficulties}
          onChange={onDifficultyChange}
        />
        
        <FilterSection<QuestionTypeEnum>
          title="Question Type"
          items={questionTypes}
          selected={selectedTypes}
          onChange={onTypeChange}
        />
        
        <FilterSection<number>
          title="Grade (9-12)"
          items={allGrades}
          selected={selectedGrades}
          onChange={onGradeChange}
        />
      </ScrollView>
    </View>
  );
};

export default FilterPanel;