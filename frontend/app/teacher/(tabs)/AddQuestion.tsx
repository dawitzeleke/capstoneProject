import React, { useEffect, useState, useCallback, useRef } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ContentTypeSelector from "@/components/teacher/ContentTypeSelector";
import AppHeader from "@/components/teacher/AppHeader";
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
import AnswerInput from "@/components/teacher/QuestionForm/AnswerInput";
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
import ResetFormButton from '@/components/teacher/ResetFormButton';

// Move this *above* your component, so it's the same object every time.
const EMPTY_FORM_STATE = {
  id: "",
  questionText: "",
  courseName: "",
  description: "",
  grade: 9,
  difficulty: DifficultyLevel.Easy,
  questionType: QuestionTypeEnum.MultipleChoice,
  point: 1,
  options: ["", "", "", ""],
  tags: [],
  hint: "",
  explanation: "",
  correctOption: "",
  status: ContentStatus.Draft,
};

// Type assertion for the hoisted constant
const EMPTY_FORM_STATE_TYPED: QuestionFormState = EMPTY_FORM_STATE as QuestionFormState;

const AddQuestion = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const { questions, editingQuestionId } = useSelector((state: RootState) => state.teacherQuestions);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const shouldLoadDraft = useRef(!editingQuestionId);

  // Use the hoisted stable reference for initial state
  const [formState, setFormState] = useState<QuestionFormState>(() => {
    if (editingQuestionId) {
      const questionToEdit = questions.find(q => q.id === editingQuestionId);
      return questionToEdit || EMPTY_FORM_STATE_TYPED;
    }
    return EMPTY_FORM_STATE_TYPED;
  });

  // Modal and loading states
  const [modalState, setModalState] = useState({
    success: false,
    error: false,
    draftSuccess: false,
    cancel: false,
    message: "",
    color: "",
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
        shouldLoadDraft.current = false; // Prevent draft loading after edit
      } else if (shouldLoadDraft.current) {
        // Only load draft on first mount if not editing and draft exists
        const savedDraft = localStorage.getItem('questionDraft');
        if (savedDraft) {
          setFormState(JSON.parse(savedDraft));
        }
        shouldLoadDraft.current = false; // Mark as loaded (or attempted load)
      } else {
        // Explicitly reset form when entering without edit mode and no draft should load
        setFormState(EMPTY_FORM_STATE_TYPED);
      }

      return () => {
        // Only clear editing state if component unmounts without active edit
        if (!editingQuestionId) {
          dispatch(clearEditingQuestion());
        }
      };
    }, [editingQuestionId, questions, dispatch]) // Updated dependencies
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
      questionType: value,
      options: value === QuestionTypeEnum.TrueFalse ? ['True', 'False'] : prev.options,
      correctOption: value === QuestionTypeEnum.TrueFalse ? '' : prev.correctOption
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
      explanation: formState.explanation?.trim() === "",
      tags: formState.tags.length === 0,
      correctOption: (
        !formState.correctOption || // Correct option is required for all types
        (formState.questionType === QuestionTypeEnum.TrueFalse && formState.correctOption !== 'True' && formState.correctOption !== 'False') ||
        (formState.questionType === QuestionTypeEnum.MultipleChoice && !formState.options.includes(formState.correctOption))
      )
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
        createdAt: editingQuestionId ? formState.createdAt ?? new Date().toISOString() : new Date().toISOString(),
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
        message: "Posted Successfully!",
        color: "#22c55e"
      });
      resetForm();
      setSubmitted(false);

      // Add timeout to close modal and navigate
      setTimeout(() => {
        setModalState(prev => ({
          ...prev,
          success: false,
          error: false,
          draftSuccess: false,
          cancel: false,
        }));
        router.push("/teacher/(tabs)/ContentList");
      }, 2000); // Close after 2 seconds

    } catch (error) {
      setModalState({
        success: false,
        error: true,
        draftSuccess: false,
        cancel: false,
        message: "Posting failed. Please try again.",
        color: ""
      });
    } finally {
      setIsPosting(false);
    }
  }, [formState, editingQuestionId, dispatch, router]);

  const handleSaveDraft = useCallback(async () => {
    if (formState.questionText.trim() === "") {
      setSubmitted(true);
      const isValid = validateForm();
      if (!isValid) return;
    }

    setIsSavingDraft(true);

    try {
      const draftQuestionData: QuestionItem = {
        ...formState,
        id: formState.id || editingQuestionId || Date.now().toString(), // Keep existing ID for drafts if available
        status: ContentStatus.Draft,
        createdAt: formState.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "" // Update with actual user ID if available
      };

      if (editingQuestionId) {
        dispatch(updateQuestion(draftQuestionData));
      } else if (formState.id && questions.find(q => q.id === formState.id)) {
        // If it's a new question but already has an ID (e.g., saved draft before), update it
        dispatch(updateQuestion(draftQuestionData));
      } else {
        dispatch(addQuestion(draftQuestionData));
      }

      setModalState({
        success: false,
        error: false,
        draftSuccess: true,
        cancel: false,
        message: "Draft Saved!",
        color: "#4f46e5"
      });
      setSubmitted(false);

      // Add timeout to close modal and navigate after draft save
      setTimeout(() => {
        setModalState(prev => ({
          ...prev,
          success: false,
          error: false,
          draftSuccess: false,
          cancel: false,
        }));
        router.push("/teacher/(tabs)/ContentList");
      }, 2000); // Close after 2 seconds

    } catch (error) {
      setModalState({
        success: false,
        error: true,
        draftSuccess: false,
        cancel: false,
        message: "Saving draft failed. Please try again.",
        color: ""
      });
    } finally {
      setIsSavingDraft(false);
    }
  }, [formState, editingQuestionId, dispatch, questions, validateForm]);

  const resetForm = useCallback(() => {
    dispatch(clearEditingQuestion());
    setFormState(EMPTY_FORM_STATE_TYPED);
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
    // Clear draft from storage and prevent reloading
    localStorage.removeItem('questionDraft');
    shouldLoadDraft.current = false; // Corrected to false
  }, [dispatch, EMPTY_FORM_STATE_TYPED]); // Updated dependencies

  const handleCancel = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      cancel: true,
    }));
  }, []);

  const handleConfirmCancel = useCallback(() => {
    resetForm();
    setModalState(prev => ({ ...prev, cancel: false }));
    router.push("/teacher/(tabs)/ContentList");
  }, [resetForm, router]); // Dependencies are okay as resetForm now handles clearEditingQuestion and its dependencies

  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      success: false,
      error: false,
      draftSuccess: false,
    }));
  }, []);

  // Effects
  useEffect(() => {
    validateForm();
  }, [formState, submitted, validateForm]);

  // Render
  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="pb-10" showsVerticalScrollIndicator={false}>
        <AppHeader 
          title="Upload Content" 
          onBack={router.back}
          showResetButton={true}
          onReset={resetForm}
          buttons={[
            {
              icon: "folder-open",
              onPress: () => router.push("/teacher/(tabs)/ContentList"),
              side: "right",
              key: "exit-button",
            },
          ]}
        />
        <ContentTypeSelector currentScreen="AddQuestion" />

        <View className="px-4 pt-4">
          <View className="mt-2">

            <CourseNameInput
              value={formState.courseName}
              onChange={(text) => setFormState({ ...formState, courseName: text })}
              error={validationErrors.courseName}
              submitted={submitted}
            />
            <DescriptionInput
              value={formState.description}
              onChange={(text) => setFormState({ ...formState, description: text })}
              error={validationErrors.description}
              submitted={submitted}
            />

            <GradeSelector
              value={formState.grade}
              onChange={(value) => setFormState({ ...formState, grade: value })}
              error={validationErrors.grade}
              submitted={submitted}
            />

            <QuestionTypeDropdown
              value={formState.questionType}
              onChange={(type: QuestionTypeEnum) => setFormState({ ...formState, questionType: type })}
              error={validationErrors.questionType}
              submitted={submitted}
            />

            <DifficultySelector
              value={formState.difficulty}
              onChange={(difficulty: DifficultyLevel) => setFormState({ ...formState, difficulty })}
              error={validationErrors.difficulty}
              submitted={submitted}
            />


            <PointSelector
              value={formState.point}
              onChange={(value) => setFormState({ ...formState, point: value })}
              error={validationErrors.point}
              submitted={submitted}
            />

            <QuestionInputSection
              value={formState.questionText}
              onChange={(text) => setFormState({ ...formState, questionText: text })}
              error={validationErrors.questionText}
              submitted={submitted}
            />
            <AnswerInput
              questionType={formState.questionType}
              options={formState.options}
              correctOption={formState.correctOption}
              onOptionChange={handleOptionChange}
              onCorrectAnswer={(value) => setFormState({ ...formState, correctOption: value })}
              errors={validationErrors.options}
              correctAnswerError={validationErrors.correctOption}
              submitted={submitted}
            />


            <HintInput
              value={formState.hint ?? ''}
              onChange={(text) => setFormState({ ...formState, hint: text })}
            />

            <ExplanationInput
              value={formState.explanation ?? ''}
              onChange={(text) => setFormState({ ...formState, explanation: text })}
              error={validationErrors.explanation}
              submitted={submitted}
            />

            <TagsInput
              value={formState.tags}
              onChange={(tags) => setFormState({ ...formState, tags: tags })}
              error={validationErrors.tags}
              submitted={submitted}
            />

          </View>
















          <FormActions
            onPost={handlePost}
            onSaveDraft={handleSaveDraft}
            onCancel={handleCancel}
            isPosting={isPosting}
            isSavingDraft={isSavingDraft}
            validationErrors={validationErrors}
          />
        </View>
        
        <SuccessModal
          isVisible={modalState.success || modalState.draftSuccess}
          message={modalState.message}
          onDismiss={handleCloseModal}
          color={modalState.color}
          icon={modalState.success ? "checkmark-circle" : "bookmark"}
        />

        <ErrorModal
          isVisible={modalState.error}
          message={modalState.message}
          onDismiss={handleCloseModal}
        />

        <CancelModal
          isVisible={modalState.cancel}
          onConfirm={() => {
            resetForm();
            router.push("/teacher/(tabs)/ContentList");
            setModalState(prev => ({ ...prev, cancel: false }));
          }}
          onCancel={() => setModalState(prev => ({ ...prev, cancel: false }))}
        />

        <QuestionPreviewModal
          visible={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          question={formState}
          onConfirm={handleConfirmPost}
          onEdit={() => {
            setShowPreviewModal(false);
          }}
          loading={isPosting}
          mode="edit"
        />

      </ScrollView>
    </View>
  );
};

export default AddQuestion;