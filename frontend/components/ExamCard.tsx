import React from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

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
  disabled?: boolean;
};

export default function ExamCard({
  question,
  selectedAnswer,
  onSelect,
  index,
  mode,
  disabled = false,
}: ExamCardProps) {
  const currentTheme = useSelector((state: any) => state.theme.mode);

  const getOptionStyle = (opt: string) => {
    const isSelected = selectedAnswer === opt;
    const isCorrect = question.correct === opt;

    if (mode === "exam") {
      return {
        container: `px-6 py-4 mb-3 rounded-xl border ${
          isSelected
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
            : currentTheme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`,
        text: `text-base font-pregular ${
          isSelected
            ? "text-indigo-700 dark:text-indigo-300"
            : currentTheme === "dark"
            ? "text-gray-300"
            : "text-gray-700"
        }`,
      };
    }

    if (mode === "review") {
      if (isCorrect) {
        return {
          container: "px-6 py-4 mb-3 rounded-xl border border-green-500 bg-green-50 dark:bg-green-900/30",
          text: "text-base font-pregular text-green-700 dark:text-green-300",
        };
      }
      if (isSelected && !isCorrect) {
        return {
          container: "px-6 py-4 mb-3 rounded-xl border border-red-500 bg-red-50 dark:bg-red-900/30",
          text: "text-base font-pregular text-red-700 dark:text-red-300",
        };
      }
      return {
        container: `px-6 py-4 mb-3 rounded-xl border ${
          currentTheme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`,
        text: `text-base font-pregular ${
          currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
        }`,
      };
    }

    return {
      container: "",
      text: "",
    };
  };

  return (
    <View className={`rounded-2xl px-6 py-5 shadow-sm border ${
      currentTheme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    } mx-2 my-2`}>
      <View className="flex-row items-start mb-5">
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
          currentTheme === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}>
          <Text className={`font-psemibold ${
            currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
            {index + 1}
          </Text>
        </View>
        <Text className={`flex-1 font-pmedium text-base ${
          currentTheme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}>
          {question.question}
        </Text>
      </View>

      {question.options.map((opt, i) => {
        const styles = getOptionStyle(opt);
        const isCorrect = question.correct === opt;
        const isSelected = selectedAnswer === opt;

        if (mode === "exam") {
          return (
            <Pressable
              key={i}
              onPress={() => !disabled && onSelect && onSelect(question.id, opt)}
              className={`${styles.container} active:opacity-70`}
            >
              <Text className={styles.text}>{opt}</Text>
            </Pressable>
          );
        }

        if (mode === "review") {
          return (
            <View key={i} className={styles.container}>
              <View className="flex-row items-center justify-between">
                <Text className={styles.text}>{opt}</Text>
                {isCorrect && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={currentTheme === "dark" ? "#34D399" : "#059669"}
                  />
                )}
                {isSelected && !isCorrect && (
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color={currentTheme === "dark" ? "#F87171" : "#DC2626"}
                  />
                )}
              </View>
            </View>
          );
        }

        return null;
      })}
    </View>
  );
}
