import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ValidationErrors } from '@/types/questionTypes';

interface FormActionsProps {
  onPost: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isPosting: boolean;
  isSavingDraft: boolean;
  validationErrors: ValidationErrors;
}

const FormActions: React.FC<FormActionsProps> = ({
  onPost,
  onSaveDraft,
  onCancel,
  isPosting,
  isSavingDraft,
  validationErrors,
}) => {
  const canSaveDraft = !validationErrors.questionText;
  const canPost = !Object.values(validationErrors).some(error => 
    Array.isArray(error) ? error.some(e => e) : error
  );

  return (
    <View className="px-4 py-4 bg-white border-t border-gray-200">
      <TouchableOpacity
        onPress={onPost}
        disabled={isPosting || !canPost}
        className={`flex-row items-center justify-center px-4 py-2.5 rounded-xl shadow-sm mb-3 ${
          canPost 
            ? 'bg-indigo-600 border border-indigo-700' 
            : 'bg-indigo-300 border border-indigo-400'
        }`}
      >
        <Ionicons 
          name="cloud-upload-outline" 
          size={20} 
          color="white" 
        />
        <Text className="text-white ml-2 font-medium text-sm">
          {isPosting ? 'Posting...' : 'Post'}
        </Text>
      </TouchableOpacity>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={onSaveDraft}
          disabled={isSavingDraft || !canSaveDraft}
          className={`flex-1 flex-row items-center justify-center px-4 py-2.5 rounded-xl shadow-sm ${
            canSaveDraft ? 'bg-white border border-gray-200' : 'bg-gray-50'
          }`}
        >
          <Ionicons 
            name="save-outline" 
            size={20} 
            color={canSaveDraft ? "#4B5563" : "#9CA3AF"} 
          />
          <Text className={`ml-2 font-medium text-sm ${
            canSaveDraft ? 'text-gray-700' : 'text-gray-400'
          }`}>
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 flex-row items-center justify-center px-4 py-2.5 rounded-xl shadow-sm bg-white border border-gray-200"
        >
          <Ionicons name="close-outline" size={20} color="#DC2626" />
          <Text className="text-red-600 ml-2 font-medium text-sm">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormActions;