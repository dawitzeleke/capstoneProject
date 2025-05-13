import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SavedQuestionCard } from "@/components/SavedQuestionCard";
import { Link } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const QuestionsDone = () => {
  const [selectedTab, setSelectedTab] = useState("Correct");
  const savedQuestions = useSelector(
    (state: RootState) => state.questions.data
  );
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const filteredQuestions = savedQuestions.filter((q) =>
    selectedTab === "Correct" ? q.isCorrect : !q.isCorrect
  );

  return (
    <SafeAreaView
      className={`flex-1  ${
        currentTheme === "dark" ? "bg-black" : "bg-[#f1f3fc]"
      }`}>
      {/* 🔹 Header */}
      <View className="flex-row justify-between py-6 px-2  items-center mb-6">
        <Link href="/student/(tabs)/Profile">
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentTheme === "dark" ? "white" : "black"}
          />
        </Link>
        <Text
          className={`text-2xl font-pbold ${
            currentTheme === "dark" ? "text-white" : "text-black"
          }`}>
          Leaderboard
        </Text>
        <TouchableOpacity>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={currentTheme === "dark" ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 Tabs */}
      <View className={`flex-row justify-around mb-6 p-2 rounded-full`}>
        {["Correct", "Incorrect"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`py-4 px-6 rounded-lg ${
              selectedTab === tab
                ? currentTheme === "dark"
                  ? "bg-[#4F46E5]"
                  : "bg-[#4F46E5]"
                : "bg-transparent"
            }`}>
            <Text
              className={`text-sm font-psemibold ${
                selectedTab === tab
                  ? currentTheme === "dark"
                    ? "text-white"
                    : "text-white"
                  : currentTheme === "dark"
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 Questions List */}
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
          <Text
            className={`text-center mt-20 font-pregular ${
              currentTheme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
            No questions in this category yet.
          </Text>
        )}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionsDone;
