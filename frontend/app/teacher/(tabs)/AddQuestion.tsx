import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, useWindowDimensions, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
  ContentList: undefined;
  AddQuestionScreen: undefined;
};


const AddQuestionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isVerySmallScreen = width <= 320;
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');


  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleTagInput = (text: string) => {
    setTagsInput(text);
    if (text.includes(',') || text.includes(' ')) {
      const newTags = text.split(/[ ,]+/).filter(tag => tag.trim() !== '');
      setTags([...tags, ...newTags]);
      setTagsInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };


  const [errors, setErrors] = useState({
    question: false,
    options: [false, false, false, false],
    explanation: false,
    tags: false,
  });

  const validateForm = () => {
    const newErrors = {
      question: question.trim() === '',
      options: options.map(opt => opt.trim() === ''),
      explanation: explanation.trim() === '',
      tags: tags.length === 0,
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => 
      Array.isArray(error) ? error.some(e => e) : error
    );
  };

  // Post
  const handlePost = () => {
    if (!validateForm()) {
      alert('Please fill all required fields');
    }
    // Proceed with posting logic
  };


  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}
        onPress={() => navigation.navigate('ContentList')}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </Pressable>
        <Text style={styles.title}>Upload Content</Text>
      </View>

      {/* Content Type Selector */}
      <View style={styles.selectorContainer}>
        <Pressable style={[styles.selectorButton, styles.activeSelector]}>
          <Text style={[styles.selectorText, styles.activeSelectorText]}>Add question</Text>
        </Pressable>
        <Pressable style={styles.selectorButton}>
          <Text style={styles.selectorText}>Upload other</Text>
        </Pressable>
      </View>

      {/* Question Input Section */}
      <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>
    Question<Text style={styles.requiredIndicator}>*</Text>
  </Text>
        <TextInput
          style={styles.questionInput}
          multiline
          placeholder="Start writing your question here..."
          placeholderTextColor="#94a3b8"
          value={question}
          onChangeText={setQuestion}
        />
      </View>

      {/* Options Input Section */}
      <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>
    Options<Text style={styles.requiredIndicator}>*</Text>
  </Text>
        {options.map((option, index) => (
          <View key={`option-${index}`} style={styles.optionContainer}>
            <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</Text>
            <TextInput
             style={[
              styles.optionInput,
              errors.options[index] && styles.errorInput
            ]}
              placeholder={`Start writing choice ${String.fromCharCode(65 + index)}...`}
              placeholderTextColor="#94a3b8"
              value={option}
              onChangeText={(text) => handleOptionChange(text, index)}
            />
          </View>
        ))}
      </View>

      {/* Hint Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb-outline" size={20} color="#f59e0b" style={styles.bulbIcon} />
          <Text style={styles.sectionLabel}>Hint</Text>
        </View>
        <TextInput
          style={styles.hintInput}
          placeholder="Add a hint to help users answer..."
          placeholderTextColor="#94a3b8"
          value={hint}
          onChangeText={setHint}
        />
      </View>

{/* Explanation Section */}
      <View style={styles.sectionContainer}>
      <Text style={styles.sectionLabel}>
      Explanation<Text style={styles.requiredIndicator}>*</Text>
      </Text>
  <TextInput
     style={[
      styles.explanationInput,
      errors.explanation && styles.errorInput
    ]}
    multiline
    placeholder="Add detailed explanation for the correct answer..."
    placeholderTextColor="#94a3b8"
    value={explanation}
    onChangeText={setExplanation}
  />
</View>

      {/* Tags Input Section */}
      <View style={styles.sectionContainer}>
  <Text style={styles.sectionLabel}>
    Tags<Text style={styles.requiredIndicator}>*</Text>
  </Text>
        <View  style={[
    styles.tagsContainer,
    errors.tags && styles.errorInput
  ]}>
          {tags.map((tag, index) => (
            <View key={`${tag}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <Pressable onPress={() => removeTag(index)}>
                <Ionicons name="close" size={16} color="#4F46E5" />
              </Pressable>
            </View>
          ))}
          <TextInput
            style={styles.tagInput}
            placeholder="Add tags (comma separated)..."
            placeholderTextColor="#94a3b8"
            value={tagsInput}
            onChangeText={handleTagInput}
          />
        </View>
      </View>

      {/* Optimized Action Buttons */}
      <View style={[
        styles.buttonContainer,
        isVerySmallScreen && styles.verySmallButtonContainer
      ]}>
        <Pressable 
          style={[
            styles.buttonBase,
            styles.draftButton,
            isVerySmallScreen && styles.verySmallButton
          ]}
          android_ripple={{ color: '#d8b4fe' }}
        >
          <Text 
            style={[
              styles.buttonTextBase,
              isVerySmallScreen && styles.verySmallButtonText
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            Save to drafts
          </Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.buttonBase,
            styles.postButton,
            isVerySmallScreen && styles.verySmallButton
          ]}
          android_ripple={{ color: '#4c1d95' }}
        >
          <Text 
            style={[
              styles.buttonTextBase,
              styles.postButtonText,
              isVerySmallScreen && styles.verySmallButtonText
            ]}
            numberOfLines={1}
          >
            Post
          </Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.buttonBase,
            styles.cancelButton,
            isVerySmallScreen && styles.verySmallCancelButton
          ]}
          android_ripple={{ color: '#e2e8f0' }}
        >
          <Text 
            style={[
              styles.cancelButtonText,
              isVerySmallScreen && styles.verySmallCancelText
            ]}
            numberOfLines={1}
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  selectorContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeSelector: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeSelectorText: {
    color: '#ffffff',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  questionInput: {
    minHeight: 100,
    fontSize: 14,
    color: '#334155',
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    width: 24,
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulbIcon: {
    marginRight: 8,
  },
  hintInput: {
    fontSize: 14,
    color: '#334155',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  explanationInput: {
    minHeight: 100,
    fontSize: 14,
    color: '#334155',
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  tagText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '500',
  },
  tagInput: {
    flex: 1,
    minWidth: 120,
    fontSize: 14,
    color: '#334155',
  },
  requiredIndicator: {
    color: '#ef4444',
    marginLeft: 4,
  },
  errorInput: {
    borderColor: '#ef4444',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderRadius: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    minHeight: 44,
  },
  verySmallButtonContainer: {
    gap: 4,
    marginHorizontal: 8,
    minHeight: 40,
  },
  buttonBase: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  verySmallButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 0,
    flexShrink: 1,
    flexGrow: 1,
  },
  draftButton: {
    backgroundColor: '#d6ddff',
    flex: 1.7,
  },
  postButton: {
    backgroundColor: '#4F46E5',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#ff8a80',
    flex: 1,
  },
  verySmallCancelButton: {
    flex: 0.9,
    paddingHorizontal: 6,
  },
  buttonTextBase: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
    textAlign: 'center',
  },
  verySmallButtonText: {
    fontSize: 12,
    letterSpacing: -0.2,
    paddingHorizontal: 2,
  },
  postButtonText: {
    color: '#ffffff',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  verySmallCancelText: {
    fontSize: 12,
  },
});

export default AddQuestionScreen;