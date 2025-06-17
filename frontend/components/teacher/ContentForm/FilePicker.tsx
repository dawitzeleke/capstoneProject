import { useState } from 'react';
import { Pressable, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

const MAX_FILE_SIZE_MB = 50; // 50MB

export interface FileData {
  uri: string;
  name: string;
  type: string;
  size: number;
}

type FilePickerProps = {
  file: FileData | null;
  allowedTypes: string[];
  fileTypeLabel: string;
  onFilePicked: (file: FileData | null) => void;
  error?: boolean;
  loading?: boolean;
};

const FilePicker = ({ 
  file,
  allowedTypes, 
  fileTypeLabel, 
  onFilePicked,
  error = false,
  loading = false
}: FilePickerProps) => {
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleFilePick = async () => {
    if (loading) return;
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result?.assets?.[0]) {
        const asset = result.assets[0];
        if (asset.size && asset.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB`);
        }

        const newFile = {
          uri: asset.uri,
          name: asset.name || 'unnamed_file',
          type: asset.mimeType || allowedTypes[0],
          size: asset.size || 0,
        };

        onFilePicked(newFile);
        setPreviewError(null);
      }
    } catch (err) {
      const error = err as Error;
      setPreviewError(error.message || 'Failed to pick file');
      onFilePicked(null);
      setTimeout(() => setPreviewError(null), 3000);
    }
  };

  return (
    <View className="w-full mb-4">
      <Pressable
        className={`min-h-[180px] border-2 border-dashed rounded-xl justify-center items-center p-5 ${
          error || previewError ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'
        }`}
        onPress={handleFilePick}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#4F46E5" />
        ) : (
          <View className="items-center">
            <Ionicons 
              name="cloud-upload" 
              size={48} 
              color={error || previewError ? '#EF4444' : '#4F46E5'} 
            />
            <Text className={`text-base font-psemibold mt-2 ${
              error || previewError ? 'text-red-600' : 'text-slate-800'
            }`}>
              Select {fileTypeLabel.toUpperCase()} File
            </Text>
            <Text className={`text-sm ${
              error || previewError ? 'text-red-500' : 'text-slate-500'
            } text-center`}>
              {file ? 'Tap to change file' : `Max ${MAX_FILE_SIZE_MB}MB`}
            </Text>
          </View>
        )}
      </Pressable>

      {(error || previewError) && (
        <Text className="text-red-500 text-sm mt-1 font-pregular">
          {previewError || `${fileTypeLabel} file is required`}
        </Text>
      )}

      {file && !loading && (
        <View className="mt-4 p-3 bg-indigo-50 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-indigo-800 font-pmedium flex-1" numberOfLines={1}>
              {file.name}
            </Text>
            <Text className="text-indigo-600 text-sm">
              {(file.size / 1024 / 1024).toFixed(1)}MB
            </Text>
          </View>

          <Pressable
            className="mt-3 flex-row items-center justify-end"
            onPress={() => onFilePicked(null)}
            disabled={loading}
          >
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text className="text-red-500 text-sm font-pmedium ml-1">
              Remove File
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default FilePicker;