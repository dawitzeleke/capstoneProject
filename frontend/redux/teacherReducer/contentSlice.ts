// redux/contentReducer/contentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuestionItem {
    id: string;
    question: string;
    options: string[];
    status: "draft" | "posted";
    date: string;
}

interface ContentState {
    questions: QuestionItem[];
    selectedIds: string[];
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
        // Add other reducers as needed
    },
});

export const { toggleSelection } = contentSlice.actions;
export default contentSlice.reducer;