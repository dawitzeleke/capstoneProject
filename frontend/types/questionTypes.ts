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
    id: string;
    questionText: string;
    description: string;
    options: string[];
    correctOption: string;
    courseName: string;
    grade: number;
    difficulty: DifficultyLevel;
    questionType: QuestionTypeEnum;
    point: number;
    tags: string[];
    hint?: string;
    explanation?: string;
    status: ContentStatus;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export type QuestionFormState = {
  
    id: string;
  questionText: string;
  courseName: string;
  description: string;
  grade: number;
  difficulty: DifficultyLevel;
  questionType: QuestionTypeEnum;
  point: number;
  options: string[];
  tags: string[];
  hint?: string;
  explanation: string;
  correctOption: string;
  status: ContentStatus;
  createdAt?: string;
  updatedAt?: string;
};




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