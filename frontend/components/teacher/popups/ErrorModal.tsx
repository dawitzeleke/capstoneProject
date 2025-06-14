import { View, Text, Modal, Pressable } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

type ErrorModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const ErrorModal = ({ visible, onClose, children }: ErrorModalProps) => (
  <Modal transparent visible={visible}>
    <View className="flex-1 justify-center items-center bg-black/40">
      {/* Absolute positioned centered container */}
      <View className="w-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-xs px-4">
        <View className="bg-white rounded-xl p-6 shadow-lg">
          <Pressable onPress={onClose} className="absolute top-3 right-3 z-10">
            <Ionicons name="close" size={24} color="#64748b" />
          </Pressable>
          {children}
        </View>
      </View>
    </View>
  </Modal>
);