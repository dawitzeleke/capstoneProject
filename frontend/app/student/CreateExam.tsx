import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"; // ✅ Lottie
import { useRef } from "react";
import { useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable layout animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Define allowed stream types
type StreamType = "Natural" | "Social";

const subjectsByStream: Record<StreamType, string[]> = {
  Natural: ["Biology", "Math", "Chemistry", "Physics"],
  Social: ["Economics", "Civics", "Geography", "History"],
};

const difficultyLevels = ["Easy", "Medium", "Hard"];
const streams: StreamType[] = ["Natural", "Social"];

export default function CreateCustomExamScreen() {
  const router = useRouter();
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const [form, setForm] = useState({
    questions: "",
    examTime: "",
    subject: "",
    difficulty: "Easy",
  });

  const [stream, setStream] = useState<StreamType>("Natural");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const animationRef = useRef(null);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubmit = () => {
    // Show overlay
    setShowOverlay(true);

    // Hide overlay after 7 seconds
    setTimeout(() => {
      setShowOverlay(false);
      console.log("Form:", { ...form, stream });
      // Your submission logic here
      router.replace("../../../student/Exam");
    }, 7000);
  };

  return (
    <SafeAreaView className={`flex-1 ${currentTheme === "dark" ? "bg-gray-900" : "bg-[#f1f3fc]"}`}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          className="flex-1 px-6 pt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity 
                onPress={() => router.back()}
                style={{
                  backgroundColor: currentTheme === "dark" ? "#1f2937" : "#f1f3fc",
                  borderRadius: 100,
                  padding: 10,
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={currentTheme === "dark" ? "#fff" : "#000"}
                />
              </TouchableOpacity>
              <Text className={`text-xl font-psemibold ${
                currentTheme === "dark" ? "text-white" : "text-gray-800"
              }`}>
                Create Custom Exam
              </Text>
              <View className="w-10" />
            </View>
          </View>


          {/* Questions Input */}
          <View className="mb-6">
            <Text className={`text-base font-pmedium mb-3 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Number of Questions
            </Text>
            <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
              currentTheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
            }`}>
              <MaterialIcons
                name="help-outline"
                size={24}
                color={currentTheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <TextInput
                value={form.questions}
                onChangeText={(val) =>
                  setForm({ ...form, questions: val.replace(/[^0-9]/g, "") })
                }
                placeholder="e.g. 20"
                keyboardType="numeric"
                className={`flex-1 ml-3 text-base font-pregular ${
                  currentTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
                placeholderTextColor={currentTheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </View>
          </View>

          {/* Exam Time Input */}
          <View className="mb-6">
            <Text className={`text-base font-pmedium mb-3 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Exam Duration (minutes)
            </Text>
            <View className={`flex-row items-center px-4 py-3 rounded-xl border ${
              currentTheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
            }`}>
              <MaterialIcons
                name="timer"
                size={24}
                color={currentTheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <TextInput
                value={form.examTime}
                onChangeText={(val) =>
                  setForm({ ...form, examTime: val.replace(/[^0-9]/g, "") })
                }
                placeholder="e.g. 60"
                keyboardType="numeric"
                className={`flex-1 ml-3 text-base font-pregular ${
                  currentTheme === "dark" ? "text-white" : "text-gray-900"
                }`}
                placeholderTextColor={currentTheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </View>
          </View>

          {/* Difficulty Selection */}
          <View className="mb-6">
            <Text className={`text-base font-pmedium mb-3 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Difficulty Level
            </Text>
            <View className="flex-row space-x-3">
              {difficultyLevels.map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setForm({ ...form, difficulty: level })}
                  className={`flex-1 py-3 px-4 rounded-xl border ${
                    form.difficulty === level
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                      : currentTheme === "dark"
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text
                    className={`text-center font-pmedium ${
                      form.difficulty === level
                        ? "text-indigo-600 dark:text-indigo-400"
                        : currentTheme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Subject Selection */}
          <View className="mb-8">
            <Text className={`text-base font-pmedium mb-3 ${
              currentTheme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
              Subject
            </Text>
            <Pressable
              onPress={toggleDropdown}
              className={`px-4 py-3 rounded-xl border flex-row justify-between items-center ${
                currentTheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
              }`}
            >
              <Text className={`font-pregular ${
                currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
              }`}>
                {form.subject || "Select a subject"}
              </Text>
              <FontAwesome
                name={dropdownOpen ? "angle-up" : "angle-down"}
                size={20}
                color={currentTheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </Pressable>

            {dropdownOpen && (
              <View className={`mt-2 rounded-xl border overflow-hidden ${
                currentTheme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
              }`}>
                {subjectsByStream[stream].map((subj) => (
                  <Pressable
                    key={subj}
                    onPress={() => {
                      setForm({ ...form, subject: subj });
                      setDropdownOpen(false);
                    }}
                    className={`px-4 py-3 border-b ${
                      currentTheme === "dark" ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <Text className={`font-pregular ${
                      currentTheme === "dark" ? "text-gray-300" : "text-gray-800"
                    }`}>
                      {subj}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <CustomButton
            title="Create Exam"
            handlePress={handleSubmit}
            containerStyles={`mt-2 mb-8 ${
              currentTheme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
            }`}
            textStyles="text-white text-base font-psemibold"
          />

          {/* Overlay */}
          {showOverlay && (
              <Modal
              transparent={true}
              visible={showOverlay}
              animationType="fade"
              onRequestClose={() => setShowOverlay(false)}>
              <View
                className="flex-1 justify-center items-center bg-black opacity-80"
                style={{ zIndex: 999 }}>
                <View className="rounded-xl justify-center items-center p-6 shadow-lg" style={{ zIndex: 1000 }}>
                  <LottieView
                    ref={animationRef}
                    source={require("../../assets/animations/generating.json")}
                    autoPlay
                    loop
                    style={{
                      width: 70,
                      height: 70,
                      transform: [{ scale: 3 }], // force magnify
                    }}
                  />
                </View>
                  <Text className="mt-6 text-lg text-center font-semibold text-gray-100">
                    Preparing Exam...
                  </Text>
              </View>
            </Modal>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
