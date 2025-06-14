import React, { useEffect, useState, useCallback, useRef } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  QuestionTypeEnum,
  ValidationErrors
} from "@/types/questionTypes";
import QuestionInputSection from "@/components/teacher/QuestionForm/QuestionInputSection";
import AnswerInput from "@/components/teacher/QuestionForm/AnswerInput";
import HintInput from "@/components/teacher/QuestionForm/HintInput";
import FormActions from "@/components/teacher/QuestionForm/FormActions";
import DescriptionInput from "@/components/teacher/QuestionForm/DescriptionInput";

import GradeSelector from "@/components/teacher/QuestionForm/GradeSelector";

import QuestionPreviewModal from '@/components/teacher/popups/QuestionPreviewModal';
import CourseNameInput from '@/components/teacher/QuestionForm/CourseNameInput';
import ResetFormButton from '@/components/teacher/ResetFormButton';
import MatrikCheckbox from "@/components/teacher/QuestionForm/MatrikCheckbox";
import StreamDropdown from '@/components/teacher/QuestionForm/StreamDropdown';
import ChapterInput from "@/components/teacher/QuestionForm/ChapterInput";
import httpRequest from "@/util/httpRequest";
import QuestionTypeDropdown from "@/components/teacher/QuestionForm/QuestionTypeDropdown";
import DifficultySelector from "@/components/teacher/QuestionForm/DifficultySelector";
import ExplanationInput from "@/components/teacher/QuestionForm/ExplanationInput";

interface AddQuestionValidationErrors extends ValidationErrors {
  questionType: boolean;
  explanation: boolean;
}

// Utility function to map frontend enums to backend values
const mapDifficultyToBackend = (difficulty: DifficultyLevel): number => {
  switch (difficulty) {
    case DifficultyLevel.Easy:
      return 0; // Easy
    case DifficultyLevel.Medium:
      return 1; // Medium
    case DifficultyLevel.Hard:
      return 2; // Hard
    default:
      return 0;
  }
};

const mapQuestionTypeToBackend = (questionType: QuestionTypeEnum): number => {
  switch (questionType) {
    case QuestionTypeEnum.MultipleChoice:
      return 0;
    case QuestionTypeEnum.TrueFalse:
      return 1;
    case QuestionTypeEnum.ProblemSolving:
      return 2;
    case QuestionTypeEnum.Code:
      return 3;
    default:
      return 0;
  }
};

const mapStreamToBackend = (stream: string): number => {
  switch (stream) {
    case 'NaturalScience':
      return 0; // NaturalScience
    case 'SocialScience':
      return 1; // SocialScience
    case 'Other':
      return 2; // Other
    default:
      return 0;
  }
};

// Update the initial state to ensure explanation is always a string
const EMPTY_FORM_STATE: QuestionFormState = {
  id: "",
  questionText: "",
  courseName: "",
  description: "",
  grade: 9,
  difficulty: DifficultyLevel.Medium,
  options: ["", "", "", "", ""],
  tags: [],
  hint: "",
  correctOption: "",
  status: ContentStatus.Draft,
  isMatrik: false,
  year: "",
  stream: "",
  chapter: "",
  questionType: QuestionTypeEnum.MultipleChoice,
  createdBy: "",
  explanation: "",
};

const AddQuestion = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const { questions, editingQuestionId } = useSelector((state: RootState) => state.teacherQuestions);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const shouldLoadDraft = useRef(!editingQuestionId);
  const [isStreamDropdownOpen, setIsStreamDropdownOpen] = useState(false);
  const [isQuestionTypeDropdownOpen, setIsQuestionTypeDropdownOpen] = useState(false);

  // Use the hoisted stable reference for initial state
  const [formState, setFormState] = useState<QuestionFormState>(() => {
    if (editingQuestionId) {
      const questionToEdit = questions.find(q => q.id === editingQuestionId);
      if (questionToEdit) {
        return {
          ...questionToEdit,
          correctOption: questionToEdit.correctOption,
          options: [...questionToEdit.options],
          hint: questionToEdit.hint || '',
          explanation: questionToEdit.explanation || '',
        };
      }
    }
    return EMPTY_FORM_STATE;
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

  const [validationErrors, setValidationErrors] = useState<AddQuestionValidationErrors>({
    questionText: false,
    courseName: false,
    description: false,
    grade: false,
    difficulty: false,
    options: [false, false, false, false, false],
    tags: false,
    correctOption: false,
    stream: false,
    chapter: false,
    isMatrik: false,
    year: false,
    hint: false,
    questionType: false,
    explanation: false,
  });

  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Form initialization and reset
  useFocusEffect(
    useCallback(() => {
      if (editingQuestionId) {
        const questionToEdit = questions.find(q => q.id === editingQuestionId);
        if (questionToEdit) {
          const formState: QuestionFormState = {
            ...questionToEdit,
            correctOption: questionToEdit.correctOption,
            options: [...questionToEdit.options],
            hint: questionToEdit.hint || '',
            explanation: questionToEdit.explanation || '',
          };
          setFormState(formState);
        }
        shouldLoadDraft.current = false;
      } else if (shouldLoadDraft.current) {
        const loadDraft = async () => {
          try {
            const savedDraft = await AsyncStorage.getItem('questionDraft');
            if (savedDraft) {
              const parsedDraft = JSON.parse(savedDraft);
              const formState: QuestionFormState = {
                ...parsedDraft,
                hint: parsedDraft.hint || '',
                explanation: parsedDraft.explanation || '',
              };
              setFormState(formState);
            }
          } catch (error) {
            console.error('Error loading draft:', error);
          }
          shouldLoadDraft.current = false;
        };
        loadDraft();
      } else {
        setFormState(EMPTY_FORM_STATE);
      }

      return () => {
        if (!editingQuestionId) {
          dispatch(clearEditingQuestion());
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

  const handleOptionChange = useCallback((text: string, index: number) => {
    setFormState(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? text : opt
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
      description: false,
      grade: !formState.grade,
      difficulty: !formState.difficulty,
      options: formState.options.map((opt, i) =>
        i < 2 ? opt.trim() === "" : false
      ),
      tags: formState.tags.length === 0,
      correctOption: !formState.correctOption || !formState.options.includes(formState.correctOption),
      stream: !formState.stream,
      chapter: false,
      isMatrik: false,
      year: formState.isMatrik && !formState.year.trim(),
      hint: false,
      questionType: !formState.questionType,
      explanation: !formState.explanation.trim(),
    };

    setValidationErrors({
      questionText: submitted && errors.questionText,
      courseName: submitted && errors.courseName,
      description: false,
      grade: submitted && errors.grade,
      difficulty: submitted && errors.difficulty,
      options: submitted ? errors.options : [false, false, false, false, false],
      tags: submitted && errors.tags,
      correctOption: submitted && errors.correctOption,
      stream: submitted && errors.stream,
      chapter: false,
      isMatrik: false,
      year: submitted && errors.year,
      hint: false,
      questionType: submitted && errors.questionType,
      explanation: submitted && errors.explanation,
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
    setIsPosting(true);
    try {
      const questionPayload = new FormData();
      questionPayload.append("QuestionText", formState.questionText);
      questionPayload.append("Description", formState.description);
      questionPayload.append("Options", JSON.stringify(formState.options));
      questionPayload.append("CorrectOption", formState.correctOption);
      questionPayload.append("CourseName", formState.courseName);
      questionPayload.append("Grade", formState.grade.toString());
      questionPayload.append("Difficulty", mapDifficultyToBackend(formState.difficulty).toString());
      questionPayload.append("QuestionType", mapQuestionTypeToBackend(formState.questionType).toString());
      questionPayload.append("CreatedBy", formState.createdBy);
      questionPayload.append("Stream", mapStreamToBackend(formState.stream).toString());
      questionPayload.append("Hint", formState.hint);
      questionPayload.append("Tags", JSON.stringify(formState.tags));
      questionPayload.append("Explanation", formState.explanation || "");
      questionPayload.append("IsMatrik", formState.isMatrik.toString());
      questionPayload.append("Year", formState.year);
      questionPayload.append("Chapter", formState.chapter);
      if (editingQuestionId) {
        questionPayload.append("Id", editingQuestionId);
      }

      const method = editingQuestionId ? "PUT" : "POST";
      const endpoint = `/Questions`;

      const response = await httpRequest(endpoint, questionPayload, method, user?.token, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newQuestion: QuestionItem = {
        ...formState,
        id: response.id || editingQuestionId || `temp_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: ContentStatus.Posted,
      };

      if (editingQuestionId) {
        dispatch(updateQuestion(newQuestion));
      } else {
        dispatch(addQuestion(newQuestion));
      }

      setModalState(prev => ({
        ...prev,
        success: true,
        message: editingQuestionId ? "Question updated successfully!" : "Question posted successfully!",
        color: "#16a34a"
      }));

      setShowPreviewModal(false);
    } catch (error: any) {
      setModalState(prev => ({
        ...prev,
        error: true,
        message: error.message || "Failed to post question. Please try again."
      }));
    } finally {
      setIsPosting(false);
    }
  }, [formState, editingQuestionId, dispatch]);

  const handleSaveDraft = useCallback(async () => {
    setIsSavingDraft(true);
    try {
      // Option 1: Save to backend
      const questionPayload = new FormData();
      questionPayload.append("QuestionText", formState.questionText);
      questionPayload.append("Description", formState.description);
      questionPayload.append("Options", JSON.stringify(formState.options));
      questionPayload.append("CorrectOption", formState.correctOption);
      questionPayload.append("CourseName", formState.courseName);
      questionPayload.append("Grade", formState.grade.toString());
      questionPayload.append("Difficulty", mapDifficultyToBackend(formState.difficulty).toString());
      questionPayload.append("QuestionType", mapQuestionTypeToBackend(formState.questionType).toString());
      questionPayload.append("CreatedBy", formState.createdBy);
      questionPayload.append("Stream", mapStreamToBackend(formState.stream).toString());
      questionPayload.append("Hint", formState.hint);
      questionPayload.append("Tags", JSON.stringify(formState.tags));
      questionPayload.append("Explanation", formState.explanation || "");
      questionPayload.append("IsMatrik", formState.isMatrik.toString());
      questionPayload.append("Year", formState.year);
      questionPayload.append("Chapter", formState.chapter);

      const response = await httpRequest('/api/Questions/draft', questionPayload, 'POST', user?.token, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newQuestion: QuestionItem = {
        ...formState,
        id: response.id || `draft_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: ContentStatus.Draft,
      };

      dispatch(addQuestion(newQuestion));

      // Option 2: Keep local draft saving as fallback
      await AsyncStorage.setItem('questionDraft', JSON.stringify(formState));

      setModalState(prev => ({
        ...prev,
        draftSuccess: true,
        message: "Draft saved successfully!",
        color: "#4F46E5"
      }));
    } catch (error: any) {
      // Fallback to local storage on error
      try {
        await AsyncStorage.setItem('questionDraft', JSON.stringify(formState));
        setModalState(prev => ({
          ...prev,
          draftSuccess: true,
          message: "Draft saved locally due to network issue.",
          color: "#4F46E5"
        }));
      } catch (storageError) {
        console.error('Error saving draft locally:', storageError);
        setModalState(prev => ({
          ...prev,
          error: true,
          message: "Failed to save draft locally.",
          color: "#dc2626"
        }));
      }
      console.error('Error saving draft to backend:', error);
    } finally {
      setIsSavingDraft(false);
    }
  }, [formState, dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      success: false,
      error: false,
      draftSuccess: false,
      cancel: false
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(EMPTY_FORM_STATE);
    setValidationErrors({
      questionText: false,
      courseName: false,
      description: false,
      grade: false,
      difficulty: false,
      options: [false, false, false, false, false],
      tags: false,
      correctOption: false,
      stream: false,
      chapter: false,
      isMatrik: false,
      year: false,
      hint: false,
      questionType: false,
      explanation: false,
    });
    setSubmitted(false);
    setShowPreviewModal(false);
  }, []);

  // Effects
  useEffect(() => {
    validateForm();
  }, [formState, submitted, validateForm]);

  // Render
  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="pb-10"
        showsVerticalScrollIndicator={false}
        aria-hidden={showPreviewModal}
        nestedScrollEnabled={true}
        scrollEnabled={!isStreamDropdownOpen && !isQuestionTypeDropdownOpen}
      >
        <AppHeader
          title="Upload Content"
          titleStyle={{fontFamily: 'Poppins-SemiBold'}}
          onBack={router.back}
          showResetButton={true}
          onReset={resetForm}
          disabled={showPreviewModal}
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
              onChange={(text: string) => setFormState({ ...formState, courseName: text })}
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
              onChange={(value) => setFormState({ ...formState, questionType: value })}
              error={validationErrors.questionType}
              submitted={submitted}
              isOpen={isQuestionTypeDropdownOpen}
              setIsOpen={setIsQuestionTypeDropdownOpen}
            />
            <DifficultySelector
              value={formState.difficulty}
              onChange={(value) => setFormState({ ...formState, difficulty: value })}
              error={validationErrors.difficulty}
              submitted={submitted}
            />

            <MatrikCheckbox
              formState={formState}
              setFormState={setFormState}
              validationErrors={{
                isMatrik: validationErrors.isMatrik ? 'Required' : '',
                year: validationErrors.year ? 'Required' : ''
              }} submitted={false}            />

            <StreamDropdown
              value={formState.stream}
              onChange={(value) => setFormState({ ...formState, stream: value })}
              error={validationErrors.stream}
              submitted={submitted}
              isOpen={isStreamDropdownOpen}
              setIsOpen={setIsStreamDropdownOpen}
            />

            <ChapterInput
              value={formState.chapter}
              onChange={(text) => setFormState({ ...formState, chapter: text })}
              error={validationErrors.chapter}
              submitted={submitted}
            />

            <QuestionInputSection
              value={formState.questionText}
              onChange={(text) => setFormState({ ...formState, questionText: text })}
              error={validationErrors.questionText}
              submitted={submitted}
            />
            <AnswerInput
              options={formState.options}
              correctOption={formState.correctOption}
              onOptionChange={handleOptionChange}
              onCorrectAnswer={(value) => setFormState({ ...formState, correctOption: value })}
              errors={validationErrors.options}
              correctAnswerError={validationErrors.correctOption}
              submitted={submitted}
            />
            <ExplanationInput
              value={formState.explanation}
              onChange={(text) => setFormState({ ...formState, explanation: text })}
              error={validationErrors.explanation}
              submitted={submitted}
            />

            <HintInput
              value={formState.hint}
              onChange={(text) => setFormState({ ...formState, hint: text })}
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
            onCancel={() => setModalState(prev => ({ ...prev, cancel: true }))}
            isPosting={isPosting}
            isSavingDraft={isSavingDraft}
            validationErrors={validationErrors}
          />
        </View>

        <QuestionPreviewModal
          visible={showPreviewModal}
          question={formState as QuestionItem}
          onClose={() => setShowPreviewModal(false)}
          onEdit={() => setShowPreviewModal(false)}
          onConfirm={handleConfirmPost}
          loading={isPosting}
          mode="edit"
        />

        <ErrorModal
          isVisible={modalState.error}
          message={modalState.message}
          onDismiss={() => setModalState(prev => ({ ...prev, error: false }))}
        />

        <SuccessModal
          isVisible={modalState.success || modalState.draftSuccess}
          message={modalState.message}
          onDismiss={() => {
            handleCloseModal();
            if (modalState.success || modalState.draftSuccess) {
              router.push("/teacher/(tabs)/ContentList");
            }
          }}
          color={modalState.color}
          icon={modalState.success ? "checkmark-circle" : "bookmark"}
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
      </ScrollView>
    </View>
  );
};

export default AddQuestion;