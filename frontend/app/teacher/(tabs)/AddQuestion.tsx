import React, { useEffect, useState, useCallback, useRef } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
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
  QuestionTypeEnum,
  StreamEnum
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
import { ConfirmModal } from '@/components/teacher/popups/ConfirmModal';

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
  stream: StreamEnum.Natural,
  chapter: "",
  point: 1,
  questionType: QuestionTypeEnum.MultipleChoice,
  createdBy: "",
  explanation: "",
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
          explanation: questionToEdit.explanation || '',
        };
      }
    }
    return EMPTY_FORM_STATE;
  });

  // Modal and loading states
  const [modalState, setModalState] = useState({
    showSuccess: false,
    showError: false,
    showConfirm: false,
    showCancel: false,
    message: '',
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
    explanation: false,
    point: false,
    questionType: false
  });

  const [isPosting, setIsPosting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const user = useSelector((state:any)=>(state.user.user))

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
    const errors: ValidationErrors = {
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
      explanation: false,
      point: false,
      questionType: false
    };

    if (submitted) {
      if (!formState.questionText.trim()) errors.questionText = true;
      if (!formState.courseName.trim()) errors.courseName = true;
      if (!formState.options[0].trim()) errors.options[0] = true;
      if (!formState.options[1].trim()) errors.options[1] = true;
      if (!formState.correctOption.trim()) errors.correctOption = true;
      if (!formState.point) errors.point = true;
      if (!formState.grade) errors.grade = true;
      if (formState.difficulty === undefined || formState.difficulty === null) errors.difficulty = true;
      if (formState.questionType === undefined || formState.questionType === null) errors.questionType = true;
      if (formState.stream === undefined) errors.stream = true;
      if (!formState.explanation?.trim()) errors.explanation = true;
    }
    setValidationErrors(errors);
    return !Object.values(errors).some(error => 
      Array.isArray(error) ? error.some(e => e) : error
    );
  }, [formState, submitted]);

  // Form submissions
  const handlePost = useCallback(async () => {
    setSubmitted(true);
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    console.log('Current form state:', formState);
    console.log('Validation errors:', validationErrors);

    if (!isValid) {
      setModalState(prev => ({
        ...prev,
        showError: true,
        message: "Please fill all required fields"
      }));
      return;
    }

    try {
      setIsPosting(true);
      const questionPayload = new FormData();
      questionPayload.append('QuestionText', formState.questionText.trim());
      questionPayload.append('Description', formState.description?.trim() || '');
      questionPayload.append('Options', JSON.stringify(formState.options.map(opt => opt.trim())));
      questionPayload.append('CorrectOption', formState.correctOption.trim());
      questionPayload.append('CourseName', formState.courseName.trim());
      questionPayload.append('Point', formState.point.toString());
      questionPayload.append('Grade', formState.grade.toString());
      questionPayload.append('Difficulty', formState.difficulty.toString());
      questionPayload.append('QuestionType', formState.questionType.toString());
      questionPayload.append('CreatedBy', user?.id || '');
      questionPayload.append('Stream', formState.stream.toString());
      questionPayload.append('Hint', formState.hint?.trim() || '');
      questionPayload.append('Tags', JSON.stringify(formState.tags || []));
      questionPayload.append('Explanation', formState.explanation?.trim() || '');

      if (editingQuestionId) {
        questionPayload.append('Id', editingQuestionId);
      }

      const response = await httpRequest(
        '/Questions',
        questionPayload,
        'POST',
        user?.token,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user?.token}`
          },
        }
      );

      if (response) {
        setModalState(prev => ({
          ...prev,
          showSuccess: true,
          message: "Question added successfully!"
        }));
        setFormState(EMPTY_FORM_STATE);
        setSubmitted(false);
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
          explanation: false,
          point: false,
          questionType: false
        });
        await AsyncStorage.removeItem('questionDraft');
        dispatch(clearEditingQuestion());
      } else {
        setModalState(prev => ({
          ...prev,
          showError: true,
          message: "Failed to add question"
        }));
      }
    } catch (error) {
      console.error('Error posting question:', error);
      setModalState(prev => ({
        ...prev,
        showError: true,
        message: "Failed to add question"
      }));
    } finally {
      setIsPosting(false);
    }
  }, [formState, editingQuestionId, user?.id, user?.token, validateForm, dispatch]);

  const handleSaveDraft = useCallback(async () => {
    try {
      setIsSavingDraft(true);
      const questionPayload = new FormData();
      questionPayload.append('QuestionText', formState.questionText.trim());
      questionPayload.append('Description', formState.description?.trim() || '');
      questionPayload.append('Options', JSON.stringify(formState.options.map(opt => opt.trim())));
      questionPayload.append('CorrectOption', formState.correctOption.trim());
      questionPayload.append('CourseName', formState.courseName.trim());
      questionPayload.append('Point', formState.point.toString());
      questionPayload.append('Grade', formState.grade.toString());
      questionPayload.append('Difficulty', formState.difficulty.toString());
      questionPayload.append('QuestionType', formState.questionType.toString());
      questionPayload.append('CreatedBy', user?.id || '');
      questionPayload.append('Stream', formState.stream.toString());
      questionPayload.append('Hint', formState.hint?.trim() || '');
      questionPayload.append('Tags', JSON.stringify(formState.tags || []));
      questionPayload.append('Explanation', formState.explanation?.trim() || '');

      if (editingQuestionId) {
        questionPayload.append('Id', editingQuestionId);
      }

      const response = await httpRequest(
        '/Questions/create-draft',
        questionPayload,
        'POST',
        user?.token,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          'Authorization':`Bearer ${user?.token}`
          },
        }
      );

      if (response) {
        setModalState(prev => ({
          ...prev,
          showSuccess: true,
          message: "Question saved as draft successfully!"
        }));
        await AsyncStorage.removeItem('questionDraft');
        dispatch(clearEditingQuestion());
      } else {
        setModalState(prev => ({
          ...prev,
          showError: true,
          message: "Failed to save draft"
        }));
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setModalState(prev => ({
        ...prev,
        showError: true,
        message: "Failed to save draft"
      }));
    } finally {
      setIsSavingDraft(false);
    }
  }, [formState, editingQuestionId, user?.id, user?.token, dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalState({
      showSuccess: false,
      showError: false,
      showConfirm: false,
      showCancel: false,
      message: '',
    });
  }, []);

  const handleCancel = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      showCancel: true
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
      explanation: false,
      point: false,
      questionType: false
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
            <View className="bg-white rounded-xl shadow p-4 mb-4 border-b border-slate-200">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text className="text-lg font-psemibold text-slate-800">Course Name</Text>
                  <Text className="text-red-500 m-1 text-xl">*</Text>
                </View>
                {submitted && validationErrors.courseName && (
                  <Text className="text-red-500 text-xs">Required</Text>
                )}
              </View>
              <TextInput
                className={`text-base text-black font-pregular border-b border-slate-200 ${
                  submitted && validationErrors.courseName ? "border-2 border-red-200 bg-red-50 rounded px-2" : ""
                }`}
                placeholder="Enter course name"
                placeholderTextColor="#94a3b8"
                value={formState.courseName}
                onChangeText={(text) => {
                  setFormState(prev => ({ ...prev, courseName: text }));
                  if (submitted) {
                    setValidationErrors(prev => ({
                      ...prev,
                      courseName: !text.trim()
                    }));
                  }
                }}
              />
            </View>
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
              onChange={(value: StreamEnum) => setFormState({ ...formState, stream: value })}
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

            <View className="bg-white rounded-xl shadow p-4 mb-4 border-b border-slate-200">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text className="text-lg font-psemibold text-slate-800">Explanation</Text>
                  <Text className="text-red-500 m-1 text-xl">*</Text>
                </View>
                {submitted && validationErrors.explanation && (
                  <Text className="text-red-500 text-xs">Required</Text>
                )}
              </View>
              <TextInput
                className={`min-h-[100px] text-base text-black font-pregular border-b border-slate-200 ${
                  submitted && validationErrors.explanation ? "border-2 border-red-200 bg-red-50 rounded px-2" : ""
                }`}
                placeholder="Enter explanation for the correct answer"
                placeholderTextColor="#94a3b8"
                value={formState.explanation}
                onChangeText={(text) => {
                  setFormState(prev => ({ ...prev, explanation: text }));
                  if (submitted) {
                    setValidationErrors(prev => ({
                      ...prev,
                      explanation: !text.trim()
                    }));
                  }
                }}
                multiline
                textAlignVertical="top"
              />
            </View>

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
          visible={modalState.showSuccess}
          onClose={handleCloseModal}
        >
          <View className="items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 mb-2">Success!</Text>
            <Text className="text-gray-600 text-center mb-4">{modalState.message}</Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              className="bg-green-500 py-3 rounded-lg w-full"
            >
              <Text className="text-white text-center font-semibold">Continue</Text>
            </TouchableOpacity>
          </View>
        </SuccessModal>

        <ErrorModal
          visible={modalState.showError}
          onClose={handleCloseModal}
        >
          <View className="items-center">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle" size={32} color="#ef4444" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 mb-2">Error</Text>
            <Text className="text-gray-600 text-center mb-4">{modalState.message}</Text>
            <TouchableOpacity
              onPress={handleCloseModal}
              className="bg-red-500 py-3 rounded-lg w-full"
            >
              <Text className="text-white text-center font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </ErrorModal>

        <ConfirmModal
          visible={modalState.showConfirm}
          onClose={handleCloseModal}
          onConfirm={handlePost}
          loading={isPosting}
        >
          <Text className="text-xl font-semibold text-gray-900 mb-2">Confirm Submission</Text>
          <Text className="text-gray-600 text-center">
            Are you sure you want to submit this question? This action cannot be undone.
          </Text>
        </ConfirmModal>

        <CancelModal
          visible={modalState.showCancel}
          onClose={handleCloseModal}
          onConfirm={() => {
            handleCloseModal();
            router.back();
          }}
        >
          <View className="items-center">
            <Text className="text-lg font-semibold text-gray-900 mb-2">Discard Changes?</Text>
            <Text className="text-gray-600 text-center mb-6">Are you sure you want to discard this upload?</Text>
            <View className="flex-col space-y-4 w-full">
              <TouchableOpacity
                onPress={handleCloseModal}
                className="w-full bg-gray-100 px-6 py-3 rounded-lg"
              >
                <Text className="text-gray-600 font-medium text-center">Continue Editing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCloseModal();
                  router.back();
                }}
                className="w-full bg-red-100 px-6 py-3 rounded-lg"
              >
                <Text className="text-red-600 font-medium text-center">Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CancelModal>

        <QuestionPreviewModal
          visible={showPreviewModal}
          question={formState as QuestionItem}
          onClose={() => setShowPreviewModal(false)}
          onEdit={() => setShowPreviewModal(false)}
          onConfirm={handlePost}
          loading={isPosting}
          mode="edit"
        />
      </ScrollView>
    </View>
  );
};

export default AddQuestion;