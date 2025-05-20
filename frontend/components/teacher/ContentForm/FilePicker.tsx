import { useState } from 'react';
import { Pressable, View, Text, Image, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Video from 'react-native-video';

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
  const [pickedFile, setPickedFile] = useState<FileData | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  const handleFilePick = async (event: GestureResponderEvent) => {
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
        setPickedFile(newFile);
        onFilePicked(newFile);
      } else {
        setPickedFile(null);
        onFilePicked(null);
      }
    } catch (error) {
      console.error('File picker error:', error);
      setPickedFile(null);
      onFilePicked(null);
    }
  };

  return (
    <View className="w-full mb-4">
      {/* File Selection Button */}
      <Pressable
        className={`min-h-[180px] border-2 border-dashed rounded-xl justify-center items-center p-5 ${
          error ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'
        }`}
        onPress={handleFilePick}
      >
        <View className="items-center">
          <Ionicons 
            name="cloud-upload" 
            size={48} 
            color={error ? '#EF4444' : '#4F46E5'} 
          />
          <Text className={`text-base font-psemibold mt-2 ${
            error ? 'text-red-600' : 'text-slate-800'
          }`}>
            Select {fileTypeLabel.toUpperCase()} File
          </Text>
          <Text className={`text-sm ${
            error ? 'text-red-500' : 'text-slate-500'
          } text-center`}>
            {pickedFile ? 'Tap to change file' : 'Tap to choose from your device'}
          </Text>
        </View>
      </Pressable>

      {/* Validation Error Message */}
      {error && !pickedFile && (
        <Text className="text-red-500 text-sm mt-1 font-pregular">
          {fileTypeLabel === 'video' 
            ? 'Video file is required' 
            : 'Image file is required'}
        </Text>
      )}

      {/* Selected File Preview */}
      {pickedFile && (
        <View className="mt-4 p-3 bg-indigo-50 rounded-lg">
          {/* File Info */}
          <View className="flex-row items-center justify-between">
            <Text className="text-indigo-800 font-pmedium flex-1">
              {pickedFile.name}
            </Text>
            <Text className="text-indigo-600 text-sm">
              {Math.round(pickedFile.size / 1024)}KB
            </Text>
          </View>

          {/* Media Preview */}
          <View className="mt-4">
            {pickedFile.type.startsWith('image/') ? (
              <Image
                source={{ uri: pickedFile.uri }}
                className="w-full h-48 rounded-lg"
                resizeMode="contain"
              />
            ) : pickedFile.type.startsWith('video/') ? (
              <View className="w-full h-48 rounded-lg overflow-hidden">
                <Video
                  source={{ uri: pickedFile.uri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  controls={false}
                  paused={isVideoPaused}
                  repeat
                />
                <Pressable
                  className="absolute bottom-2 right-2 bg-[#4F46E5] p-2 rounded-full"
                  onPress={() => setIsVideoPaused(!isVideoPaused)}
                >
                  <Ionicons 
                    name={isVideoPaused ? "play" : "pause"} 
                    size={24} 
                    color="white" 
                  />
                </Pressable>
              </View>
            ) : (
              <Text className="text-slate-500 mt-2">Preview not available</Text>
            )}
          </View>

          {/* Remove File Button */}
          <Pressable
            className="mt-3 flex-row items-center justify-end"
            onPress={() => {
              setPickedFile(null);
              onFilePicked(null);
            }}
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