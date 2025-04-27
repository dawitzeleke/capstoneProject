import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ContentTypeSelector from "@/components/teacher/ContentTypeSelector";
import AppHeader from "@/components/teacher/Header";
import TagsInput from '@/components/teacher/TagsInput';

const AddQuestion = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [tags, setTags] = useState<string[]>([]);
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDraftSuccessModal, setShowDraftSuccessModal] = useState(false);
  const [postedQuestion, setPostedQuestion] = useState<any>(null);

  const [errors, setErrors] = useState({
    question: false,
    options: [false, false, false, false],
    explanation: false,
    tags: false,
    correctOption: false,
  });

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };


  const validateForm = () => {
    const newErrors = {
      question: question.trim() === "",
      options: options.map((opt) => opt.trim() === ""),
      explanation: explanation.trim() === "",
      tags: tags.length === 0,
      correctOption: correctOption === null,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) =>
      Array.isArray(error) ? error.some((e) => e) : error
    );
  };

  const handlePost = async () => {
    if (!validateForm()) {
      setErrorMessage("Please fill all required fields");
      setShowErrorModal(true);
      return;
    }

    setIsPosting(true);

    try {
      const newQuestion = {
        id: Date.now().toString(),
        question: question.trim(),
        options: options.map((opt, index) => ({
          text: opt.trim(),
          correct: index === correctOption,
        })),
        tags,
        hint: hint.trim(),
        explanation: explanation.trim(),
        status: "posted",
        date: new Date().toISOString(),
      };

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.1
            ? resolve(true)
            : reject(new Error("Simulated API failure"));
        }, 1500);
      });

      setPostedQuestion(newQuestion);
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Posting failed. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (question.trim() === "") {
      setErrorMessage("Question field is required for drafts");
      setShowErrorModal(true);
      return;
    }

    setIsSavingDraft(true);

    try {
      const draftQuestion = {
        id: Date.now().toString(),
        question: question.trim(),
        options: options.map((opt, index) => ({
          text: opt.trim(),
          correct: index === correctOption,
        })),
        tags,
        hint: hint.trim(),
        explanation: explanation.trim(),
        status: "draft",
        date: new Date().toISOString(),
      };

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.1
            ? resolve(true)
            : reject(new Error("Simulated save failure"));
        }, 1000);
      });

      setPostedQuestion(draftQuestion);
      setShowDraftSuccessModal(true);
      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Saving draft failed"
      );
      setShowErrorModal(true);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption(null);
    setTags([]);
    setHint("");
    setExplanation("");
    setErrors({
      question: false,
      options: [false, false, false, false],
      explanation: false,
      tags: false,
      correctOption: false,
    });
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (showSuccessModal) {
      timers.push(
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("../(teacher)/ContentList");
        }, 2000)
      );
    }

    if (showDraftSuccessModal) {
      timers.push(
        setTimeout(() => {
          setShowDraftSuccessModal(false);
          router.push("../(teacher)/Drafts");
        }, 2000)
      );
    }

    if (showErrorModal) {
      timers.push(setTimeout(() => setShowErrorModal(false), 2000));
    }

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [showSuccessModal, showDraftSuccessModal, showErrorModal, postedQuestion]);

  useEffect(() => {
    return () => {
      setShowSuccessModal(false);
      setShowErrorModal(false);
      setShowDraftSuccessModal(false);
      setPostedQuestion(null);
    };
  }, []);

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="pb-10"
        showsVerticalScrollIndicator={false}>
        <AppHeader title="Upload Content" onBack={() => router.back()} />
        <ContentTypeSelector currentScreen="AddQuestion" />
        
        <View className="px-4 pt-4">
          {/* QUESTION */}
          <View className="bg-white rounded-xl shadow p-4 mb-4">
            <Text className="text-base font-psemibold text-slate-800 mb-2">
              Question<Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              multiline
              placeholder="Start writing your question here..."
              placeholderTextColor="#94a3b8"
              className="min-h-[100px] text-sm text-slate-700"
              value={question}
              onChangeText={setQuestion}
            />
          </View>

          {/* OPTIONS */}
          <View className="bg-white rounded-xl shadow p-4 mb-4">
            <Text className="text-base font-psemibold text-slate-800 mb-2">
              Options<Text className="text-red-500">*</Text>
            </Text>
            {options.map((option, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Pressable
                  onPress={() => setCorrectOption(index)}
                  className="p-2 mr-2">
                  <Ionicons
                    name={
                      correctOption === index
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color="#4F46E5"
                  />
                </Pressable>
                <Text className="w-6 text-sm font-pmedium text-indigo-700">
                  {String.fromCharCode(65 + index)}.
                </Text>
                <TextInput
                  placeholder={`Start writing choice ${String.fromCharCode(
                    65 + index
                  )}...`}
                  placeholderTextColor="#94a3b8"
                  className={`flex-1 border-b border-slate-200 text-sm text-slate-700 py-1 ${errors.options[index]
                    ? "border-red-500 bg-red-100 rounded"
                    : ""
                    }`}
                  value={option}
                  onChangeText={(text) => handleOptionChange(text, index)}
                />
              </View>
            ))}
            {errors.correctOption && (
              <Text className="text-red-500 text-xs mt-1">
                Please select the correct answer
              </Text>
            )}
          </View>
          {/* HINT */}
          <View className="bg-white rounded-xl shadow p-4 mb-4">
            <Text className="text-base font-psemibold text-slate-800 mb-2">
              Hint (Optional)
            </Text>
            <TextInput
              multiline
              placeholder="You can add a hint to help students"
              placeholderTextColor="#94a3b8"
              className="min-h-[80px] text-sm text-slate-700"
              value={hint}
              onChangeText={setHint}
            />
          </View>

          {/* EXPLANATION */}
          <View className="bg-white rounded-xl shadow p-4 mb-4">
            <Text className="text-base font-psemibold text-slate-800 mb-2">
              Explanation<Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              multiline
              placeholder="Explain why the correct answer is correct"
              placeholderTextColor="#94a3b8"
              className={`min-h-[100px] text-sm text-slate-700 ${errors.explanation
                ? "border border-red-500 bg-red-100 rounded px-2"
                : ""
                }`}
              value={explanation}
              onChangeText={setExplanation}
            />
          </View>

          {/* TAGS */}
          <TagsInput
            value={tags}
            onChange={setTags}
            placeholder="Add tags separated by comma or space"
            error={errors.tags}
            maxLength={20}
          />

          {/* ACTION BUTTONS */}
          <View className="flex-row gap-2 mx-4 mt-4 min-h-[44px]">
            <Pressable
              className="flex-1 rounded bg-indigo-100 py-3 items-center justify-center"
              onPress={handleSaveDraft}
              disabled={isSavingDraft}>
              {isSavingDraft ? (
                <ActivityIndicator color="#4F46E5" size="small" />
              ) : (
                <Text className="text-indigo-600 text-sm font-pmedium">
                  Save Draft
                </Text>
              )}
            </Pressable>

            <Pressable
              className="flex-1 rounded bg-indigo-600 py-3 items-center justify-center"
              onPress={handlePost}
              disabled={isPosting}>
              {isPosting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-sm font-pmedium">Post</Text>
              )}
            </Pressable>

            <Pressable
              className="flex-1 rounded bg-red-300 py-3 items-center justify-center"
              onPress={() => setShowCancelModal(true)}>
              <Text className="text-white text-sm font-pmedium">Cancel</Text>
            </Pressable>
          </View>
        </View>

        {/* MODALS */}
        <Modal transparent visible={showSuccessModal}>
          <View className="flex-1 justify-center items-center bg-black/40 px-6">
            <View className="bg-white rounded-xl p-6 w-full items-center">
              <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
              <Text className="text-lg font-psemibold text-green-600 mt-2">
                Posted Successfully!
              </Text>
            </View>
          </View>
        </Modal>

        <Modal visible={showCancelModal} transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-xl p-6 w-4/5">
              <Text className="text-lg font-psemibold text-slate-800 mb-2">
                Discard Changes?
              </Text>
              <Text className="text-sm text-slate-500 mb-6">
                Are you sure you want to discard this upload?
              </Text>
              <View className="flex-row justify-end gap-2">
                <Pressable
                  className="bg-slate-100 px-4 py-2 rounded"
                  onPress={() => setShowCancelModal(false)}>
                  <Text className="text-slate-500 font-pmedium">
                    Continue Editing
                  </Text>
                </Pressable>
                <Pressable
                  className="bg-red-200 px-4 py-2 rounded"
                  onPress={() => {
                    setShowCancelModal(false);
                    resetForm();
                    router.push("../(teacher)/ContentList");
                  }}>
                  <Text className="text-red-500 font-pmedium">Discard</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={showDraftSuccessModal}>
          <View className="flex-1 justify-center items-center bg-black/40 px-6">
            <View className="bg-white rounded-xl p-6 w-full items-center">
              <Ionicons name="checkmark-circle" size={48} color="#3b82f6" />
              <Text className="text-lg font-psemibold text-blue-600 mt-2">
                Saved as Draft!
              </Text>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={showErrorModal}>
          <View className="flex-1 justify-center items-center bg-black/40 px-6">
            <View className="bg-white rounded-xl p-6 w-full items-center">
              <Ionicons name="close-circle" size={48} color="#ef4444" />
              <Text className="text-lg font-psemibold text-red-600 mt-2">
                {errorMessage}
              </Text>
            </View>
          </View>
        </Modal>

        {/* Remaining inputs and buttons (hint, explanation, tags, modals, etc.) will follow same pattern */}
      </ScrollView>
    </View>
  );
};

export default AddQuestion;
