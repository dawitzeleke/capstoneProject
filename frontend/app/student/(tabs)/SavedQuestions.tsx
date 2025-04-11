import { View, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SavedQuestionCard } from "@/components/SavedQuestionCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // adjust this path as needed

export default function SavedQuestions() {
  const savedQuestions = useSelector(
    (state: RootState) => state.savedQuestions.list
  );
  console.log();

  return (
    <View className="flex-1 bg-primary p-4">
      <View className="flex-row justify-center absolute top-4 left-4 align-middle mb-6">
        <Link
          href="/student/(tabs)/Profile"
          className="text-lg text-blue-500 font-pregular">
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Link>
      </View>

      <Text className="text-center text-xl text-gray-200 font-pbold mt-4 mb-4">
        Saved Questions
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {savedQuestions.map((q) => (
          <SavedQuestionCard
            id={q.id}
            key={q.id}
            subject={q.subject}
            question={q.question}
            author={q.author}
          />
        ))}
      </ScrollView>
    </View>
  );
}
