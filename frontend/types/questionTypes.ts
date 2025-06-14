// types/questionTypes.ts
export enum DifficultyLevel {
    Easy = 0,
    Medium = 1,
    Hard = 2
}

export enum QuestionTypeEnum {
    MultipleChoice = 0,
    TrueFalse = 1,
    ProblemSolving = 2,
    Code = 3
}

export enum StreamEnum {
    Natural = 0,
    Social = 1
}

export enum ContentStatus {
    All = 'all',
    Draft = 'draft',
    Posted = 'posted'
}

export interface QuestionItem {
    id: string;
    questionText: string;
    description: string;
    options: string[];
    correctOption: string;
    courseName: string;
    point: number;
    grade: number;
    difficulty: DifficultyLevel;
    questionType: QuestionTypeEnum;
    createdBy: string;
    stream: StreamEnum;
    hint: string;
    tags: string[];
    status: ContentStatus;
    createdAt?: string;
    updatedAt?: string;
    isMatrik: boolean;
    year: string;
    chapter: string;
    explanation?: string;
}

export interface QuestionFormState {
    id: string;
    questionText: string;
    description: string;
    options: string[];
    correctOption: string;
    hint: string;
    difficulty: DifficultyLevel;
    courseName: string;
    grade: number;
    stream: StreamEnum;
    chapter: string;
    isMatrik: boolean;
    year: string;
    tags: string[];
    status: ContentStatus;
    createdAt?: string;
    updatedAt?: string;
    point: number;
    questionType: QuestionTypeEnum;
    createdBy: string;
    explanation: string;
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
    explanation: boolean;
    point: boolean;
    questionType: boolean;
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