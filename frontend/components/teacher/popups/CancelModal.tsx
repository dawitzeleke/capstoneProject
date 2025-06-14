import { View, Text, Modal, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

type CancelModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: ReactNode;
};

export const CancelModal = ({ visible, onClose, onConfirm, children }: CancelModalProps) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center px-4">
      <View className="bg-white rounded-xl p-6 w-full max-w-[400px]">
        <Pressable onPress={onClose} className="absolute top-3 right-3 z-10">
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
        
        {children}
      </View>
    </View>
  </Modal>
);