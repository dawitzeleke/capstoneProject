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
} from "react-native";
import LottieView from "lottie-react-native";
import ExamCard from "../../components/ExamCard";
import ExamHeader from "../../components/ExamHeader";
import CountdownOverlay from "../../components/CountdownOverlay";
import ResultModal from "../../components/ResultModal";

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
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

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
    <View className="flex-1 bg-[#f1f3fc] px-4 pt-8 relative">
      <CountdownOverlay countdown={countdown} />
      <ExamHeader
        started={started}
        score={score}
        timeLeft={timeLeft}
        formatTime={formatTime}
      />

      {!started && score === null && (
        <View
          className={`${
            started ? "hidden" : ""
          } flex-1 justify-center items-center`}>
          <Pressable
            onPress={handleStart}
            className="bg-indigo-600 h-52 w-52 items-center justify-center rounded-full px-10 py-6">
            <Text className="text-white text-xl font-psemibold">
              Start Exam
            </Text>
          </Pressable>
        </View>
      )}

      {started && (
        <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
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

          <Pressable
            onPress={handleSubmit}
            className="bg-green-600 mt-4 mb-8 rounded-full py-3 px-6 self-center">
            <Text className="text-white font-semibold text-base">Submit</Text>
          </Pressable>
        </ScrollView>
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
        <ScrollView className="mt-4">
          {sampleQuestions.map((q, idx) => (
            <ExamCard
              key={q.id}
              question={q}
              selectedAnswer={answers[q.id]}
              index={idx}
              mode="review"
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
