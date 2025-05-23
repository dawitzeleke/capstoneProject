import React, { useState, useRef } from 'react';
import { View, Text, Pressable, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateRangeFilterProps {
  currentRange: string;
  onSelectRange: (range: string) => void;
}

const ranges = [
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'Last 90 Days', value: 'last_90_days' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'This Year', value: 'this_year' },
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ currentRange, onSelectRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (isOpen) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (range: string) => {
    onSelectRange(range);
    toggleDropdown();
  };

  return (
    <View className={`relative ${isOpen ? 'z-[200]' : 'z-1'}`}>
      <Pressable
        className="flex-row items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white min-w-[120px] mr-2 mb-0.5 shadow-sm shadow-indigo-300/10"
        onPress={toggleDropdown}
      >
        <Text className="text-[#4F46E5] font-medium mr-1.5 text-[15px]">
          Period:
        </Text>
        <Text 
          className="text-indigo-900 font-medium text-[15px] flex-1" 
          numberOfLines={1}
        >
          {currentRange.replace('_', ' ')}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#a78bfa"
          className="ml-1.5"
        />
      </Pressable>

      {isOpen && (
        <Animated.View
          className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-lg shadow-indigo-300/30 py-1.5 px-1 mt-0.5"
          style={{
            opacity: dropdownAnim,
            transform: [
              {
                translateY: dropdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          {ranges.map((range) => (
            <TouchableOpacity
              key={range.value}
              className="flex-row items-center py-2 px-4 bg-white rounded-xl"
              onPress={() => handleSelect(range.value)}
            >
              <Text className="text-indigo-900 text-base font-normal flex-1">
                {range.label}
              </Text>
              {currentRange === range.value && (
                <Ionicons 
                  name="checkmark" 
                  size={16} 
                  color="#a78bfa" 
                  className="ml-2"
                />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

export default DateRangeFilter;