// savedQuestionsActionTypes.ts

export const SET_SAVED_QUESTIONS = "SET_SAVED_QUESTIONS";
export const CLEAR_SAVED_QUESTIONS = "CLEAR_SAVED_QUESTIONS";
export const REMOVE_SAVED_QUESTION = "REMOVE_SAVED_QUESTION";

export interface RemoveSavedQuestionAction {
  type: typeof REMOVE_SAVED_QUESTION;
  payload: string; // question ID
}

// Question interface (can be reused across files)
export interface Question {
  _id: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  UpdatedBy: string | null;
  type: number;
  CreatedBy: string;
  QuestionText: string;
  Description: string;
  CourseName: string;
  Options: string[];
  CorrectOption: string;
  Grade: number;
  Chapter: number;
  QuestionType: number;
  Difficulty: number;
  Stream: number;
  Explanation: string;
  Hint: string;
  Tags: string[];
  RelatedBlog: string | null;
  Report: any | null;
  Point: number;
  TotalCorrectAnswers: number;
  Likes: number | null;
}

// Action Interfaces
export interface SetSavedQuestionsAction {
  type: typeof SET_SAVED_QUESTIONS;
  payload: Question[];
}

export interface ClearSavedQuestionsAction {
  type: typeof CLEAR_SAVED_QUESTIONS;
}

export type SavedQuestionsActionTypes =
  | SetSavedQuestionsAction
  | ClearSavedQuestionsAction
  | RemoveSavedQuestionAction;
