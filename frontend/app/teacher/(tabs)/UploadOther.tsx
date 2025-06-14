import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, ScrollView, Pressable, Text, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppDispatch } from '@/redux/store';

// Components
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/AppHeader';
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import FormActions from '@/components/teacher/QuestionForm/FormActions';
import FilePicker, { FileData } from '@/components/teacher/ContentForm/FilePicker';
import MediaPreviewModal from '@/components/teacher/popups/MediaPreviewModal';
import { SuccessModal } from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';
import TitleInput from '@/components/teacher/ContentForm/TitleInput';
import DescriptionInput from '@/components/teacher/ContentForm/DescriptionInput';

// Redux and Types
import { RootState } from '@/redux/store';
import { createMediaContent, updateMediaContent, setEditingMedia } from '@/redux/teacherReducer/mediaSlice';
import { MediaItem, MediaType, MediaStatus } from '@/types/mediaTypes';

const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: [
      'video/mp4',
      'video/quicktime',
      'video/x-m4v',
      'video/3gpp',
      'video/x-msvideo',
      'video/x-matroska',
      'video/webm',
      'video/*'
    ],
};

// Custom ID generator for React Native
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Add type for form state
type FormState = {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  file: FileData | null;
  thumbnail: FileData | null;
  tags: string[];
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

// Add type for modal state
type ModalState = {
  success: boolean;
  error: boolean;
  draftSuccess: boolean;
  cancel: boolean;
  message: string;
  color: string;
};

// Create a factory function for empty state
const createEmptyFormState = () => ({
  id: generateId(),
  title: '',
  description: '',
  type: 'image' as MediaType,
  file: null as FileData | null,
  thumbnail: null as FileData | null,
  tags: [] as string[],
  status: 'draft' as MediaStatus,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: '',
});

const UploadOtherScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { editingMedia } = useSelector((state: RootState) => state.media);
  const shouldLoadDraft = useRef(true);
  const [localDraft, setLocalDraft] = useState(() => {
    // Initialize with null, we'll load the draft in useEffect
    return null;
  });

  // Form state
  const [formState, setFormState] = useState<FormState>(createEmptyFormState());

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [modalState, setModalState] = useState({
    success: false,
    error: false,
    draftSuccess: false,
    cancel: false,
    message: '',
    color: '',
  });

  // Validation
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    file: false,
    tags: false,
    thumbnail: false,
  });

  // Loading states
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Load draft from AsyncStorage on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedDraft = await AsyncStorage.getItem('mediaDraft');
        if (savedDraft) {
          setLocalDraft(JSON.parse(savedDraft));
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    };
    loadDraft();
  }, []);

  // Reset/Cancel logic
  const resetForm = useCallback(async () => {
    dispatch(setEditingMedia(null));
    setFormState(createEmptyFormState());
    try {
      await AsyncStorage.removeItem('mediaDraft');
    } catch (error) {
      console.error('Error removing draft:', error);
    }
    shouldLoadDraft.current = false;
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      let initialData = createEmptyFormState();
      
      if (editingMedia) {
        initialData = {
          ...initialData,
          ...editingMedia,
          file: { uri: editingMedia.url, name: editingMedia.title, type: editingMedia.type, size: 0 },
          thumbnail: editingMedia.thumbnailUrl ? { 
            uri: editingMedia.thumbnailUrl, name: 'thumbnail', type: 'image', size: 0 
          } : null
        };
      } else if (localDraft) {
        initialData = localDraft;
      }

      setFormState(initialData);

      return () => {
        if (!editingMedia && formState.title) {
          AsyncStorage.setItem('mediaDraft', JSON.stringify(formState))
            .catch(error => console.error('Error saving draft:', error));
        }
      };
    }, [editingMedia, localDraft])
  );

  // Auto-save effect
  useEffect(() => {
    if (!editingMedia && formState.title && !modalState.success) {
      const timeout = setTimeout(() => {
        AsyncStorage.setItem('mediaDraft', JSON.stringify(formState))
          .catch(error => console.error('Error auto-saving draft:', error));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [formState, editingMedia, modalState.success]);

  // Input handlers
  const handleTitleChange = useCallback((text: string) => {
    setFormState((prev: FormState) => ({ ...prev, title: text }));
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setFormState((prev: FormState) => ({ ...prev, description: text }));
  }, []);

  const handleFilePick = useCallback(async (type: 'file' | 'thumbnail') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'file' ? FILE_TYPES[formState.type as keyof typeof FILE_TYPES] : ['image/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets?.[0]) {
        const asset = result.assets[0];
        const newFile = {
          uri: asset.uri,
          name: asset.name || 'unnamed_file',
          type: asset.mimeType || (type === 'thumbnail' ? 'image/*' : FILE_TYPES[formState.type as keyof typeof FILE_TYPES][0]),
          size: asset.size || 0,
        };

        setFormState((prev: FormState) => ({
          ...prev,
          [type]: newFile,
          ...(type === 'file' && formState.type === 'video' ? { thumbnail: null } : {})
        }));
      }
    } catch (error) {
      console.error('File pick error:', error);
      setModalState((prev: ModalState) => ({
        ...prev,
        error: true,
        draftSuccess: false,
        cancel: false,
        message: 'Failed to select file. Please try again.',
        color: '',
      }));
    }
  }, [formState.type]);

  const validateForm = useCallback(() => {
    const errors = {
      title: !formState.title.trim(),
      file: !formState.file,
      tags: formState.tags.length === 0,
      thumbnail: formState.type === 'video' && !formState.thumbnail,
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  }, [formState]);

  const handleSubmit = useCallback(async (status: MediaStatus) => {
    setSubmitted(true);
    setModalState((prev: ModalState) => ({ ...prev, error: false }));

    if (!validateForm()) {
      setModalState((prev: ModalState) => ({
        ...prev,
        error: true,
        message: 'Please complete all required fields (*)'
      }));
      return;
    }

    try {
      status === 'posted' ? setIsPosting(true) : setIsSavingDraft(true);

      // Set status in formState for UI consistency
      setFormState((prev: FormState) => ({ ...prev, status }));

      // Create FormData with proper file formatting
      const formData = new FormData();
      formData.append('title', formState.title);
      formData.append('description', formState.description || '');
      formData.append('type', formState.type);
      formData.append('status', status);
      formData.append('tags', JSON.stringify(formState.tags));

      if (formState.file) {
        formData.append('file', {
          uri: formState.file.uri,
          name: formState.file.name,
          type: formState.file.type,
        } as any);
      }
      if (formState.thumbnail) {
        formData.append('thumbnail', {
          uri: formState.thumbnail.uri,
          name: formState.thumbnail.name,
          type: formState.thumbnail.type,
        } as any);
      }

      let result;
      if (editingMedia) {
        result = await dispatch(updateMediaContent({
          id: editingMedia.id,
          type: editingMedia.type,
          data: formData
        })).unwrap();
      } else {
        result = await dispatch(createMediaContent(formData)).unwrap();
      }

      // Use returned status if available
      setFormState((prev: FormState) => ({ ...prev, status: result?.status || status }));

      setModalState((prev: ModalState) => ({
        ...prev,
        success: true,
        error: false,
        draftSuccess: false,
        cancel: false,
        message: status === 'posted' ? "Posted Successfully!" : "Saved as Draft!",
        color: status === 'posted' ? "#22c55e" : "#4F46E5",
      }));

      if (!editingMedia) {
        setFormState(createEmptyFormState());
      }
    } catch (error: any) {
      const errorMessage = error.payload?.message || error.message || 'Submission failed. Please try again.';
      setModalState((prev: ModalState) => ({
        ...prev,
        success: false,
        error: true,
        draftSuccess: false,
        cancel: false,
        message: errorMessage,
        color: '',
      }));
    } finally {
      setIsPosting(false);
      setIsSavingDraft(false);
    }
  }, [formState, validateForm, dispatch, editingMedia, resetForm]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (modalState.success || modalState.draftSuccess) {
      // Refresh media list after successful post/draft
      dispatch({ type: 'media/fetch', payload: formState.type });
      timeoutId = setTimeout(() => {
        router.push('/teacher/ContentList');
        setModalState((prev: ModalState) => ({
          ...prev,
          success: false,
          draftSuccess: false
        }));
      }, 2000);
    }

    if (modalState.error) {
      timeoutId = setTimeout(() => {
        setModalState((prev: ModalState) => ({ ...prev, error: false }));
      }, 3000);
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [modalState, router, dispatch, formState.type]);

  const handleCancel = useCallback(() => {
    setModalState((prev: ModalState) => ({ ...prev, cancel: true }));
  }, []);

  // Map media validation errors to question validation errors structure for FormActions
  const mappedValidationErrors = {
    questionText: validationErrors.title,
    courseName: false,
    description: false,
    grade: false,
    difficulty: false,
    questionType: false,
    point: false,
    options: [false, false, false, false, false],
    explanation: false,
    tags: validationErrors.tags,
    correctOption: false,
    stream: false,
    chapter: false,
    isMatrik: false,
    year: false,
    hint: false,
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AppHeader
          title="Upload Content"
          titleStyle={{fontFamily: 'Poppins-SemiBold'}}
          onBack={() => router.back()}
          showResetButton={true}
          onReset={() => Alert.alert(
            'Reset Form',
            'Are you sure?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Reset', onPress: resetForm }
            ]
          )}
          buttons={[
            {
              icon: 'folder-open',
              onPress: () => router.push("/teacher/(tabs)/ContentList"),
              side: 'right',
              key: 'exit-button'
            }
          ]}
        />
        <ContentTypeSelector currentScreen="UploadOther" />

        <View className="px-4 pt-4 mt-2">
          {/* Media Type Selection */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-psemibold mb-2">Media Type</Text>
            <View className="flex-row gap-2">
              {Object.keys(FILE_TYPES).map((type) => (
                <Pressable
                  key={type}
                  className={`px-4 py-2 rounded-full ${formState.type === type ? 'bg-indigo-600' : 'bg-slate-100'}`}
                  onPress={() => {
                    setFormState(prev => ({
                      ...prev,
                      type: type as MediaType,
                      file: null,
                      thumbnail: null
                    }));
                    setValidationErrors(prev => ({
                      ...prev,
                      file: false,
                      thumbnail: false
                    }));
                  }}
                >
                  <Text className={`font-pmedium ${formState.type === type ? 'text-white' : 'text-slate-600'}`}>
                    {type.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* File Upload Section */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-psemibold mb-2">Media File</Text>
            <FilePicker
              allowedTypes={FILE_TYPES[formState.type as keyof typeof FILE_TYPES]}
              fileTypeLabel={formState.type}
              onFilePicked={file => setFormState((prev: FormState) => ({ ...prev, file }))}
              error={submitted && validationErrors.file}
            />

            {formState.type === 'video' && (
              <>
                <Text className="text-lg font-psemibold mt-4 mb-2">Thumbnail</Text>
                <FilePicker
                  allowedTypes={FILE_TYPES.image}
                  fileTypeLabel="image"
                  onFilePicked={thumbnail => setFormState((prev: FormState) => ({ ...prev, thumbnail }))}
                  error={submitted && validationErrors.thumbnail}
                />
              </>
            )}
          </View>

          {/* Media Details */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <Text className="text-lg font-psemibold mb-2">Details</Text>

            <TitleInput
              value={formState.title}
              onChange={handleTitleChange}
              error={validationErrors.title}
              submitted={submitted}
              placeholder="Enter media title"
            />

            <DescriptionInput
              value={formState.description}
              onChange={handleDescriptionChange}
              placeholder="Enter media description"
              error={false}
              submitted={false}
            />

            <TagsInput
              value={formState.tags || []}
              onChange={tags => setFormState((prev: FormState) => ({ ...prev, tags }))}
              error={validationErrors.tags}
              submitted={submitted}
            />
          </View>

          <FormActions
            onSaveDraft={() => handleSubmit('draft')}
            onPost={() => {
              setSubmitted(true);
              if (validateForm()) setShowPreviewModal(true);
            }}
            onCancel={handleCancel}
            isSavingDraft={isSavingDraft}
            isPosting={isPosting}
            validationErrors={mappedValidationErrors}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <MediaPreviewModal
        visible={showPreviewModal}
        media={{
          ...formState,
          url: formState.file?.uri || '',
          thumbnailUrl: formState.thumbnail?.uri || '',
          createdBy: formState.createdBy || '',
        }}
        onClose={() => setShowPreviewModal(false)}
        onEdit={() => {
          setShowPreviewModal(false);
          setFormState((prev: FormState) => ({ ...prev }));
        }}
        onConfirm={() => {
          setShowPreviewModal(false);
          handleSubmit('posted');
        }}
        loading={isPosting}
        mode={editingMedia ? 'edit' : 'create'}
        status={formState.status}
      />

      <SuccessModal
        isVisible={modalState.success}
        onDismiss={() => setModalState((prev: ModalState) => ({ ...prev, success: false }))}
        message={modalState.message}
        icon={formState.type === 'image' ? 'image' : 'videocam'}
        color={modalState.color}
      />

      <SuccessModal
        isVisible={modalState.draftSuccess}
        onDismiss={() => setModalState((prev: ModalState) => ({ ...prev, draftSuccess: false }))}
        message={modalState.message}
        icon="save"
      />

      <ErrorModal
        isVisible={modalState.error}
        message={modalState.message}
        onDismiss={() => setModalState((prev: ModalState) => ({ ...prev, error: false }))}
      />

      <CancelModal
        isVisible={modalState.cancel}
        onConfirm={() => {
          resetForm();
          router.push('/teacher/ContentList');
          setModalState((prev: ModalState) => ({ ...prev, cancel: false }));
        }}
        onCancel={() => setModalState((prev: ModalState) => ({ ...prev, cancel: false }))}
      />
    </View>
  );
};

export default UploadOtherScreen;