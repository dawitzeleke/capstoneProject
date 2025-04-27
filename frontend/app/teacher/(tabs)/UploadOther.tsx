import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from '@/components/teacher/Header';
import TagsInput from '@/components/teacher/TagsInput';



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
        


        <View className="flex-row gap-2 mx-4 mt-4 min-h-[44px]">
          <Pressable
            className="flex-1 rounded bg-indigo-100 py-3 items-center justify-center"
            onPress={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <ActivityIndicator color="#4F46E5" size="small" />
            ) : (
              <Text className="text-indigo-600 text-sm font-pmedium">Save Draft</Text>
            )}
          </Pressable>

          <Pressable
            className="flex-1 rounded bg-indigo-600 py-3 items-center justify-center"
            onPress={handlePost}
            disabled={isPosting}
          >
            {isPosting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white text-sm font-pmedium">Post</Text>
            )}
          </Pressable>

          <Pressable
            className="flex-1 rounded bg-red-300 py-3 items-center justify-center"
            onPress={() => setShowCancelModal(true)}
          >
            <Text className="text-white text-sm font-pmedium">Cancel</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>

      <Modal visible={showCancelModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-4/5">
            <Text className="text-lg font-psemibold text-slate-800 mb-2">Discard Changes?</Text>
            <Text className="text-sm text-slate-500 mb-6">Are you sure you want to discard this upload?</Text>
            <View className="flex-row justify-end gap-2">
              <Pressable className="bg-slate-100 px-4 py-2 rounded" onPress={() => setShowCancelModal(false)}>
                <Text className="text-slate-500 font-pmedium">Continue Editing</Text>
              </Pressable>
              <Pressable
                className="bg-red-200 px-4 py-2 rounded"
                onPress={() => {
                  setShowCancelModal(false);
                  resetForm();
                  router.push("../ContentList");
                }}
              >
                <Text className="text-red-500 font-pmedium">Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-8 items-center gap-4">
            <Ionicons name="cloud-done" size={48} color="#4F46E5" />
            <Text className="text-slate-800 text-base font-psemibold">Upload Successful!</Text>
          </View>
        </View>
      </Modal>

      <Modal visible={showErrorModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-8 items-center gap-4">
            <Ionicons name="cloud-offline" size={48} color="#DC2626" />
            <Text className="text-slate-800 text-base font-psemibold">Error</Text>
            <Text className="text-slate-500 text-sm">{errorMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UploadOtherScreen;
