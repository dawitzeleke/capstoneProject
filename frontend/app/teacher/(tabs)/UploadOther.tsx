import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/Header';
import TagsInput from '@/components/teacher/TagsInput';
import ActionButtons from '@/components/teacher/ActionButtons';
import { SuccessModal} from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';




type FileData = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

const UploadOtherScreen = () => {

  const [selectedFileType, setSelectedFileType] = useState('mp4');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<FileData | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleBack = () => {
    router.push("../ContentList");
  };

  const [errors, setErrors] = useState({
    file: false,
    tags: false,
  });

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
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: FILE_TYPES[selectedFileType as keyof typeof FILE_TYPES],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result?.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name || 'unnamed_file',
          type: asset.mimeType ?? FILE_TYPES[selectedFileType as keyof typeof FILE_TYPES][0],
          size: asset.size ?? 0,
        });
      } else {
        setErrorMessage('No file was selected.');
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('File picker error:', error);
      setErrorMessage(`Failed to pick file: ${(error as Error).message}`);
      setShowErrorModal(true);
    }
  };


  // Validation
  const validateForm = (): string | true => {
    const newErrors = {
      file: !file || !file.uri,
      tags: tags.length === 0
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

    if (!file) return;

    setIsPosting(true);
    try {
      const processedFile = processFileForUpload(file);

      const formData = new FormData();
      formData.append('file', {
        uri: processedFile.uri,
        name: processedFile.name,
        type: processedFile.type,
      } as any);

      await fetch('https://your-api-endpoint/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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

      const draftData = {
        file: processedFile,
        tags,
        status: 'draft',
        date: new Date().toISOString()
      };

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

  const resetForm = () => {
    setFile(null);
    setTags([]);
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        resetForm();
        router.push("../ContentList");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

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
    if (Platform.OS === 'android' && processedUri.startsWith('file://')) {
      processedUri = processedUri.replace('file://', '');
    }
    return {
      ...fileData,
      uri: processedUri
    };
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AppHeader title="Upload Content" onBack={handleBack} />
        <ContentTypeSelector currentScreen="UploadOther" />
        <View className='px-4 pt-4'>
          <View className="bg-white  mb-4 p-4 rounded-lg shadow">
            <Text className="text-slate-800 text-base font-psemibold mb-3">File type</Text>
            <View className="flex-row flex-wrap gap-2 justify-center items-center mb-4">
              {Object.keys(FILE_TYPES).map((type) => (
                <Pressable
                  key={type}
                  className={`py-2 px-4 rounded-full border ${selectedFileType === type ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-50 border-slate-200'}`}
                  onPress={() => setSelectedFileType(type)}
                >
                  <Text className={`text-sm font-pmedium ${selectedFileType === type ? 'text-white' : 'text-slate-500'}`}>{type.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              className={`min-h-[180px] border-2 border-dashed rounded-xl justify-center items-center p-5 ${file ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}
              onPress={handleFilePick}
            >
              {file ? (
                <>
                  <Ionicons name="document" size={40} color="#4F46E5" />
                  <Text className="text-slate-800 text-base font-psemibold mt-2">{file.name}</Text>
                  <Text className="text-slate-500 text-sm">{`${(file.size / 1024).toFixed(1)}KB • ${file.type}`}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={48} color="#4F46E5" />
                  <Text className="text-slate-800 text-base font-psemibold mt-2">Select {selectedFileType.toUpperCase()} File</Text>
                  <Text className="text-slate-500 text-sm text-center">Tap to choose from your device</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* TAGS */}
          <TagsInput
            value={tags}
            onChange={setTags}
            placeholder="Add tags separated by comma or space"
            error={errors.tags}
            maxLength={20}
          />


          {/* Buttons */}
          <ActionButtons
            onSaveDraft={handleSaveDraft}
            onPost={handlePost}
            onCancel={() => setShowCancelModal(true)}
            isSavingDraft={isSavingDraft}
            isPosting={isPosting}
          />

        </View>
      </ScrollView>

      {/* Modals */}
      <>
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
      </>
    </View>
  );
};

export default UploadOtherScreen;
