import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, Pressable, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppDispatch, RootState } from '@/redux/store';
import httpRequest from '@/util/httpRequest';

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
import { setEditingMedia } from '@/redux/teacherReducer/mediaSlice';
import { MediaType, MediaStatus } from '@/types/mediaTypes';

const FILE_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/3gpp'],
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
const createEmptyFormState = (): FormState => ({
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
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const { editingMedia } = useSelector((state: RootState) => state.media);
  const shouldLoadDraft = useRef(true);
  const [localDraft, setLocalDraft] = useState<FormState | null>(null);

  // Form state
  const [formState, setFormState] = useState<FormState>(createEmptyFormState());

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
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
      } else if (localDraft && shouldLoadDraft.current) {
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
    setFormState((prev) => ({ ...prev, title: text }));
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setFormState((prev) => ({ ...prev, description: text }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {
      title: !formState.title.trim(),
      file: !formState.file,
      tags: formState.tags.length === 0,
      thumbnail: false,
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(Boolean);
  }, [formState]);

  const handleSubmit = useCallback(async (status: MediaStatus) => {
    setSubmitted(true);
    setModalState((prev) => ({ ...prev, error: false }));

    if (!validateForm()) {
      setModalState((prev) => ({
        ...prev,
        error: true,
        message: 'Please complete all required fields (*)'
      }));
      return;
    }

    try {
      status === 'posted' ? setIsPosting(true) : setIsSavingDraft(true);

      const formData = new FormData();
      
      // Match backend's expected format exactly
      formData.append('CreatedBy', user?.id || '');
      formData.append('Title', formState.title);
      formData.append('Description', formState.description || '');
      formData.append('Tags', JSON.stringify(formState.tags));

      if (formState.file) {
        const fileToUpload = {
          uri: formState.file.uri,
          type: formState.file.type,
          name: formState.file.name
        };
        formData.append('Video', fileToUpload as any);
      }

      if (formState.type === 'video' && formState.thumbnail) {
        const thumbnailFile = {
          uri: formState.thumbnail.uri,
          type: formState.thumbnail.type,
          name: formState.thumbnail.name
        };
        formData.append('Thumbnail', thumbnailFile as any);
      }

      const endpoint = formState.type === 'image' ? '/ImageContent' : '/VideoContent';
      
      const response = await httpRequest(
        endpoint,
        formData,
        'POST',
        user?.token,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user?.token}`
          },
        }
      );

      if (response) {
        setModalState((prev) => ({
          ...prev,
          success: true,
          message: `${formState.type.charAt(0).toUpperCase() + formState.type.slice(1)} ${status} successfully!`,
          color: status === 'posted' ? "#22c55e" : "#4F46E5",
        }));

        await resetForm();
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.payload?.message || error.message || 'Submission failed. Please try again.';
      setModalState((prev) => ({
        ...prev,
        error: true,
        message: errorMessage,
      }));
    } finally {
      setIsPosting(false);
      setIsSavingDraft(false);
    }
  }, [formState, validateForm, user?.id, user?.token, editingMedia, resetForm]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (modalState.success || modalState.draftSuccess) {
      dispatch({ type: 'media/fetch', payload: formState.type }); // Refresh list
      timeoutId = setTimeout(() => {
        router.push('/teacher/ContentList');
        setModalState({ success: false, error: false, draftSuccess: false, cancel: false, message: '', color: '' });
      }, 2000);
    }

    if (modalState.error) {
      timeoutId = setTimeout(() => {
        setModalState((prev) => ({ ...prev, error: false, message: '' }));
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [modalState.success, modalState.draftSuccess, modalState.error, router, dispatch, formState.type]);

  const handleCloseModal = useCallback(() => {
    setModalState({ success: false, error: false, draftSuccess: false, cancel: false, message: '', color: '' });
  }, []);

  const handleCancel = useCallback(() => {
    setModalState((prev) => ({ ...prev, cancel: true }));
  }, []);

  const mappedValidationErrors = {
    questionText: validationErrors.title,
    tags: validationErrors.tags,
    // Add other fields from the generic type and set to false
    courseName: false, description: false, grade: false, difficulty: false, questionType: false,
    point: false, options: [false, false, false, false, false], explanation: false, correctOption: false,
    stream: false, chapter: false, isMatrik: false, year: false, hint: false
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AppHeader
          title="Upload Content"
          onBack={() => router.back()}
          showResetButton={true}
          onReset={() => Alert.alert('Reset Form', 'Are you sure?',
            [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', onPress: resetForm }]
          )}
          buttons={[{ icon: 'folder-open', onPress: () => router.push("/teacher/ContentList"), side: 'right', key: 'exit-button' }]}
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
                    setFormState(prev => ({ ...prev, type: type as MediaType, file: null, thumbnail: null }));
                    setValidationErrors(prev => ({ ...prev, file: false, thumbnail: false }));
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
            <Text className="text-lg font-psemibold mb-2">Media File *</Text>
            <FilePicker
              file={formState.file}
              allowedTypes={FILE_TYPES[formState.type as keyof typeof FILE_TYPES]}
              fileTypeLabel={formState.type}
              onFilePicked={file => setFormState((prev) => ({ ...prev, file }))}
              error={submitted && validationErrors.file}
            />

            {formState.type === 'video' && (
              <>
                <Text className="text-lg font-psemibold mt-4 mb-2">Thumbnail (Optional)</Text>
                <FilePicker
                  file={formState.thumbnail}
                  allowedTypes={FILE_TYPES.image}
                  fileTypeLabel="image"
                  onFilePicked={thumbnail => setFormState((prev) => ({ ...prev, thumbnail }))}
                  error={false}
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
              placeholder="Enter media title *"
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
              onChange={tags => setFormState((prev) => ({ ...prev, tags }))}
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
        onEdit={() => setShowPreviewModal(false)}
        onConfirm={() => {
          setShowPreviewModal(false);
          handleSubmit('posted');
        }}
        loading={isPosting}
        mode={editingMedia ? 'edit' : 'create'}
        status={formState.status}
      />

      <SuccessModal visible={modalState.success} onClose={handleCloseModal}>
        <View className="items-center">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
          </View>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Success!</Text>
          <Text className="text-gray-600 text-center mb-4">{modalState.message}</Text>
          <TouchableOpacity onPress={handleCloseModal} className="bg-green-500 py-3 rounded-lg w-full">
            <Text className="text-white text-center font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      </SuccessModal>

      <ErrorModal visible={modalState.error} onClose={handleCloseModal}>
        <View className="items-center">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle" size={32} color="#ef4444" />
          </View>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Error</Text>
          <Text className="text-gray-600 text-center mb-4">{modalState.message}</Text>
          <TouchableOpacity onPress={handleCloseModal} className="bg-red-500 py-3 rounded-lg w-full">
            <Text className="text-white text-center font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </ErrorModal>

      <CancelModal visible={modalState.cancel} onClose={handleCloseModal} onConfirm={() => { handleCloseModal(); router.back(); }}>
        <View className="items-center">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Discard Changes?</Text>
          <Text className="text-gray-600 text-center mb-6">Are you sure you want to discard this upload?</Text>
          <View className="flex-col space-y-4 w-full">
            <TouchableOpacity onPress={handleCloseModal} className="w-full bg-gray-100 px-6 py-3 rounded-lg">
              <Text className="text-gray-600 font-medium text-center">Continue Editing</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { handleCloseModal(); router.back(); }} className="w-full bg-red-100 px-6 py-3 rounded-lg">
              <Text className="text-red-600 font-medium text-center">Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CancelModal>
    </View>
  );
};

export default UploadOtherScreen;