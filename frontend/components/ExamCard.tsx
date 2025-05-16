import React from "react";
import { View, Text, Pressable } from "react-native";

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: string;
};

type ExamCardProps = {
  question: Question;
  selectedAnswer: string | undefined;
  onSelect?: (qId: number, option: string) => void;
  index: number;
  mode: "exam" | "review";
  disabled?: boolean; // disables option selection in exam mode
};

export default function ExamCard({
  question,
  selectedAnswer,
  onSelect,
  index,
  mode,
  disabled = false,
}: ExamCardProps) {
  return (
    <View className="bg-white rounded-2xl px-5 py-4 shadow border border-gray-100 mx-2 my-2">
      <Text className="font-psemibold text-gray-800 mb-3">
        {index + 1}. {question.question}
      </Text>

      {question.options.map((opt, i) => {
        let bgClass = "bg-gray-100 border-transparent";
        let textClass = "text-gray-700";
        const isSelected = selectedAnswer === opt;

        if (mode === "exam") {
          bgClass = isSelected ? "bg-indigo-100 border-indigo-400" : bgClass;
          textClass = isSelected ? "text-indigo-800 font-semibold" : textClass;

          return (
            <Pressable
              key={i}
              onPress={() =>
                !disabled && onSelect && onSelect(question.id, opt)
              }
              className={`px-4 py-3 mb-2 rounded-xl border ${bgClass}`}>
              <Text className={`text-base font-pregular ${textClass}`}>
                {opt}
              </Text>
            </Pressable>
          );
        }

        if (mode === "review") {
          const isCorrect = question.correct === opt;

          if (isCorrect) {
            bgClass = "bg-green-100 border-green-400";
            textClass = "text-green-800 font-semibold";
          } else if (isSelected && !isCorrect) {
            bgClass = "bg-red-100 border-red-400";
            textClass = "text-red-800 font-semibold";
          } else if (!selectedAnswer === true) {
            bgClass = "bg-red-100 border-red-400";
            textClass = "text-red-800 font-semibold";
          }

          return (
            <View
              key={i}
              className={`px-4 py-3 mb-2 rounded-xl border ${bgClass}`}>
              <Text className={`text-base font-pregular ${textClass}`}>
                {opt}{" "}
                {isCorrect
                  ? "✓"
                  : isSelected && !isCorrect
                  ? "✗"
                  : !selectedAnswer
                  ? "✗"
                  : ""}
              </Text>
            </View>
          );
        }

        return null;
      })}
    </View>
  );
}
