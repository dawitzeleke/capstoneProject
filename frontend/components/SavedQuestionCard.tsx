import { View, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeSavedQuestion } from "@/redux/savedQuestionsReducer/savedQuestionActions";

interface SavedQuestionCardProps {
  subject: string;
  question: string;
  author: string;
  id: string; 
}

export const SavedQuestionCard: FC<SavedQuestionCardProps> = ({
  subject,
  question,
  author,
  id,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
   const dispatch = useDispatch<AppDispatch>();

  const handleRemove = () => {
    dispatch(removeSavedQuestion(id));
    setMenuVisible(false);
  };

  return (
    <View className="bg-card p-6 rounded-xl mb-4 relative">
      <TouchableOpacity
        className="absolute right-4 top-4 z-10"
        onPress={() => setMenuVisible((prev) => !prev)}
      >
        <Entypo name="dots-three-vertical" size={16} color="gray" />
      </TouchableOpacity>

      {menuVisible && (
        <View className="absolute right-4 top-10 bg-option rounded-md p-4 z-20 shadow-md">
          <TouchableOpacity onPress={handleRemove}>
            <Text className="text-gray-400 text-lg font-pregular">Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="text-xl text-gray-300 font-pbold mb-1">{subject}</Text>
      <Text className="text-lg font-pregular text-gray-400 mb-2">{question}</Text>
      <Text className="text-lg text-white font-pthin">By {author}</Text>
    </View>
  );
};
