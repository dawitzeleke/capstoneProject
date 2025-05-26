import React, { useRef } from "react";
import { View, Text, Pressable, Modal, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

type ResultModalProps = {
  visible: boolean;
  score: number | null;
  totalQuestions: number;
  onClose: () => void;
  onRetake: () => void;
};

export default function ResultModal({
  visible,
  score,
  totalQuestions,
  onClose,
  onRetake,
}: ResultModalProps) {
  const router = useRouter();
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const animationRef = useRef(null);
  const { width, height } = Dimensions.get("window");

  const getAnimationSource = () => {
    if (score === null) return null;
    if (score === totalQuestions) {
      return require("../assets/animations/winner.json");
    } else if (score >= totalQuestions * 0.7) {
      return require("../assets/animations/average.json");
    } else if (score >= totalQuestions * 0.5 || score === 0) {
      return require("../assets/animations/keepup.json");
    }
    return null;
  };

  const handleRetake = () => {
    onClose();
    router.replace("/student/CreateExam");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-center items-center"
        onPress={onClose}>
        <Pressable
          onPress={() => {}}
          className="bg-[#f1f3fc] rounded-2xl opacity-100 px-6 items-center z-2 absolute justify-center"
          style={{ width: width * 0.9, height: height * 0.65 }}>
          <Text className="text-2xl font-pbold text-indigo-600 mb-3">
            You scored {score}/{totalQuestions}
          </Text>

        
          {score !== null && getAnimationSource() && (
            <LottieView
              ref={animationRef}
              source={getAnimationSource()}
              autoPlay
              loop
              style={{
                width: "55%",
                height: "55%",
                transform: [{ scale: 2 }],
              }}
            />
          )}

          <Text className="mt-4 text-center text-base font-pmedium text-gray-700">
            {score === totalQuestions
              ? "Perfect! You've got all the answers right!"
              : score !== null && score >= totalQuestions * 0.7
              ? "Good job! You're above average!"
              : "Keep up the effort! You'll improve with practice."}
          </Text>

          <Pressable
              onPress={handleRetake}
              className={`px-6 py-3 mt-3 rounded-xl ${
                currentTheme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
              }`}
            >
              <Text className="text-white font-psemibold">
                Retake Exam
              </Text>
            </Pressable>

          <Pressable
            onPress={onClose}
            className="mt-3 bg-gray-200 px-6 py-3 rounded-full">
            <Text className="text-gray-700 font-pregular text-base">
              Exit
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
