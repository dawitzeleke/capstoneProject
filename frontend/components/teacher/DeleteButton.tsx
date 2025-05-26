import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

interface DeleteButtonProps {
  loading: boolean;
  variant?: "icon" | "text";
  onPress: () => void;
}

const DeleteButton = ({ 
  loading, 
  variant = "icon",
  onPress
}: DeleteButtonProps) => {
  return (
    <Pressable
      className={`flex-row items-center rounded-lg ${
        variant === "icon" ? "p-2 bg-red-100" : "px-4 py-2 bg-red-100"
      }`}
      onPress={onPress}
      disabled={loading}
    >
      {variant === "icon" ? (
        <Ionicons name="trash-outline" size={20} color="#dc2626" />
      ) : (
        <Text className="text-red-600 font-pmedium">Delete</Text>
      )}
    </Pressable>
  );
};

export default DeleteButton;