import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, useWindowDimensions, View, Text } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import ContentTypeSelector from "@/components/teacher/ContentTypeSelector";
import AppHeader from "@/components/teacher/Header";
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import { SuccessModal } from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';
import { RootState } from "@/redux/store";
import { updateQuestion, clearEditingQuestion, QuestionItem, addQuestion } from "@/redux/teacherReducer/contentSlice";
import { QuestionFormState } from "@/types";
import QuestionInputSection from "@/components/teacher/QuestionForm/QuestionInputSection";
import OptionsGrid from "@/components/teacher/QuestionForm/OptionsGrid";
import HintInput from "@/components/teacher/QuestionForm/HintInput";
import ExplanationInput from "@/components/teacher/QuestionForm/ExplanationInput";
import FormActions from "@/components/teacher/QuestionForm/FormActions";
import { Ionicons } from "@expo/vector-icons";

const AddQuestion = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [submitted, setSubmitted] = useState(false);
  const { questions, editingQuestionId } = useSelector((state: RootState) => state.content);

  // Form state
  const [formState, setFormState] = useState<QuestionFormState>({
    id: "",
    question: "",
    options: ["", "", "", ""],
    tags: [],
    hint: "",
    explanation: "",
    correctAnswer: -1,
    status: "draft",
    date: new Date().toISOString()
  });

  // Modal and loading states
  const [modalState, setModalState] = useState({
    success: false,
    error: false,
    draftSuccess: false,
    cancel: false,
    message: ""
  });

  const [validationErrors, setValidationErrors] = useState({
    question: false,
    options: [false, false, false, false],
    explanation: false,
    tags: false,
    correctAnswer: false,
  });

  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Single source of truth for form state management
  useFocusEffect(
    useCallback(() => {
      if (editingQuestionId) {
        const questionToEdit = questions.find(q => q.id === editingQuestionId);
        if (questionToEdit) {
          setFormState({
            id: questionToEdit.id,
            question: questionToEdit.question,
            options: [...questionToEdit.options] as [string, string, string, string],
            tags: questionToEdit.tags,
            hint: questionToEdit.hint,
            explanation: questionToEdit.explanation,
            correctAnswer: questionToEdit.correctAnswer,
            status: questionToEdit.status,
            date: questionToEdit.date
          });
        }
      } else {
        resetForm();
      }

      return () => {
        if (!editingQuestionId) {
          dispatch(clearEditingQuestion());
          resetForm();
        }
      };
    }, [editingQuestionId, questions, dispatch])
  );

  // Form handlers
  const handleOptionChange = useCallback((text: string, index: number) => {
    setFormState(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? text.trim() : opt
      ) as [string, string, string, string]
    }));
  }, []);

  const handleCorrectAnswer = useCallback((index: number) => {
    setFormState(prev => ({ ...prev, correctAnswer: index }));
  }, []);

  // Validation
  const validateForm = useCallback(() => {
    const errors = {
      question: formState.question.trim() === "",
      options: formState.options.map(opt => opt.trim() === ""),
      explanation: formState.explanation.trim() === "",
      tags: formState.tags.length === 0,
      correctAnswer: formState.correctAnswer === -1,
    };

    setValidationErrors({
      question: submitted && errors.question,
      options: submitted ? errors.options : [false, false, false, false],
      explanation: submitted && errors.explanation,
      tags: submitted && errors.tags,
      correctAnswer: submitted && errors.correctAnswer,
    });

    return !Object.values(errors).some(error =>
      Array.isArray(error) ? error.some(e => e) : error
    );
  }, [formState, submitted]);

  // Form submissions
  const handlePost = useCallback(async () => {
    setSubmitted(true);
    const isValid = validateForm();
    
    if (!isValid) {
      setModalState(prev => ({
        ...prev,
        error: true,
        message: "Please complete all required fields marked with *"
      }));
      return;
    }

    const questionData: QuestionItem = {
      id: editingQuestionId ?? Date.now().toString(),
      question: formState.question.trim(),
      options: formState.options.map(opt => opt.trim()),
      tags: formState.tags,
      hint: formState.hint.trim(),
      explanation: formState.explanation.trim(),
      correctAnswer: formState.correctAnswer,
      status: "posted",
      date: new Date().toISOString(),
    };

    setIsPosting(true);

    try {
      if (editingQuestionId) {
        dispatch(updateQuestion(questionData));
      } else {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            Math.random() > 0.1 
              ? resolve(true) 
              : reject(new Error("Simulated API failure"));
          }, 1500);
        });
        dispatch(addQuestion(questionData));
      }

      setModalState({
        success: true,
        error: false,
        draftSuccess: false,
        cancel: false,
        message: "Posted Successfully!"
      });
      resetForm();
      setSubmitted(false);
    } catch (error) {
      setModalState({
        success: false,
        error: true,
        draftSuccess: false,
        cancel: false,
        message: error instanceof Error ? error.message : "Posting failed. Please try again."
      });
    } finally {
      setIsPosting(false);
    }
  }, [formState, editingQuestionId, dispatch, validateForm]);

  const handleSaveDraft = useCallback(async () => {
    if (formState.question.trim() === "") {
      setSubmitted(true);
      setModalState(prev => ({
        ...prev,
        error: true,
        message: "Question field is required for drafts"
      }));
      return;
    }

    setIsSavingDraft(true);

    try {
      const draftQuestion: QuestionItem = {
        id: Date.now().toString(),
        question: formState.question.trim(),
        options: formState.options.map(opt => opt.trim()),
        tags: formState.tags,
        hint: formState.hint.trim(),
        explanation: formState.explanation.trim(),
        correctAnswer: formState.correctAnswer,
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

      dispatch(addQuestion(draftQuestion));
      setModalState(prev => ({
        ...prev,
        draftSuccess: true,
        message: "Saved as Draft!"
      }));
      resetForm();
    } catch (error) {
      setModalState(prev => ({
        ...prev,
        error: true,
        message: error instanceof Error ? error.message : "Saving draft failed"
      }));
    } finally {
      setIsSavingDraft(false);
    }
  }, [formState, dispatch]);

  // Form reset
  const resetForm = useCallback(() => {
    setFormState({
      id: "",
      question: "",
      options: ["", "", "", ""],
      tags: [],
      hint: "",
      explanation: "",
      correctAnswer: -1,
      status: "draft",
      date: new Date().toISOString()
    });
    setValidationErrors({
      question: false,
      options: [false, false, false, false],
      explanation: false,
      tags: false,
      correctAnswer: false,
    });
    setSubmitted(false);
  }, []);

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formState, validateForm]);

  // Success state cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    if (modalState.success || modalState.draftSuccess) {
      timeoutId = setTimeout(() => {
        router.navigate("/teacher/ContentList");
        setModalState(prev => ({
          ...prev,
          success: false,
          draftSuccess: false
        }));
        dispatch(clearEditingQuestion());
      }, 2000);
    }
  
    if (modalState.error) {
      timeoutId = setTimeout(() => {
        setModalState(prev => ({ ...prev, error: false }));
        setSubmitted(false); // Reset submitted state to clear validation errors
      }, 3000);
    }
  
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [modalState, router, dispatch]);


  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="pb-10" showsVerticalScrollIndicator={false}>
        <AppHeader title="Upload Content" onBack={router.back} />

        <ContentTypeSelector currentScreen="AddQuestion" />

        {submitted && Object.values(validationErrors).some(error =>
          Array.isArray(error) ? error.some(e => e) : error
        ) && (
            <View className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded">
              <View className="flex flex-row items-center">
                <Ionicons name="warning" size={20} color="#f59e0b" />
                <Text className="ml-2 text-sm font-pmedium text-yellow-700">
                  Please fill all required fields (*) and select correct answer
                </Text>
              </View>
            </View>
          )}

        <View className="px-4 pt-4">
          <QuestionInputSection
            value={formState.question}
            onChange={(text) => setFormState(prev => ({ ...prev, question: text }))}
            error={validationErrors.question}
            submitted={submitted} />

          <OptionsGrid
            options={formState.options}
            correctAnswer={formState.correctAnswer}
            onOptionChange={handleOptionChange}
            onCorrectAnswer={handleCorrectAnswer}
            errors={validationErrors.options}
            correctAnswerError={validationErrors.correctAnswer}
            submitted={submitted} />

          <HintInput
            value={formState.hint}
            onChange={(text) => setFormState(prev => ({ ...prev, hint: text }))}
          />

          <ExplanationInput
            value={formState.explanation}
            onChange={(text) => setFormState(prev => ({ ...prev, explanation: text }))}
            error={validationErrors.explanation}
            submitted={submitted} />

          <TagsInput
            value={formState.tags}
            onChange={(tags) => setFormState(prev => ({ ...prev, tags }))}
            error={validationErrors.tags}
            submitted={submitted}
          />

          <FormActions
            onSaveDraft={handleSaveDraft}
            onPost={handlePost}
            onCancel={() => setModalState(prev => ({ ...prev, cancel: true }))}
            isSavingDraft={isSavingDraft}
            isPosting={isPosting}
            validationErrors={validationErrors}
          />
        </View>

        <SuccessModal
          isVisible={modalState.success}
          onDismiss={() => setModalState(prev => ({ ...prev, success: false }))}
          icon="checkmark-circle"
          message={modalState.message}
          color="#22c55e"
        />

        <SuccessModal
          isVisible={modalState.draftSuccess}
          onDismiss={() => setModalState(prev => ({ ...prev, draftSuccess: false }))}
          icon="checkmark-circle"
          message={modalState.message}
          color="#3b82f6"
        />

        <CancelModal
          isVisible={modalState.cancel}
          onConfirm={() => {
            setModalState(prev => ({ ...prev, cancel: false }));
            resetForm();
            router.push("/teacher/ContentList");
          }}
          onCancel={() => setModalState(prev => ({ ...prev, cancel: false }))}
        />

        <ErrorModal
          isVisible={modalState.error}
          message={modalState.message}
          onDismiss={() => setModalState(prev => ({ ...prev, error: false }))}
        />
      </ScrollView>
    </View>
  );
};

export default AddQuestion;