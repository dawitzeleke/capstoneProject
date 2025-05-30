import React from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import { ValidationErrors } from '@/types/questionTypes';
import { Ionicons } from '@expo/vector-icons';

type FormActionsProps = {
  onSaveDraft: () => void;
  onPost: () => void;
  onCancel: () => void;
  isSavingDraft: boolean;
  isPosting: boolean;
  validationErrors: ValidationErrors;
};

const FormActions = ({
  onSaveDraft,
  onPost,
  onCancel,
  isSavingDraft,
  isPosting,
  validationErrors,
}: FormActionsProps) => {
  const canSaveDraft = !validationErrors.questionText;
  const canPost = !Object.values(validationErrors).some(error => 
    Array.isArray(error) ? error.some(e => e) : error
  );

  return (
    <View className="flex-row flex-wrap justify-around p-4 border-t border-gray-200 gap-2">
      <Pressable
        className="flex-2 flex-row items-center justify-center px-4 py-2 bg-indigo-100 rounded-lg"
        onPress={onSaveDraft}
        disabled={isSavingDraft}
      >
        {isSavingDraft ? (
          <ActivityIndicator color="#4F46E5" />
        ) : (
          <>
            <Ionicons name="bookmark" size={18} color="#4F46E5" />
            <Text className="ml-2 text-[#4F46E5] font-pmedium">Save Draft</Text>
          </>
        )}
      </Pressable>

      <Pressable
        className="flex-2 flex-row items-center justify-center px-4 py-2 bg-[#dcfce7] rounded-lg"
        onPress={onPost}
        disabled={isPosting}
      >
        {isPosting ? (
          <ActivityIndicator color="#16a34a" />
        ) : (
          <>
            <Ionicons name="checkmark" size={18} color="#16a34a" />
            <Text className="ml-2 text-[#16a34a] font-pmedium">Post</Text>
          </>
        )}
      </Pressable>

      <Pressable
        className="flex-2 flex-row items-center justify-center px-4 py-2 bg-red-100 rounded-lg"
        onPress={onCancel}
      >
        <Ionicons name="close" size={18} color="#DC2626" />
        <Text className="ml-2 text-red-600 font-pmedium">Cancel</Text>
      </Pressable>
    </View>
  );
};

export default FormActions;