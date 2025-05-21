import { View, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DeleteModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  count: number;
  title?: string;
  message?: string;
};

export const DeleteConfirmationModal = ({ 
  visible, 
  onConfirm, 
  onCancel, 
  count, 
  title,
  message
}: DeleteModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center px-4">
      <View className="bg-white rounded-xl p-6 w-full max-w-[400px]">
        <Pressable onPress={onCancel} className="absolute top-3 right-3 z-10">
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
        <Text className="text-lg font-psemibold text-slate-800 mb-2 text-center mt-4">
          {title ?? (count === 1 ? 'Delete Question?' : `Delete ${count} Questions?`)}
        </Text>
        <Text className="text-base text-slate-500 mb-6 text-center">
          {message ?? (count === 1 
            ? 'Are you sure you want to delete this question? This action cannot be undone.'
            : `Are you sure you want to delete these ${count} questions? This action cannot be undone.`)}
        </Text>
        <View className="flex-col space-y-4">
          <Pressable
            className="w-full bg-slate-100 px-6 py-3 rounded-lg"
            onPress={onCancel}>
            <Text className="text-slate-600 font-pmedium text-center text-base">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            className="w-full bg-red-100 px-6 py-3 rounded-lg"
            onPress={onConfirm}>
            <Text className="text-red-600 font-pmedium text-center text-base">
              {count === 1 ? 'Delete Permanently' : `Delete ${count} Questions`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);