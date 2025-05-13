import { View, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SavedQuestionCard } from "@/components/SavedQuestionCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function SavedQuestions() {
  const savedQuestions = useSelector(
    (state: RootState) => state.savedQuestions.list
  );
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <View className={`flex-1 p-4 ${theme === "dark" ? "bg-black" : "bg-[#f1f3fc]"}`}>
      <View className="flex-row justify-center absolute top-4 left-4 align-middle mb-6">
        <Link href="/student/(tabs)/Profile" className="text-lg font-pregular">
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme === "dark" ? "#ccc" : "gray"}
          />
        </Link>
      </View>

      <Text
        className={`text-center text-xl font-pbold mt-4 mb-4 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Saved Questions
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {savedQuestions.map((q) => (
          <SavedQuestionCard
            key={q.id}
            id={q.id}
            subject={q.subject}
            question={q.question}
            author={q.author}
          />
        ))}
      </ScrollView>
    </View>
  );
}
