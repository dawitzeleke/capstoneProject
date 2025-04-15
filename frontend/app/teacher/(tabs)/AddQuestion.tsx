import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ContentTypeSelector from '@/components/teacher/ContentTypeSelector';
import AppHeader from "@/components/teacher/Header";


type RootStackParamList = {
  ContentList: {
    refresh: boolean;
    newQuestion?: {
      id: string;
      question: string;
      options: Array<{ text: string; correct: boolean }>;
      tags: string[];
      hint: string;
      explanation: string;
      status: "posted" | "draft";
      date: string;
    }
  };
  AddQuestionScreen: undefined;
};

const AddQuestionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const isVerySmallScreen = width <= 320;

  // Form states
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState("");
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDraftSuccessModal, setShowDraftSuccessModal] = useState(false);

  // Store created questions for navigation
  const [postedQuestion, setPostedQuestion] = useState<any>(null);

  const handleOptionChange = (text: string, index: number) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleTagInput = (text: string) => {
    setTagsInput(text);
    if (text.includes(",") || text.includes(" ")) {
      const newTags = text.split(/[ ,]+/).filter((tag) => tag.trim() !== "");
      setTags([...tags, ...newTags]);
      setTagsInput("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const [errors, setErrors] = useState({
    question: false,
    options: [false, false, false, false],
    explanation: false,
    tags: false,
    correctOption: false,
  });

  const validateForm = () => {
    const newErrors = {
      question: question.trim() === "",
      options: options.map((opt) => opt.trim() === ""),
      explanation: explanation.trim() === "",
      tags: tags.length === 0,
      correctOption: correctOption === null, // Add this
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) =>
      Array.isArray(error) ? error.some((e) => e) : error
    );
  };

  // POST HANDLER
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
          correct: index === correctOption // Update this
        })),
        tags,
        hint: hint.trim(),
        explanation: explanation.trim(),
        status: "posted",
        date: new Date().toISOString(),
      };

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.1 ? resolve(true) : reject(new Error("Simulated API failure"));
        }, 1500);
      });

      // Store question and show success modal
      setPostedQuestion(newQuestion);
      setShowSuccessModal(true);


      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(null);
      setTags([]);
      setHint("");
      setExplanation("");
      setTagsInput("");
      setErrors({
        question: false,
        options: [false, false, false, false],
        explanation: false,
        tags: false,
        correctOption: false,
      });

    } catch (error) {
      let message = "Posting failed. Please try again.";
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setIsPosting(false);
    }
  };

  // DRAFT HANDLER
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
          correct: index === correctOption // Update this
        })),
        tags,
        hint: hint.trim(),
        explanation: explanation.trim(),
        status: "draft",
        date: new Date().toISOString(),
      };

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.1 ? resolve(true) : reject(new Error("Simulated save failure"));
        }, 1000);
      });

      // Store draft and show success
      setPostedQuestion(draftQuestion);
      setShowDraftSuccessModal(true);

      // Reset form
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(null);
      setTags([]);
      setHint("");
      setExplanation("");
      setTagsInput("");

    } catch (error) {
      let message = "Saving draft failed";
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // MODAL EFFECTS
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (showSuccessModal) {
      timers.push(setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate({
          name: "ContentList",
          params: {
            refresh: true,
            newQuestion: postedQuestion
          }
        });
      }, 2000));
    }

    if (showDraftSuccessModal) {
      timers.push(setTimeout(() => {
        setShowDraftSuccessModal(false);
        navigation.navigate({
          name: "ContentList",
          params: {
            refresh: true,
            newQuestion: postedQuestion
          }
        });
      }, 2000));
    }

    if (showErrorModal) {
      timers.push(setTimeout(() => setShowErrorModal(false), 2000));
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [showSuccessModal, showDraftSuccessModal, showErrorModal, postedQuestion]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setShowSuccessModal(false);
      setShowErrorModal(false);
      setShowDraftSuccessModal(false);
      setPostedQuestion(null); // Clear stored question
    };
  }, []);


  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <AppHeader
          title="Upload Content"
          onBack={() => navigation.navigate('ContentList')}
        />

        {/* Content Type Selector */}
        <ContentTypeSelector currentScreen="AddQuestion" />

        {/* Question Input Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Question<Text style={styles.requiredIndicator}>*</Text>
          </Text>
          <TextInput
            style={styles.questionInput}
            multiline
            placeholder="Start writing your question here..."
            placeholderTextColor="#94a3b8"
            value={question}
            onChangeText={setQuestion}
          />
        </View>

        {/* Options Input Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Options<Text style={styles.requiredIndicator}>*</Text>
          </Text>
          {options.map((option, index) => (
            <View key={`option-${index}`} style={styles.optionContainer}>
              <Pressable
                onPress={() => setCorrectOption(index)}
                style={styles.radioButton}
              >
                <Ionicons
                  name={correctOption === index ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color="#4F46E5"
                />
              </Pressable>
              <Text style={styles.optionLabel}>
                {String.fromCharCode(65 + index)}.
              </Text>
              <TextInput
                style={[
                  styles.optionInput,
                  errors.options[index] && styles.errorInput,
                ]}
                placeholder={`Start writing choice ${String.fromCharCode(
                  65 + index
                )}...`}
                placeholderTextColor="#94a3b8"
                value={option}
                onChangeText={(text) => handleOptionChange(text, index)}
              />
            </View>
          ))}
          {/* Add error message for correct option */}
          {errors.correctOption && (
            <Text style={styles.errorText}>Please select the correct answer</Text>
          )}
        </View>

        {/* Hint Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="bulb-outline"
              size={20}
              color="#f59e0b"
              style={styles.bulbIcon}
            />
            <Text style={styles.sectionLabel}>Hint</Text>
          </View>
          <TextInput
            style={styles.hintInput}
            placeholder="Add a hint to help users answer..."
            placeholderTextColor="#94a3b8"
            value={hint}
            onChangeText={setHint}
          />
        </View>

        {/* Explanation Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Explanation<Text style={styles.requiredIndicator}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.explanationInput,
              errors.explanation && styles.errorInput,
            ]}
            multiline
            placeholder="Add detailed explanation for the correct answer..."
            placeholderTextColor="#94a3b8"
            value={explanation}
            onChangeText={setExplanation}
          />
        </View>

        {/* Tags Input Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>
            Tags<Text style={styles.requiredIndicator}>*</Text>
          </Text>
          <View
            style={[styles.tagsContainer, errors.tags && styles.errorInput]}
          >
            {tags.map((tag, index) => (
              <View key={`${tag}-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <Pressable onPress={() => removeTag(index)}>
                  <Ionicons name="close" size={16} color="#4F46E5" />
                </Pressable>
              </View>
            ))}
            <TextInput
              style={styles.tagInput}
              placeholder="Add tags (comma separated)..."
              placeholderTextColor="#94a3b8"
              value={tagsInput}
              onChangeText={handleTagInput}
            />
          </View>
        </View>

        {/* Optimized Action Buttons */}
        <View
          style={[
            styles.buttonContainer,
            isVerySmallScreen && styles.verySmallButtonContainer,
          ]}
        >
          {/* Drafts Button */}
          <Pressable
            style={[
              styles.buttonBase,
              styles.draftButton,
              isVerySmallScreen && styles.verySmallButton,
            ]}
            onPress={handleSaveDraft}
            disabled={isSavingDraft}
            android_ripple={{ color: "#d8b4fe" }}
          >
            {isSavingDraft ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              <Text
                style={[
                  styles.buttonTextBase,
                  isVerySmallScreen && styles.verySmallButtonText,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                Save to drafts
              </Text>
            )}
          </Pressable>

          {/* Post Button */}
          <Pressable
            style={[
              styles.buttonBase,
              styles.postButton,
              isVerySmallScreen && styles.verySmallButton,
              isPosting && styles.disabledButton,
            ]}
            onPress={handlePost}
            disabled={isPosting}
            android_ripple={{ color: "#4c1d95" }}
          >
            {isPosting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text
                style={[
                  styles.buttonTextBase,
                  styles.postButtonText,
                  isVerySmallScreen && styles.verySmallButtonText,
                ]}
                numberOfLines={1}
              >
                Post
              </Text>
            )}
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            style={[
              styles.buttonBase,
              styles.cancelButton,
              isVerySmallScreen && styles.verySmallCancelButton,
            ]}
            onPress={() => setShowCancelModal(true)}
            android_ripple={{ color: "#e2e8f0" }}
          >
            <Text
              style={[
                styles.cancelButtonText,
                isVerySmallScreen && styles.verySmallCancelText,
              ]}
              numberOfLines={1}
            >
              Cancel
            </Text>
          </Pressable>

        </View>
      </ScrollView>

      {/* SUCCESS MODALS */}
      <Modal visible={showDraftSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Ionicons name="bookmark" size={48} color="#4F46E5" />
            <Text style={styles.successModalText}>Draft Saved Successfully!</Text>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal visible={showErrorModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalContent}>
            <Ionicons name="warning" size={48} color="#ef4444" />
            <Text style={styles.errorModalText}>{errorMessage}</Text>
          </View>
        </View>
      </Modal>

      {/* Draft Success Modal*/}
      <Modal visible={showDraftSuccessModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <Ionicons name="bookmark" size={48} color="#4F46E5" />
            <Text style={styles.successModalText}>Draft Saved Successfully!</Text>
          </View>
        </View>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Discard Changes?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to discard this question?
            </Text>

            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>
                  Continue Editing
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.confirmCancelButton]}
                onPress={() => {
                  // Clear all fields
                  setQuestion("");
                  setOptions(["", "", "", ""]);
                  setCorrectOption(null);
                  setTagsInput("");
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
                  setShowCancelModal(false);
                  navigation.navigate({
                    name: "ContentList",
                    params: { refresh: false }  // Add params here
                  });
                }}
              >
                <Text style={styles.confirmCancelButtonText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  selectorContainer: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeSelector: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeSelectorText: {
    color: "#ffffff",
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  questionInput: {
    minHeight: 100,
    fontSize: 14,
    color: "#334155",
    textAlignVertical: "top",
    lineHeight: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  optionLabel: {
    width: 24,
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "500",
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  radioButton: {
    padding: 8,
    marginRight: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulbIcon: {
    marginRight: 8,
  },
  hintInput: {
    fontSize: 14,
    color: "#334155",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  explanationInput: {
    minHeight: 100,
    fontSize: 14,
    color: "#334155",
    textAlignVertical: "top",
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f3ff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  tagText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "500",
  },
  tagInput: {
    flex: 1,
    minWidth: 120,
    fontSize: 14,
    color: "#334155",
  },
  requiredIndicator: {
    color: "#ef4444",
    marginLeft: 4,
  },
  errorInput: {
    borderColor: "#ef4444",
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderRadius: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    minHeight: 44,
  },
  verySmallButtonContainer: {
    gap: 4,
    marginHorizontal: 8,
    minHeight: 40,
  },
  buttonBase: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  verySmallButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 0,
    flexShrink: 1,
    flexGrow: 1,
  },
  draftButton: {
    backgroundColor: "#d6ddff",
    flex: 1.7,
  },
  postButton: {
    backgroundColor: "#4F46E5",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#ff8a80",
    flex: 1,
  },
  verySmallCancelButton: {
    flex: 0.9,
    paddingHorizontal: 6,
  },
  buttonTextBase: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4F46E5",
    textAlign: "center",
  },
  verySmallButtonText: {
    fontSize: 12,
    letterSpacing: -0.2,
    paddingHorizontal: 2,
  },
  postButtonText: {
    color: "#ffffff",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelModalButton: {
    backgroundColor: "#f1f5f9",
  },
  confirmCancelButton: {
    backgroundColor: "#fee2e2",
  },
  cancelModalButtonText: {
    color: "#64748b",
    fontWeight: "500",
  },
  confirmCancelButtonText: {
    color: "#ef4444",
    fontWeight: "500",
  },
  verySmallCancelText: {
    fontSize: 12,
  },
  successModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    gap: 16,
  },
  successModalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    gap: 16,
  },
  errorModalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    textAlign: "center",
  },
});

export default AddQuestionScreen;
