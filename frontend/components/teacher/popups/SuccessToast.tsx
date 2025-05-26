import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SuccessToast = ({ message }: { message: string }) => (
  <View 
    className="bg-green-500 p-2 rounded-lg flex-row items-center justify-center shadow-lg"
    style={{
      position: 'absolute',
      top: 45, // Adjust this value to move it up/down
      left: 16,
      right: 16,
      zIndex: 100,
      elevation: 3, // For Android shadow
    }}
  >
    <Ionicons name="checkmark-circle" size={20} color="white" />
    <Text className="text-white font-pmedium ml-2 text-center">
      {message}
    </Text>
  </View>
);