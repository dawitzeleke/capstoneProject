import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UploadOtherScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const [selectedFileType, setSelectedFileType] = useState('mp4');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#6D28D9" />
        </Pressable>
        <Text style={styles.title}>Upload Content</Text>
      </View>

      {/* Content Type Selector */}
      <View style={styles.selectorContainer}>
        <Pressable style={styles.selectorButton}>
          <Text style={styles.selectorText}>Add question</Text>
        </Pressable>
        <Pressable style={[styles.selectorButton, styles.activeSelector]}>
          <Text style={[styles.selectorText, styles.activeSelectorText]}>Upload other</Text>
        </Pressable>
      </View>

      {/* File Type Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>File type</Text>
        <View style={styles.fileTypeContainer}>
          {['mp4', 'pdf', 'doc', 'ppt'].map((type) => (
            <Pressable
              key={type}
              style={[
                styles.fileTypeButton,
                selectedFileType === type && styles.selectedFileType
              ]}
              onPress={() => setSelectedFileType(type)}
            >
              <Text style={[
                styles.fileTypeText,
                selectedFileType === type && styles.selectedFileTypeText
              ]}>
                {type.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Upload Area */}
      <View style={styles.sectionContainer}>
        <Pressable style={styles.uploadArea}>
          <Ionicons name="cloud-upload" size={48} color="#6D28D9" style={styles.uploadIcon} />
          <Text style={styles.uploadTitle}>Upload new file or folder</Text>
          <Text style={styles.uploadSubtitle}>Drag and drop a file or browse files</Text>
        </Pressable>
      </View>

      {/* Tags Input */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Tags</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={`${tag}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <Pressable onPress={() => removeTag(index)}>
                <Ionicons name="close" size={16} color="#6D28D9" />
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

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, isSmallScreen && styles.smallButtonContainer]}>
        <Pressable style={[styles.button, styles.draftButton]}>
          <Text style={styles.buttonText}>Save to drafts</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.postButton]}>
          <Text style={[styles.buttonText, styles.postButtonText]}>Post</Text>
        </Pressable>
        <Pressable style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
    backgroundColor: '#6D28D9',
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
  fileTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  fileTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  selectedFileType: {
    backgroundColor: '#6D28D9',
    borderColor: '#6D28D9',
  },
  fileTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  selectedFileTypeText: {
    color: '#ffffff',
  },
  uploadArea: {
    minHeight: 200,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
    color: '#6D28D9',
    fontSize: 12,
    fontWeight: '500',
  },
  tagInput: {
    flex: 1,
    minWidth: 150,
    fontSize: 14,
    color: '#334155',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    minHeight: 44,
  },
  smallButtonContainer: {
    gap: 4,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftButton: {
    backgroundColor: '#e9d5ff',
  },
  postButton: {
    backgroundColor: '#6D28D9',
  },
  postButtonText: {
    color: '#ffffff',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff8a80',
    borderRadius: 8,

  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6D28D9',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default UploadOtherScreen;