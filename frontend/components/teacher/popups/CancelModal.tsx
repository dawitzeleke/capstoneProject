import { View, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CancelModalProps = {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const CancelModal = ({ isVisible, onConfirm, onCancel }: CancelModalProps) => (
  <Modal visible={isVisible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center px-4">
      <View className="bg-white rounded-xl p-6 w-full max-w-[400px]">
        <Pressable onPress={onCancel} className="absolute top-3 right-3 z-10">
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
        <Text className="text-lg font-psemibold text-slate-800 mb-2 text-center">
          Discard Changes?
        </Text>
        <Text className="text-base text-slate-500 mb-6 text-center">
          Are you sure you want to discard this upload?
        </Text>
        
        {/* Vertical layout with proper spacing */}
        <View className="flex-col space-y-4">
          <Pressable
            className="w-full bg-slate-100 px-6 py-3 rounded-lg mb-2"
            onPress={onCancel}>
            <Text className="text-slate-600 font-pmedium text-center text-base">
              Continue Editing
            </Text>
          </Pressable>
          
          <Pressable
            className="w-full bg-red-100 px-6 py-3 rounded-lg mb-2"
            onPress={onConfirm}>
            <Text className="text-red-600 font-pmedium text-center text-base">
              Discard
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);