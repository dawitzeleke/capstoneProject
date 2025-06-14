import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

type ConfirmModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  children: ReactNode;
};

export const ConfirmModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  loading = false,
  children 
}: ConfirmModalProps) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 justify-center items-center bg-black/50 px-6">
      <View className="bg-white rounded-2xl p-6 w-full max-w-[400px] shadow-xl">
        <Pressable 
          onPress={onClose} 
          className="absolute top-4 right-4 z-10 bg-gray-100 rounded-full p-1"
        >
          <Ionicons name="close" size={20} color="#64748b" />
        </Pressable>
        <View className="items-center">
          <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
            <Ionicons name="help-circle" size={32} color="#3b82f6" />
          </View>
          {children}
          <View className="flex-row space-x-4 w-full mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-100 py-3 rounded-xl"
            >
              <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              className="flex-1 bg-blue-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                {loading ? 'Confirming...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </Modal>
); 