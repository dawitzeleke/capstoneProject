import { View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ErrorModalProps = {
  isVisible: boolean;
  message: string;
  onDismiss: () => void;
};

export const ErrorModal = ({ isVisible, message, onDismiss }: ErrorModalProps) => (
  <Modal transparent visible={isVisible} onDismiss={onDismiss}>
    <View className="flex-1 justify-center items-center bg-black/40">
      {/* Absolute positioned centered container */}
      <View className="w-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-xs px-4">
        <View className="bg-white rounded-xl p-6 items-center shadow-lg">
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
    </View>
  </Modal>
);