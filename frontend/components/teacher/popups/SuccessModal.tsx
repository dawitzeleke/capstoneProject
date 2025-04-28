import { View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SuccessModalProps = {
  isVisible: boolean;
  onDismiss: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  message: string;
  color?: string;
};

export const SuccessModal = ({ 
  isVisible, 
  onDismiss,
  icon,
  message,
  color = '#4F46E5'
}: SuccessModalProps) => (
  <Modal transparent visible={isVisible}>
    <View className="flex-1 justify-center items-center bg-black/40 px-6">
      <View className="bg-white rounded-xl p-6 w-full max-w-[320px] items-center flex-col">
        <Ionicons name={icon} size={48} color={color} />
        <Text className="text-lg font-psemibold mt-2 text-center" style={{ color }}>
          {message}
        </Text>
      </View>
    </View>
  </Modal>
);