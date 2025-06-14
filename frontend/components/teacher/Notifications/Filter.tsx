
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { NotificationType } from '@/redux/teacherReducer/notificationsSlice';

type FilterOption = NotificationType | 'all';

interface Props {
  filter: FilterOption;
  onChange: (filter: FilterOption) => void;
}

// Display labels for each filter key
const FILTER_LABELS: Record<FilterOption, string> = {
  all: 'All',
  follower: 'Follows',
  like: 'Likes',
  comment: 'Comments',
  report: 'Reports',
  rating: 'Ratings',
};

const Filter: React.FC<Props> = ({ filter, onChange }) => {
  const options: FilterOption[] = [
    'all',
    'follower',
    'like',
    'comment',
    'report',
    'rating',
  ];

  return (
    <View className="py-2 border-b border-gray-300 bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {options.map((option) => {
          const isActive = option === filter;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              className={`py-1.5 px-3 mr-2 rounded-full ${
                isActive ? 'bg-[#4F46E5]' : 'bg-indigo-100'
              }`}
            >
              <Text
                className={`text-sm ${
                  isActive ? 'text-white font-psemibold' : 'text-[#4F46E5] font-pregular'
                }`}
              >
                {FILTER_LABELS[option]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Filter;