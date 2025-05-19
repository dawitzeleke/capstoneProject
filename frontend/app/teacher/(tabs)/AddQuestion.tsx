import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ContentTypeSelector from "@/components/teacher/ContentTypeSelector";
import AppHeader from "@/components/teacher/Header";
import TagsInput from '@/components/teacher/QuestionForm/TagsInput';
import { SuccessModal } from '@/components/teacher/popups/SuccessModal';
import { ErrorModal } from '@/components/teacher/popups/ErrorModal';
import { CancelModal } from '@/components/teacher/popups/CancelModal';
import { RootState } from "@/redux/store";
import {
  addQuestion,
  updateQuestion,
  clearEditingQuestion
} from "@/redux/teacherReducer/teacherQuestionSlice";
import {
  QuestionFormState,
  QuestionItem,
  ContentStatus,
  DifficultyLevel,
  QuestionTypeEnum
} from "@/types/questionTypes";
import QuestionInputSection from "@/components/teacher/QuestionForm/QuestionInputSection";
import OptionsGrid from "@/components/teacher/QuestionForm/OptionsGrid";
import HintInput from "@/components/teacher/QuestionForm/HintInput";
import ExplanationInput from "@/components/teacher/QuestionForm/ExplanationInput";
import FormActions from "@/components/teacher/QuestionForm/FormActions";
import DescriptionInput from "@/components/teacher/QuestionForm/DescriptionInput";
import QuestionTypeDropdown from "@/components/teacher/QuestionForm/QuestionTypeDropdown";
import DifficultySelector from "@/components/teacher/QuestionForm/DifficultySelector";
import GradeSelector from "@/components/teacher/QuestionForm/GradeSelector";
import PointSelector from "@/components/teacher/QuestionForm/PointSelector";
import QuestionPreviewModal from "@/components/teacher/popups/QuestionPreviewModal";
import CourseNameInput from '@/components/teacher/QuestionForm/CourseNameInput ';

const AddQuestion = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const { questions, editingQuestionId } = useSelector((state: RootState) => state.teacherQuestions);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form state
  const [formState, setFormState] = useState<QuestionFormState>({
    id: "",
    questionText: "",
    courseName: "",
    description: "",
    grade: 1,
    difficulty: DifficultyLevel.Easy,
    questionType: QuestionTypeEnum.MultipleChoice,
    point: 5,
    options: ["", "", "", ""],
    tags: [],
    hint: "",
    explanation: "",
    correctOption: "",
    status: ContentStatus.Draft,
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
    questionText: false,
    courseName: false,
    description: false,
    grade: false,
    difficulty: false,
    questionType: false,
    point: false,
    options: [false, false, false, false],
    explanation: false,
    tags: false,
    correctOption: false,
  });

  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Form initialization and reset
  useFocusEffect(
    useCallback(() => {
      if (editingQuestionId) {
        const questionToEdit = questions.find(q => q.id === editingQuestionId);
        if (questionToEdit) {
          setFormState({
            ...questionToEdit,
            correctOption: questionToEdit.correctOption,
            options: [...questionToEdit.options],
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
  const handleDifficultyChange = (value: DifficultyLevel) => {
    setFormState(prev => ({
      ...prev,
      difficulty: value
    }));
  };

  const handleQuestionTypeChange = (value: QuestionTypeEnum) => {
    setFormState(prev => ({
      ...prev,
      questionType: value
    }));
  };

  const handleOptionChange = useCallback((text: string, index: number) => {
    setFormState(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? text.trim() : opt
      )
    }));
  }, []);

  const handleCorrectAnswer = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      correctOption: prev.options[index]
    }));
  }, []);

  // Validation
  const validateForm = useCallback(() => {
    const errors = {
      questionText: formState.questionText.trim() === "",
      courseName: formState.courseName.trim() === "",
      description: formState.description.trim() === "",
      grade: !formState.grade,
      difficulty: !formState.difficulty,
      questionType: !formState.questionType,
      point: !formState.point,
      options: formState.options.map(opt => opt.trim() === ""),
      explanation: formState.explanation.trim() === "",
      tags: formState.tags.length === 0,
      correctOption: formState.correctOption === "",
    };

    setValidationErrors({
      questionText: submitted && errors.questionText,
      courseName: submitted && errors.courseName,
      description: submitted && errors.description,
      grade: submitted && errors.grade,
      difficulty: submitted && errors.difficulty,
      questionType: submitted && errors.questionType,
      point: submitted && errors.point,
      options: submitted ? errors.options : [false, false, false, false],
      explanation: submitted && errors.explanation,
      tags: submitted && errors.tags,
      correctOption: submitted && errors.correctOption,
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

    setShowPreviewModal(true);
  }, [validateForm]);

  const handleConfirmPost = useCallback(async () => {
    setShowPreviewModal(false);
    setIsPosting(true);

    try {
      const questionData: QuestionItem = {
        ...formState,
        id: editingQuestionId || Date.now().toString(),
        status: ContentStatus.Posted,
        createdAt: editingQuestionId ? formState.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: ""        // Update with actual user ID if available
      };

      if (editingQuestionId) {
        dispatch(updateQuestion(questionData));
      } else {
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
        message: "Posting failed. Please try again."
      });
    } finally {
      setIsPosting(false);
    }
  }, [formState, editingQuestionId, dispatch]);

  const handleSaveDraft = useCallback(async () => {
    if (formState.questionText.trim() === "") {
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
        ...formState,
        id: Date.now().toString(),
        status: ContentStatus.Draft,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "",
      };

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
        message: "Saving draft failed"
      }));
    } finally {
      setIsSavingDraft(false);
    }
  }, [formState, dispatch]);

  // Form reset
  const resetForm = useCallback(() => {
    setFormState({
      id: "",
      questionText: "",
      courseName: "",
      description: "",
      grade: 1,
      difficulty: DifficultyLevel.Easy,
      questionType: QuestionTypeEnum.MultipleChoice,
      point: 1,
      options: ["", "", "", ""],
      tags: [],
      hint: "",
      explanation: "",
      correctOption: "",
      status: ContentStatus.Draft,
    });
    setValidationErrors({
      questionText: false,
      courseName: false,
      description: false,
      grade: false,
      difficulty: false,
      questionType: false,
      point: false,
      options: [false, false, false, false],
      explanation: false,
      tags: false,
      correctOption: false,
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
        setSubmitted(false);
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
                  Please fill all required fields (*)
                </Text>
              </View>
            </View>
          )}

        <View className="px-4 pt-4">
          <CourseNameInput
            value={formState.courseName}
            onChange={(text: string) => setFormState(prev => ({ ...prev, courseName: text }))}
            error={validationErrors.courseName}
            submitted={submitted}
          />

          <DifficultySelector
            value={formState.difficulty}
            onChange={(value) => setFormState(prev => ({ ...prev, difficulty: value }))}
            error={validationErrors.difficulty}
            submitted={submitted}
          />

          <GradeSelector
            value={formState.grade}
            onChange={(value) => setFormState(prev => ({ ...prev, grade: value }))}
            error={validationErrors.grade}
            submitted={submitted}
          />

          <QuestionTypeDropdown
            value={formState.questionType}
            onChange={(value) => setFormState(prev => ({ ...prev, questionType: value }))}
            error={validationErrors.questionType}
            submitted={submitted}
          />

          <PointSelector
            value={formState.point}
            onChange={(value) => setFormState(prev => ({ ...prev, point: value }))}
            error={validationErrors.point}
            submitted={submitted}
          />

          <DescriptionInput
            value={formState.description}
            onChange={(text) => setFormState(prev => ({ ...prev, description: text }))}
            error={validationErrors.description}
            submitted={submitted}
          />

          <QuestionInputSection
            value={formState.questionText}
            onChange={(text) => setFormState(prev => ({ ...prev, questionText: text }))}
            error={validationErrors.questionText}
            submitted={submitted}
          />

          <OptionsGrid
            options={formState.options}
            correctAnswer={formState.options.indexOf(formState.correctOption)}
            onOptionChange={handleOptionChange}
            onCorrectAnswer={handleCorrectAnswer}
            errors={validationErrors.options}
            correctAnswerError={validationErrors.correctOption}
            submitted={submitted}
          />

          <HintInput
            value={formState.hint}
            onChange={(text) => setFormState(prev => ({ ...prev, hint: text }))}
          />

          <ExplanationInput
            value={formState.explanation}
            onChange={(text) => setFormState(prev => ({ ...prev, explanation: text }))}
            error={validationErrors.explanation}
            submitted={submitted}
          />

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

        <QuestionPreviewModal
          visible={showPreviewModal}
          question={{ ...formState, id: 'preview' } as QuestionItem}
          onClose={() => setShowPreviewModal(false)}
          onEdit={() => setShowPreviewModal(false)}
          onConfirm={handleConfirmPost}
          loading={isPosting}
          mode="edit"
        />
      </ScrollView>
    </View>
  );
};

export default AddQuestion;