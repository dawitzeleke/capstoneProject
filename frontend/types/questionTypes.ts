// types/questionTypes.ts
export enum DifficultyLevel {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

export enum QuestionTypeEnum {
    MultipleChoice = 'MultipleChoice',
    TrueFalse = 'TrueFalse',
    ProblemSolving = 'ProblemSolving',
    Code = 'Code'
}

export enum ContentStatus {
    All = 'all',
    Draft = 'draft',
    Posted = 'posted'
}

export interface QuestionItem {
    explanation: string;
    id: string;
    questionText: string;
    description: string;
    options: string[];
    correctOption: string;
    courseName: string;
    grade: number;
    difficulty: DifficultyLevel;
    questionType: QuestionTypeEnum;
    createdBy: string;
    stream: string;
    hint: string;
    tags: string[];
    status: ContentStatus;
    createdAt?: string;
    updatedAt?: string;
    isMatrik: boolean;
    year: string;
    chapter: string;
}

export interface QuestionFormState {
    id: string;
    questionText: string;
    description: string;
    options: string[];
    correctOption: string;
    hint: string;
    explanation: string;
    difficulty: DifficultyLevel;
    courseName: string;
    grade: number;
    stream: string;
    chapter: string;
    isMatrik: boolean;
    year: string;
    tags: string[];
    status: ContentStatus;
    createdAt?: string;
    updatedAt?: string;
    questionType: QuestionTypeEnum;
    createdBy: string;
}

export interface ValidationErrors {
    questionText: boolean;
    courseName: boolean;
    description: boolean;
    grade: boolean;
    difficulty: boolean;
    options: boolean[];
    tags: boolean;
    correctOption: boolean;
    stream: boolean;
    chapter: boolean;
    isMatrik: boolean;
    year: boolean;
    hint: boolean;
}

export type QuestionFormMode = "create" | "edit";

export const isQuestionItem = (item: unknown): item is QuestionItem => {
    return (
        typeof item === "object" && item !== null &&
        "id" in item &&
        "questionText" in item &&
        "options" in item &&
        Array.isArray((item as QuestionItem).options) &&
        "correctOption" in item
    );
};