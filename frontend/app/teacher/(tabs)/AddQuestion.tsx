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
  ValidationErrors,
  QuestionTypeEnum
} from "@/types/questionTypes";
import QuestionInputSection from "@/components/teacher/QuestionForm/QuestionInputSection";
import AnswerInput from "@/components/teacher/QuestionForm/AnswerInput";
import HintInput from "@/components/teacher/QuestionForm/HintInput";
import FormActions from "@/components/teacher/QuestionForm/FormActions";
import DescriptionInput from "@/components/teacher/QuestionForm/DescriptionInput";
import QuestionTypeDropdown from "@/components/teacher/QuestionForm/QuestionTypeDropdown";
import DifficultySelector from "@/components/teacher/QuestionForm/DifficultySelector";
import GradeSelector from "@/components/teacher/QuestionForm/GradeSelector";
import PointSelector from "@/components/teacher/QuestionForm/PointSelector";
import QuestionPreviewModal from "@/components/teacher/popups/QuestionPreviewModal";
import CourseNameInput from '@/components/teacher/QuestionForm/CourseNameInput';
import ResetFormButton from '@/components/teacher/ResetFormButton';
import MatrikCheckbox from '@/components/teacher/QuestionForm/MatrikCheckbox';
import StreamDropdown from '@/components/teacher/QuestionForm/StreamDropdown';
import ChapterInput from '@/components/teacher/QuestionForm/ChapterInput';
import httpRequest from "@/util/httpRequest";

// Update the initial state to ensure explanation is always a string
const EMPTY_FORM_STATE: QuestionFormState = {
  id: "",
  questionText: "",
  courseName: "",
  description: "",
  grade: 9,
  difficulty: DifficultyLevel.Easy,
  options: ["", "", "", "", ""],
  tags: [],
  hint: "",
  correctOption: "",
  status: ContentStatus.Draft,
  isMatrik: false,
  year: "",
  stream: "",
  chapter: "",
  point: 1,
  questionType: QuestionTypeEnum.MultipleChoice,
  createdBy: "",
};

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
      if (questionToEdit) {
        return {
          ...questionToEdit,
          correctOption: questionToEdit.correctOption,
          options: [...questionToEdit.options],
          hint: questionToEdit.hint || '',
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

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
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
      description: false,
      grade: !formState.grade,
      difficulty: !formState.difficulty,
      options: formState.options.map((opt, i) => 
        i < 2 ? opt.trim() === "" : false
      ),
      tags: formState.tags.length === 0,
      correctOption: !formState.correctOption || !formState.options.includes(formState.correctOption),
      stream: formState.stream.trim() === "",
      chapter: false,
      isMatrik: false,
      year: formState.isMatrik && !formState.year.trim(),
      hint: false,
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
      questionPayload.append("Point", formState.point.toString());
      questionPayload.append("Grade", formState.grade.toString());
      questionPayload.append("Difficulty", "0");
      questionPayload.append("QuestionType", "0");
      questionPayload.append("CreatedBy", formState.createdBy);
      questionPayload.append("Stream", "0");
      questionPayload.append("Hint", formState.hint);
      questionPayload.append("Tags", JSON.stringify(formState.tags));
      questionPayload.append("Explanation", "test explanation"); 
      if (editingQuestionId) {
        questionPayload.append("Id", editingQuestionId);
      }
      
      
      const method = editingQuestionId ? "PUT" : "POST";
      const url = "/api/Questions";

      const response = await httpRequest(url, questionPayload, method, {
          headers: { "Content-Type": "multipart/form-data",
          Accept: "application/json", 
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODJhZGE0Yzg3MWYwMjdmMzA0OTI2NmQiLCJlbWFpbCI6ImRhd2l0dGVhY2hlckBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY4MmFkYTRjODcxZjAyN2YzMDQ5MjY2ZCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImRhd2l0dGVhY2hlckBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJUZWFjaGVyIiwianRpIjoiNGQ0MjRlNmMtNzFiZi00ZmJhLWE1NzItNjU5M2Y3YjJkYzg0IiwiZXhwIjoxNzUxMjA3OTEzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMTkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAifQ.GvFSaN2rynQLz92Iyw3yZUHujjcuirXn_RPpeNIg3qs`  // Include token if needed
          },

        });

      const questionToSubmit: QuestionItem = {
        ...formState,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingQuestionId) {
        dispatch(updateQuestion(questionToSubmit));
      } else {
        dispatch(addQuestion(questionToSubmit));
      }

      setModalState(prev => ({
        ...prev,
        success: true,
        message: editingQuestionId ? "Question updated successfully!" : "Question posted successfully!",
        color: "#16a34a"
      }));

      setShowPreviewModal(false);
    } catch (error) {
      setModalState(prev => ({
        ...prev,
        error: true,
        message: "Failed to post question. Please try again."
      }));
    } finally {
      setIsPosting(false);
    }
  }, [formState, editingQuestionId, dispatch]);

  const handleSaveDraft = useCallback(async () => {
    setIsSavingDraft(true);
    try {
      await AsyncStorage.setItem('questionDraft', JSON.stringify(formState));
      setModalState(prev => ({
        ...prev,
        draftSuccess: true,
        message: "Draft saved successfully!",
        color: "#4F46E5"
      }));
    } catch (error) {
      setModalState(prev => ({
        ...prev,
        error: true,
        message: "Failed to save draft. Please try again."
      }));
    } finally {
      setIsSavingDraft(false);
    }
  }, [formState]);

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
    });
    setSubmitted(false);
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

            <MatrikCheckbox
              formState={formState}
              setFormState={setFormState}
              validationErrors={{
                isMatrik: validationErrors.isMatrik ? 'Required' : '',
                year: validationErrors.year ? 'Required' : ''
              }}
            />

            <StreamDropdown
              value={formState.stream}
              onChange={(value) => setFormState({ ...formState, stream: value })}
              error={validationErrors.stream}
              submitted={submitted}
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
            onCancel={handleCloseModal}
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
          question={formState as QuestionItem}
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