import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onClose: () => void;
  placeholder?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  onClose,
  placeholder = 'Search...',
}) => {
  const handleClose = () => {
    onSearchChange('');
    onClose();
  };

  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center relative">
        <TextInput
          className="flex-1 rounded-lg p-3 text-gray-900 text-base border border-[#4F46E5] pr-10 bg-white shadow-md shadow-indigo-100"
          placeholder={placeholder}
          placeholderTextColor="#8A8A8A"
          value={searchTerm}
          onChangeText={onSearchChange}
          autoFocus
        />
        
        <Pressable
          className="absolute right-3 p-1"
          onPress={handleClose}
        >
          <Ionicons name="close-circle" size={24} color="#B2B2B2" />
        </Pressable>
      </View>
    </View>
  );
};

export default SearchFilter;