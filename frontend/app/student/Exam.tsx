import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import ExamCard from "../../components/ExamCard";
import ExamHeader from "../../components/ExamHeader";
import CountdownOverlay from "../../components/CountdownOverlay";
import ResultModal from "../../components/ResultModal";
import { Link, useRouter } from "expo-router";
import { useSelector } from "react-redux";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    correct: "Mars",
  },
];

export default function ExamScreen() {
  const router = useRouter();
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStarted(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const handleStart = () => {
    startCountdown();
  };

  const handleSelect = (qId: number, option: string) => {
    if (!started) return;
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = () => {
    let correct = 0;
    sampleQuestions.forEach((q) => {
      if (answers[q.id] && answers[q.id] === q.correct) correct++;
    });
    setScore(correct);
    setStarted(false);
    setTimeLeft(5 * 60);
  };

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && started) {
      handleSubmit();
    }
  }, [timeLeft, started]);

  const handleRetake = () => {
    setAnswers({});
    setScore(null);
    setShowResults(false);
    handleStart();
  };

  return (
    <View className={`flex-1 px-4 pt-8 relative ${
      currentTheme === "dark" ? "bg-gray-900" : "bg-[#f1f3fc]"
    }`}>
      <CountdownOverlay countdown={countdown} />
      <ExamHeader
        started={started}
        score={score}
        timeLeft={timeLeft}
        formatTime={formatTime}
      />

      {!started && score === null && (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-4xl font-pbold mb-8 text-center ${
            currentTheme === "dark" ? "text-white" : "text-gray-800"
          }`}>
            Get Ready!
          </Text>
          <View className="items-center">
            <View className={`w-64 h-64 rounded-full items-center justify-center mb-8 ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-white"
            }`}>
              <MaterialIcons
                name="school"
                size={80}
                color={currentTheme === "dark" ? "#fff" : "#4F46E5"}
              />
            </View>
            <Pressable
              onPress={handleStart}
              className={`rounded-2xl px-12 py-4 ${
                currentTheme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
              } shadow-lg`}
            >
              <Text className="text-white text-xl font-psemibold">
                Start Exam
              </Text>
            </Pressable>
            <Pressable
            onPress={() => router.back()}
            className="mt-6 bg-gray-200 px-6 py-3 rounded-full">
            <Text className="text-gray-700 font-pregular text-base">
              Cancle
            </Text>
          </Pressable>
          </View>
        </View>
      )}

      {started && (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="mt-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {sampleQuestions.map((q, idx) => (
              <ExamCard
                key={q.id}
                question={q}
                selectedAnswer={answers[q.id]}
                onSelect={handleSelect}
                index={idx}
                mode="exam"
              />
            ))}

            <View className="flex-row justify-between items-center mt-6 mb-8 px-2">
              <Pressable
                onPress={() => router.back()}
                className={`px-6 py-3 rounded-xl ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <Text className={`font-pmedium ${
                  currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Exit
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                className="bg-green-600 px-8 py-3 rounded-xl"
              >
                <Text className="text-white px-4 font-psemibold text-base">
                  Submit Exam
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {!started && score !== null && !showResults && (
        <ResultModal
          visible={true}
          score={score}
          totalQuestions={sampleQuestions.length}
          onClose={() => setShowResults(true)}
          onRetake={handleRetake}
        />
      )}

      {!started && score !== null && showResults && (
        <ScrollView 
          className="mt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {sampleQuestions.map((q, idx) => (
            <ExamCard
              key={q.id}
              question={q}
              selectedAnswer={answers[q.id]}
              index={idx}
              mode="review"
            />
          ))}
          <View className="flex-row justify-between items-center mt-6 mb-8 px-2">
            <Pressable
              className={`px-6 py-3 rounded-xl ${
                currentTheme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
              onPress={() => router.replace("/student/CreateExam")}
            >
              <Text className={`font-pmedium ${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Back
              </Text>
            </Pressable>
            <Pressable
              onPress={handleRetake}
              className={`px-6 py-3 rounded-xl ${
                currentTheme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
              }`}
            >
              <Text className="text-white font-psemibold">
                Retake Exam
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
