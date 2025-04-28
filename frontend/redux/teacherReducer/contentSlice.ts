import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        
    },
});


export const { toggleSelection,
    setEditingQuestion,
    clearEditingQuestion,
    updateQuestion,
    deleteQuestion
} = contentSlice.actions;
export default contentSlice.reducer;