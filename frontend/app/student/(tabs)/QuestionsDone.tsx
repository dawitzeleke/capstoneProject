import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { SavedQuestionCard } from "@/components/SavedQuestionCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";

const QuestionsDone = () => {
  const [selectedTab, setSelectedTab] = useState("Correct");
  const savedQuestions = useSelector(
    (state: RootState) => state.questions.data
  );

  // Filter based on selected tab
  const filteredQuestions = savedQuestions.filter((q) =>
    selectedTab === "Correct" ? q.isCorrect : !q.isCorrect
  );

  return (
    <View className="flex-1 bg-primary px-4 pt-6">
      <View className="flex-row justify-between items-center mb-6">
        <Link
          href="/student/(tabs)/Profile"
          className="text-lg text-blue-500 font-pregular">
          <Ionicons name="chevron-back" size={20} color="gray" />
        </Link>
        <Text className="text-white text-2xl font-pbold">Leaderboard</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {/* 🔹 Tabs */}
      <View className="flex-row justify-around mb-6 bg-[#1A233A] p-2 rounded-full">
        {["Correct", "Incorrect"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`py-2 px-6 rounded-full ${
              selectedTab === tab ? "bg-white" : "bg-transparent"
            }`}>
            <Text
              className={`text-sm font-psemibold ${
                selectedTab === tab ? "text-black" : "text-gray-400"
              }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Question List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <SavedQuestionCard
              key={q.id}
              subject={q.subject}
              question={q.question}
              author={q.author}
              id={q.id}
            />
          ))
        ) : (
          <Text className="text-center text-gray-400 font-pregular mt-20">
            No questions in this category yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default QuestionsDone;
