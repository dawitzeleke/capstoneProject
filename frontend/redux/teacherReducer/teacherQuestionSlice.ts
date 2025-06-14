// redux/teacherQuestionSlice.ts
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import {
  QuestionItem,
  ContentStatus,
  DifficultyLevel,
  QuestionTypeEnum
} from "@/types/questionTypes";
import { MediaStatus } from "@/types/mediaTypes";

interface QuestionState {
  questions: QuestionItem[];
  selectedIds: string[];
  editingQuestionId: string | null;
  searchTerm: string;
  activeTab: ContentStatus | MediaStatus | "all";
  filters: {
    difficulties: DifficultyLevel[];
    questionTypes: QuestionTypeEnum[];
    grades: number[];
    points: number[];
  };
}

const initialState: QuestionState = {
  questions: [
    {
      id: "1",
      questionText: `Which organelle is known as the "powerhouse of the cell"?`,
      description: "Cell Biology",
      options: [
        "Nucleus",
        "Mitochondria",
        "Ribosome",
        "Endoplasmic Reticulum"
      ],
      correctOption: "Mitochondria",
      courseName: "Biology",
      grade: 9,
      difficulty: DifficultyLevel.Medium,
      questionType: QuestionTypeEnum.MultipleChoice,
      point: 1,
      tags: ["bio", "science"],
      hint: "It's the organelle responsible for producing energy (ATP).",
      explanation: `Mitochondria generate most of the cell's energy through cellular respiration, converting glucose and oxygen into ATP, hence they're called the "powerhouse" of the cell.`,
      status: ContentStatus.Posted,
      createdBy: "teacher_abc123",
      createdAt: "2025-03-16T00:00:00Z",
      updatedAt: "2025-03-16T00:00:00Z",
      isMatrik: false,
      year: "",
      stream: "Natural Science",
      chapter: "2"
    },
    {
      id: "2",
      questionText: "What is the process of cell division called?",
      description: "Cell Biology",
      options: ["Mitosis", "Meiosis", "Both A and B", "None"],
      correctOption: "Mitosis",
      courseName: "Biology",
      grade: 10,
      difficulty: DifficultyLevel.Medium,
      questionType: QuestionTypeEnum.MultipleChoice,
      point: 3,
      tags: ["bio", "science"],
      hint: "It involves the division of a single cell into two identical daughter cells.",
      explanation: "Mitosis is the process by which a cell divides to produce two genetically identical daughter cells. It is essential for growth, repair, and asexual reproduction. Meiosis, on the other hand, is used in the formation of gametes and results in four genetically different cells.",
      status: ContentStatus.Draft,
      createdBy: "teacher_abc123",
      createdAt: "2025-02-25T00:00:00Z",
      updatedAt: "2025-02-29T00:00:00Z",
      isMatrik: true,
      year: "2024",
      stream: "Natural Science",
      chapter: "3"
    },
    {
      id: "3",
      questionText: "What molecule carries genetic information in most living organisms?",
      description: "Genetics",
      options: ["RNA", "Lipid", "Protein", "DNA"],
      correctOption: "DNA",
      courseName: "Biology",
      grade: 10,
      difficulty: DifficultyLevel.Medium,
      questionType: QuestionTypeEnum.MultipleChoice,
      point: 2,
      tags: ["bio", "science"],
      hint: "This molecule has a double helix structure and contains the instructions for building proteins.",
      explanation: "DNA (Deoxyribonucleic acid) is the molecule that carries genetic information in most living organisms. It encodes the instructions needed for an organism to develop, survive, and reproduce.",
      status: ContentStatus.Draft,
      createdBy: "teacher_abc123",
      createdAt: "2024-03-14T00:00:00Z",
      updatedAt: "2024-03-14T00:00:00Z",
      isMatrik: false,
      year: "",
      stream: "Natural Science",
      chapter: "4"
    },
  ],

  selectedIds: [],
  editingQuestionId: null,
  searchTerm: "",
  activeTab: "all",
  filters: {
    difficulties: [],
    questionTypes: [],
    grades: [],
    points: []
  }
};

const teacherQuestionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<QuestionItem>) => {
      state.questions.unshift(action.payload);
    },
    toggleSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter(itemId => itemId !== id)
        : [...state.selectedIds, id];
    },
    setEditingQuestion: (state, action: PayloadAction<string>) => {
      state.editingQuestionId = action.payload;
    },
    clearEditingQuestion: (state) => {
      state.editingQuestionId = null;
    },
    updateQuestion: (state, action: PayloadAction<QuestionItem>) => {
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
        question => question.id !== action.payload
      );
      state.selectedIds = state.selectedIds.filter(
        id => id !== action.payload
      );
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ContentStatus | MediaStatus | "all">) => {
      state.activeTab = action.payload;
    },
    clearSelections(state) {
      state.selectedIds = [];
    },
    deleteMultipleQuestions(state, action: PayloadAction<string[]>) {
      const idsToDelete = action.payload;
      state.questions = state.questions.filter(q => !idsToDelete.includes(q.id));
      state.selectedIds = state.selectedIds.filter(id => !idsToDelete.includes(id));
    },
    setDifficultyFilter: (state, action: PayloadAction<DifficultyLevel[]>) => {
      state.filters.difficulties = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<QuestionTypeEnum[]>) => {
      state.filters.questionTypes = action.payload;
    },
    setGradeFilter: (state, action: PayloadAction<number[]>) => {
      state.filters.grades = action.payload;
    },
    setPointFilter: (state, action: PayloadAction<number[]>) => {
      state.filters.points = action.payload;
    },
  }
});

export const {
  toggleSelection,
  setEditingQuestion,
  clearEditingQuestion,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setSearchTerm,
  setActiveTab,
  clearSelections,
  deleteMultipleQuestions,
    setDifficultyFilter,
  setTypeFilter,
  setGradeFilter,
  setPointFilter,
} = teacherQuestionSlice.actions;

export const selectFilteredQuestions = createSelector(
  [
    (state: RootState) => state.teacherQuestions.questions || [],
    (state: RootState) => state.teacherQuestions.searchTerm || '',
    (state: RootState) => state.teacherQuestions.filters
  ],
  (questions, searchTerm, filters) => {
    const lowerSearch = searchTerm.toLowerCase();
    
    return questions.filter(question => {
      // Search filter
      const matchesSearch = !searchTerm || 
        question.questionText.toLowerCase().includes(lowerSearch) ||
        question.options.some(opt => opt.toLowerCase().includes(lowerSearch));

      // Difficulty filter
      const matchesDifficulty = filters.difficulties.length === 0 || 
        filters.difficulties.includes(question.difficulty);

      // Question type filter
      const matchesType = filters.questionTypes.length === 0 || 
        filters.questionTypes.includes(question.questionType);

      // Grade filter
      const matchesGrade = filters.grades.length === 0 || 
        filters.grades.includes(question.grade);

      // Point filter
      const matchesPoint = filters.points.length === 0 || 
        filters.points.includes(question.point);

      return matchesSearch && matchesDifficulty && matchesType && 
             matchesGrade && matchesPoint;
    });
  }
);

export const selectDisplayQuestions = createSelector(
  [
    selectFilteredQuestions,
    (state: RootState) => state.teacherQuestions.activeTab || 'all'
  ],
  (filtered, activeTab) => activeTab === 'all'
    ? filtered
    : filtered.filter((item: { status: any; }) => item.status === activeTab)
);

export default teacherQuestionSlice.reducer;
