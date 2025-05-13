// SearchFilter.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchFilterProps {
  data: any[];
  searchKeys: string[];
  onFilter: (filteredData: any[]) => void;
  placeholder?: string;
  debounceTime?: number;
  onClose: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  data,
  searchKeys,
  onFilter,
  placeholder = 'Search...',
  debounceTime = 300,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      const filtered = data.filter(item =>
        searchKeys.some(key =>
          item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      onFilter(filtered);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [searchQuery, data, searchKeys, debounceTime, onFilter]);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close-circle" size={24} color="#64748b" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingRight: 40, 
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
});

export default SearchFilter;