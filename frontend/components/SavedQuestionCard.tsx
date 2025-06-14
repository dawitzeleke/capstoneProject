import { View, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { removeSavedQuestion } from "@/redux/savedQuestionsReducer/savedQuestionActions";

interface SavedQuestionCardProps {
  subject: string;
  question: string;
  author: string;
  id: string;
  description?: string;
  courseName?: string;
  createdAt?: string;
}

export const SavedQuestionCard: FC<SavedQuestionCardProps> = ({
  subject,
  question,
  author,
  id,
  description,
  courseName,
  createdAt,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleRemove = () => {
    dispatch(removeSavedQuestion(id));
    setMenuVisible(false);
  };

  return (
    <View
      className={`w-[99%] p-5 mb-4 rounded-2xl border shadow-xl ${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Menu Icon */}
      <TouchableOpacity
        className="absolute top-3 right-3"
        onPress={() => setMenuVisible((prev) => !prev)}
      >
        <Entypo name="dots-three-vertical" size={18} color="#888" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View
          className={`absolute top-10 right-3 px-4 py-2 rounded-lg border shadow-lg z-10 ${
            theme === "dark"
              ? "bg-neutral-700 border-neutral-600"
              : "bg-white border-gray-200"
          }`}
        >
          <TouchableOpacity onPress={handleRemove}>
            <Text
              className={`text-sm font-pmedium ${
                theme === "dark" ? "text-gray-200" : "text-gray-600"
              }`}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <Text
        className={`text-lg font-psemibold mb-1 ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {courseName || subject}
      </Text>
      <Text
        className={`text-base font-pregular mb-2 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {question}
      </Text>
      {description && (
        <Text
          className={`text-sm font-pregular mb-2 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </Text>
      )}
      <View className="flex-row justify-between items-center">
        <Text
          className={`text-sm font-pthin ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          By {author}
        </Text>
        {createdAt && (
          <Text
            className={`text-xs font-pthin ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
};
