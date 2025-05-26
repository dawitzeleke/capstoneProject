import { View, Pressable, Text, ActivityIndicator } from 'react-native';

type FormActionsProps = {
  onSaveDraft: () => void;
  onPost: () => void;
  onCancel: () => void;
  isSavingDraft: boolean;
  isPosting: boolean;
  validationErrors: {
    questionText: boolean;
    courseName: boolean;
    description: boolean;
    grade: boolean;
    difficulty: boolean;
    questionType: boolean;
    point: boolean;
    options: boolean[];
    explanation: boolean;
    tags: boolean;
    correctOption: boolean;
  };
};

const FormActions = ({
  onSaveDraft,
  onPost,
  onCancel,
  isSavingDraft,
  isPosting,
  validationErrors
}: FormActionsProps) => {
  const canSaveDraft = !validationErrors.questionText;
  const canPost = !Object.values(validationErrors).some(error => 
    Array.isArray(error) ? error.some(e => e) : error
  );

  return (
    <View className="flex-row gap-2 mx-4 mt-4 min-h-[44px]">
      {/* Save Draft Button */}
      <Pressable
        className={`flex-1 rounded py-3 items-center justify-center ${
          canSaveDraft ? 'bg-indigo-100' : 'bg-gray-100'
        }`}
        onPress={onSaveDraft}
        disabled={isSavingDraft || !canSaveDraft}
      >
        {isSavingDraft ? (
          <ActivityIndicator color="#4F46E5" size="small" />
        ) : (
          <Text className={`text-sm font-pmedium ${
            canSaveDraft ? 'text-indigo-600' : 'text-gray-400'
          }`}>
            Save Draft
          </Text>
        )}
      </Pressable>

      {/* Post Button */}
      <Pressable
        className={`flex-1 rounded py-3 items-center justify-center ${
          canPost ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
        onPress={onPost}
        disabled={isPosting || !canPost}
      >
        {isPosting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className={`text-sm font-pmedium ${
            canPost ? 'text-white' : 'text-gray-500'
          }`}>
            Post
          </Text>
        )}
      </Pressable>

      {/* Cancel Button */}
      <Pressable
        className="flex-1 rounded bg-red-100 py-3 items-center justify-center"
        onPress={onCancel}
      >
        <Text className="text-red-600 text-sm font-pmedium">Cancel</Text>
      </Pressable>
    </View>
  );
};

export default FormActions;