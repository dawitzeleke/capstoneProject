import React from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';

export type ActionButtonsProps = {
  onSaveDraft: () => void;
  onPost: () => void;
  onCancel: () => void;
  isSavingDraft: boolean;
  isPosting: boolean;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSaveDraft,
  onPost,
  onCancel,
  isSavingDraft,
  isPosting,
}) => (
  <View className="flex-row gap-2 mx-4 mt-4 min-h-[44px]">
    <Pressable
      className="flex-1 rounded bg-indigo-100 py-3 items-center justify-center"
      onPress={onSaveDraft}
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
      onPress={onPost}
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
      onPress={onCancel}
    >
      <Text className="text-white text-sm font-pmedium">Cancel</Text>
    </Pressable>
  </View>
);

export default ActionButtons;
