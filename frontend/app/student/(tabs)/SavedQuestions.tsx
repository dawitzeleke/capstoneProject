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

  console.log('Saved Questions:', savedQuestions);

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
        {savedQuestions && savedQuestions.length > 0 ? (
          savedQuestions.map((q) => (
            <SavedQuestionCard
              key={q._id}
              id={q._id}
              subject={q.CourseName}
              question={q.QuestionText}
              author={q.CreatedBy}
              description={q.Description}
              courseName={q.CourseName}
              createdAt={q.CreatedAt}
            />
          ))
        ) : (
          <Text
            className={`text-center mt-20 font-pregular ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            No saved questions yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
