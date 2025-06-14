import React from 'react';
import { View, Pressable, Text, ActivityIndicator, Dimensions } from 'react-native';
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

// Get screen width for responsive button sizing
const { width: screenWidth } = Dimensions.get('window');
// Calculate button width: 30% of screen width, capped at 120px for large screens
const BUTTON_WIDTH = Math.min(screenWidth * 0.3, 120);
// Total container width: 3 buttons + 2 gaps (8px each)
const CONTAINER_WIDTH = BUTTON_WIDTH * 3 + 8 * 2;

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
    <View className="border-t border-gray-200 py-4">
      {/* Centered container with fixed width */}
      <View
        className="flex-row justify-between"
        style={{
          width: CONTAINER_WIDTH,
          marginHorizontal: 'auto', // Center horizontally
        }}
      >
        <Pressable
          className={`flex-row items-center justify-center bg-indigo-100 rounded-lg ${
            isSavingDraft ? 'opacity-50' : ''
          }`}
          onPress={onSaveDraft}
          disabled={isSavingDraft}
          style={{
            width: BUTTON_WIDTH,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          {isSavingDraft ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <>
              <Ionicons name="bookmark" size={18} color="#4F46E5" />
              <Text className="ml-2 text-[#4F46E5] font-pmedium text-sm">
                Save Draft
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          className={`flex-row items-center justify-center bg-[#dcfce7] rounded-lg ${
            isPosting || !canPost ? 'opacity-50' : ''
          }`}
          onPress={onPost}
          disabled={isPosting || !canPost}
          style={{
            width: BUTTON_WIDTH,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          {isPosting ? (
            <ActivityIndicator color="#16a34a" />
          ) : (
            <>
              <Ionicons name="checkmark" size={18} color="#16a34a" />
              <Text className="ml-2 text-[#16a34a] font-pmedium text-sm">
                Post
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          className="flex-row items-center justify-center bg-red-100 rounded-lg mr-2"
          onPress={onCancel}
          style={{
            width: BUTTON_WIDTH,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <Ionicons name="close" size={18} color="#DC2626" />
          <Text className="ml-2 text-red-600 font-pmedium text-sm">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FormActions;
