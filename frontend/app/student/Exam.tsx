import React, { useState, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import LottieView from "lottie-react-native";

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
  const [showOverlay, setShowOverlay] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const animationRef = useRef(null);
  const { width, height } = Dimensions.get("window");

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
    setShowOverlay(true);
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

  const getAnimationSource = () => {
    if (score === null) return null;
    if (score === sampleQuestions.length) {
      return require("../../assets/animations/winner.json");
    } else if (score >= sampleQuestions.length * 0.7) {
      return require("../../assets/animations/average.json");
    } else if (score >= sampleQuestions.length * 0.5 || score === 0) {
      return require("../../assets/animations/keepup.json");
    }
    return null;
  };

  return (
    <View className="flex-1 bg-[#f1f3fc] px-4 pt-8 relative">
      {/* Countdown Overlay */}
      {countdown !== null && (
        <View className="absolute inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
          <Text className="text-white text-7xl font-bold">{countdown}</Text>
        </View>
      )}

      {/* Header */}
      <View className="mb-2 flex-row justify-between items-center">
        <Text className="text-xl font-psemibold text-gray-800">
          {started
            ? "Answer the Questions"
            : score !== null
            ? "Result"
            : "Get Ready!"}
        </Text>

        {started && (
          <View className="bg-indigo-100 px-3 py-1 rounded-full">
            <Text className="text-indigo-700 font-semibold text-base">
              ⏱ {formatTime(timeLeft)}
            </Text>
          </View>
        )}
      </View>

      {/* Show score and answers after modal is dismissed */}
      {!started && score !== null && showResults && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="space-y-6">
          {sampleQuestions.map((q, idx) => (
            <View
              key={q.id}
              className="bg-white rounded-2xl px-5 py-4 my-2 shadow border border-gray-100 mx-2">
              <Text className="font-psemibold text-gray-800 mb-3">
                {idx + 1}. {q.question}
              </Text>
              {q.options.map((opt, i) => {
                const userAns = answers[q.id];
                const isCorrect = q.correct === opt;
                const isSelected = userAns === opt;

                let bgClass = "bg-gray-100 border-transparent";
                let textClass = "text-gray-700";

                if (isCorrect) {
                  bgClass = "bg-green-100 border-green-400";
                  textClass = "text-green-800 font-semibold";
                } else if (isSelected && !isCorrect) {
                  bgClass = "bg-red-100 border-red-400";
                  textClass = "text-red-800 font-semibold";
                }

                return (
                  <View
                    key={i}
                    className={`px-4 py-3 mb-2 rounded-xl border ${bgClass}`}>
                    <Text className={`text-base font-pregular ${textClass}`}>
                      {opt}{" "}
                      {isCorrect ? "✓" : isSelected && !isCorrect ? "✗" : ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          <Pressable
            onPress={() => {
              setAnswers({});
              setScore(null);
              setShowResults(false);
            }}
            className="bg-indigo-600 py-4 rounded-xl items-center mx-2 mt-6">
            <Text className="text-white text-base font-semibold">
              Retake Exam
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Start Exam */}
      {!started && score === null && countdown === null && (
        <View className="flex-1 justify-center items-center">
          <Pressable
            onPress={handleStart}
            className="w-40 h-40 bg-indigo-600 rounded-full justify-center items-center shadow-lg">
            <Text className="text-white text-xl font-semibold">Start Exam</Text>
          </Pressable>
        </View>
      )}

      {/* Questions */}
      {started && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="space-y-6">
          {sampleQuestions.map((q, idx) => (
            <View
              key={q.id}
              className="bg-white rounded-2xl px-5 py-4 shadow border border-gray-100 mx-2">
              <Text className="font-psemibold text-gray-800 mb-3">
                {idx + 1}. {q.question}
              </Text>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt;
                return (
                  <Pressable
                    key={i}
                    onPress={() => handleSelect(q.id, opt)}
                    className={`px-4 py-3 mb-2 rounded-xl border ${
                      isSelected
                        ? "bg-indigo-100 border-indigo-400"
                        : "bg-gray-100 border-transparent"
                    }`}>
                    <Text
                      className={`text-base font-pregular ${
                        isSelected
                          ? "text-indigo-800 font-semibold"
                          : "text-gray-700"
                      }`}>
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            className="bg-indigo-600 py-4 rounded-xl items-center mx-2 mt-6">
            <Text className="text-white text-base font-semibold">
              Submit Exam
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Modal Overlay for Exam Result */}
      <Modal
        transparent={true}
        visible={showOverlay}
        animationType="fade"
        onRequestClose={() => setShowOverlay(false)}>
        <Pressable
          className="flex-1 justify-center items-center bg-black bg-opacity-80 z-50"
          onPress={() => {
            setShowOverlay(false);
            setShowResults(true);
          }}>
          <Pressable
            onPress={() => {}}
            className="bg-white rounded-2xl px-6 py-8 items-center justify-center"
            style={{ width: width * 0.9, height: height * 0.65 }}>
            <Text className="text-2xl font-bold text-green-600 mb-3">
              You scored {score}/{sampleQuestions.length}
            </Text>

            <Pressable
              onPress={() => {
                setAnswers({});
                setScore(null);
                setShowOverlay(false);
                setShowResults(false);
              }}
              className="bg-indigo-600 px-6 py-3 rounded-full mb-6">
              <Text className="text-white font-semibold text-base">
                Retake Exam
              </Text>
            </Pressable>

            {score !== null && getAnimationSource() && (
              <LottieView
                ref={animationRef}
                source={getAnimationSource()}
                autoPlay
                loop
                style={{
                  width: "100%",
                  height: "50%",
                  transform: [{ scale: 1.3 }],
                }}
              />
            )}

            <Text className="mt-4 text-center text-base font-medium text-gray-700">
              {score === sampleQuestions.length
                ? "Perfect! You've got all the answers right!"
                : score !== null && score >= sampleQuestions.length * 0.7
                ? "Good job! You're above average!"
                : "Keep up the effort! You'll improve with practice."}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
