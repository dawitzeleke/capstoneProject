import React, { useState, useRef } from 'react';
import { View, Text, Pressable, TouchableOpacity, Animated, StyleSheet } from 'react-native';
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
    <View style={{ zIndex: isOpen ? 200 : 1 }}>
      <Pressable
        style={styles.trigger}
        onPress={toggleDropdown}
      >
        <Text style={styles.label}>Content Type:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {selectedTypes.length === allTypes.length
            ? 'All Content'
            : selectedTypes.join(', ')}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#a78bfa"
          style={{ marginLeft: 6 }}
        />
      </Pressable>
      {isOpen && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: dropdownAnim,
              transform: [
                {
                  translateY: dropdownAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {allTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.option}
              onPress={() => handleSelect(type)}
            >
              <Text style={styles.optionText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
              {selectedTypes.includes(type) && (
                <Ionicons name="checkmark" size={16} color="#a78bfa" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    minWidth: 120,
    marginRight: 8,
    marginBottom: 2,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    color: '#7c3aed',
    fontWeight: '500',
    marginRight: 6,
    fontSize: 15,
  },
  value: {
    color: '#312e81',
    fontWeight: '500',
    fontSize: 15,
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 8,
    paddingVertical: 6,
    marginTop: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  optionText: {
    color: '#312e81',
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
});

export default ContentTypeFilter; 