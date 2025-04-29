import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export interface QuestionItem {
    id: string;
    question: string;
    options: string[];
    status: "draft" | "posted";
    date: string;
    tags?: string[];
    hint?: string;
    explanation?: string;
    correctAnswer?: string;
}

interface ContentState {
    questions: QuestionItem[];
    selectedIds: string[];
    editingQuestionId: string | null;
    searchTerm: string;
    activeTab: "all" | "posted" | "draft";

}

const initialState: ContentState = {
    questions: [
        {
            id: "1",
            question: 'Which organelle is known as the "powerhouse of the cell"?',
            options: ["A. Nucleus", "B. Mitochondria", "C. Ribosome", "D. Organelles"],
            status: "posted",
            date: "2024-03-15",
        },
        {
            id: "2",
            question: "What is the process of cell division called?",
            options: ["A. Mitosis", "B. Meiosis", "C. Both A and B", "D. None"],
            status: "draft",
            date: "2024-03-16",
        },
        {
            id: "3",
            "question": "What molecule carries genetic information in most living organisms?",
            "options": ["A. RNA", "B. DNA", "C. Protein", "D. Lipid"],
            "status": "draft",
            "date": "2024-03-14"
        },
    ],
    selectedIds: [],
    editingQuestionId: null,
    searchTerm: "",
    activeTab: "all"
};

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
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
            // Remove from questions array
            state.questions = state.questions.filter(
                question => question.id !== action.payload
            );

            // Remove from selectedIds if present
            state.selectedIds = state.selectedIds.filter(
                id => id !== action.payload
            );
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<"all" | "posted" | "draft">) => {
            state.activeTab = action.payload;
        },
        addQuestion: (state, action: PayloadAction<QuestionItem>) => {
            state.questions.unshift(action.payload);
        },
        clearSelections(state) {
            state.selectedIds = [];
          },
          deleteMultipleQuestions(state, action: PayloadAction<string[]>) {
            const idsToDelete = action.payload;
            state.questions = state.questions.filter(q => !idsToDelete.includes(q.id));
            state.selectedIds = state.selectedIds.filter(id => !idsToDelete.includes(id));
          },
    }
});

export const { toggleSelection,
    setEditingQuestion,
    clearEditingQuestion,
    updateQuestion,
    deleteQuestion,
    setSearchTerm,
    setActiveTab,
    clearSelections,
    deleteMultipleQuestions,
} = contentSlice.actions;

export const selectFilteredQuestions = createSelector(
    [(state: RootState) => state.content.questions,
    (state: RootState) => state.content.searchTerm],
    (questions, searchTerm) => {
        if (!searchTerm) return questions;
        const lowerSearch = searchTerm.toLowerCase();
        return questions.filter(item =>
            item.question.toLowerCase().includes(lowerSearch) ||
            item.options.some(opt => opt.toLowerCase().includes(lowerSearch)) ||
            item.date.toLowerCase().includes(lowerSearch)
        );
    }
);

export const selectDisplayQuestions = createSelector(
    [selectFilteredQuestions,
        (state: RootState) => state.content.activeTab],
    (filtered, activeTab) => activeTab === 'all'
        ? filtered
        : filtered.filter(item => item.status === activeTab)
);


export default contentSlice.reducer;