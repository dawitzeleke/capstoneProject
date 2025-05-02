import { QuestionItem } from "@/redux/teacherReducer/questionSlice";

export type { QuestionItem } from "@/redux/teacherReducer/questionSlice";

export type QuestionStatus = "draft" | "posted";

export type QuestionFormState = {
    id: string;
    question: string;
    options: [string, string, string, string]; // Enforce exactly 4 options
    tags: string[];
    hint: string;
    explanation: string;
    correctAnswer: number;
    status: QuestionStatus;
    date: string;
};

export type QuestionFormMode = "create" | "edit";


export const isQuestionItem = (item: unknown): item is QuestionItem => {
    return (
        typeof item === "object" && item !== null &&
        "id" in item &&
        "question" in item &&
        "options" in item &&
        Array.isArray((item as QuestionItem).options) &&
        "correctAnswer" in item &&
        typeof (item as QuestionItem).correctAnswer === "number"
    );
};