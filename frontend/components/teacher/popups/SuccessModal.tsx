import { View, Text, Modal, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

type SuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const SuccessModal = ({ 
  visible, 
  onClose,
  children
}: SuccessModalProps) => (
  <Modal transparent visible={visible}>
    <View className="flex-1 justify-center items-center bg-black/40 px-6">
      <View className="bg-white rounded-xl p-6 w-full max-w-[320px]">
        <Pressable onPress={onClose} className="absolute top-3 right-3 z-10">
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
        {children}
      </View>
    </View>
  </Modal>
);