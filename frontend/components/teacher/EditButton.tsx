import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setEditingQuestion } from "@/redux/teacherReducer/contentSlice"
interface EditButtonProps {
  itemId: string;
  loading: boolean;
  variant?: "icon" | "text";
  onNavigate?: () => void; 
}

const EditButton = ({ 
  itemId, 
  loading, 
  variant = "icon", // Default to icon variant
  onNavigate ,
}: EditButtonProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleEdit = () => {
    dispatch(setEditingQuestion(itemId));
    router.push({
      pathname: "/teacher/AddQuestion",
      params: { editingId: itemId }
    });
    onNavigate?.();
  };

  return (
    <Pressable
      className={`flex-row items-center rounded-lg ${
        variant === "icon" ? "p-2 bg-indigo-100" : "px-4 py-2 bg-indigo-100"
      }`}
      onPress={handleEdit}
      disabled={loading}
    >
      {variant === "icon" ? (
        <Ionicons name="create-outline" size={20} color="#4F46E5" />
      ) : (
        <Text className="text-indigo-600 font-pmedium">Edit</Text>
      )}
    </Pressable>
  );
};

export default EditButton;