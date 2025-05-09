import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export type FileData = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

type FilePickerProps = {
  allowedTypes: string[];
  fileTypeLabel: string;
  onFilePicked: (file: FileData | null) => void;
  error?: boolean;
};

const FilePicker = ({ allowedTypes, fileTypeLabel, onFilePicked, error }: FilePickerProps) => {
  const handlePress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result?.assets?.[0]) {
        const asset = result.assets[0];
        const newFile = {
          uri: asset.uri,
          name: asset.name || 'unnamed_file',
          type: asset.mimeType || allowedTypes[0],
          size: asset.size || 0,
        };
        onFilePicked(newFile);
      } else {
        onFilePicked(null);
      }
    } catch (error) {
      console.error('File picker error:', error);
      onFilePicked(null);
    }
  };

  return (
    <Pressable
      className={`min-h-[180px] border-2 border-dashed rounded-xl justify-center items-center p-5 ${
        error ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'
      }`}
      onPress={handlePress}
    >
      <Ionicons name="cloud-upload" size={48} color={error ? '#EF4444' : '#4F46E5'} />
      <Text className={`text-base font-psemibold mt-2 ${error ? 'text-red-600' : 'text-slate-800'}`}>
        Select {fileTypeLabel.toUpperCase()} File
      </Text>
      <Text className={`text-sm ${error ? 'text-red-500' : 'text-slate-500'} text-center`}>
        Tap to choose from your device
      </Text>
    </Pressable>
  );
};

export default FilePicker;