import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/Header';
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import { SuccessModal} from '@/components/teacher/popups/SuccessModal'
import { ErrorModal} from '@/components/teacher/popups/ErrorModal'
import { CancelModal} from '@/components/teacher/popups/CancelModal'
import FormActions from '@/components/teacher/QuestionForm/FormActions';
import FilePicker, { FileData } from '@/components/teacher/ContentForm/FilePicker';

const FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/3gpp'],
};

const UploadOtherScreen = () => {
  const router = useRouter();
  const [selectedFileType, setSelectedFileType] = useState<keyof typeof FILE_TYPES>('image');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<FileData | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [errors, setErrors] = useState({
    file: false,
    tags: false,
  });

  const validateForm = (): string | true => {
    const newErrors = {
      file: !file,
      tags: tags.length === 0,
    };

    setErrors(newErrors);

    if (newErrors.file) return 'Please select a valid file';
    if (newErrors.tags) return 'Please add at least one tag';
    return true;
  };

  const handlePost = async () => {
    const validation = validateForm();
    if (validation !== true) {
      setErrorMessage(validation);
      setShowErrorModal(true);
      return;
    }

    setIsPosting(true);
    try {
      const processedFile = processFileForUpload(file!);
      const formData = new FormData();
      
      // @ts-ignore - Expo specific file format
      formData.append('file', {
        uri: processedFile.uri,
        name: processedFile.name,
        type: processedFile.type,
      });

      // Replace with your actual API call
      await fetch('https://your-api-endpoint/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(`Upload failed: ${(error as Error).message}`);
      setShowErrorModal(true);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveDraft = async () => {
    const validation = validateForm();
    if (validation !== true) {
      setErrorMessage(validation);
      setShowErrorModal(true);
      return;
    }

    setIsSavingDraft(true);
    try {
      // Replace with your draft save logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(`Draft save failed: ${(error as Error).message}`);
      setShowErrorModal(true);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const processFileForUpload = (fileData: FileData): FileData => {
    return {
      ...fileData,
      uri: Platform.OS === 'android' 
        ? fileData.uri.replace('file://', '') 
        : fileData.uri,
    };
  };

  const resetForm = () => {
    setFile(null);
    setTags([]);
    setErrors({ file: false, tags: false });
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        resetForm();
        router.push("/teacher/ContentList");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AppHeader title="Upload Content" onBack={() => router.push("../ContentList")} />
        <ContentTypeSelector currentScreen="UploadOther" />
        
        <View className="px-4 pt-4">
          {/* File Type Selection */}
          <View className="bg-white mb-4 p-4 rounded-lg shadow">
            <Text className="text-slate-800 text-base font-psemibold mb-3">File Type</Text>
            
            <View className="flex-row flex-wrap gap-2 justify-center items-center mb-4">
              {Object.keys(FILE_TYPES).map((type) => (
                <Pressable
                  key={type}
                  className={`py-2 px-4 rounded-full border ${
                    selectedFileType === type 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                  onPress={() => setSelectedFileType(type as keyof typeof FILE_TYPES)}
                >
                  <Text className={`text-sm font-pmedium ${
                    selectedFileType === type ? 'text-white' : 'text-slate-500'
                  }`}>
                    {type.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* File Picker */}
            <FilePicker
              allowedTypes={FILE_TYPES[selectedFileType]}
              fileTypeLabel={selectedFileType}
              onFilePicked={(file) => {
                setFile(file);
                setErrors(prev => ({ ...prev, file: false }));
              }}
              error={errors.file}
            />

            {/* Selected File Preview */}
            {file && (
              <View className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <Text className="text-indigo-800 font-pmedium">
                  Selected: {file.name} ({Math.round(file.size / 1024)}KB)
                </Text>
              </View>
            )}
          </View>

          {/* Tags Input */}
          <TagsInput
            value={tags}
            onChange={(newTags) => {
              setTags(newTags);
              setErrors(prev => ({ ...prev, tags: false }));
            }}
            placeholder="Add tags separated by comma or space"
            error={errors.tags}
            maxLength={20}
          />

          {/* Form Actions */}
          <FormActions
            onSaveDraft={handleSaveDraft}
            onPost={handlePost}
            onCancel={() => setShowCancelModal(true)}
            isSavingDraft={isSavingDraft}
            isPosting={isPosting}
            validationErrors={{
              question: false,
              options: [],
              explanation: false,
              tags: errors.tags,
              correctAnswer: false
            }}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <CancelModal
        isVisible={showCancelModal}
        onConfirm={() => {
          setShowCancelModal(false);
          resetForm();
          router.push("../ContentList");
        }}
        onCancel={() => setShowCancelModal(false)}
      />

      <SuccessModal
        isVisible={showSuccessModal}
        onDismiss={() => setShowSuccessModal(false)}
        icon="cloud-done"
        message="Upload Successful!"
      />

      <ErrorModal
        isVisible={showErrorModal}
        message={errorMessage}
        onDismiss={() => setShowErrorModal(false)}
      />
    </View>
  );
};

export default UploadOtherScreen;