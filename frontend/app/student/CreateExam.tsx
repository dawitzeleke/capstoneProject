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
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native"; // ✅ Lottie
import { useRef } from "react";
import { useRouter } from "expo-router";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

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
      router.push("../../../student/Exam");
    }, 7000);
  };

  return (
    <ScrollView className="flex-1 bg-[#f1f3fc] px-6 pt-10">
      {/* Header */}
      <View className="mb-6">
        <Pressable className="mb-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.push("/student/(tabs)/Profile")}>
              <Ionicons
                name="chevron-back"
                size={20}
                // color={currentTheme === "dark" ? "#d6ddff" : "#4F46E5"} // Pritext-[#a5a1f7] color for icons
              />
            </TouchableOpacity>
          </View>
        </Pressable>
        <Text className="text-center text-lg font-psemibold text-gray-800">
          Custom Exam
        </Text>
      </View>

      {/* Questions Input */}
      <FormField
        title="Number of Questions"
        value={form.questions}
        placeholder="e.g. 20"
        handleChangeText={(val) =>
          setForm({ ...form, questions: val.replace(/[^0-9]/g, "") })
        }
        keyboardType="numeric"
      />

      {/* Exam Time Input */}
      <FormField
        title="Exam Time (in minutes)"
        value={form.examTime}
        placeholder="e.g. 60"
        handleChangeText={(val) =>
          setForm({ ...form, examTime: val.replace(/[^0-9]/g, "") })
        }
        keyboardType="numeric"
        otherStyles="mt-6"
      />

      {/* Difficulty Toggle */}
      <Text className="text-gray-600 mt-6 mb-2 font-pregular">Difficulty</Text>
      <View className="flex-row justify-between bg-gray-100 rounded-xl px-3 py-2 mb-4">
        {difficultyLevels.map((level) => (
          <Pressable
            key={level}
            onPress={() => setForm({ ...form, difficulty: level })}
            className={`flex-1 items-center py-3 rounded-xl ${
              form.difficulty === level ? "bg-white shadow" : ""
            }`}>
            <Text className="text-gray-800 font-pregular">{level}</Text>
          </Pressable>
        ))}
      </View>

      {/* Subject Dropdown */}
      <Text className="text-gray-600 mb-2">Subject ({stream})</Text>
      <Pressable
        onPress={toggleDropdown}
        className="bg-gray-100 px-4 py-3 rounded-xl mb-2 flex-row justify-between items-center">
        <Text className="text-gray-800 font-pregular">
          {form.subject || "Select a subject"}
        </Text>
        <FontAwesome
          name={dropdownOpen ? "angle-up" : "angle-down"}
          size={20}
          color="#6b7280"
        />
      </Pressable>

      {dropdownOpen && (
        <View className="bg-white rounded-xl shadow border border-gray-200 mb-4 overflow-hidden">
          {subjectsByStream[stream].map((subj) => (
            <Pressable
              key={subj}
              onPress={() => {
                setForm({ ...form, subject: subj });
                setDropdownOpen(false);
              }}
              className="px-4 py-3 border-b border-gray-100">
              <Text className="text-gray-800 font-pregular">{subj}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Submit Button */}
      <CustomButton
        title="Preparing Exam"
        handlePress={handleSubmit}
        containerStyles="mt-6 bg-indigo-600"
        textStyles="text-white text-base font-semibold"
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
  );
}
