import { View, Text, ScrollView } from "react-native";
import { SavedQuestionCard } from "@/components/SavedQuestionCard";

export default function SavedQuestions() {
  return (
    <View className="flex-1 bg-primary p-4">
      <Text className="text-center text-xl text-gray-200 font-pbold mb-4">
        Saved Questions
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SavedQuestionCard
          subject="Biology"
          question="What is the powerhouse of the cell?"
          author="temesgen"
        />
      </ScrollView>
    </View>
  );
}
