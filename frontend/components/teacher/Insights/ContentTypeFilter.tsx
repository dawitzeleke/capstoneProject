import React, { useState, useRef } from 'react';
import { View, Text, Pressable, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ContentTypeFilterProps {
  selectedTypes: ('question' | 'image' | 'video')[];
  onSelectType: (type: 'question' | 'image' | 'video') => void;
}

const allTypes: ('question' | 'image' | 'video')[] = ['question', 'image', 'video'];

const ContentTypeFilter: React.FC<ContentTypeFilterProps> = ({ selectedTypes, onSelectType }) => {
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

  const handleSelect = (type: 'question' | 'image' | 'video') => {
    onSelectType(type);
    toggleDropdown();
  };

  return (
    <View className={`relative ${isOpen ? 'z-[200]' : 'z-1'}`}>
      <Pressable
        className="flex-row items-center border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white min-w-[120px] mr-2 mb-0.5 shadow-sm shadow-indigo-300/10"
        onPress={toggleDropdown}
      >
        <Text className="text-[#4F46E5] font-medium mr-1.5 text-[15px]">
          Content Type:
        </Text>
        <Text 
          className="text-indigo-900 font-medium text-[15px] flex-1" 
          numberOfLines={1}
        >
          {selectedTypes.length === allTypes.length ? 'All Content' : selectedTypes.join(', ')}
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
          {allTypes.map((type) => (
            <TouchableOpacity
              key={type}
              className="flex-row items-center  py-2 px-4 bg-white rounded-xl"
              onPress={() => handleSelect(type)}
            >
              <Text className="text-indigo-900 text-base font-normal flex-1">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
              {selectedTypes.includes(type) && (
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

export default ContentTypeFilter;