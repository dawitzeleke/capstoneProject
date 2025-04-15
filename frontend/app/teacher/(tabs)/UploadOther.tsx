import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as  DocumentPicker from 'expo-document-picker';




type RootStackParamList = {
  ContentList: {
    refresh: boolean;
  };
  UploadOtherScreen: undefined;
};

type DocumentResult = DocumentPicker.DocumentPickerResult;

type FileData = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

const UploadOtherScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;


  // State variables
  const [selectedFileType, setSelectedFileType] = useState('mp4');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<FileData | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Back button handler
  const handleBack = () => {
    navigation.navigate('ContentList', { refresh: false });
  };

  // FILE_TYPES with MIME type coverage
  const FILE_TYPES = {
    mp4: ['video/mp4', 'video/quicktime'],
    pdf: ['application/pdf'],
    doc: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ppt: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
  };

  // File picker handler
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: FILE_TYPES[selectedFileType as keyof typeof FILE_TYPES],
        copyToCacheDirectory: true,
        multiple: false,
      });
  
      if (result.type === 'success') {
        const successResult = result;
        setFile({
          uri: successResult.uri,
          name: successResult.name || 'unnamed_file',
          type: successResult.mimeType || FILE_TYPES[selectedFileType as keyof typeof FILE_TYPES][0], // Get first MIME type
          size: successResult.size || 0,
        });
        console.log('File state updated:', file); // Debug log
      }
    } catch (error) {
      console.error('File picker error:', error);
      setErrorMessage(`Failed to pick file: ${(error as Error).message}`);
      setShowErrorModal(true);
    }
  };

  // Tags handling
  const handleTagInput = (text: string) => {
    setTagsInput(text);
    if (text.includes(',') || text.includes(' ')) {
      const newTags = text.split(/[ ,]+/).filter(tag => tag.trim() !== '');
      setTags([...tags, ...newTags]);
      setTagsInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = (): string | true => {
    if (!file || !file.uri || file.uri === '') return 'Please select a valid file';
    if (tags.length === 0) return 'Please add at least one tag';
    return true;
  };



  // Post handler
  const handlePost = async () => {
    const validation = validateForm();
    if (validation !== true) {
      setErrorMessage(validation);
      setShowErrorModal(true);
      return;
    }

    if (!file) return;

    setIsPosting(true);
    try {
      // Process the file first
      const processedFile = processFileForUpload(file);

      // Here's where you would implement actual file upload
      const formData = new FormData();
      formData.append('file', {
        uri: processedFile.uri,
        name: processedFile.name,
        type: processedFile.type,
      } as any);

      // Example API call - replace with your actual endpoint
      await fetch('https://your-api-endpoint/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Simulated success
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(`Failed to upload file: ${(error as Error).message}`);
      setShowErrorModal(true);
    } finally {
      setIsPosting(false);
    }
  };


  // Draft handler
  const handleSaveDraft = async () => {
    const validation = validateForm();
    if (validation !== true) {
      setErrorMessage(validation);
      setShowErrorModal(true);
      return;
    }

    if (!file) return;

    setIsSavingDraft(true);
    try {
      const processedFile = processFileForUpload(file);

      // Here you would implement draft saving logic
      const draftData = {
        file: processedFile,
        tags,
        status: 'draft',
        date: new Date().toISOString()
      };

      // Example API call for saving draft
      await fetch('https://your-api-endpoint/drafts', {
        method: 'POST',
        body: JSON.stringify(draftData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Draft save error:', error);
      setErrorMessage(`Failed to save draft: ${(error as Error).message}`);
      setShowErrorModal(true);
    } finally {
      setIsSavingDraft(false);
    }
  };


  // Reset form
  const resetForm = () => {
    setFile(null);
    setTags([]);
    setTagsInput('');
  };

  // Modal effects
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        resetForm();
        navigation.navigate('ContentList', { refresh: true });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // Error handling
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showErrorModal) {
      timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showErrorModal]);





  const processFileForUpload = (fileData: FileData): FileData => {
    let processedUri = fileData.uri;

    console.log('Original URI:', processedUri); // Debug log

    if (Platform.OS === 'android') {
      if (processedUri.startsWith('file://')) {
        processedUri = processedUri.replace('file://', '');
      }
    }

    console.log('Processed URI:', processedUri); // Debug log

    return {
      ...fileData,
      uri: processedUri
    };
    console.log('Processed URI:', processedUri);
    return { ...fileData, uri: processedUri };
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* Header Section */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.title}>Upload Content</Text>
        </View>

        {/* Content Type Selector */}
        <View style={styles.selectorContainer}>
          <Pressable style={styles.selectorButton}>
            <Text style={styles.selectorText}>
              Add question
            </Text>
          </Pressable>
          <Pressable style={[styles.selectorButton, styles.activeSelector]}>
            <Text style={[styles.selectorText, styles.activeSelectorText]}>Upload other</Text>
          </Pressable>
        </View>

        {/* File Type Selection and Upload Area */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>File type</Text>
          <View style={styles.fileTypeContainer}>
            {Object.keys(FILE_TYPES).map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.fileTypeButton,
                  selectedFileType === type && styles.selectedFileType
                ]}
                onPress={() => setSelectedFileType(type as keyof typeof FILE_TYPES)}
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

          <View>
            <Pressable
              style={({ pressed }) => [
                styles.uploadArea,
                pressed && styles.pressedUpload,
                !!file && styles.uploadAreaSelected
              ]}
              onPress={handleFilePick}
            >
              {file ? (
                <>
                  <Ionicons name="document" size={40} color="#4F46E5" />
                  <Text style={styles.uploadTitle}>{file.name}</Text>
                  <Text style={styles.uploadSubtitle}>
                    {`${(file.size / 1024).toFixed(1)}KB • ${file.type}`}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={48} color="#4F46E5" />
                  <Text style={styles.uploadTitle}>Select {selectedFileType.toUpperCase()} File</Text>
                  <Text style={styles.uploadSubtitle}>Tap to choose from your device</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Tags Input */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagsContainer}>
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

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, isSmallScreen && styles.smallButtonContainer]}>

          {/* Drafts Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.draftButton,
              pressed && styles.pressedButton,
              isSmallScreen && styles.smallButton
            ]}
            onPress={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <ActivityIndicator color="#4F46E5" size="small" />
            ) : (
              <Text style={styles.buttonText}>Save Draft</Text>
            )}
          </Pressable>

          {/* Post Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.postButton,
              pressed && styles.pressedButton,
              isSmallScreen && styles.smallButton
            ]}
            onPress={handlePost}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={[styles.buttonText, styles.postButtonText]}>Post</Text>
            )}
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.cancelButton,
              pressed && styles.pressedButton,
              isSmallScreen && styles.smallButton
            ]}
            onPress={() => setShowCancelModal(true)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

        </View>
      </ScrollView >


      {/* Modals */}
      <Modal visible={showCancelModal} transparent animationType="fade" >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Discard Changes?</Text>
            <Text style={styles.modalText}>Are you sure you want to discard this upload?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Continue Editing</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmCancelButton]}
                onPress={() => {
                  setShowCancelModal(false);
                  resetForm();
                  navigation.navigate('ContentList', { refresh: false });
                }}
              >
                <Text style={styles.confirmCancelButtonText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Ionicons name="cloud-done" size={48} color="#4F46E5" />
            <Text style={styles.successModalText}>Upload Successful!</Text>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={showErrorModal} transparent animationType="fade">
        <View style={styles.modalOverlay} pointerEvents="box-none">
          <View style={styles.errorModalContent}>
            <Ionicons name="warning" size={48} color="#ef4444" />
            <Text style={styles.errorModalText}>{errorMessage}</Text>
          </View>
        </View>
      </Modal>
    </View >
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
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
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
  fileTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
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
    minHeight: 180,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
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
  uploadAreaSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#f5f3ff',
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
    color: '#4F46E5',
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
  pressedUpload: {
    backgroundColor: '#f1f5f9',
  },
  pressedButton: {
    opacity: 0.8,
  },
  smallButton: {
    paddingVertical: 10,
    minWidth: 80,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftButton: {
    backgroundColor: '#d6ddff',
  },
  postButton: {
    backgroundColor: '#4F46E5',
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
    color: '#4F46E5',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelModalButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmCancelButton: {
    backgroundColor: '#fee2e2',
  },
  cancelModalButtonText: {
    color: '#64748b',
    fontWeight: '500',
  },
  confirmCancelButtonText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  successModalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  errorModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  errorModalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
  },
});


export default UploadOtherScreen;