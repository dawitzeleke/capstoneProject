import { View, Text, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ErrorModalProps = {
  isVisible: boolean;
  message: string;
  onDismiss: () => void;
};

export const ErrorModal = ({ isVisible, message, onDismiss }: ErrorModalProps) => (
  <Modal
    transparent
    visible={isVisible}
    onRequestClose={onDismiss}
    statusBarTranslucent
  >
    <View
      className="flex-1 justify-center items-center bg-black/40 px-6"
      accessibilityViewIsModal
      aria-modal={true}
      role="dialog"
    >
      <View className="bg-white rounded-xl p-6 w-full max-w-xs items-center flex-col">
        <Pressable onPress={onDismiss} className="absolute top-3 right-3 z-10">
          <Ionicons name="close" size={24} color="#64748b" />
        </Pressable>
        <Ionicons name="close-circle" size={48} color="#ef4444" />
        <Text 
          className="text-lg font-psemibold text-red-600 mt-2 text-center"
          style={{ 
            textAlign: 'center',
            width: '100%'
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  </Modal>
);